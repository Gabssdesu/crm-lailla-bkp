import Address from "@/components/data/contact/Address";

export default function AddressPage({ address, setAddress, client, saveData }) {
  return <Address address={address} setAddress={setAddress} client={client} saveData={saveData} />;
}
