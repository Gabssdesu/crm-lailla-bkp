import Sales from "@/components/data/services/sales/Sales";

export default function SalesPage({
  service,
  setService,
  marketing,
  setMarketing,
  sales,
  setSales,
  saveSales,
  deleteSalesDB,
  deletePaymentsDB,
  stageID,
  dadosCW,
  isAdmin,
  appointments,
  treatments
}) {
  return (
    <Sales
      service={service}
      setService={setService}
      marketing={marketing}
      setMarketing={setMarketing}
      sales={sales}
      setSales={setSales}
      saveSales={saveSales}
      deleteSalesDB={deleteSalesDB}
      deletePaymentsDB={deletePaymentsDB}
      stageID={stageID}
      dadosCW={dadosCW}
      isAdmin={isAdmin}
      treatments={treatments}
      appointments={appointments}
    />
  );
}
