import React, { useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { registerAcquisition, registerCampaign, registerAd, registerIndication } from '@/functions/registerFunctions';

export default function InitContactModal({
  dadosCW,
  marketing,
  setMarketing,
  acquisitions,
  setAcquisitions,
  selectedAcquisition,
  setSelectedAcquisition,
  campaigns,
  setCampaigns,
  selectedCampaign,
  setSelectedCampaign,
  ads,
  setAds,
  selectedAd,
  setSelectedAd,
  referrals,
  setReferrals,
  selectedReferral,
  setSelectedReferral,
  setShowInitialData,
  setShowInitContact,
  initContact,
  startModal,
  closeStartModal,
}) {

  const toast = useRef(null);

  const origins = [
    { name: "Captação", id: "acquisition" },
    { name: "Campanha", id: "campaign" },
    { name: "Anúncio", id: "ad" },
    { name: "Indicação", id: "referral" },
  ];

  const [selectedOrigins, setSelectedOrigins] = useState([origins[0]]);
  const [origensBackup, setOrigensBackup] = useState([origins[0]]);

  const onOriginChange = (e) => {
    let _origensSelecionadas = [...selectedOrigins];

    if (e.checked) {
      _origensSelecionadas.push(e.value);

      if (e.value.id === "referral") {
        setSelectedAcquisition("Indicação");
      }
    }
    else {
      _origensSelecionadas = selectedOrigins.filter(
        (origem) => origem.id !== e.value.id
      );
      if (e.value.id === "acquisition") setSelectedAcquisition(null);
      if (e.value.id === "campaign") setSelectedCampaign(null);
      if (e.value.id === "ad") setSelectedAd(null);
      if (e.value.id === "referral") {
        setSelectedReferral(null);
        setSelectedAcquisition(null);
      }
    }

    setSelectedOrigins(_origensSelecionadas);

    if (marketing.define_origin) {
      setOrigensBackup(_origensSelecionadas);
    }
  };

  const isValid = () => {
    if (marketing.define_origin === false) return true;
    if (selectedOrigins.length === 0) return false;
    if (
      selectedOrigins.some((item) => item.id === "acquisition") &&
      !selectedAcquisition
    )
      return false;
    if (
      selectedOrigins.some((item) => item.id === "campaign") &&
      !selectedCampaign
    )
      return false;
    if (selectedOrigins.some((item) => item.id === "ad") && !selectedAd)
      return false;
    if (
      selectedOrigins.some((item) => item.id === "acquisition") &&
      (selectedAcquisition?.acquisition === "Indicação" || selectedAcquisition === "Indicação") &&
      !selectedReferral
    )
      return false;

    return true;
  };

  useEffect(() => {
    if (!startModal.lead && !startModal.consultant) {
      setSelectedOrigins([origins[0]]);
      setOrigensBackup([origins[0]]);
      setMarketing((prev) => ({ ...prev, define_origin: true }));
      setSelectedAcquisition(null);
      setSelectedCampaign(null);
      setSelectedAd(null);
      setSelectedReferral(null);
    }
  }, [startModal.lead, startModal.consultant]);

  const handleInitContact = (type) => {
    if (!isValid()) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Todos os campos são obrigatórios!",
        life: 3000,
      });
      return;
    }

    toast.current.show({
      severity: "info",
      summary: "Carregando",
      detail: "Iniciando contato...",
      life: 2300,
    });

    setShowInitialData(true);
    setShowInitContact(false);
    closeStartModal(type);

    if (selectedAcquisition && !acquisitions.includes(selectedAcquisition)) {
      registerAcquisition(selectedAcquisition, acquisitions, setAcquisitions, dadosCW, toast);
    }
    if (selectedCampaign && !campaigns.includes(selectedCampaign)) {
      registerCampaign(selectedCampaign, campaigns, setCampaigns, dadosCW, toast);
    }
    if (selectedAd && !ads.includes(selectedAd)) {
      registerAd(selectedAd, ads, setAds, dadosCW, toast);
    }
    if (selectedReferral && !referrals.includes(selectedReferral)) {
      registerIndication(selectedReferral, referrals, setReferrals, dadosCW, toast);
    }

    initContact(type, selectedAcquisition, selectedCampaign, selectedAd, selectedReferral);
  };

  const modalFooter = (type) => (
    <>
      <Button
        style={{ margin: "5px", borderRadius: "8px" }}
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={() => closeStartModal(type)}
      />
      <Button
        style={{ margin: "5px", borderRadius: "8px" }}
        label="Iniciar Contato"
        icon="pi pi-check"
        onClick={() => handleInitContact(type)}
        disabled={!isValid()}
      />
    </>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={startModal.lead || startModal.consultant}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={startModal.lead ? "Cliente" : "Consultor"}
        modal
        footer={modalFooter(startModal.lead ? "lead" : "consultant")}
        onHide={() => closeStartModal(startModal.lead ? "lead" : "consultant")}
      >
        <div className="confirmation-content">
          <div style={{ marginBottom: "25px" }}>
            <RadioButton
              inputId="definir-origem"
              name="definir-origem"
              style={{ marginRight: "5px" }}
              value={true}
              onChange={() => {
                setMarketing((prev) => ({ ...prev, define_origin: true }));
                setSelectedOrigins(
                  origensBackup.length ? origensBackup : [origins[0]]
                );
              }}
              checked={marketing.define_origin === true}
            />
            <label
              htmlFor="definir-origem"
              className="ml-2"
              style={{ marginRight: "30px" }}
            >
              Definir Origem
            </label>

            <RadioButton
              inputId="nao-aplica"
              name="definir-origem"
              style={{ marginRight: "5px" }}
              value={false}
              onChange={() => {
                setMarketing((prev) => ({ ...prev, define_origin: false }));
                setOrigensBackup(selectedOrigins);
                setSelectedOrigins([]);
                setSelectedAcquisition(null);
                setSelectedCampaign(null);
                setSelectedAd(null);
                setSelectedReferral(null);
              }}
              checked={marketing.define_origin === false}
            />
            <label htmlFor="nao-aplica" className="ml-2">
              Não Aplica
            </label>
          </div>

          {marketing.define_origin === true && (
            <div className="flex flex-wrap gap-3 items-center RadioButtonsLinha">
              {origins.map((origem) => (
                <div key={origem.id} className="flex align-items-center">
                  <Checkbox
                    inputId={origem.id}
                    name="origem"
                    value={origem}
                    onChange={onOriginChange}
                    checked={selectedOrigins.some(
                      (item) => item.id === origem.id
                    )}
                    disabled={
                      origem.id === "acquisition" &&
                      selectedOrigins.some((item) => item.id === "referral")
                    }
                  />
                  <label
                    htmlFor={origem.id}
                    className="ml-2"
                    style={{ marginLeft: "5px" }}
                  >
                    {origem.name}
                  </label>
                </div>
              ))}

              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column" }}>
                {selectedOrigins.some((item) => item.id === "acquisition") && (
                  <Dropdown
                    value={selectedAcquisition}
                    onChange={(e) => setSelectedAcquisition(e.value)}
                    options={acquisitions}
                    optionLabel="acquisition"
                    editable
                    placeholder="Selecione uma captação"
                    className="w-full md:w-14rem"
                    style={{ marginBottom: "10px" }}
                    disabled={selectedOrigins.some((item) => item.id === "referral")}
                  />
                )}

                {selectedOrigins.some((item) => item.id === "campaign") && (
                  <Dropdown
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.value)}
                    options={campaigns}
                    optionLabel="name"
                    editable
                    style={{ marginBottom: "10px" }}
                    placeholder="Selecione uma campanha"
                    className="w-full md:w-14rem"
                  />
                )}

                {selectedOrigins.some((item) => item.id === "ad") && (
                  <Dropdown
                    value={selectedAd}
                    onChange={(e) => setSelectedAd(e.value)}
                    options={ads}
                    optionLabel="name"
                    editable
                    placeholder="Selecione um anúncio"
                    className="w-full md:w-14rem"
                    style={{ marginBottom: "10px" }}
                  />
                )}

                {selectedOrigins.some((item) => item.id === "referral") && (
                  <Dropdown
                    value={selectedReferral}
                    onChange={(e) => setSelectedReferral(e.value)}
                    options={referrals}
                    optionLabel="name"
                    editable
                    placeholder="Selecione uma indicação"
                    className="w-full md:w-14rem"
                    style={{ marginBottom: "10px" }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  )
}