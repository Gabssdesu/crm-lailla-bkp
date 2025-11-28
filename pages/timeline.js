import TimeLine from '@/components/data/timeline/TimeLine';

export default function TimeLinePage({ client, dadosCW, stageID, events, setEvents, dataCW, sales, rejections, stageControl }) {
  return <TimeLine
    client={client}
    dadosCW={dadosCW}
    dataCW={dataCW}
    stageID={stageID}
    events={events}
    setEvents={setEvents}
    sales={sales}
    rejections={rejections}
    stageControl={stageControl}
  />;
}