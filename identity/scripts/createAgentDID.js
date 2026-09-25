require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'identities.json');

async function pinToIPFS(jsonBody) {
  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    jsonBody,
    { headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` } }
  );
  return res.data.IpfsHash;
}

async function main() {
  const agentAddress = process.argv[2];
  const serviceEndpoint = process.argv[3] || 'https://example.com/agent-api';

  if (!agentAddress) {
    console.error('Usage: node createAgentDID.js <agent-address> [serviceEndpoint]');
    process.exit(1);
  }

  const didDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: `did:example:${agentAddress}`,
    controller: agentAddress,
    service: [
      {
        type: 'AIConsumerAgent',
        serviceEndpoint,
      },
    ],
  };

  console.log('Pinning DID document to IPFS...');
  const cid = await pinToIPFS(didDocument);
  console.log('Pinned. CID:', cid);

  // Attach the DID CID to the existing identity record, if present.
  const identities = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) : {};
  identities[agentAddress] = {
    ...(identities[agentAddress] || { role: 'agent' }),
    didDocumentCid: cid,
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(identities, null, 2));

  console.log('Updated data/identities.json with didDocumentCid.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});