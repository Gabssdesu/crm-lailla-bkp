import React from "react";
import { Dialog } from "primereact/dialog";
import { formatBRLCurrency } from "@/functions/formatters";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

export default function SaleDetailsModal({
  visible,
  sale,
  setSaleDetailsModal,
  appointments,
  treatments,
  setSale,
}) {


  const closeSaleDetailsModal = (rowData) => {
    setSaleDetailsModal(false);
    setSale(null);
  };

  const normalizeStatuses = (status) => {
    const statuses = {
      sinal: "SINAL",
      "aguardando-pagamento": "AGUARDANDO PAGAMENTO",
      pago: "PAGO",
    };
    return statuses[status?.toLowerCase()] || "DESCONHECIDO";
  };

  const getSeverity = (status) => {
    const severityMap = {
      sinal: "info",
      "aguardando-pagamento": "warning",
      pago: "success",
    };
    return severityMap[status?.toLowerCase()] || "secondary";
  };

  const getPaymentStatusTag = (sale) => {
    if (!sale) return null;

    const hasSignPayment = sale.payments?.some((p) => p.is_sign);
    const totalPayments = sale.payment_amount || 0;
    const finalValue = (sale.service_value || 0) - (sale.discount || 0);
    const isFullyPaid = totalPayments >= finalValue;

    if (isFullyPaid) {
      return (
        <Tag
          value="PAGO TOTAL"
          severity="success"
          style={{ backgroundColor: "rgba(40, 167, 69, 0.8)", marginLeft: "3%" }} // Ajusta a opacidade
        />
      );
    } else if (hasSignPayment) {
      return (
        <Tag
          value="SINAL PAGO"
          severity="info"
          style={{ backgroundColor: "rgba(20, 148, 208, 0.7)", marginLeft: "3%" }} // Ajusta a opacidade
        />
      );
    } else if (!sale.payment_status) {
      return (
        <Tag
          value="PENDENTE"
          severity="warning"
          style={{ backgroundColor: "rgba(255, 193, 7, 0.8)", marginLeft: "3%" }} // Ajusta a opacidade
        />
      );
    } else {
      const normalizedStatus = normalizeStatuses(sale.payment_status);
      const severity = getSeverity(sale.payment_status);
      return (
        <Tag
          value={normalizedStatus}
          severity={severity}
          style={{ backgroundColor: "rgba(108, 117, 125, 0.8)" }} // Ajusta a opacidade
        />
      );
    }
  };

  const header = (
    <div className="flex align-items-center" style={{ display: 'flex', flexDirection: "row" }}>
      <h5 style={{ marginLeft: "3%", marginTop: "10px", marginBottom: "0px" }}>
        Detalhes da Venda
      </h5>
      <span style={{ verticalAlign: "middle", width: "100px", marginLeft: "15px", marginTop: "5px" }}>{getPaymentStatusTag(sale)}</span>
    </div>
  )

  return (
    <Dialog
      visible={visible}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={header}
      modal
      onHide={closeSaleDetailsModal}
    >
      {sale ? (
        <div style={{ padding: "0px 20px" }}>
          {sale.service && (
            <>
              <p style={{ fontSize: "0.9rem", marginBottom: "0px" }}>Serviço</p>
              <p>
                <b>
                  {(sale.service_type === "consulta" && "Consulta") ||
                    (sale.service_type === "acompanhamento" && "Acompanhamento") ||
                    "Tipo desconhecido"}{" "}
                  -{" "}
                  {Object.values(
                    sale.service_type === "consulta" ? appointments : treatments
                  ).find(
                    (s) => s.value === sale.service
                  )?.display_name || "Serviço não encontrado"}
                </b>
              </p>
            </>)}
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "0.9rem" }}></i>
              <b>Valor do serviço:</b>
            </div>
            <span>{formatBRLCurrency(Number(sale.service_value))}</span>
          </div>

          {Number(sale.discount) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "0.9rem" }}></i>
                <b>Valor do desconto:</b>
              </div>
              <span>{formatBRLCurrency(Number(sale.discount))}</span>
            </div>
          )}


          {sale.payments?.find((p) => p.is_sign) && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "0.9rem" }}></i>
                <b>Valor do sinal:</b>
              </div>
              <span>
                {formatBRLCurrency(Number(sale.payments.find((p) => p.is_sign)?.amount))}
              </span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "0.9rem", color: "#26B756" }}></i>
              <b>Valor pago:</b>
            </div>
            <span>
              <b style={{ color: "#26B756" }}>
                {formatBRLCurrency(
                  sale.payments?.reduce((acc, p) => acc + Number(p.amount || 0), 0) || 0
                )}
              </b>
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F2F2F2", padding: "7px", borderRadius: "5px", marginTop: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "1rem", color: "#2B75ED" }}></i>
              <b>Valor total:</b>
            </div>
            <span>
              <b style={{ color: "#2B75ED" }}>{formatBRLCurrency(Number(sale.service_value) - Number(sale.discount))}</b>
            </span>
          </div>

          <Divider />
          {!sale.beginning_date && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <i className="pi pi-calendar-clock" style={{ marginRight: "5px", fontSize: "1rem" }}></i>
              <p style={{ margin: 0 }}>
                <b>Data do Serviço:</b>{" "}
                {new Date(sale.service_date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                às{" "}
                {new Date(sale.service_date).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
          {sale.beginning_date && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <i className="pi pi-calendar-clock" style={{ marginRight: "5px", fontSize: "1rem" }}></i>
              <p style={{ margin: 0 }}>
                <b>Data de Início:</b>{" "}
                {new Date(sale.beginning_date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                às{" "}
                {new Date(sale.beginning_date).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
          {sale.final_date && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <i className="pi pi-calendar-clock" style={{ marginRight: "5px", fontSize: "1rem" }}></i>
              <p style={{ margin: 0 }}>
                <b>Data de Término:</b>{" "}
                {new Date(sale.final_date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                às{" "}
                {new Date(sale.final_date).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
          {sale.notes && (
            <p>
              <b>Observações:</b> {sale.notes}
            </p>
          )}
        </div>
      ) : null}
    </Dialog>
  );
}