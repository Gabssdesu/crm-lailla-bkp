import React, { useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ClientCard from "@/components/common/ClientCard";


export default function InitContactCard({
  client,
  dadosCW,
  dataCW,
  stageID,
  stageControl,
  selectedAcquisition,
  selectedCampaign,
  selectedAd,
  selectedReferral,
  showInitialData,
  setShowInitialData,
  showInitContact,
  setShowInitContact,
  startModal,
  openStartModal,
  closeStartModal,
}) {

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
      {showInitContact && !stageID ? (
        <div className="flex-row">
          <Card
            title="Iniciar Contato como:"
            className="card-iniciar-contato"
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '-10px' }}>
              <Button
                label="Cliente"
                icon="pi pi-pen-to-square"
                className="p-button-initcontact"
                style={{ borderRadius: "8px", margin: "5px" }}
                onClick={() => openStartModal("lead")}
              />
              <Button
                label="Consultor"
                icon="pi pi-comment"
                className="p-button-initcontact"
                style={{ borderRadius: "8px", margin: "5px" }}
                onClick={() => openStartModal("consultant")}
              />
            </div>
          </Card>
        </div>
      ) : showInitialData && (
        <div style={{marginTop: '20px'}}>
          <ClientCard
            client={client}
            dadosCW={dadosCW}
            dataCW={dataCW}
            stageControl={stageControl}
          />
        </div>
      )}
    </>
  )
}