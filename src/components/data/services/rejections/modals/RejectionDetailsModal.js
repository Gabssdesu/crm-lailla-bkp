import React from "react";
import { Dialog } from "primereact/dialog";

export default function LostSaleDetailsModal({
  visible,
  setLostSaleDetailsModal,
  rejection,
  reasons,
  services,
  setRejection
}) {
  const closeLostSaleDetailsModal = (rowData) => {
    setLostSaleDetailsModal(false);
    setRejection(null);
  };
  return (
    <Dialog
      visible={visible}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Detalhes da objeção"
      modal
      onHide={closeLostSaleDetailsModal}
    >
      {rejection && (
        <div className="p-3">
          {rejection.reason && (
            <p>
              <b>Motivo:</b>{" "}
              {
                reasons.find((m) => m.id === rejection.reason)?.name ||
                (rejection.reason === "Excesso de Follow-Up"
                  ? "Excesso de Follow-Up"
                  : "Motivo desconhecido")
              }
            </p>
          )}
          {rejection.service && (
            <p>
              <b>Serviço:</b>{" "}
              {services[rejection.service] || "Serviço não encontrado"}
            </p>
          )}
          {rejection.detail && (
            <p>
              <b>Detalhe:</b> {rejection.detail}
            </p>
          )}
          {rejection.date && (
            <p>
              <b>Data:</b>{" "}
              {(() => {
                const [datePart, timePart] = rejection.date.split("T");
                const [year, month, day] = datePart.split("-");
                let [hour, minute] = timePart.split(":");
                return `${day}/${month}/${year} às ${hour
                  .toString()
                  .padStart(2, "0")}:${minute}`;
              })()}
            </p>
          )}
        </div>
      )}
    </Dialog>
  );
}