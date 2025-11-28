import { crmPool } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    // Consultar anúncios
    const adsResult = await crmPool.query(
      "SELECT name FROM public.options_ad ORDER BY id"
    );
    const ads = adsResult.rows.map((item) => item.name);

    // Consultar campanhas
    const campaignsResult = await crmPool.query(
      "SELECT name FROM public.options_campaign ORDER BY id"
    );
    const campaigns = campaignsResult.rows.map((item) => item.name);

    const referralsResult = await crmPool.query(
      "SELECT name FROM public.options_indication ORDER BY id"
    );
    const referrals = referralsResult.rows.map((item) => item.name);

    // Consultar seguros
    const insuranceResult = await crmPool.query(
      "SELECT name FROM public.options_insurance ORDER BY id"
    );
    const insurances = insuranceResult.rows.map((item) => item.name);

    // Consultar aquisições
    const acquisitionResult = await crmPool.query(
      "SELECT name FROM public.options_acquisition ORDER BY id"
    );
    const acquisitions = acquisitionResult.rows.map((item) => item.name);


    // Consultar serviços
    const serviceResult = await crmPool.query(
      "SELECT id, display_name, value, status, type_value FROM public.options_service ORDER BY id"
    );
    const services = serviceResult.rows;

    // Consultar motivos
    const reasonResult = await crmPool.query(
      "SELECT id, display_name, value, status FROM public.options_rejection ORDER BY id"
    );
    const reasons = reasonResult.rows;


    // Separar os serviços em appointments e treatments
    const appointments = services
      .filter((service) => service.type_value === "consulta")
      .map((service) => ({
        id: service.id,
        display_name: service.display_name,
        value: service.value,
        status: service.status
      }));

    const treatments = services
      .filter((service) => service.type_value !== "consulta")
      .map((service) => ({
        id: service.id,
        display_name: service.display_name,
        value: service.value,
        status: service.status
      }));





    // Retornar todos os dados consolidados
    return res.status(200).json({
      ads,
      campaigns,
      referrals,
      insurances,
      acquisitions,
      appointments,
      treatments,
      reasons
    });
  } catch (error) {
    console.error("Erro ao buscar dados de controle:", error);
    return res.status(500).json({
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
}
