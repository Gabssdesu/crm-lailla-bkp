import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import SalesTable from "./tables/SalesTable";
import SalesModal from "./modals/SalesModal";
import SaleDetailsModal from "./modals/SaleDetailsModal";
import PaymentsModal from "./modals/PaymentsModal";
import DeleteSaleModal from "./modals/DeleteSaleModal";
import createId from "@/functions/createId";
import NoContactCard from "@/components/common/NoContactCard";

import PropTypes from "prop-types";

Service.propTypes = {
  sales: PropTypes.array.isRequired,
  setSales: PropTypes.func.isRequired,
  saveSales: PropTypes.func.isRequired,
  deleteSalesDB: PropTypes.func.isRequired,
  deletePaymentsDB: PropTypes.func.isRequired,
  stageID: PropTypes.string,
  dadosCW: PropTypes.object,
  isAdmin: PropTypes.bool,
  treatments: PropTypes.array,
  appointments: PropTypes.array,
};

function Service({
  sales,
  setSales,
  saveSales,
  deleteSalesDB,
  deletePaymentsDB,
  stageID,
  dadosCW,
  isAdmin,
  treatments,
  appointments,
}) {

  useEffect(() => {
    if (!stageID) return;
    fetch(`/api/client/sales-made?stage_id=${stageID}`)
      .then((response) => response.json())
      .then((data) => {
        setSales(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do webhook vendas:", err);
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao consultar vendas: " + err.message,
          life: 3000,
        });
      });
  }, [stageID]);
useEffect(()=>{console.log(sales)}, [sales])
  const [newPayment, setNewPayment] = useState({
    id: null,
    payment_id: "",
    amount: null,
    method: null,
    is_sign: false,
  });

  const services = {
    consulta: "Consulta",
    acompanhamento: "Acompanhamento",
  };

  const paymentMethods = [
    "Pix",
    "Crédito",
    "Débito",
    "Boleto",
  ];

  const toast = useRef(null);

  const [checked, setChecked] = useState(false);

  const emptySale = {
    id: null,
    sale_id: "",
    created_at: null,
    updated_at: null,
    service_type: "",
    service: "",
    service_value: 0,
    final_value: 0,
    service_date: null,
    beginning_date: null,
    final_date: null,
    is_completed: false,
    is_canceled: false,
    payment_amount: "",
    payment_status: "",
    discount: 0,
    agent_id: "",
    stage_id: "",
    stage_number: "",
    notes: "",
    payments: [
      {
        id: "",
        payment_id: "",
        amount: "",
        created_at: "",
        is_sign: false,
        method: "",
      },
    ],
  };

  const [sale, setSale] = useState(emptySale);
  const [saleModal, setSaleModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const openSaleModal = (saleToEdit = null) => {
    if (saleToEdit) {
      setSale(saleToEdit);
      setIsEditing(true);
    } else {
      setSale(emptySale);
      setIsEditing(false);
    }
    setSaleModal(true);
  };

  const [deleteSaleModal, setDeleteSaleModal] = useState(false);

  const [saleDetailsModal, setSaleDetailsModal] = useState(false);

  const openSaleDetailsModal = (rowData) => {
    setSale(rowData);
    setSaleDetailsModal(true);
  };

  const [paymentModal, setPaymentModal] = useState(false);

  const openPaymentModal = (rowData) => {
    setSale(rowData); // Define a venda atual para o modal
    setPaymentModal(true); // Abre o modal de pagamentos
  };

  return (
    <div>
      <Toast ref={toast} />
      <div id="Form">
        {stageID === undefined || stageID === null ? (
          <NoContactCard viewName="as vendas" />
        ) : null}
        {stageID && (
          <>
            <SalesTable
              sales={sales}
              setSales={setSales}
              isAdmin={isAdmin}
              treatments={treatments}
              appointments={appointments}
              onOpenSaleModal={openSaleModal}
              openPaymentModal={openPaymentModal}
              openSaleDetailsModal={openSaleDetailsModal}
              setSale={setSale}
              setDeleteSaleModal={setDeleteSaleModal}
            />
            <SalesModal
              sale={sale}
              setSale={setSale}
              sales={sales}
              setSales={setSales}
              saleModal={saleModal}
              setSaleModal={setSaleModal}
              isEditing={isEditing}
              emptySale={emptySale}
              services={services}
              appointments={appointments}
              treatments={treatments}
              saveSales={saveSales}
              createId={createId}
            />
          </>
        )}

        <SaleDetailsModal
          visible={saleDetailsModal}
          sale={sale}
          setSaleDetailsModal={setSaleDetailsModal}
          setSale={setSale}
          appointments={appointments}
          treatments={treatments}
        />

        <PaymentsModal
          paymentModal={paymentModal}
          sale={sale}
          setSale={setSale}
          newPayment={newPayment}
          setNewPayment={setNewPayment}
          paymentMethods={paymentMethods}
          setPaymentModal={setPaymentModal}
          checked={checked}
          setChecked={setChecked}
          isAdmin={isAdmin}
          sales={sales}
          setSales={setSales}
          deletePaymentsDB={deletePaymentsDB}
          createId={createId}
          dadosCW={dadosCW}
          stageID={stageID}
        />

        <DeleteSaleModal
          visible={deleteSaleModal}
          sale={sale}
          appointments={appointments}
          treatments={treatments}
          setDeleteSaleModal={setDeleteSaleModal}
          sales={sales}
          setSales={setSales}
          setSale={setSale}
          deleteSalesDB={deleteSalesDB}
        />
      </div>
    </div>
  );
}

export default Service;