import Rejections from "@/components/data/services/rejections/Rejections";

export default function RejectionsPage({
  dataCW,
  rejection,
  setRejection, 
  saveRejections,
  isAdmin,
  stageID,
  rejections,
  setRejections,
  deleteRejections
}) {
  return (
    <Rejections
      dataCW={dataCW}
      rejection={rejection}
      setRejection={setRejection}
      saveRejections={saveRejections}
      rejections={rejections}
      setRejections={setRejections}
      isAdmin={isAdmin}
      stageID={stageID}
      deleteRejections={deleteRejections}
    />
  );
}
