import React, { useState, useEffect, useRef } from "react";
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
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function SingleSender({ singleSender, setSingleSender }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSingleSender({
      ...singleSender,
      [name]: value,
    });
  };

  let mensagemProgVazia = {
    id: null,
    subject: "",
    message: "",
    date_time: "",
    status: "AGENDADA",
  };

  const [mensagens, setMensagens] = useState([]);
  const [message, setMensagem] = useState(mensagemProgVazia);

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
  };

  const salvarMensagem = () => {
    setSend(true);

    if (
      !singleSender.subject ||
      !singleSender.message ||
      !singleSender.date_time
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
    let _msgProgramada = { ...singleSender };

    if (_msgProgramada.date_time) {
      _msgProgramada.date_time = new Date(
        _msgProgramada.date_time
      ).toISOString();
    }

    _msgProgramada.status = "AGENDADA";

    if (_msgProgramada.id) {
      const index = findIndexById(_msgProgramada.id);
      if (index > -1) {
        _mensagens[index] = _msgProgramada;
      }
    } else {
      _msgProgramada.id = createId();
      _mensagens.unshift(_msgProgramada);
    }

    setMensagens(_mensagens);
    setMensagemModal(false);
    setSingleSender(mensagemProgVazia);
  };

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
        onClick={salvarMensagem}
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
    setSingleSender(message);
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

  const ProductService = {
    getProductsMini: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "1",
              subject: "subject 1",
              message: "olá",
              date_time: "2024-06-04 00:05",
              status: "agendada",
            },
            {
              id: "2",
              subject: "subject 2",
              message: "message",
              date_time: "2024-06-04 20:07",
              status: "enviada",
            },
            {
              id: "3",
              subject: "subject 3",
              message: "texto",
              date_time: "2024-06-04 23:59",
              status: "enviada",
            },
          ]);
        }, 1000);
      });
    },
  };

  useEffect(() => {
    ProductService.getProductsMini().then((data) => {
      const normalizedData = data.map((msg) => ({
        ...msg,
        status: statusesMap[msg.status.toLowerCase()] || msg.status,
      }));
      setMensagens(normalizedData);
    });
  }, []);

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
    const date_time = new Date(rowData.date_time);
    return `${date_time.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })} - ${date_time.toLocaleTimeString("pt-BR", {
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
              key="subject"
              field="subject"
              header="Assunto"
              style={{ width: "25%" }}
            />
            <Column
              key="date_time"
              field="date_time"
              header="Data e Hora de Envio"
              body={dateBodyTemplate}
              style={{ width: "30%" }}
            />
            <Column
              key="status"
              field="status"
              header="Status"
              body={statusBodyTemplate}
              style={{ width: "20%" }}
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
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Agendamento de mensagens"
            modal
            className="p-fluid"
            footer={mensagemModalFooter}
            onHide={fecharMensagemModal}
          >
            {/* {venda.image && <img src={`https://primefaces.org/cdn/primereact/images/venda/${venda.image}`} alt={venda.image} className="venda-image block m-auto pb-3" />} */}

            <Form>
              <label htmlFor="subject" className="font-bold block mb-2">
                {" "}
                Assunto *{" "}
              </label>
              <InputText
                name="subject"
                value={singleSender.subject}
                onChange={handleChange}
              ></InputText>

              <label htmlFor="message" className="font-bold block mb-2">
                {" "}
                Mensagem *{" "}
              </label>
              <InputTextarea
                name="message"
                value={singleSender.message}
                onChange={handleChange}
              ></InputTextarea>

              <label htmlFor="date_time" className="font-bold block mb-2">
                {" "}
                Data e Hora de Envio *{" "}
              </label>
              <Calendar
                value={
                  singleSender.date_time
                    ? new Date(singleSender.date_time)
                    : null
                }
                onChange={(e) =>
                  setSingleSender({ ...singleSender, date_time: e.value })
                }
                showTime
                hourFormat="24"
                locale="pt"
                dateFormat="dd/mm/yy"
              />
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
            <p className="m-0">{selectedMessage?.message}</p>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default SingleSender;
