import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { adaptData } from "@/functions/adaptData";

function Transfer({ transfer, setTransfer, instances, dadosCW, events, setEvents, stageID }) {
  const toast = useRef(null);
  const [cooldown, setCooldown] = useState(false);

  const waitForEventsUpdate = async (maxAttempts = 5, delay = 2000) => {
    let attempts = 0;
    let previousEvents = events;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      // await fetchEvents();

      if (JSON.stringify(events) !== JSON.stringify(previousEvents)) {
        break;
      }

      attempts++;
    }
  };

  // const postTransferencia = async (transfer) => {
  //   try {
  //     if (!transfer || !transfer.inbox) {
  //       throw new Error("Erro: 'inbox' não foi definido.");
  //     }

  //     const url = `https://enginewebhook.w40.unigate.com.br/webhook/cdtjf/macro/transfer?instance=${transfer.inbox}`;

  //     const body = JSON.stringify({
  //       ...adaptData(dadosCW),
  //       remoteJid: dadosCW.contact.identifier?.split("@")[0] || "",
  //       cn_status: dadosCW.contact.custom_attributes.csv_status || "",
  //       snoozed: false,
  //     });

  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: body,
  //     });

  //     if (!response.ok) {
  //       const errorResponse = await response.text();
  //       throw new Error(`Erro na requisição: ${response.status} - ${errorResponse}`);
  //     }

  //     const data = await response.json();

  //     toast.current.show({
  //       severity: "success",
  //       summary: "Sucesso",
  //       detail: "Transferência realizada com sucesso!",
  //       life: 5000,
  //     });

  //     waitForEventsUpdate();
  //     // fetchEvents();

  //     return data;
  //   } catch (error) {
  //     console.error("Erro ao send transferência:", error);
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Erro",
  //       detail: "Não foi possível realizar a transferência!",
  //       life: 3000,
  //     });
  //   }
  // };

  const handleClick = () => {
    setCooldown(true);
    if (!stageID) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Você deve iniciar o contato antes de realizar uma transferência!",
        life: 3000,
      });
    }
    // else {
    //   // postTransferencia(transfer);
    // }
    setTimeout(() => {
      setCooldown(false);
    }, 4000);
  };

  const transferencia_vendas = [
    {
      name: "Transferência de vendas",
      url: `https://enginewebhook.w40.unigate.com.br/webhook/cdtjf/macro/transfer?instance=${transfer.inbox}`,
      emoji: "🔁",
    },
  ];

  const transferencia_adimplencia = [
    {
      name: "Transferência de adimplência",
      url: `https://enginewebhook.w40.unigate.com.br/webhook/cdtjf/macro/transfer?instance=${transfer.inbox}`,
      emoji: "💰",
    },
  ];

  const transferencia_retencao = [
    {
      name: "Transferência de retenção",
      url: `https://enginewebhook.w40.unigate.com.br/webhook/cdtjf/macro/transfer?instance=${transfer.inbox}`,
      emoji: "🔒",
    },
  ];

  const transferencia_edt = [
    {
      name: "Transferência de EDT",
      url: `https://enginewebhook.w40.unigate.com.br/webhook/cdtjf/macro/transfer?instance=${transfer.inbox}`,
      emoji: "📞",
    },
  ];

  const setores = [
    { label: "Vendas", value: "Vendas" },
    { label: "Adimplência", value: "Adimplencia" },
    { label: "Retenção", value: "Retencao" },
    { label: "EDT", value: "EDT" }
  ];

  const getTransferenciaData = (sector) => {
    switch (sector) {
      case "Vendas":
        return transferencia_vendas;
      case "Adimplencia":
        return transferencia_adimplencia;
      case "Retencao":
        return transferencia_retencao;
      case "EDT":
        return transferencia_edt;
      default:
        return [];
    }
  };

  const transferenciaData = getTransferenciaData(transfer.sector);

  return (
    <>
      <Toast ref={toast} />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Card id="card-transfer">
          <div style={{ width: "88vw", marginTop: "-20px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Divider align="center">
                <div className="inline-flex align-items-center">
                  <b>Transferência</b>
                </div>
              </Divider>
              <div className="grupo-transf-campos">
                <FloatLabel className="w-full md:w-14rem">
                  <Dropdown
                    inputId="sector"
                    value={transfer.sector}
                    onChange={(e) =>
                      setTransfer((prevTransferencia) => ({
                        ...prevTransferencia,
                        sector: e.value,
                      }))
                    }
                    options={setores}
                    placeholder="Selecione um sector"
                    className="w-full campos-transf"
                  />
                  <label htmlFor="sector">Setores</label>
                </FloatLabel>
                <FloatLabel className="w-full md:w-14rem">
                  <Dropdown
                    inputId="inbox"
                    value={transfer.inbox}
                    onChange={(e) =>
                      setTransfer((prevTransferencia) => ({
                        ...prevTransferencia,
                        inbox: e.value,
                      }))
                    }
                    options={instances
                      .filter(
                        (item) =>
                          item["Status de Instância"] === "Conectada" &&
                          item.Setor === transfer.sector
                      )
                      .map((item) => ({
                        label: `${item.Inbox} - ${item.Nome}`,
                        value: item.Inbox,
                      }))}
                    disabled={!transfer.sector}
                    placeholder="Selecione uma caixa de entrada"
                    className="w-full campos-transf"
                  />
                  <label htmlFor="inbox">Caixa de entrada</label>
                </FloatLabel>

              </div>

              {transferenciaData.map((contato) => (
                <Button
                  key={contato.name}
                  className="btn-transf"
                  label={`${contato.emoji} ${contato.name}`}
                  onClick={() => handleClick(contato)}
                  disabled={cooldown}
                  loading={cooldown}
                />
              ))}

            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Transfer;
