import { crmPool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { contact_id } = req.query;
    
    if (!contact_id) {
      return res.status(400).json({ message: 'Parâmetro contact_id é obrigatório' });
    }

    // Consulta ao banco de dados
    const result = await crmPool.query(
      'SELECT * FROM public.control_stages WHERE contact_id = $1 ORDER BY id DESC',
      [contact_id]
    );

    // Verificar se retornou algum resultado
    if (result.rows.length > 0) {
      // Tem resultados, retorna o primeiro (mais recente por causa do ORDER BY DESC)
      return res.status(200).json(result.rows[0]);
    } else {
      // Não tem resultados
      return res.status(200).json({ id: null });
    }
  } catch (error) {
    console.error('Erro ao buscar controle de etapas:', error);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
}