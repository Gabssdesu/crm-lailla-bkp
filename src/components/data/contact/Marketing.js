import React, { useEffect, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Card } from "primereact/card";
import { FloatLabel } from 'primereact/floatlabel';

function Marketing({ marketing, setMarketing, dadosCW, stageControl }) {

  const campoIndicacaoRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMarketing({
      ...marketing,
      [name]: value,
    });
  };

  useEffect(() => {
    if (stageControl?.contact_id !== "") {
      setMarketing({
        campaign: stageControl?.first_campaign || '',
        ad: stageControl?.first_ad || '',
        acquisition: stageControl?.first_acquisition || '',
        contact_type: stageControl?.initial_contact || '',
        engagement: stageControl?.current_engagement || '',
        first_instance: stageControl?.first_instance || '',
        conversation_class: dadosCW?.conversation?.custom_attributes?.classificacao || '',
        comercial_funnel: dadosCW?.conversation?.custom_attributes?.funil_comercial || '',
        relationship_funnel: dadosCW?.conversation?.custom_attributes?.funil_relacionamento || '',
        follow_up: dadosCW?.conversation?.custom_attributes?.follow_up || ''
      });
    }
  }, [dadosCW, setMarketing]);

  useEffect(() => {
    if (campoIndicacaoRef.current) {
      if (marketing.acquisition === "indicacao") {
        campoIndicacaoRef.current.style.display = "block";
      } else {
        campoIndicacaoRef.current.style.display = "none";
      }
    }
  }, [marketing.acquisition]);

  return (

    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <i className="pi pi-chart-pie" style={{ marginRight: '8px', fontSize: '0.9em' }}></i>
          Dados do marketing
        </div>
      }
        style={{ width: "auto", marginTop: '10px' }} className="card"
      >
        <div className="flex justify-content-center caixa mt-5">
          <FloatLabel htmlFor="acquisition">
            <InputText
              id="acquisition"
              value={marketing.acquisition}
              onChange={handleChange}
              name="acquisition"
              className="campos"
              disabled
            />
            <label htmlFor="acquisition">Captação</label>
          </FloatLabel>
          <FloatLabel htmlFor="campaign">
            <InputText
              id="campaign"
              value={marketing.campaign}
              onChange={handleChange}
              name="campaign"
              className="campos"
              disabled
            />
            <label htmlFor="campaign">Campanha</label>
          </FloatLabel>
        </div>
        <div
          className="flex justify-content-center"
          style={{ display: "flex", marginTop: "45px", height: "50px" }}
        >
          <FloatLabel htmlFor="ad">
            <InputText
              id="ad"
              value={marketing.ad}
              onChange={handleChange}
              name="ad"
              className="campos"
              disabled
            />
            <label htmlFor="ad">Anúncio</label>
          </FloatLabel>
          <FloatLabel htmlFor="contact_type">
            <InputText
              id="contact_type"
              value={marketing.contact_type}
              onChange={handleChange}
              name="contact_type"
              className="campos"
              disabled
              min={0}
            />
            <label htmlFor="contact_type">Tipo do contato</label>
          </FloatLabel>
        </div>
        <div
          className="flex justify-content-center"
          style={{ display: "flex", marginTop: "45px", height: "50px" }}
        >
          <FloatLabel htmlFor="engagement">
            <InputText
              id="engagement"
              value={marketing.engagement}
              onChange={handleChange}
              name="engagement"
              className="campos"
              disabled
            />
            <label htmlFor="engagement">Engajamento</label>
          </FloatLabel>
          <FloatLabel htmlFor="conversation_class">
            <InputText
              id="conversation_class"
              value={marketing.conversation_class}
              onChange={handleChange}
              name="conversation_class"
              className="campos"
              disabled
            />
            <label htmlFor="conversation_class">Classificação da conversa</label>
          </FloatLabel>
        </div>
        <div
          className="flex justify-content-center"
          style={{ display: "flex", marginTop: "45px", height: "50px" }}
        >
          <FloatLabel htmlFor="comercial_funnel">
            <InputText
              id="comercial_funnel"
              value={marketing.comercial_funnel}
              onChange={handleChange}
              name="comercial_funnel"
              className="campos"
              disabled
            />
            <label htmlFor="comercial_funnel">Funil comercial</label>
          </FloatLabel>
          <FloatLabel htmlFor="relationship_funnel">
            <InputText
              id="relationship_funnel"
              value={marketing.relationship_funnel}
              onChange={handleChange}
              name="relationship_funnel"
              className="campos"
              disabled
            />
            <label htmlFor="relationship_funnel">Funil de relacionamento</label>
          </FloatLabel>
        </div>
        <div
          className="flex justify-content-center"
          style={{ display: "flex", marginTop: "45px", height: "50px" }}
        >
          <FloatLabel htmlFor="follow_up">
            <InputText
              id="follow_up"
              value={marketing.follow_up}
              onChange={handleChange}
              name="follow_up"
              className="campos"
              disabled
            />
            <label htmlFor="follow_up">Follow-Up</label>
          </FloatLabel>
          {/* <div id="CampoIndicacao" style={{ display: 'none' }}>
            <FloatLabel htmlFor="indicacao">
              <InputText
                id="indicacao"
                value={marketing.indicacao}
                onChange={handleChange}
                name="indicacao"
                className="campos"
                disabled
              />
              <label htmlFor="indicacao">Indicação</label>
            </FloatLabel>
          </div> */}
        </div>
      </Card>
    </div>
  );
}

export default Marketing;