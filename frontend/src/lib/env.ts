import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

function required(name: string, fallbackNames: string[] = []): string {
  const candidateNames = [name, ...fallbackNames];
  for (const candidate of candidateNames) {
    const value = process.env[candidate];
    if (value) {
      return value;
    }
  }

  throw new Error(`Missing required env var: ${name} (see .env.example)`);
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  RPC_URL: required('RPC_URL', ['NEXT_PUBLIC_RPC_URL']),
  CONTRACT_ADDRESS: required('CONTRACT_ADDRESS', ['NEXT_PUBLIC_CONTRACT_ADDRESS']),
  KEY_STORE_PATH: process.env.KEY_STORE_PATH ?? './data/keys.json',
  ADMIN_API_KEY: required('ADMIN_API_KEY', ['KEY_MANAGER_ADMIN_API_KEY']),
};