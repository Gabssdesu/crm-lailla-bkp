import Macros from "@/components/data/macros/Macros";

export default function MacrosPage({
  client,
  dadosCW,
  dataCW,
  setUpdtDataCW,
  stageID,
  sales,
  setSales,
  marketing,
  setMarketing,
  acquisitions,
  setAcquisitions,
  campaigns,
  setCampaigns,
  ads,
  setAds,
  referrals,
  setReferrals,
  treatments,
  appointments,
  initContact,
  agentDepartment,
  isAdmin,
  stageControl,
}) {
  return (
    <Macros
      client={client}
      dadosCW={dadosCW}
      dataCW={dataCW}
      setUpdtDataCW={setUpdtDataCW}
      stageID={stageID}
      sales={sales}
      setSales={setSales}
      marketing={marketing}
      setMarketing={setMarketing}
      acquisitions={acquisitions}
      setAcquisitions={setAcquisitions}
      campaigns={campaigns}
      setCampaigns={setCampaigns}
      ads={ads}
      setAds={setAds}
      referrals={referrals}
      setReferrals={setReferrals}
      treatments={treatments}
      appointments={appointments}
      initContact={initContact}
      agentDepartment={agentDepartment}
      isAdmin={isAdmin}
      stageControl={stageControl}
    />
  );
}
