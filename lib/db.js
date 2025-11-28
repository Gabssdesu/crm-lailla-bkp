import { Pool } from 'pg';

// Configuração para o banco de dados CDTJF
export const crmPool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.CRM_DB_NAME,
  port: parseInt(process.env.POSTGRES_PORT)
});

// Configuração para o banco de dados Chatwoot
export const chatwootPool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.CHATWOOT_DB_NAME,
  port: parseInt(process.env.POSTGRES_PORT)
});

// Função útil para tratar valores nulos
export const handleNull = (obj) => {
  if (!obj) return {};
  
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key] === null ? '' : obj[key];
    }
  }
  return result;
};