import Marketing from '@/components/data/contact/Marketing';

export default function MarketingPage({
  marketing,
  setMarketing,
  dadosCW,
  stageControl,
}) {
  return <Marketing
    marketing={marketing}
    setMarketing={setMarketing}
    dadosCW={dadosCW}
    stageControl={stageControl}
  />;
}
