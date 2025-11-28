import React, { useRef } from "react";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import "primereact/resources/primereact.min.css";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";

function Client({ client, setClient, address, dadosCW, saveData }) {
  const toast = useRef(null);

  const handleChange = (e) => {
    const { checked } = e.target;
    setClient((prevCliente) => ({
      ...prevCliente,
      lgpd_blocked: checked,
    }));
  };

  const handleClienteChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [id]: value,
      gender: prev.gender || (id === "gender" ? value : prev.gender),
    }));
  };

  const generos = ["Mulher", "Homem", "Não-binário", "Prefiro não informar"];

  const opcoesRendaFamiliar = [
    "0 a R$2.824",
    "R$2.825 a R$5.648",
    "R$5.649 a R$11.296",
    "R$11.297 a R$22.592",
    "Acima de R$22.593",
  ];

  return (
    <>
      <Toast ref={toast} />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <i
                className="pi pi-id-card"
                style={{ marginRight: "8px", fontSize: "0.9em" }}
              ></i>
              Dados do cliente
            </div>
          }
          style={{ width: "auto", marginTop: "10px", margin: "15px" }}
          className="card"
        >
          <div className="flex justify-content-center caixa mt-5">
            <FloatLabel>
              <InputText
                className="campos"
                id="name"
                value={client.name || dadosCW.contact.name}
                onChange={handleClienteChange}
              />
              <label htmlFor="name">Nome completo</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                className="campos"
                id="cpf"
                keyfilter="num"
                value={client.cpf || ""}
                // value={client.cpf || dadosCW.contact.name}
                onChange={handleClienteChange}
              />
              <label htmlFor="cpf">CPF</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                id="phone"
                disabled
                value={
                  dadosCW?.contact?.phone_number
                    ? dadosCW.contact.phone_number
                      .replace("+55", "") // Remove o prefixo +55, se presente
                      .replace(/\D/g, "") // Remove qualquer caractere não numérico
                      .replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3") // Para números com 10 dígitos
                      .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3") // Para números com 11 dígitos
                    : "" // Valor padrão caso phone_number seja undefined
                }
                onChange={handleClienteChange}
                className="campos"
              />
              <label htmlFor="phone">Telefone</label>
            </FloatLabel>
          </div>
          <div
            className="flex justify-content-center"
            style={{ display: "flex", marginTop: "27px", height: "50px" }}
          >
            <FloatLabel>
              <InputText
                className="campos"
                id="email"
                keyfilter="email"
                value={client.email || ""}
                onChange={handleClienteChange}
              />
              <label htmlFor="email">E-mail</label>
            </FloatLabel>
            <FloatLabel className="w-full md:w-14rem">
              <Dropdown
                inputId="gender"
                value={client.gender}
                onChange={(e) =>
                  setClient((prevCliente) => ({
                    ...prevCliente,
                    gender: e.value,
                  }))
                }
                options={generos}
                placeholder="Selecione um gênero"
                className="w-full campos"
              />
              <label htmlFor="gender">Gênero</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                className="campos"
                id="profession"
                value={client.profession || ""}
                onChange={handleClienteChange}
              />
              <label htmlFor="profession">Profissão</label>
            </FloatLabel>
          </div>
          <div className="flex justify-content-center caixa">
            <FloatLabel>
              <InputText
                className="campos"
                id="convenio"
                value={client.convenio || dadosCW.contact.convenio}
                onChange={handleClienteChange}
              />
              <label htmlFor="convenio">Convênio</label>
            </FloatLabel>
            <FloatLabel className="w-full md:w-14rem">
              <Dropdown
                inputId="family_income"
                value={client.family_income}
                onChange={(e) =>
                  setClient((prevCliente) => ({
                    ...prevCliente,
                    family_income: e.value,
                  }))
                }
                options={opcoesRendaFamiliar}
                placeholder="Selecione uma renda familiar"
                className="w-full campos"
              />
              <label htmlFor="family_income">Renda Familiar</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                className="campos"
                id="found_us"
                value={client.found_us || ""}
                onChange={handleClienteChange}
              />
              <label htmlFor="found_us">Como nos conheceu?</label>
            </FloatLabel>
          </div>
          <div style={{ marginRight: "auto", marginLeft: "auto" }}>
            <div className="flex justify-content-center caixa">
              <FloatLabel>
                <InputTextarea
                  value={client.observation || ""}
                  onChange={handleClienteChange}
                  style={{ width: "500px", resize: "none" }}
                  id="observation"
                  rows={2}
                  cols={50}
                />
                <label htmlFor="observation">Observações</label>
              </FloatLabel>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "10px",
              marginTop: "40px",
              justifyContent: "center",
            }}
          >
            <h4 style={{ marginTop: "6px" }}>LGPD</h4>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                margin: "10px",
              }}
            >
              <Checkbox
                inputId="lgpd_blocked"
                checked={client.lgpd_blocked || false}
                onChange={handleChange}
                style={{ width: "10vw", marginLeft: "15px" }}
              />
              <label htmlFor="lgpd_blocked" style={{ marginLeft: "-55px" }}>
                Bloqueado
              </label>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "50px",
            }}
          >
            <Button
              className="p-ripple"
              variant="light"
              onClick={() => saveData(client, address)}
              style={{ borderRadius: "10px" }}
              label="Salvar Dados"
            />
          </div>
        </Card>
      </div>
    </>
  );
}
export default Client;