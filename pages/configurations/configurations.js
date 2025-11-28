import Configurations from "@/components/data/configurations/Configurations";

export default function ConfigurationsPage({
  dataCW,
  reasons,
  setReasons,
  appointments,
  setAppointments,
  treatments,
  setTreatments,
  enviarConfiguracao
}) {
  return <Configurations
  dataCW={dataCW }
  reasons={reasons}
  setReasons={setReasons}
  appointments={appointments}
  setAppointments={setAppointments}
  treatments={treatments}
  setTreatments={setTreatments}
  enviarConfiguracao={enviarConfiguracao}
  />;
}
