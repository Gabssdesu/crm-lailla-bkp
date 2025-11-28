import { crmPool } from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { id, tableName, status } = req.body;

    // Validação dos dados recebidos
    if (!id || !tableName || typeof status !== 'boolean') {
        return res.status(400).json({ 
            message: 'Dados inválidos. É necessário enviar id, tableName e status (boolean)' 
        });
    }

    // Validação das tabelas permitidas
    const allowedTables = ['options_service', 'options_rejection'];
    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ 
            message: 'Tabela não permitida' 
        });
    }

    try {
        // Atualiza o status da opção
        const updateQuery = `
            UPDATE ${tableName} 
            SET status = $1 
            WHERE id = $2 
            RETURNING *
        `;
        
        const result = await crmPool.query(updateQuery, [status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'Opção não encontrada' 
            });
        }

        const updatedOption = result.rows[0];

        res.status(200).json({
            message: `Opção ${status ? 'ativada' : 'desativada'} com sucesso`,
            data: {
                ...updatedOption,
                // Garantir que todos os campos são serializáveis
                ...Object.fromEntries(Object.entries(updatedOption).map(([k, v]) => 
                    [k, v instanceof Date ? v.toISOString() : v]
                ))
            },
            components: {} // Adiciona um objeto components vazio para evitar erros de undefined
        });

    } catch (error) {
        console.error('Erro ao atualizar status da opção:', error);
        res.status(500).json({ 
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
}
