import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";

export default function SalesTable({
  sales,
  setSales,
  isAdmin,
  treatments = [],
  appointments = [],
  onOpenSaleModal,
  openPaymentModal,
  openSaleDetailsModal,
  stageID, setSale, setDeleteSaleModal,
}) {

  const [globalFilter, setGlobalFilter] = useState(null);

  useEffect(() => {
    if (!stageID) return;
    fetch(`/api/client/sales-made?stage_id=${stageID}`)
      .then((response) => response.json())
      .then((data) => {
        setSales(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do webhook vendas:", err);
      });
  }, [stageID]);

  const header = (
    <div
      style={{ display: "flex", height: "35px" }}
      className="gap-2 align-items-center justify-content-between"
    >
      <div className="flex flex-wrap gap-2">
        <Button
          style={{ height: "50px", borderRadius: "8px" }}
          label="Novo"
          iconPos="right"
          icon="pi pi-plus"
          severity="success"
          onClick={() => onOpenSaleModal()}
        />
      </div>
      {/* <h5 style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "12px", width: "100%", marginRight: "10px" }}>
        Pesquisa de vendas
      </h5> */}
      <IconField iconPosition="right" style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Pesquisar"
        />
        <InputIcon className={classNames("pi pi-search")} />
      </IconField>
    </div>
  );

  const statuses = {
    sinal: "SINAL",
    "aguardando-pagamento": "AGUARDANDO PAGAMENTO",
  };

  const statusesSeverityMap = {
    sinal: "info",
    "aguardando-pagamento": "warning",
  };

  const normalizeStatuses = (status) => {
    if (!status) return "";
    return statuses[status.toLowerCase()];
  };

  const getSeverity = (status) => {
    const normalized = normalizeStatuses(status)?.toLowerCase() || "";
    return statusesSeverityMap[normalized] || "secondary";
  };

  const serviceBodyTemplate = (rowData) => {
    const appts = Array.isArray(appointments) ? appointments : [];
    const treats = Array.isArray(treatments) ? treatments : [];
    const allServices = [...appts, ...treats];
    const found = allServices.find((s) => s.value === rowData.service);
    return found?.display_name || "Serviço não encontrado";
  };

  const dateBodyTemplate = (rowData) => {
    if (!rowData.created_at) return "Data não disponível";

    const [datePart, timePart] = rowData.created_at.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");

    return `${day}/${month}/${year} às ${hour}:${minute}`;
  };

  const valueBodyTemplate = (rowData) => {
    let finalValue = rowData.service_value - rowData.discount;

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(finalValue);
  };

  const paymentStatusBodyTemplate = (rowData) => {
    const hasSignPayment = rowData.payments.some((p) => p.is_sign);
    const totalPayments = rowData.payment_amount || 0;
    const finalValue = (rowData.service_value || 0) - (rowData.discount || 0);
    const isFullyPaid = totalPayments >= finalValue;

    if (isFullyPaid) {
      const normalizedStatus = "PAGO TOTAL";
      const severity = "success";
      return <Tag value={normalizedStatus} severity={severity} />;
    } else if (hasSignPayment) {
      return <Tag value="SINAL PAGO" severity="info" />;
    } else if (!rowData || !rowData.payment_status)
      return <Tag value="PENDENTE" severity="warning" />;
    else {
      const normalizedStatus = normalizeStatuses(rowData.payment_status);
      const severity = getSeverity(rowData.payment_status);
      return <Tag value={normalizedStatus} severity={severity} />;
    }
  };

  const registerPaymentBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          tooltip="Registrar pagamento"
          tooltipOptions={{
            position: "top",
            mouseTrack: true,
            mouseTrackTop: 15,
          }}
          icon="pi pi-wallet"
          text
          onClick={() => openPaymentModal(rowData)}
        />
      </React.Fragment>
    );
  };

  const editSaleBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          tooltip="Editar"
          tooltipOptions={{
            position: "top",
            mouseTrack: true,
            mouseTrackTop: 15,
          }}
          icon="pi pi-pencil"
          text
          onClick={() => onOpenSaleModal(rowData)}
        />
      </React.Fragment>
    );
  };

  const saleDetailsBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          tooltip="Ver"
          tooltipOptions={{
            position: "top",
            mouseTrack: true,
            mouseTrackTop: 15,
          }}
          icon="pi pi-external-link"
          text
          onClick={() => openSaleDetailsModal(rowData)}
        />
      </React.Fragment>
    );
  };

  const deleteSaleBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          tooltip="Excluir"
          tooltipOptions={{
            position: "top",
            mouseTrack: true,
            mouseTrackTop: 15,
            color: "red",
          }}
          icon="pi pi-trash"
          severity="danger"
          text
          onClick={() => confirmSaleDeletion(rowData)}
        />
      </React.Fragment>
    );
  };

  const confirmSaleDeletion = (sale) => {
    setSale(sale);
    setDeleteSaleModal(true);
  };

  const onRowEditComplete = (e) => {
    let _sales = [...sales];
    let { newData, index } = e;

    _sales[index] = {
      ..._sales[index],
      ...newData,
    };

    setSales(_sales);
  };

  return (
    <>
      <div className="tabelaAtendimento">
        <DataTable
          // value={Array.isArray(sales) ? sales : []}
          value={
            Array.isArray(sales)
              ? [...sales].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              )
              : []
          }
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          dataKey="sale_id"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Exibindo de {first} a {last} de {totalRecords} vendas"
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            field="service"
            header="Serviço"
            body={serviceBodyTemplate}
            style={{ width: "40%" }}
          />
          <Column
            field="created_at"
            header="Data da venda"
            body={dateBodyTemplate}
            style={{ width: "40%" }}
          />
          <Column
            field="total_value"
            header="Valor Total"
            body={valueBodyTemplate}
            style={{ width: "22%" }}
          />
          <Column
            field="payment_status"
            header="Status"
            body={paymentStatusBodyTemplate}
            style={{ width: "18%" }}
          />
          <Column
            body={(rowData) => registerPaymentBodyTemplate(rowData)}
            exportable={false}
            style={{ width: "5%" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column
            body={(rowData) => editSaleBodyTemplate(rowData)}
            exportable={false}
            style={{ width: "5%" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column
            body={(rowData) => saleDetailsBodyTemplate(rowData)}
            exportable={false}
            style={{ width: "5%" }}
            bodyStyle={{ textAlign: "center" }}
          />
          {isAdmin && (
            <Column
              body={deleteSaleBodyTemplate}
              exportable={false}
              style={{ width: "5%" }}
            />
          )}
        </DataTable>
      </div>
    </>
  )
}