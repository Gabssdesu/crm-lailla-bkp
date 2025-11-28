import { crmPool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { stage_id } = req.query;

    if (!stage_id) {
      return res.status(400).json({ message: 'Parâmetro stage_id é obrigatório' });
    }

    // Consulta ao banco de dados
    const result = await crmPool.query(
      `SELECT *
      FROM public.control_rejections 
      WHERE stage_id = $1 
      ORDER BY id DESC`,
      [stage_id]
    );

    const rejections = result.rows.map(item => {      
      return {
      rejection_id: item.id,
      service: item.service,
      agent_id: item.agent_id,
      stage_id: item.stage_id,
      stage_number: item.stage_number,
      reason: item.rejection_reason,
      detail: item.lost_reason_detail,
      date: item.created_at
      };
    });

    return res.status(200).json(rejections);
    
  } catch (error) {
    console.error('Erro ao buscar vendas perdidas por etapa:', error);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
}
