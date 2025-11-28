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
      "SELECT control_sales.*, json_agg(control_payments.*) FILTER (WHERE control_payments.id IS NOT NULL) AS payments FROM control_sales LEFT JOIN control_payments ON control_sales.id = control_payments.sale_id WHERE control_sales.stage_id = $1 GROUP BY control_sales.id;",
      [stage_id]
    );

    // Se não encontrou resultados
    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    // Mapear os resultados para o formato desejado
    const sales = result.rows.map(item => ({
      sale_id: item.id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      service: item.service,
      service_type: item.service.includes('consulta') ? 'consulta' : 'acompanhamento',
      service_value: item.service_value,
      service_date: item.service_date,
      is_completed: item.is_completed,
      is_canceled: item.is_canceled,
      payment_amount: item.payment_amount,
      payment_status: item.payment_status,
      discount: item.discount,
      agent_id: item.agent_id,
      stage_id: item.stage_id,
      stage_number: item.stage_number,
      notes: item.notes,
      beginning_date: item.beginning_date,
      final_date: item.final_date,
      payments: (item.payments && item.payments.map(payment => {
        // Mapeia cada item e renomeia o campo 'id' para 'payment_id'
        const { id, ...rest } = payment; // Desestrutura e pega o 'id', mantendo o resto
        return { payment_id: id, ...rest }; // Retorna um novo objeto com 'payment_id' e os outros campos
      })) || [] // Caso 'item.payments' seja null ou undefined, retorna um array vazio
    }));
    
    // Retornar os dados processados
    return res.status(200).json(sales);

  } catch (error) {
    console.error('Erro ao buscar vendas por etapa:', error);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
}