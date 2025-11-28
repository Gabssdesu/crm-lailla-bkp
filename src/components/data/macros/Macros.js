import React, { useRef, useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { addLocale, locale } from "primereact/api";
import InitContactCard from "./init-contact/InitContactCard";
import InitContactModal from "./init-contact/InitContactModal";
import MacrosCard from "./macros/MacrosCard";

locale("pt");
addLocale("pt", {
  firstDayOfWeek: 1,
  dayNames: [
    "domingo",
    "segunda",
    "terça",
    "quarta",
    "quinta",
    "sexta",
    "sábado",
  ],
  dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
  monthNames: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
  monthNamesShort: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ],
  today: "Hoje",
  clear: "Limpar",
  emptyFilterMessage: "Nada foi encontrado...",
  emptyMessage: "Nada foi encontrado...",
});

function Macros({
  client,
  dadosCW,
  dataCW,
  setUpdtDataCW,
  stageID,
  sales,
  setSales,
  marketing,
  setMarketing,
  acquisitions,
  setAcquisitions,
  campaigns,
  setCampaigns,
  ads,
  setAds,
  referrals,
  setReferrals,
  treatments,
  appointments,
  initContact,
  agentDepartment,
  isAdmin,
  stageControl,
}) {

  const toast = useRef(null);

  useEffect(() => {
    if (!stageID) return;
    fetch(`/api/client/sales-made?stage_id=${stageID}`)
      .then((response) => response.json())
      .then((data) => {
        setSales(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do webhook de vendas:", err);
      });
  }, [stageID]);

  const [startModal, setStartModal] = useState({
    lead: false,
    consultant: false,
  });

  const openStartModal = (type) => {
    setStartModal((prev) => ({ ...prev, [type]: true }));
  };

  const closeStartModal = (type) => {
    setStartModal((prev) => ({ ...prev, [type]: false }));
  };

  const [selectedAcquisition, setSelectedAcquisition] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedReferral, setSelectedReferral] = useState(null);

  const [showInitialData, setShowInitialData] = useState(false);
  const [showInitContact, setShowInitContact] = useState(true);

  useEffect(() => {
    if (stageID) {
      setShowInitialData(true);
      setShowInitContact(false);
    } else {
      setShowInitialData(false);
      setShowInitContact(true);
    }
  }, [stageID]);

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
        <InitContactCard
          client={client}
          dadosCW={dadosCW}
          dataCW={dataCW}
          stageID={stageID}
          stageControl={stageControl}
          selectedAcquisition={selectedAcquisition}
          selectedCampaign={selectedCampaign}
          selectedAd={selectedAd}
          selectedReferral={selectedReferral}
          showInitialData={showInitialData}
          setShowInitialData={setShowInitialData}
          showInitContact={showInitContact}
          setShowInitContact={setShowInitContact}
          startModal={startModal}
          openStartModal={openStartModal}
          closeStartModal={closeStartModal}
        />
        <InitContactModal
          dadosCW={dadosCW}
          marketing={marketing}
          setMarketing={setMarketing}
          acquisitions={acquisitions}
          setAcquisitions={setAcquisitions}
          selectedAcquisition={selectedAcquisition}
          setSelectedAcquisition={setSelectedAcquisition}
          campaigns={campaigns}
          setCampaigns={setCampaigns}
          selectedCampaign={selectedCampaign}
          setSelectedCampaign={setSelectedCampaign}
          ads={ads}
          setAds={setAds}
          selectedAd={selectedAd}
          setSelectedAd={setSelectedAd}
          referrals={referrals}
          setReferrals={setReferrals}
          selectedReferral={selectedReferral}
          setSelectedReferral={setSelectedReferral}
          setShowInitialData={setShowInitialData}
          setShowInitContact={setShowInitContact}
          startModal={startModal}
          openStartModal={openStartModal}
          closeStartModal={closeStartModal}
          initContact={initContact}
        />

        <MacrosCard
          toast={toast}
          sales={sales}
          dadosCW={dadosCW}
          stageID={stageID}
          setUpdtDataCW={setUpdtDataCW}
          treatments={treatments}
          appointments={appointments}
          // agentDepartment={agentDepartment}
          isAdmin={isAdmin}
        />

      </div>
    </>
  );
}

export default Macros;