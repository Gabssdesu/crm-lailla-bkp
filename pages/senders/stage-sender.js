import StageSender from '@/components/data/senders/StageSender';

export default function StageSenderPage({ stageSender, setStageSender, sendMessage }) {
  return <StageSender stageSender={stageSender} setStageSender={setStageSender} sendMessage={sendMessage} />;
}
