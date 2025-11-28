import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export default function DeleteSaleModal({
    visible,
    sale,
    appointments,
    treatments,
    setDeleteSaleModal,
    sales,
    setSales,
    setSale,
    deleteSalesDB,
}) {

    const closeDeleteSaleModal = () => {
        setDeleteSaleModal(false);
    };

    const deleteSale = (id) => {
        const index = sales.indexOf(sale);
        if (index > -1) {
            let _sales = [...sales];
            _sales.splice(index, 1);
            setSales(_sales);
        }
        setDeleteSaleModal(false);
        setSale(null);
        deleteSalesDB(id);
    };

    const deleteSaleModalFooter = (id) => {
        return (
            <React.Fragment>
                <Button
                    style={{ margin: "5px", borderRadius: "8px" }}
                    label="Cancelar"
                    icon="pi pi-times"
                    outlined
                    onClick={closeDeleteSaleModal}
                />
                <Button
                    style={{ margin: "5px", borderRadius: "8px" }}
                    label="Deletar"
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={() => deleteSale(id)}
                />
            </React.Fragment>
        );
    };

    return (
        <Dialog
            visible={visible}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirmar exclusão de venda"
            modal
            footer={deleteSaleModalFooter(sale?.sale_id)}
            onHide={closeDeleteSaleModal}
        >
            <div className="confirmation-content">
                <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "1.5rem", verticalAlign: "middle" }}
                />
                {sale && (
                    <span style={{ textAlign: "center" }}>
                        Tem certeza que deseja excluir{" "}
                        <b>
                            {[
                                ...Object.values(appointments || {}),
                                ...Object.values(treatments || {})
                            ].find(
                                (s) => s.value === sale.service
                            )?.display_name || "Serviço não encontrado"}
                        </b>
                        ?
                    </span>
                )}
            </div>
        </Dialog>
    );
} 