import { crmPool, chatwootPool, handleNull } from '../../../lib/db';

// Função principal que substitui o fluxo do n8n
export async function getClientData(contact_id, conversation_id, agent_id, account_id) {
  try {
    // 1. Pegar dados do client
    const clienteResult = await crmPool.query(
      'SELECT * FROM public.contacts_data WHERE contact_id = $1 LIMIT 1',
      [contact_id]
    );
    const clientData = clienteResult.rows[0] || {};

    // 2. Pegar dados de endereço
    const addressResult = await crmPool.query(
      'SELECT * FROM public.contacts_addresses WHERE contact_id = $1 LIMIT 1',
      [contact_id]
    );
    const addressData = addressResult.rows[0] || {};

    // 3. Pegar dados do contato no Chatwoot
    const contactCWResult = await chatwootPool.query(
      'SELECT name, phone_number, custom_attributes, id, identifier FROM public.contacts WHERE id = $1 LIMIT 1',
      [contact_id]
    );
    const contactCW = contactCWResult.rows[0] || {};
    
    // 4. Pegar dados da conversa no Chatwoot
    const conversationCWResult = await chatwootPool.query(
      'SELECT status, inbox_id, account_id, custom_attributes, display_id AS id, cached_label_list, status FROM public.conversations WHERE display_id = $1 AND account_id = $2 LIMIT 1',
      [conversation_id, account_id]
    );
    const conversationCW = conversationCWResult.rows[0] || {};
    
    // 5. Pegar dados do agente no Chatwoot
    const agentCWResult = await chatwootPool.query(
      'SELECT id, name FROM public.users WHERE id = $1 LIMIT 1',
      [agent_id]
    );
    const agentCW = agentCWResult.rows[0] || {};

    // 6. Montando o objeto final com todos os dados
    const resultado = {
      client_data: handleNull(clientData),
      address_data: handleNull(addressData),
      dadosCW: handleNull({
        contact: contactCW,
        conversation: conversationCW,
        currentAgent: agentCW
      })
    };

    return resultado;
  } catch (error) {
    console.error('Erro ao obter dados do cliente:', error);
    throw error;
  }
}

// Exemplo de uso em uma API route do Next.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { contact_id, conversation_id, agent_id, account_id } = req.query;
    
    if (!contact_id || !conversation_id || !agent_id || !account_id) {
      return res.status(400).json({ message: 'Parâmetros obrigatórios não fornecidos' });
    }

    const data = await getClientData(contact_id, conversation_id, agent_id, account_id);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
}