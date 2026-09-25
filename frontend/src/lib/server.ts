import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './env';
import { storeAssetKey, getAssetKey } from './keyStore';
import * as contractModule from './contract';

// Some contract module versions do not export an access checker. In that
// case, deny key requests rather than making an unverified access decision.
const creatorOf: (assetId: number) => Promise<string> =
  'creatorOf' in contractModule
    ? (contractModule as typeof contractModule & {
        creatorOf: (assetId: number) => Promise<string>;
      }).creatorOf
    : async () => {
        throw new Error('creatorOf is not exported by the contract module');
      };

const hasActiveAccess: (assetId: number, agent: string) => Promise<boolean> =
  'hasActiveAccess' in contractModule
    ? (contractModule as typeof contractModule & {
        hasActiveAccess: (assetId: number, agent: string) => Promise<boolean>;
      }).hasActiveAccess
    : async () => false;

async function start() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  app.get('/health', async () => ({ ok: true }));

  /**
   * Register the symmetric key for a freshly minted asset.
   *
   * This must only ever be called from a trusted backend (e.g. the Next.js
   * /api/keymanager/register proxy), right after the mintIP transaction
   * confirms — never directly from a browser, since it requires ADMIN_API_KEY.
   */
  app.post<{ Params: { assetId: string }; Body: { keyBase64?: string } }>(
    '/keys/:assetId',
    async (request, reply) => {
      const apiKey = request.headers['x-api-key'];
      if (apiKey !== env.ADMIN_API_KEY) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const assetId = Number(request.params.assetId);
      const { keyBase64 } = request.body ?? {};
      if (!Number.isInteger(assetId) || assetId <= 0 || !keyBase64) {
        return reply.code(400).send({ error: 'assetId and keyBase64 are required' });
      }

      let creator: string;
      try {
        creator = await creatorOf(assetId);
      } catch (err) {
        request.log.error(err);
        return reply.code(502).send({ error: 'Failed to read asset from chain' });
      }

      if (creator.toLowerCase() === '0x0000000000000000000000000000000000000000') {
        return reply.code(404).send({ error: 'Asset not found on-chain' });
      }

      await storeAssetKey(assetId, keyBase64, creator);
      return reply.code(201).send({ stored: true, assetId, creator });
    }
  );

  /**
   * The gate the whole demo hinges on: only release the decryption key once
   * hasActiveAccess(assetId, agent) returns true on-chain. This is the
   * "before/after" moment — call it once before paying (expect 403), once
   * after requestAccess() confirms (expect 200).
   */
  app.get<{ Params: { assetId: string }; Querystring: { agent?: string } }>(
    '/key/:assetId',
    async (request, reply) => {
      const assetId = Number(request.params.assetId);
      const agent = request.query.agent;

      if (!Number.isInteger(assetId) || assetId <= 0) {
        return reply.code(400).send({ error: 'Invalid assetId' });
      }
      if (!agent) {
        return reply.code(400).send({ error: 'agent query param is required' });
      }

      const record = await getAssetKey(assetId);
      if (!record) {
        return reply.code(404).send({ error: 'No key registered for this asset yet' });
      }

      let allowed: boolean;
      try {
        allowed = await hasActiveAccess(assetId, agent);
      } catch (err) {
        request.log.error(err);
        return reply.code(502).send({ error: 'Failed to check access on-chain' });
      }

      if (!allowed) {
        return reply.code(403).send({ error: 'Access denied — no active CONSUMER_ROLE / expired.' });
      }

      return reply.send({ assetId, keyBase64: record.keyBase64 });
    }
  );

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void start();