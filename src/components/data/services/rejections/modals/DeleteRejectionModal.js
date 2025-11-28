import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export default function DeleteLostSaleModal({
  visible,
  rejection,
  reasons,
  setDeleteLostSaleModal,
  setRejection,
  rejections,
  setRejections,
  deleteRejections,
}) {

  const fecharDeletarVendaPerdidaModal = () => {
    setDeleteLostSaleModal(false);
  };


  const deleteLostSale = (id) => {
    const index = rejections.indexOf(rejection);
    if (index > -1) {
      let _lostSales = [...rejections];
      _lostSales.splice(index, 1);
      setRejections(_lostSales);
    }
    setDeleteLostSaleModal(false);
    setRejection(null);
    deleteRejections(id);
  };

  const deleteLostSaleModalFooter = (id) => {
    return (
      <React.Fragment>
        <Button
          style={{ margin: "5px", borderRadius: "8px" }}
          label="Cancelar"
          icon="pi pi-times"
          outlined
          onClick={fecharDeletarVendaPerdidaModal}
        />
        <Button
          style={{ margin: "5px", borderRadius: "8px" }}
          label="Deletar"
          icon="pi pi-check"
          severity="danger"
          onClick={() => deleteLostSale(id)}
        />
      </React.Fragment>
    );
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "95vw" }}
      header="Confirmar exclusão de objeção"
      modal
      footer={deleteLostSaleModalFooter(rejection?.rejection_id)}
      onHide={fecharDeletarVendaPerdidaModal}
    >
      <div className="confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "1.5rem", verticalAlign: "middle" }}
        />
        {rejection && (
          <span>
            Tem certeza que deseja excluir a objeção por{" "}
            <b>
              {
                reasons.find((m) => m.id === rejection.reason)?.name ||
                (rejection.reason === "Excesso de Follow-Up"
                  ? "Excesso de Follow-Up"
                  : "Motivo desconhecido")
              }
            </b>
            ?
          </span>
        )}
      </div>
    </Dialog>
  );
}