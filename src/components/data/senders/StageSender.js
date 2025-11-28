import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { Image } from "primereact/image";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function StageSender({ stageSender, setStageSender, sendMessage }) {

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStageSender({
      ...stageSender,
      [name]: value,
    });
  };

  let mensagemProgVazia = {
    id: null,
    departamentos: "",
    stage: "",
    subject: "",
    message: "",
    last_interaction: "",
    send_date: "",
    status: "AGENDADA",
  };

  const [mensagens, setMensagens] = useState([]);
  const [message, setMensagem] = useState(mensagemProgVazia);

  // const departamentos = {
  //   sales: "Vendas",
  //   adimplencia: "Adimplência",
  //   sac: "SAC",
  //   retencao: "Retenção",
  //   "pos-sales": "Pós-sales",
  // };

  const departamentos = [
    { label: "Vendas", value: "sales" },
    { label: "Adimplência", value: "adimplencia" },
    { label: "Retenção", value: "retencao" },
    { label: "Pós-Vendas", value: "pos-sales" },
  ];

  const etapas_pos_vendas = {
    "plano-ativo": "Plano Ativo",
    suporte: "Suporte",
  }

  const etapas_vendas = {
    "contato-inicial": "Contato Inicial",
    service: "Service",
    arrecadacao: "Arrecadação",
    "negociacao": "Negociação",
    transferido: "Transferido",
    documentacao: "Documentação",
    "venda-realizada": "Venda Realizada",
    "venda-perdida": "Venda Perdida",
  };

  const etapas_adimplencia = {
    "cobranca-efetuada": "Cobrança Efetuada",
    "cobranca-automatica": "Cobrança Automática",
    "debito-nao-comprovado": "Débito Não Comprovado",
    "pagamento-realizado": "Pagamento Realizado",
    "debito-informado": "Débito Informado",
    "aguardando-presencial": "Aguardando Presencial",
    "aguardando-pagamento": "Aguardando Pagamento",
  };

  const etapas_retencao = {
    "em-risco": "Em Risco",
    cancelado: "Cancelado",
    revertido: "Revertido",
    "aguardando-retorno": "Aguardando Retorno",
    oferta: "Oferta",
  };

  const etapas = {
    sales: etapas_vendas,
    adimplencia: etapas_adimplencia,
    "pos-sales": etapas_pos_vendas,
    retencao: etapas_retencao,
  };

  const getDepartamentoLabel = (department) => {
    return (
      departamentos.find((dep) => dep.value === department)?.label ||
      "Departamento desconhecido"
    );
  };

  const getEtapaDescricao = (department, stage) => {
    const etapasMap = {
      sales: etapas_vendas,
      adimplencia: etapas_adimplencia,
      retencao: etapas_retencao,
    };

    return etapasMap[department]?.[stage] || "Etapa desconhecida";
  };

  const etapasFiltradas = stageSender.department
    ? Object.entries(etapas[stageSender.department]).map(
      ([key, value]) => ({
        label: value,
        value: key,
      })
    )
    : [];

  const ultimasInteracoes = [
    { last_interaction: "Há 1 dia", id: "1" },
    { last_interaction: "Há 2 dias", id: "2" },
    { last_interaction: "Há 3 dias", id: "3" },
    { last_interaction: "Há 4 dias", id: "4" },
    { last_interaction: "Há 5 dias", id: "5" },
  ];

  const followUps = [
    { follow_up: "1", id: "1" },
    { follow_up: "2", id: "2" },
    { follow_up: "3", id: "3" },
    { follow_up: "4", id: "4" },
    { follow_up: "5", id: "5" },
    { follow_up: "6", id: "6" },
    { follow_up: "7", id: "7" },
    { follow_up: "8", id: "8" },
    { follow_up: "9", id: "9" },
    { follow_up: "10", id: "10" },
  ];

  const [tipoMensagem, setTipoMensagem] = useState([]);

  const onTipoMensagemChange = (e) => {
    let _tipoMensagem = [...tipoMensagem];

    if (e.checked) _tipoMensagem.push(e.value);
    else _tipoMensagem.splice(_tipoMensagem.indexOf(e.value), 1);

    setTipoMensagem(_tipoMensagem);
  };

  // const [statuses] = useState(["AGENDADA", "ENVIADA"]);
  const statusesMap = {
    agendada: "AGENDADA",
    enviada: "ENVIADA",
  };

  const normalizeStatus = (status) =>
    statusesMap[status.toLowerCase()] || status;

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [visible, setVisible] = useState(false);

  const toast = useRef(null);

  const [globalFilter, setGlobalFilter] = useState(null);

  const [mensagemModal, setMensagemModal] = useState(false);
  const [send, setSend] = useState(false);

  const modalAdicionarMensagem = () => {
    setMensagem(mensagemProgVazia);
    setSend(false);
    setMensagemModal(true);
  };

  const fecharMensagemModal = () => {
    setSend(false);
    setMensagemModal(false);
    setMensagem(mensagemProgVazia);
  };

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return "";

    const date = new Date(dataHora);
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

  // p/ definir min p/ date do calendário

  const today = new Date();
  today.setSeconds(0, 0);

  const getMinDate = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now;
  };

  const salvarMensagem = () => {
    setSend(true);

    if (
      !stageSender.department ||
      !stageSender.stage ||
      !stageSender.subject ||
      !stageSender.send_date ||
      !stageSender.acquisition ||
      !stageSender.campaign ||
      !stageSender.ad ||
      !stageSender.follow_up ||
      (!stageSender.message &&
        !stageSender.audio &&
        !stageSender.image)
    ) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Todos os campos são obrigatórios!",
        life: 3000,
      });
      return;
    }

    let _mensagens = [...mensagens];
    let _gestaoDisparos = { ...stageSender };

    if (_gestaoDisparos.send_date) {
      _gestaoDisparos.send_date = new Date(
        _gestaoDisparos.send_date
      ).toISOString();
    }

    _gestaoDisparos.status = "AGENDADA";

    if (_gestaoDisparos.id) {
      const index = findIndexById(_gestaoDisparos.id);
      if (index > -1) {
        _mensagens[index] = _gestaoDisparos;
      }
    } else {
      _gestaoDisparos.id = createId();
      _mensagens.unshift(_gestaoDisparos);
    }

    setMensagens(_mensagens);
    setMensagemModal(false);
    setStageSender(mensagemProgVazia);
    // sendPayloadMensagem();

    return true;
  };

  // const sendPayloadMensagem = async () => {
  //   try {
  //     await fetch('https://enginewebhook.w29.unigate.com.br/webhook/w40-disparador-crmporetapas', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(stageSender)
  //     });
  //     toast.current.show({
  //       severity: 'success', // tipo de notificação (sucesso)
  //       summary: 'Sucesso', // título da notificação
  //       detail: 'Disparo salvo com sucesso!', // message de sucesso
  //       life: 1000 // tempo de duração da notificação (em milissegundos)
  //     });
  //   } catch (error) {
  //     toast.current.show({
  //       severity: 'error', // tipo de notificação (erro)
  //       summary: 'Erro', // título da notificação
  //       detail: 'Erro ao salvar disparo: ' + error.message, // detalhe com a message de erro
  //       life: 2000 // tempo de duração da notificação (em milissegundos)
  //     });
  //   }
  // }

  const findIndexById = (id) => {
    const index = mensagens.findIndex((message) => message.id === id);
    return index;
  };

  const createId = () => {
    let id = "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const required_fields = ["department", "stage", "subject", "message"];

  const validarCampos = () => {
    for (let campo of required_fields) {
      if (!stageSender[campo]) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: `O campo ${campo} é obrigatório.`,
          life: 3000,
        });
        return false;
      }
    }
    return true;
  };

  const mensagemModalFooter = (
    <React.Fragment>
      <Button
        style={{ margin: "5px", borderRadius: "8px" }}
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={() => setMensagemModal(false)}
      />
      <Button
        style={{ margin: "5px", borderRadius: "8px" }}
        label="Salvar"
        icon="pi pi-check"
        onClick={() => {
          if (validarCampos()) {
            salvarMensagem();
            sendMessage();
          }
        }}
      />
    </React.Fragment>
  );

  const [deletarMensagemModal, setDeletarMensagemModal] = useState(false);

  const fecharDeletarMensagemModal = () => {
    setDeletarMensagemModal(false);
  };

  const confirmarDeletarMensagem = (message) => {
    setMensagem(message);
    setDeletarMensagemModal(true);
  };

  const deletarMensagem = () => {
    const index = mensagens.indexOf(message);
    if (index > -1) {
      let _mensagens = [...mensagens];
      _mensagens.splice(index, 1);
      setMensagens(_mensagens);
    }
    setDeletarMensagemModal(false);
    setMensagem(null);
  };

  const deletarMensagemModalFooter = (
    <React.Fragment>
      <Button
        style={{ margin: "5px", borderRadius: "8px" }}
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={() => fecharDeletarMensagemModal}
      />
      <Button
        style={{ margin: "5px", borderRadius: "8px" }}
        label="Deletar"
        icon="pi pi-check"
        severity="danger"
        onClick={deletarMensagem}
      />
    </React.Fragment>
  );

  const deletarMensagemBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          onClick={() => confirmarDeletarMensagem(rowData)}
        />
      </React.Fragment>
    );
  };

  const verMensagemBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-external-link"
          text
          onClick={() => {
            setSelectedMessage(rowData);
            setVisible(true);
          }}
        />
      </React.Fragment>
    );
  };

  const editarMensagem = (message) => {
    setStageSender(message);
    setSend(false);
    setMensagemModal(true);
  };

  const editarMensagemBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          text
          onClick={() => editarMensagem(rowData)}
        />
      </React.Fragment>
    );
  };

  // const ProductService = {
  //   getProductsMini: async () => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve([
  //           {
  //             id: "1",
  //             subject: "subject 1",
  //             message: "olá",
  //             send_date: "2024-06-04 00:05",
  //             status: "agendada",
  //           },
  //           {
  //             id: "2",
  //             subject: "subject 2",
  //             message: "message",
  //             send_date: "2024-06-04 20:07",
  //             status: "enviada",
  //           },
  //           {
  //             id: "3",
  //             subject: "subject 3",
  //             message: "texto",
  //             send_date: "2024-06-04 23:59",
  //             status: "enviada",
  //           },
  //         ]);
  //       }, 1000);
  //     });
  //   },
  // };

  // useEffect(() => {
  //   ProductService.getProductsMini().then((date) => {
  //     const normalizedData = date.map((msg) => ({
  //       ...msg,
  //       status: statusesMap[msg.status.toLowerCase()] || msg.status,
  //     }));
  //     setMensagens(normalizedData);
  //   });
  // }, []);

  const getSeverity = (status) => {
    switch (status) {
      case "AGENDADA":
        return "warning";
      case "ENVIADA":
        return "success";
      default:
        return "warning";
    }
  };

  const onRowEditComplete = (e) => {
    let _mensagens = [...mensagens];
    let { newData, index } = e;

    newData.status = normalizeStatus(newData.status);
    _mensagens[index] = newData;

    setMensagens(_mensagens);
  };

  const dateBodyTemplate = (rowData) => {
    const send_date = new Date(rowData.send_date);
    return `${send_date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })} - ${send_date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const statusBodyTemplate = (rowData) => {
    const status =
      statusesMap[rowData.status.toLowerCase()] ||
      rowData.status ||
      "Status não encontrado";
    return <Tag value={status} severity={getSeverity(status)}></Tag>;
  };

  const header = (
    <div
      style={{ display: "flex", height: "35px" }}
      className="gap-2 align-items-center justify-content-between"
    >
      <div className="flex flex-wrap gap-2">
        <Button
          style={{ height: "50px", borderRadius: "8px" }}
          label="Novo"
          iconPos="right"
          icon="pi pi-plus"
          severity="success"
          onClick={modalAdicionarMensagem}
        />
      </div>
      <h5 style={{ marginTop: "12px", marginLeft: "10%" }}>
        Pesquisa de mensagens
      </h5>
      <IconField iconPosition="left" style={{ width: "50%" }}>
        <InputIcon className={classNames("pi pi-search")} />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
        />
      </IconField>
    </div>
  );

  const [exibeMensagem, setExibeMensagem] = useState(false);
  const [exibeImagem, setExibeImagem] = useState(false);
  const [exibeAudio, setExibeAudio] = useState(false);

  const imageUpload = {
    icon: "pi pi-fw pi-images",
    iconOnly: false,
    className: "custom-choose-btn p-button-outlined",
  };
  const audioUpload = {
    icon: "pi pi-microphone",
    iconOnly: false,
    className: "custom-choose-btn p-button-outlined",
  };

  const onFileSelect = (event, tipo) => {
    const file = event.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];

        if (tipo === "image") {
          setStageSender((prevState) => ({
            ...prevState,
            image: base64String,
            imagemNome: file.name,
          }));
        }

        if (tipo === "audio") {
          setStageSender((prevState) => ({
            ...prevState,
            audio: base64String,
            audioNome: file.name,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div id="Form">
        <div className="card p-fluid " style={{ width: "98vw" }}>
          <DataTable
            value={mensagens}
            editMode="row"
            onRowEditComplete={onRowEditComplete}
            dataKey="id"
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Exibindo de {first} a {last} de {totalRecords} vendas"
            tableStyle={{ minWidth: "50rem" }}
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              key="id"
              field="id"
              header="ID"
              style={{ width: "14%" }}
            />
            <Column
              key="subject"
              field="subject"
              header="Assunto"
              style={{ width: "22%" }}
            />
            {/* <Column
              key="department"
              field="department"
              header="Departamento"
              style={{ width: "17%" }}
              body={(rowData) => getDepartamentoLabel(rowData.department)}
            />
            <Column
              key="stage"
              field="stage"
              header="Etapa"
              style={{ width: "17%" }}
              body={(rowData) =>
                getEtapaDescricao(rowData.department, rowData.stage)
              }
            />
            <Column
              key="last_interaction"
              field="last_interaction"
              header="Última Interação"
              style={{ width: "20%" }}
            /> */}
            <Column
              key="send_date"
              field="send_date"
              header="Data e Hora de Envio"
              body={dateBodyTemplate}
              style={{ width: "30%" }}
            />
            <Column
              key="status"
              field="status"
              header="Status"
              body={statusBodyTemplate}
              style={{ width: "14%" }}
            />
            <Column
              key="verMensagem"
              field="verMensagem"
              body={(rowData) => verMensagemBodyTemplate(rowData)}
              headerStyle={{ width: "5%" }}
              exportable={false}
              bodyStyle={{ textAlign: "center" }}
            />
            <Column
              key="editarMensagem"
              field="editarMensagem"
              body={(rowData) => editarMensagemBodyTemplate(rowData)}
              exportable={false}
              style={{ width: "5%" }}
              bodyStyle={{ textAlign: "center" }}
            />
            <Column
              key="deletarMensagem"
              field="deletarMensagem"
              body={(rowData) => deletarMensagemBodyTemplate(rowData)}
              exportable={false}
              style={{ width: "5%" }}
            />
          </DataTable>

          <Dialog
            visible={mensagemModal}
            style={{ width: "80vw" }}
            breakpoints={{ "960px": "90vw", "641px": "90vw" }}
            header="Agendamento de disparos"
            modal
            className="p-fluid"
            footer={mensagemModalFooter}
            onHide={fecharMensagemModal}
          >
            <Form>
              <div className="caixa-campos-juntos">
                <div className="p-field campos-juntos">
                  <label htmlFor="department">Departamento *</label>
                  <Dropdown
                    id="department"
                    value={stageSender.department || ""}
                    options={departamentos}
                    onChange={(e) =>
                      setStageSender((prev) => ({
                        ...prev,
                        department: e.value,
                        stage: "",
                      }))
                    }
                    style={{ margin: "10px 0", marginRight: "7px" }}
                    name="department"
                    placeholder="Selecione uma opção"
                  />
                </div>
                <div className="p-field campos-juntos">
                  <label htmlFor="stage">Etapa *</label>
                  <Dropdown
                    id="stage"
                    value={stageSender.stage || ""}
                    options={etapasFiltradas}
                    onChange={(e) =>
                      setStageSender((prev) => ({
                        ...prev,
                        stage: e.value,
                      }))
                    }
                    style={{ margin: "10px 0" }}
                    name="stage"
                    placeholder="Selecione uma opção"
                    disabled={!stageSender.department}
                  />
                </div>
              </div>

              <div className="p-field caixa-campos-juntos">
                <div className="campos-juntos" style={{ margin: "10px 0", marginRight: "7px" }}>
                  <label htmlFor="acquisition" className="font-bold block mb-2">
                    {" "}
                    Captação *{" "}
                  </label>
                  <InputText
                    name="acquisition"
                    disabled
                    value={stageSender.acquisition}
                    onChange={handleChange}
                  ></InputText>
                </div>
                <div className="campos-juntos" style={{ margin: "10px 0", marginRight: "7px" }}>
                  <label htmlFor="campaign" className="font-bold block mb-2">
                    {" "}
                    Campanha *{" "}
                  </label>
                  <InputText
                    name="campaign"
                    value={stageSender.campaign || ""}
                    onChange={handleChange}
                  ></InputText>
                </div>
                <div className="campos-juntos" style={{ margin: "10px 0", marginRight: "7px" }}>
                  <label htmlFor="ad" className="font-bold block mb-2" >
                    {" "}
                    Anúncio *{" "}
                  </label>
                  <InputText
                    name="ad"
                    value={stageSender.ad || ""}
                    onChange={handleChange}
                  ></InputText>
                </div>
              </div>

              <div className="caixa-campos-juntos ">
                <div className="p-field campos-juntos ultima-interacao" style={{ margin: "10px 0", marginRight: "7px", width: "30vw" }}>
                  <label htmlFor="last_interaction" className="font-bold block">
                    {" "}
                    Última Interação *{" "}
                  </label>
                  <Dropdown
                    value={ultimasInteracoes.find(
                      (item) =>
                        item.last_interaction ===
                        stageSender.last_interaction
                    ) || ""}
                    onChange={(e) =>
                      setStageSender((prev) => ({
                        ...prev,
                        last_interaction: e.value.last_interaction,
                      }))
                    }
                    style={{ margin: "8px 0" }}
                    options={ultimasInteracoes}
                    optionLabel="last_interaction"
                    placeholder="Selecione uma opção"
                    className="w-full md:w-14rem"
                  />
                </div>
                <div className="p-field campos-juntos follow_up" style={{ margin: "10px 0", marginRight: "7px", width: "30vw" }}>
                  <label htmlFor="follow_up" className="font-bold block">
                    {" "}
                    Follow-Up *{" "}
                  </label>
                  <Dropdown
                    value={followUps.find(
                      (item) =>
                        item.follow_up ===
                        stageSender.follow_up
                    ) || ""}
                    onChange={(e) =>
                      setStageSender((prev) => ({
                        ...prev,
                        follow_up: e.value.follow_up,
                      }))
                    }
                    style={{ margin: "8px 0" }}
                    options={followUps}
                    optionLabel="follow_up"
                    placeholder="Selecione uma opção"
                    className="w-full md:w-14rem"
                  />
                </div>
                <div className="campos-juntos" style={{ margin: "8px 0", marginRight: "7px" }}>
                  <label htmlFor="send_date" className="font-bold block">
                    {" "}
                    Data e Hora *{" "}
                  </label>
                  <Calendar
                    value={
                      stageSender.send_date
                        ? new Date(stageSender.send_date)
                        : null
                    }
                    onChange={(e) =>
                      setStageSender({
                        ...stageSender,
                        send_date: e.value,
                      })
                    }
                    showTime
                    hourFormat="24"
                    style={{ margin: "10px 0" }}
                    locale="pt"
                    dateFormat="dd/mm/yy"
                    hideOnDateTimeSelect
                    minDate={getMinDate()}
                  />
                </div>
              </div>

              <label htmlFor="subject" className="font-bold block mb-2">
                {" "}
                Assunto *{" "}
              </label>
              <InputText
                name="subject"
                value={stageSender.subject || ""}
                onChange={handleChange}
              ></InputText>

              <div className="flex flex-wrap justify-content-start gap-3 RadioButtonsLinha mt-3 mb-3">
                <div className="flex align-items-center">
                  <Checkbox
                    inputId="texto"
                    name="opcaoMensagem"
                    value="Texto"
                    onChange={(e) => {
                      onTipoMensagemChange(e);
                      setExibeMensagem(e.checked);
                    }}
                    checked={tipoMensagem.includes("Texto")}
                  />
                  <label
                    htmlFor="texto"
                    className="ml-2"
                    style={{ marginLeft: "5px" }}
                  >
                    Texto
                  </label>
                </div>
                <div className="flex align-items-center">
                  <Checkbox
                    inputId="image"
                    name="opcaoMensagem"
                    value="Imagem"
                    onChange={(e) => {
                      onTipoMensagemChange(e);
                      setExibeImagem(e.checked);
                    }}
                    checked={tipoMensagem.includes("Imagem")}
                  />
                  <label
                    htmlFor="image"
                    className="ml-2"
                    style={{ marginLeft: "5px" }}
                  >
                    Imagem
                  </label>
                </div>
                <div className="flex align-items-center">
                  <Checkbox
                    inputId="audio"
                    name="opcaoMensagem"
                    value="Áudio"
                    onChange={(e) => {
                      onTipoMensagemChange(e);
                      setExibeAudio(e.checked);
                    }}
                    checked={tipoMensagem.includes("Áudio")}
                  />
                  <label
                    htmlFor="audio"
                    className="ml-2"
                    style={{ marginLeft: "5px" }}
                  >
                    Áudio
                  </label>
                </div>
              </div>

              {exibeMensagem === true && (
                <div>
                  <label htmlFor="message" className="font-bold block mb-2">
                    {" "}
                    Mensagem *{" "}
                  </label>
                  <InputTextarea
                    name="message"
                    value={stageSender.message || ""}
                    onChange={handleChange}
                  ></InputTextarea>
                </div>
              )}

              <div className="caixa-campos-juntos">
                {exibeImagem === true && (
                  <div className="flex justify-content-center mb-2 mt-2 campos-juntos">
                    <FileUpload
                      mode="basic"
                      name="demo[]"
                      // url="/api/upload"
                      accept="image/*,video/*"
                      maxFileSize={1000000}
                      style={{ display: "flex", justifyContent: "center" }}
                      onSelect={(event) => onFileSelect(event, "image")}
                      chooseOptions={{
                        ...imageUpload,
                        label: stageSender.imagemNome || "Escolher Arquivo",
                      }}
                    />
                  </div>
                )}
                {exibeAudio && (
                  <div className="flex justify-content-center mb-3 mt-2 campos-juntos">
                    <FileUpload
                      mode="basic"
                      name="demo[]"
                      url="/api/upload"
                      accept="audio/*"
                      maxFileSize={1000000}
                      style={{ display: "flex", justifyContent: "center" }}
                      onSelect={(event) => onFileSelect(event, "audio")}
                      chooseOptions={{
                        ...audioUpload,
                        label: stageSender.audioNome || "Escolher Arquivo",
                      }}
                    />
                  </div>
                )}
              </div>
            </Form>
          </Dialog>

          <Dialog
            visible={deletarMensagemModal}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirmar exclusão de message"
            modal
            footer={deletarMensagemModalFooter}
            onHide={fecharDeletarMensagemModal}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem", verticalAlign: "middle" }}
              />
              {message && (
                <span>
                  Tem certeza que deseja excluir <b>{message.subject}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            header={selectedMessage?.subject}
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
          >
            <p className="m-0">
              <b>Departamento:</b>{" "}
              {getDepartamentoLabel(selectedMessage?.department)}
            </p>
            <p className="m-0">
              <b>Etapa:</b>{" "}
              {getEtapaDescricao(
                selectedMessage?.department,
                selectedMessage?.stage
              )}
            </p>
            <p className="m-0">
              <b>Captação:</b> {selectedMessage?.acquisition}
            </p>
            <p className="m-0">
              <b>Campanha:</b> {selectedMessage?.campaign}
            </p>
            <p className="m-0">
              <b>Anúncio:</b> {selectedMessage?.ad}
            </p>
            <p className="m-0">
              <b>Última interação:</b> {selectedMessage?.last_interaction}
            </p>
            <p className="m-0">
              <b>Data e hora:</b>{" "}
              {formatarDataHora(selectedMessage?.send_date)}
            </p>
            <p className="m-0">
              <b>Status:</b> {selectedMessage?.status}
            </p>
            <p className="m-0">
              <b>Tentativa:</b> {selectedMessage?.follow_up}
            </p>
            {selectedMessage?.message && (
              <p className="m-0">
                <b>Mensagem:</b> {selectedMessage?.message}
              </p>
            )}
            {selectedMessage?.image && (
              <p className="m-0" style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                <b>Imagem:</b>
                <Image src={`date:image/jpeg;base64,${selectedMessage?.image}`} alt="Mídia" width="250" />
              </p>
            )}
            {selectedMessage?.audio && (
              <p className="m-0" style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                <b>Áudio:</b>
                <audio controls className="custom-audio">
                  <source src={`date:audio/mp3;base64,${selectedMessage?.audio}`} type="audio/mp3" />
                  <source src={`date:audio/ogg;base64,${selectedMessage?.audio}`} type="audio/ogg" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </p>
            )}
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default StageSender;
