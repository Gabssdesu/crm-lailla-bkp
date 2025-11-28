import React, { useRef, useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import Link from "next/link";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import LostSaleModal from "./modals/AddRejectionModal";
import LostSaleDetailsModal from "./modals/RejectionDetailsModal";
import LostSalesTable from "./tables/RejectionsTable";
import DeleteLostSaleModal from "./modals/DeleteRejectionModal";
import createId from "@/functions/createId";
import NoContactCard from "@/components/common/NoContactCard";

import { addLocale, locale } from "primereact/api";

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

function Rejections({
  dataCW,
  saveRejections,
  deleteRejections,
  isAdmin,
  stageID,
  rejections,
  setRejections,
}) {

  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);

  let emptyLostSale = {
    rejection_id: "",
    service: "",
    agent_id: "",
    stage_id: "",
    stage_number: "",
    reason: "",
    detail: "",
    date: null,
  };

  const services = {
    consulta: "Consulta",
    acompanhamento: "Acompanhamento",
    "acompanhamento-personalizado": "Acompanhamento personalizado",
    injetavel: "Injetável",
  };

  const reasons = [
    { name: "Valor", id: "valor" },
    { name: "Localização", id: "localizacao" },
    { name: "Serviço Indisponível", id: "servico-indisponivel" },
    { name: "Alinhamento Cônjuge", id: "alinhamento-conjuge" },
    { name: "Interesse em Medicação", id: "interesse-medicacao" },
    { name: "Outros", id: "outros" },
  ];

  const [rejection, setRejection] = useState(emptyLostSale);
  const [lostSaleModal, setLostSaleModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteLostSaleModal, setDeleteLostSaleModal] = useState(false);
  const [lostSaleDetailsModal, setLostSaleDetailsModal] = useState(false);

  useEffect(() => {
    if (!dataCW || !stageID) return;

    const fetchVendasPerdidas = async () => {
      try {
        const response = await fetch(
          `/api/client/lost-sales?stage_id=${stageID}`
        );
        const data = await response.json();
        setRejections(data);
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao consultar objeções: " + err.message,
          life: 3000,
        });
      }
    };

    fetchVendasPerdidas();
  }, [dataCW, stageID]);

  return (
    <>
      <Toast ref={toast} />

      <div id="Form" style={{ display: "flex", justifyContent: "center" }}>
        {stageID === undefined || stageID === null ? (
         <NoContactCard viewName="as objeções" />
        ) : (
          <div
            className="tabelaAtendimento"
          >
            <LostSalesTable
              rejections={rejections}
              setRejections={setRejections}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              reasons={reasons}
              isAdmin={isAdmin}
              setRejection={setRejection}
              setDeleteLostSaleModal={setDeleteLostSaleModal}
              setIsEditing={setIsEditing}
              setLostSaleModal={setLostSaleModal}
              emptyLostSale={emptyLostSale}
              setLostSaleDetailsModal={setLostSaleDetailsModal}
            />
          </div>
        )}

        <LostSaleModal
          visible={lostSaleModal}
          rejection={rejection}
          setRejection={setRejection}
          isEditing={isEditing}
          reasons={reasons}
          setLostSaleModal={setLostSaleModal}
          services={services}
          createId={createId}
          rejections={rejections}
          setRejections={setRejections}
          saveRejections={saveRejections}
          emptyLostSale={emptyLostSale}
        />

        <LostSaleDetailsModal
          visible={lostSaleDetailsModal}
          rejection={rejection}
          reasons={reasons}
          services={services}
          setLostSaleDetailsModal={setLostSaleDetailsModal}
          setRejection={setRejection}
        />

        <DeleteLostSaleModal
          visible={deleteLostSaleModal}
          rejection={rejection}
          reasons={reasons}
          setDeleteLostSaleModal={setDeleteLostSaleModal}
          setRejection={setRejection}
          setRejections={setRejections}
          rejections={rejections}
          deleteRejections={deleteRejections}
        />

      </div >
    </>
  );
}

export default Rejections;
