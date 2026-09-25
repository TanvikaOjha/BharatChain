import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { env } from './env';

interface KeyRecord {
  keyBase64: string;
  creator: string;
  storedAt: number;
}

// assetId (as string) -> record
type Store = Record<string, KeyRecord>;

// A JSON file is plenty for a 36-48h hackathon demo. For anything beyond
// that, swap this module for a real secrets manager / KMS (or go the
// Lit Protocol route described in the build guide, which removes the
// centralized key server entirely).
let writeQueue: Promise<unknown> = Promise.resolve();

async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(env.KEY_STORE_PATH, 'utf8');
    return JSON.parse(raw) as Store;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw err;
  }
}

async function writeStore(store: Store): Promise<void> {
  await mkdir(dirname(env.KEY_STORE_PATH), { recursive: true });
  await writeFile(env.KEY_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

/** Serializes reads-then-writes so concurrent register calls can't clobber each other. */
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(task, task);
  writeQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

export async function storeAssetKey(assetId: number, keyBase64: string, creator: string): Promise<void> {
  await enqueue(async () => {
    const store = await readStore();
    store[String(assetId)] = { keyBase64, creator: creator.toLowerCase(), storedAt: Date.now() };
    await writeStore(store);
  });
}

export async function getAssetKey(assetId: number): Promise<KeyRecord | null> {
  const store = await readStore();
  return store[String(assetId)] ?? null;
}