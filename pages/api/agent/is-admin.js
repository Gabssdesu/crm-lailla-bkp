// pages/api/is-admin.js
import { chatwootPool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { account_id, user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'Parâmetro user_id é obrigatório' });
    }

    // Consulta ao banco de dados Chatwoot
    const result = await chatwootPool.query(
      'SELECT * FROM public.account_users WHERE account_id = $1 AND user_id = $2',
      [account_id, user_id]
    );

    // Verificar se é admin
    if (result.rows.length > 0 && result.rows[0].role === 1) {
      // Role 1 significa que é admin
      return res.status(200).json({ isAdmin: true });
    } else {
      // Não é admin
      return res.status(200).json({ isAdmin: false, result });
    }
  } catch (error) {
    console.error('Erro ao verificar permissão de admin:', error);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
}