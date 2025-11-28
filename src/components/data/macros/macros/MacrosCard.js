import React, { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { adaptData } from "@/functions/adaptData";
import { Dialog } from "primereact/dialog"; // Import necessário
import { Dropdown } from "primereact/dropdown"; // Import necessário

export default function MacrosCard({
  toast,
  sales,
  dadosCW,
  setUpdtDataCW,
  stageID,
  treatments,
  appointments,
  isAdmin,
  // agentDepartment,
}) {

  const [cooldown, setCooldown] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(null);

  const contact_macros = stageID
    ? [
      {
        name: "Limpar Contato",
        url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/utilitarias?value=limpa-tudo",
        emoji: "🧹",
        icon: "pi pi-eraser",
      },
    ]
    : [
      {
        name: "Limpar Contato",
        url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/utilitarias?value=limpa-tudo",
        emoji: "🧹",
        icon: "pi pi-eraser",
      },
      {
        name: "Interna",
        url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/utilitarias?value=interna",
        emoji: "🏢",
        icon: "pi pi-building",
      },
      {
        name: "Prestador",
        url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/utilitarias?value=prestador",
        emoji: "🧑‍💼",
        icon: "pi pi-briefcase",
      },
      {
        name: "Não Aplica",
        url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/utilitarias?value=nao-aplica",
        emoji: "🚫",
        icon: "pi pi-times-circle",
      },
    ];

  const comercial_funnel = [
    {
      name: "Abordagem",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=abordagem",
      emoji: "🤝",
      icon: "pi pi-face-smile",
    },
    {
      name: "Investigação",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=investigacao",
      emoji: "🔍",
      icon: "pi pi-search",
    },
    {
      name: "Valorização",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=valorizacao",
      emoji: "✅",
      icon: "pi pi-check",
    },
    {
      name: "Apresentação",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=apresentacao",
      emoji: "📊",
      icon: "pi pi-chart-bar",
    },
    {
      name: "Agendamento",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=agendamento",
      emoji: "📅",
      icon: "pi pi-calendar",
    },
    {
      name: "Objeção",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=objecao",
      emoji: "❓",
      icon: "pi pi-question-circle",
    },
    {
      name: "Descartado",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=descartado",
      emoji: "🗑️",
      icon: "pi pi-trash",
    },
  ];

  const relationship_funnel = [
    {
      name: "Acompanhamento",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=acompanhamento",
      emoji: "📋",
      icon: "pi pi-list",
    },
    {
      // name: "Paciente ativo",
      name: "Consulta",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=agendado",
      emoji: "✅",
      icon: "pi pi-check-square",
    },
    {
      name: "Pós-Consulta",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=paciente-ativo",
      emoji: "✅",
      icon: "pi pi-check",
    },
    {
      name: "Consulta domiciliar",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=consulta-domiciliar",
      emoji: "🏠",
      icon: "pi pi-home",
    },
    {
      name: "Paciente inativo",
      url: "https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=paciente-inativo",
      emoji: "❌",
      icon: "pi pi-times-circle",
    },
  ];

  const handleMacro = (macro, url) => {
    setLoadingBtn(macro);
    const updatedData = JSON.parse(JSON.stringify(dadosCW));
    const adaptedData = adaptData(updatedData);

    const payload = {
      ...adaptedData,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUpdtDataCW((prev) => prev + 1);
        toast.current.show({
          severity: "success",
          summary: "Sucesso!",
          detail: `${macro} - ação realizada com sucesso!`,
          life: 3000,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.current.show({
          severity: "error",
          summary: "Erro!",
          detail: `Não foi possível realizar a ação: ${macro}`,
          life: 3000,
        });
      })
      .finally(() => setLoadingBtn(null));
  };

  const handleClick = (macro) => {
    setCooldown(true);
    setTimeout(() => setCooldown(false), 2000);
    setTimeout(() => {
      handleMacro(macro.name, macro.url);
    }, 500);
  };

  const [showDialog, setShowDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedMacro, setSelectedMacro] = useState(null); // Novo estado para rastrear a macro selecionada

  const handleMacroClick = (macroName) => {
    setSelectedMacro(macroName); // Define a macro selecionada
    setShowDialog(true); // Exibe o modal
  };

  const handleProductSelection = () => {
    if (!selectedService) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Selecione um serviço antes de continuar.",
        life: 3000,
      });
      return;
    }
    const macroValue = selectedMacro === "Consulta" ? "agendado" : selectedMacro.toLowerCase();
    const serviceURL = `https://enginewh.clientelaila.com.br/webhook/lailla/medicos/macros/etapas?value=${macroValue}&service=${encodeURIComponent(selectedService)}`;

    handleMacro(selectedMacro, serviceURL);

    setShowDialog(false);
    setSelectedService(null);
  };


  return (
    <>
      <Toast ref={toast} />
      <Card id="card-macros">
         {dadosCW?.currentAgent && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="agent-info">
              <div style={{ fontSize: '14px', color: "rgb(16, 185, 129)" }} title="Agente responsável">
                {dadosCW?.currentAgent?.name || 'Agente inexistente'}
              </div>
            </div>
            <div className="agent-info">
              <div style={{ fontSize: '14px', color: "rgb(99, 102, 241)" }} title="Caixa de entrada">
                {dadosCW.conversation.inbox_name || 'Inbox inexistente'}
              </div>
            </div>

            {isAdmin && (
              <div className="agent-info">
                <div style={{ fontSize: '14px', color: '#ffc107' }} title="Usuário Administrador">
                  Administrador
                </div>
              </div>
            )}
          </div>
        )}
        <div className="card-macros-content" style={{ marginTop: "10px" }}>
          <Divider align="left">
            <div className="inline-flex align-items-center">
              <b>Contato</b>
            </div>
          </Divider>
          <div
            className="grupo-macros"
            style={{
              justifyContent: dadosCW?.conversation?.custom_attributes?.contato_inicial
                ? "center"
                : "",
            }}
          >
            {contact_macros.map((macro) => (
              <Button
                key={macro.name}
                loading={loadingBtn === macro.name}
                className="btn-macro"
                icon={macro.icon}
                label={macro.name}
                disabled={cooldown}
                onClick={() => {
                  if (macro.name === "Limpar Contato" && sales.length > 0) {
                    toast.current.show({
                      severity: "warn",
                      summary: "Atenção",
                      detail:
                        "É necessário excluir as vendas antes de limpar o contato.",
                      life: 3000,
                    });
                  } else {
                    handleClick(macro);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {stageID && (
          <div className="card-macros-content">
            <div>
              <Divider align="left">
                <div className="inline-flex align-items-center">
                  <b>Funil Comercial</b>
                </div>
              </Divider>
              <div className="grupo-macros">
                {comercial_funnel.map((macro) => (
                  <Button
                    key={macro.name}
                    loading={loadingBtn === macro.name}
                    className="btn-macro"
                    icon={macro.icon}
                    label={macro.name}
                    onClick={() => handleClick(macro)}
                    disabled={cooldown}
                  />
                ))}
              </div>
            </div>

            <div className="card-macros-content">
              <Divider align="left">
                <div className="inline-flex align-items-center">
                  <b>Funil Relacionamento</b>
                </div>
              </Divider>
              <div className="grupo-macros">
                {relationship_funnel.map((macro) => (
                  macro.name === "Acompanhamento" || macro.name === "Consulta" ? (
                    <Button
                      key={macro.name}
                      loading={loadingBtn === macro.name}
                      className="btn-macro"
                      icon={macro.icon}
                      label={macro.name}
                      onClick={() => handleMacroClick(macro.name)}
                      disabled={cooldown}
                    />
                  ) : (
                    <Button
                      key={macro.name}
                      loading={loadingBtn === macro.name}
                      className="btn-macro"
                      icon={macro.icon}
                      label={macro.name}
                      onClick={() => handleMacro(macro.name, macro.url)}
                      disabled={cooldown}
                    />
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      <Dialog
        header={`Selecione um serviço para ${selectedMacro || ""}`}
        visible={showDialog}
        draggable={false}
        style={{ width: "50vw" }}
        onHide={() => setShowDialog(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              label="Confirmar"
              icon="pi pi-check"
              style={{ borderRadius: "10px" }}
              onClick={handleProductSelection}
            />
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
         <Dropdown
            value={selectedService}
            options={(selectedMacro === "Acompanhamento"
              ? (Array.isArray(treatments) ? treatments : Object.values(treatments || {}))
              : (Array.isArray(appointments) ? appointments : Object.values(appointments || {}))
            ).map(item => ({
              label: item.display_name || item.label || item.name,
              value: item.value ?? item.id
            }))}
            onChange={(e) => setSelectedService(e.value)}
            placeholder="Selecione um serviço"
            className="w-full"
            style={{ width: "60%", borderRadius: "10px" }}
          />
        </div>
      </Dialog>
    </>
  );
}