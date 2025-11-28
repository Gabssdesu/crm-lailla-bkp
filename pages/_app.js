import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { locale, addLocale } from "primereact/api";
import { PrimeReactProvider } from "primereact/api";
import Header from "@/components/Header";
import "@/style/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
let isListenerAdded = false;

locale("pt");
addLocale("pt", {
  firstDayOfWeek: 1,
  dayNames: [
    "domingo",
    "segunda",
    "terça",
    "quarta",
    "quinta",
    "sexta",
    "sábado",
  ],
  dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
  monthNames: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
  monthNamesShort: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ],
  today: "Hoje",
  clear: "Limpar",
  emptyFilterMessage: "Nada foi encontrado...",
  emptyMessage: "Nada foi encontrado...",
});

export default function MyApp({ Component, pageProps }) {
  const toast = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  const [events, setEvents] = useState([]);

  const [sales, setSales] = useState([]);
  const [rejections, setRejections] = useState([]);

  const [acquisitions, setAcquisitions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [ads, setAds] = useState([]);
  const [referrals, setReferrals] = useState([]);

  const [insurance, setInsurance] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [updtDataCW, setUpdtDataCW] = useState(1);

  const [stageID, setStageID] = useState(null);
  const [stageControl, setStageControl] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [agentDepartment, setAgentDepartment] = useState("");

  const value = {
    ripple: true,
  };

  const [dataCW, setDataCW] = useState(null);
  // const [dataCW, setDataCW] = useState({
  //   data: {
  //     contact: {
  //       id: "199996",
  //       name: "pedro",
  //       phone_number: "+123456",
  //     },
  //     conversation: {
  //       id: "312",
  //       inbox_id: "4",
  //       account_id: "1",
  //     },
  //     currentAgent: {
  //       id: "1",
  //       name: "Fabiano",
  //     },
  //   },
  // });

  const [dadosCW, setDadosCW] = useState({
    contact: {
      id: "",
      name: "",
      phone_number: "",
      custom_attributes: {
        acquisition: "",
        tipo: "",
        engagement: "",
        funil_vendas: "",
        indicacao: "",
      },
    },
    conversation: {
      id: "",
      inbox_id: "",
      status: "",
      custom_attributes: {
        campaign: "",
        classificacao_da_conversa: "",
        convenio: "",
        funil_vendas: "",
        follow_up: "",
      },
    },
    currentAgent: {
      id: "",
      name: "",
    },
  });

  useEffect(() => {
    if (dadosCW) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [dadosCW]);

  const [client, setClient] = useState({
    name: "",
    cpf: "",
    phone: "",
    email: "",
    gender: "",
    profession: "",
    insurance: "",
    family_income: "",
    found_us: "",
    observation: "",
    lgpd_blocked: false,
    phone_02: "",
    additional01: "",
  });

  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    neighborhood: "",
    street: "",
    number: "",
    complement: "",
    postal_code: "",
    reference: "",
    maps: "",
    latitude: 0,
    longitude: 0,
    name: "",
    region: "",
  });

  const [marketing, setMarketing] = useState({
    acquisition: "",
    ad: "",
    campaign: "",
    comercial_funnel: "",
    contact_type: "",
    conversation_class: "",
    engagement: "",
    first_instance: "",
    follow_up: "",
    relationship_funnel: "",
  });

  const [service, setService] = useState({
    sale_id: "",
    created_at: null,
    updated_at: null,
    service: "",
    service_type: "",
    service_value: 0,
    final_value: 0,
    service_date: null,
    beginning_date: null,
    final_date: null,
    is_completed: false,
    is_canceled: false,
    payment_amount: 0,
    payment_status: "",
    discount: 0,
    agent_id: "",
    stage_id: "",
    stage_number: "",
    notes: "",
    payments: [
      {
        id: "",
        payment_id: "",
        amount: "",
        created_at: "",
        is_sign: false,
        method: "",
      },
    ],
  });

  const [rejection, setRejection] = useState({
    rejection_id: "",
    service: "",
    agent_id: "",
    stage_id: "",
    stage_number: "",
    reason: "",
    detail: "",
    date: null,
  });

  const [stageSender, setStageSender] = useState({
    id: "",
    department: "",
    stage: "",
    last_interaction: "",
    subject: "",
    message: "",
    image: "",
    audio: "",
    send_date: "",
    acquisition: "UniAtende",
    campaign: "",
    ad: "",
    follow_up: "",
  });

  useEffect(() => {
    if (!dataCW) return;
    const fetchClientData = async () => {
      try {
        const response = await fetch(
          `/api/client/client-data?contact_id=${dataCW.data.contact.id}&conversation_id=${dataCW.data.conversation.id}&agent_id=${dataCW.data.currentAgent.id}&account_id=${dataCW.data.conversation.account_id}`
        );
        const data = await response.json();
        setClient(data.client_data);
        setAddress(data.address_data);
        setDadosCW(data.dadosCW);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao consultar dados do cliente: " + error.message,
          life: 2000,
        });
      }
    };

    const fetchStage = async () => {
      try {
        const response = await fetch(
          `/api/client/stages-control?contact_id=${dataCW.data.contact.id}`
        );
        const data = await response.json();
        setStageID(data?.id || null);
        setStageControl(data || null);
        // setEvents(data?.stages || []);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao consultar etapa: " + error.message,
          life: 2000,
        });
      }
    };

    const fetchIsAdmin = async () => {
      try {
        const response = await fetch(
         `/api/agent/is-admin?user_id=${dataCW.data.currentAgent.id}&account_id=${dataCW.data.conversation.account_id}`
        );
        if (!response.ok)
          throw new Error("Erro na verificação do administrador");

        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao verificar administrador: " + error.message,
          life: 3000,
        });
      }
    };


    const fetchSystemData = async () => {
      try {
        const response = await fetch("/api/system/system-data");
        if (!response.ok) throw new Error("Erro ao buscar os dados do sistema");

        const data = await response.json();

        setAds(data.ads);
        setCampaigns(data.campaigns);
        setInsurance(data.insurances);
        setReferrals(data.referrals);
        setAcquisitions(data.acquisitions);
        setAppointments(data.appointments);
        setTreatments(data.treatments);
        setReasons(data.reasons);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao carregar dados do sistema: " + error.message,
          life: 3000,
        });
      }
    };

    const fetchAllData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      await Promise.all([
        fetchClientData(),
        fetchStage(),
        fetchIsAdmin(),
        fetchSystemData(),
      ]);
    };

    fetchAllData();
  }, [dataCW, updtDataCW]);

  const handleMessage = (event) => {
    try {
      // Validação do evento
      if (!event?.data) {
        console.warn("Dados do evento inválidos");
        return;
      }

      const data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;

      // Validação dos dados
      if (data && typeof data === "object") {
        setDataCW(data);
      } else {
        console.warn("Formato de dados inválido:", data);
      }
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
      setDataCW(null);
    }
  };

  // Verificação do ambiente cliente
  if (typeof window !== "undefined" && !isListenerAdded) {
    window.addEventListener("message", handleMessage);
    isListenerAdded = true;
  }

  const saveSales = (sales) => {
    fetch(process.env.NEXT_PUBLIC_WEBHOOK_SALES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stageID,
        contact_id: dadosCW.contact.id,
        account_id: dadosCW.conversation.account_id,
        quant_vendas: sales.length,
        quant_etapas: stageControl?.stages?.length || 0,
        agent_id: dadosCW.currentAgent.id,
        sales: sales,
        contact: dadosCW.contact,
        conversation: dadosCW.conversation,
        agent: dadosCW.currentAgent,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSales(data);
      })
      .catch((error) => {
        console.error("Erro ao salvar vendas:", error);
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao salvar venda: " + error.message,
          life: 2000,
        });
      });
  };

  const deleteSalesDB = (id) => {
    fetch(
      process.env.NEXT_PUBLIC_WEBHOOK_SALES, // usando o env NEXT_PUBLIC_WEBHOOK_SALES
      {
        method: "DELETE", // método da requisição
        headers: {
          "Content-Type": "application/json", // indicando que estamos enviando JSON
        },
        body: JSON.stringify({
          sale_id: Number(id),
          account_id: dadosCW.conversation.account_id,
        }), // convertendo os dados para o formato JSON
      }
    )
      .then((response) => response.json()) // processando a resposta em JSON
      .then((data) => {
        toast.current.show({
          severity: "success", // tipo de notificação (sucesso)
          summary: "Sucesso", // título da notificação
          detail: "Venda excluída com sucesso!", // message de sucesso
          life: 1000, // tempo de duração da notificação (em milissegundos)
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error", // tipo de notificação (erro)
          summary: "Erro", // título da notificação
          detail: "Erro ao excluir: " + error.message, // detalhe com a message de erro
          life: 2000, // tempo de duração da notificação (em milissegundos)
        });
      });
  };

  const saveRejections = (rejections) => {
    fetch(process.env.NEXT_PUBLIC_WEBHOOK_LOSTSALES, {
      method: "POST", // método da requisição
      headers: {
        "Content-Type": "application/json", // indicando que estamos enviando JSON
      },
      body: JSON.stringify({
        stageID,
        contact_id: dadosCW.contact.id,
        quant_vendas_perdidas: rejections.length,
        quant_etapas: stageControl.stages.length,
        agent_id: dadosCW.currentAgent.id,
        rejections,
        contact: dadosCW.contact,
        conversation: dadosCW.conversation,
        agent: dadosCW.currentAgent,
      }), // convertendo os dados para o formato JSON
    })
      .then((response) => response.json()) // processando a resposta em JSON
      .then((data) => {
        setRejections(data);
      })
      .catch((error) => {
        toast.current.show({
          severity: "error", // tipo de notificação (erro)
          summary: "Erro", // título da notificação
          detail: "Erro ao salvar venda: " + error.message, // detalhe com a message de erro
          life: 2000, // tempo de duração da notificação (em milissegundos)
        });
      });
  };

  const deleteRejections = (id) => {
    fetch(
      process.env.NEXT_PUBLIC_WEBHOOK_LOSTSALES, // usando o env NEXT_PUBLIC_WEBHOOK_SALES
      {
        method: "DELETE", // método da requisição
        headers: {
          "Content-Type": "application/json", // indicando que estamos enviando JSON
        },
        body: JSON.stringify({
          rejection_id: Number(id),
          account_id: dadosCW.conversation.account_id,
        }), // convertendo os dados para o formato JSON
      }
    )
      .then((response) => response.json()) // processando a resposta em JSON
      .then((data) => {
        toast.current.show({
          severity: "success", // tipo de notificação (sucesso)
          summary: "Sucesso", // título da notificação
          detail: "Exclusão com sucesso!", // message de sucesso
          life: 1000, // tempo de duração da notificação (em milissegundos)
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error", // tipo de notificação (erro)
          summary: "Erro", // título da notificação
          detail: "Erro ao excluir: " + error.message, // detalhe com a message de erro
          life: 2000, // tempo de duração da notificação (em milissegundos)
        });
      });
  };

  const deletePaymentsDB = (paymentId) => {
    fetch(
      process.env.NEXT_PUBLIC_WEBHOOK_PAYMENTS, // usando o env NEXT_PUBLIC_WEBHOOK_SALES
      {
        method: "DELETE", // método da requisição
        headers: {
          "Content-Type": "application/json", // indicando que estamos enviando JSON
        },
        body: JSON.stringify({
          payment_id: paymentId,
          account_id: dadosCW.conversation.account_id,
        }),
      }
    )
      .then((response) => response.json()) // processando a resposta em JSON
      .then((data) => {
        toast.current.show({
          severity: "success", // tipo de notificação (sucesso)
          summary: "Sucesso", // título da notificação
          detail: "Pagamento excluído com sucesso!", // message de sucesso
          life: 1000, // tempo de duração da notificação (em milissegundos)
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error", // tipo de notificação (erro)
          summary: "Erro", // título da notificação
          detail: "Erro ao excluir: " + error.message, // detalhe com a message de erro
          life: 2000, // tempo de duração da notificação (em milissegundos)
        });
      });
  };

  const enviarConfiguracao = async ({ id, display_name, value, table_name, method, type_value }) => {
    const response = await fetch(process.env.NEXT_PUBLIC_WEBHOOK_CONFIGURATION, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name,
        value,
        type_value: type_value,
        account_id: dataCW.data.conversation.account_id,
        table_name,
        id
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erro ao enviar configuração");
    }
    return response.json();
  };



  const initContact = (
    contactType,
    selectedAcquisition,
    selectedCampaign,
    selectedAd,
    selectedReferral
  ) => {
    const bodyContent = {
      conversation_data: {
        ...dadosCW.conversation,
        custom_attributes: {
          ...dadosCW.conversation.custom_attributes,
          acquisition: selectedAcquisition,
          campaign: selectedCampaign,
          ad: selectedAd,
          referral: selectedReferral,
          contato_inicial: contactType, // "lead" ou "consultor"
        },
      },
      contact_data: {
        ...dadosCW.contact,
        custom_attributes: {
          ...dadosCW.contact.custom_attributes,
        },
      },
      agent_data: dadosCW.currentAgent,
    };
    setDadosCW((prev) => ({
      ...prev,
      conversation: {
        ...prev.conversation,
        custom_attributes: {
          ...prev.conversation.custom_attributes,
          contato_inicial: contactType,
          acquisition: selectedAcquisition,
          campaign: selectedCampaign,
          ad: selectedAd,
          referral: selectedReferral,
        },
      },
      contact: {
        ...prev.contact,
        custom_attributes: {
          ...prev.contact.custom_attributes,
        },
      },
    }));

    fetch(process.env.NEXT_PUBLIC_WEBHOOK_CONTACTSTART, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyContent),
    })
      .then((response) => response.json())
      .then((data) => {
        setStageID(data.id);
        toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Contato iniciado com sucesso!",
          life: 1000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao consultar etapa: " + error.message,
          life: 2000,
        });
      });

    setTimeout(() => {
      setUpdtDataCW((prev) => prev + 1);
    }, 3000);
  };

  const saveData = () => {
    fetch(process.env.NEXT_PUBLIC_WEBHOOK_SAVECLIENTDATA, {
      method: "POST", // método da requisição
      headers: {
        "Content-Type": "application/json", // indicando que estamos enviando JSON
      },
      body: JSON.stringify({
        phone_number: dadosCW.contact.phone_number,
        client,
        address,
        account_id: dadosCW.conversation.account_id,
        contact_id: dadosCW.contact.id,
      }),
    })
      .then((data) => {
        toast.current.show({
          severity: "success", // tipo de notificação (sucesso)
          summary: "Sucesso", // título da notificação
          detail: "Dados salvos com sucesso!", // message de sucesso
          life: 1000, // tempo de duração da notificação (em milissegundos)
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error", // tipo de notificação (erro)
          summary: "Erro", // título da notificação
          detail: "Erro ao salvar dados: " + error.message, // detalhe com a message de erro
          life: 2000, // tempo de duração da notificação (em milissegundos)
        });
      });

    // if (insurance.includes(client.convenio)) return;
    // else {
    //   setInsurance([...insurance, client.convenio]);
    //   fetch(
    //     `https://enginewebhook.w40.unigate.com.br/webhook/cdtjf/crm/salvar-convenio?agent_id=${dadosCW.currentAgent.id}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         convenio: client.convenio,
    //       }),
    //     }
    //   )
    //     .then((response) => response.json())
    //     .catch((error) => {
    //       toast.current.show({
    //         severity: "error",
    //         summary: "Erro",
    //         detail: "Erro ao incluir convênio: " + error.message,
    //         life: 2000,
    //       });
    //     });
    // }
  };

  return (
    <>
      <Toast ref={toast} />

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "1.2rem",
            color: "#666",
            textAlign: "center",
            flexDirection: "column",
          }}
        >
          <i
            className="pi pi-spin pi-spinner-dotted"
            style={{ fontSize: "2rem" }}
          />
          Carregando
        </div>
      ) : !dadosCW ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "1.2rem",
            color: "#666",
            textAlign: "center",
          }}
        >
          Ocorreu um erro ao carregar a página.
          <br />
          Por favor, entre em contato com o suporte técnico.
        </div>
      ) : (
        <PrimeReactProvider value={value}>
          <Header isAdmin={isAdmin}>
            <Component
              {...pageProps}
              saveData={saveData}

              client={client}
              setClient={setClient}
              marketing={marketing}
              setMarketing={setMarketing}
              address={address}
              setAddress={setAddress}

              service={service}
              setService={setService}

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
              setTreatments={setTreatments}
              setAppointments={setAppointments}
              reasons={reasons}
              setReasons={setReasons}

              initContact={initContact}

              dataCW={dataCW}
              dadosCW={dadosCW}
              setDadosCW={setDadosCW}
              updtDataCW={updtDataCW}
              setUpdtDataCW={setUpdtDataCW}

              stageID={stageID}

              events={events}
              setEvents={setEvents}
              sales={sales}
              setSales={setSales}
              rejection={rejection}
              setRejection={setRejection}
              saveSales={saveSales}
              deleteSalesDB={deleteSalesDB}
              rejections={rejections}
              setRejections={setRejections}
              saveRejections={saveRejections}
              deleteRejections={deleteRejections}
              deletePaymentsDB={deletePaymentsDB}
              enviarConfiguracao={enviarConfiguracao}
              stageSender={stageSender}
              setStageSender={setStageSender}
              // sendMessage={sendMessage}
              isAdmin={isAdmin}
              agentDepartment={agentDepartment}
              setAgentDepartment={setAgentDepartment}
              insurance={insurance}
              stageControl={stageControl}
            />
          </Header>
        </PrimeReactProvider>
      )}
    </>
  );
}
