export const adaptData = (dadosCW) => {
  return {
    contact_inbox: {
      id: dadosCW.contact.id,
      contact_id: dadosCW.contact.id,
      inbox_id: dadosCW.conversation.inbox_id,
    },
    id: dadosCW.conversation.id,
    inbox_id: dadosCW.conversation.inbox_id,
    labels: dadosCW.conversation.cached_label_list,
    meta: {
      sender: {
        id: dadosCW.contact.id,
        name: dadosCW.contact.name,
        phone_number: dadosCW.contact.phone_number,
        identifier: dadosCW.contact.identifier,
        custom_attributes: {
          bloqueado: dadosCW.contact.custom_attributes.bloqueado
        },
      },
      assignee: {
        id: dadosCW.currentAgent.id,
        name: dadosCW.currentAgent.name,
        available_name: dadosCW.currentAgent.name,
      },
    },
    status: dadosCW.conversation.status,
    messages: [
      {
        conversation_id: dadosCW.conversation.id,
        account_id: dadosCW.conversation.account_id
      },
    ],
    custom_attributes: {
      produto: dadosCW.conversation.custom_attributes.produto,
      follow_up: dadosCW.conversation.custom_attributes.follow_up,
      departamento: dadosCW.conversation.custom_attributes.departamento,
      tipo_objecao: dadosCW.conversation.custom_attributes.tipo_objecao,
      classificacao: dadosCW.conversation.custom_attributes.classificacao,
      funil_comercial: dadosCW.conversation.custom_attributes.funil_comercial,
      funil_relacionamento: dadosCW.conversation.custom_attributes.funil_relacionamento
    },
  };
};
