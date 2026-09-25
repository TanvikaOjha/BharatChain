import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name} (see .env.example)`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  RPC_URL: required('RPC_URL'),
  CONTRACT_ADDRESS: required('CONTRACT_ADDRESS'),
  KEY_STORE_PATH: process.env.KEY_STORE_PATH ?? './data/keys.json',
  ADMIN_API_KEY: required('ADMIN_API_KEY'),
};