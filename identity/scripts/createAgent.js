const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const DATA_FILE = path.join(__dirname, '..', 'data', 'identities.json');

function loadIdentities() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveIdentities(identities) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(identities, null, 2));
}

function main() {
  const label = process.argv[2] || `Agent-${Date.now()}`;

  const agentWallet = ethers.Wallet.createRandom();
  const identities = loadIdentities();

  identities[agentWallet.address] = {
    role: 'agent',
    label,
    did: `did:example:${agentWallet.address}`,
    createdAt: new Date().toISOString(),
  };

  saveIdentities(identities);

  console.log('New AI agent identity created:');
  console.log('  Label:       ', label);
  console.log('  Address:     ', agentWallet.address);
  console.log('  DID:         ', `did:example:${agentWallet.address}`);
  console.log('  Private key: ', agentWallet.privateKey);
  console.log('\n⚠️  Store the private key securely (e.g. AGENT_PRIVATE_KEY in .env).');
  console.log('   It is the only thing that lets this agent sign requestAccess().');
}

main();