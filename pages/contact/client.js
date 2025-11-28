import Client from "@/components/data/contact/Client";

export default function ClientPage({ client, setClient, address, dadosCW, saveData }) {
  return <Client client={client} setClient={setClient} address={address} dadosCW={dadosCW} saveData={saveData} />;
}