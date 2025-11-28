// Bibliotecas externas
import React, { useRef, useState, useEffect } from "react";
import "primeicons/primeicons.css";
import PropTypes from "prop-types";

// Componentes internos
import { Timeline } from "primereact/timeline";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import ClientCard from "@/components/common/ClientCard";
import CustomizedContent from "./components/CustomizedContent";
import NoContactCard from "@/components/common/NoContactCard";
import OppositeContent from "./components/OppositeContent";
import SummaryCard from "./components/SummaryCard";

// Constantes
import { departments, comercial_stages, relationship_stages, gatilhos, icones } from "./constants";

//isso serve pra ver no console caso alguma prop não esteja sendo passada corretamente!!
TimeLine.propTypes = {
  client: PropTypes.object.isRequired, // 'client' deve ser um objeto e é obrigatório
  dadosCW: PropTypes.object.isRequired, // 'dadosCW' deve ser um objeto e é obrigatório
  events: PropTypes.array.isRequired, // 'events' deve ser um array e é obrigatório
  setEvents: PropTypes.func.isRequired, // 'setEvents' deve ser uma função e é obrigatório
  stageID: PropTypes.string, // 'stageID' deve ser uma string (opcional)
  dataCW: PropTypes.object, // 'dataCW' deve ser um objeto (opcional)
  sales: PropTypes.array, // 'sales' deve ser um array (opcional)
  stageControl: PropTypes.object, // 'stageControl' deve ser um objeto (opcional)
};

function TimeLine({
  client,
  dadosCW,
  events,
  setEvents,
  stageID,
  dataCW,
  sales,
  treatments,
  appointments,
  // rejections,
  stageControl,
}) {

  const toast = useRef(null);
  const [carregando, setCarregando] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o botão quando o usuário rolar 300px para baixo
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!stageID || !sales || !dadosCW || !dadosCW.conversation.account_id)
      return;

    const queryParams = new URLSearchParams({
      stage_id: stageID,
      account_id: dadosCW.conversation.account_id, // Certifique-se de que `dadosCW.account_id` está disponível
    });

    fetch(
      `${process.env.NEXT_PUBLIC_WEBHOOK_TIMELINE}?${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao consultar linha do tempo: " + err.message,
          life: 3000,
        });
      });
  }, [stageID, sales, dadosCW]);

  useEffect(() => {
    setTimeout(() => {
      setCarregando(false);
    }, 1000);
  }, []);

  const customizedMarker = (item) => {
    const isInvalidStage = (item.stage === "agendado" || item.stage === "acompanhamento") && !item.service;
    const iconeInfo = icones[item.stage] || { icon: "pi pi-question", cor: "gray" };

    const icon = isInvalidStage ? "pi pi-times" : iconeInfo.icon;
    const cor = isInvalidStage ? "#E03E38" : iconeInfo.cor;

    return (
      <span className="custom-marker" style={{ backgroundColor: cor }}>
        <i className={icon}></i>
      </span>
    );
  };

  const renderCardContent = () => {
    if (carregando) {
      return (
        <div className="loading-container">
          <Skeleton width="20rem" height="12rem" borderRadius="16px" />
        </div>
      );
    }
    return <SummaryCard events={events} />;
  };

  return (
    <div
      className="font-size-reduced"
    >
      <Toast ref={toast} />
      {stageID ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="TLCaixa">
            <ClientCard
              client={client}
              dadosCW={dadosCW}
              dataCW={dataCW}
              stageControl={stageControl}
            />
          </div>

          <Timeline
            value={events}
            opposite={(item, index) => <OppositeContent item={item} index={index} />}
            content={(item, index) =>
              <CustomizedContent
                item={item}
                index={index}
                departments={departments}
                comercial_stages={comercial_stages}
                relationship_stages={relationship_stages}
                appointments={appointments}
                treatments={treatments}
                dadosCW={dadosCW}
                gatilhos={gatilhos}
                events={events}
              />
            }
            align="alternate"
            className="customized-timeline"
            marker={customizedMarker}
          />

          <div className="card-container">{renderCardContent()}</div>

          <div style={{ height: "10px" }}></div>
        </div>
      ) : stageID === undefined || stageID === null ? (
        <NoContactCard viewName="a linha do tempo" />
      ) : null}

      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <i className="pi pi-arrow-up"></i>
        </button>
      )}
    </div>
  );
}

export default TimeLine;