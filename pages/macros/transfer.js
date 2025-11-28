import Transfer from '@/components/data/macros/Transfer';

export default function TransferPage({ transfer, setTransfer, instances, dadosCW, events, setEvents, stageID }) {
  return <Transfer
    transfer={transfer}
    setTransfer={setTransfer}
    instances={instances}
    dadosCW={dadosCW}
    events={events}
    setEvents={setEvents}
    stageID={stageID}
  />;
}