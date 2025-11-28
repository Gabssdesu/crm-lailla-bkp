import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

function Address({ address, setAddress, client, saveData }) {

  const toast = useRef(null);

  const fetchCepData = async (postal_code) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${postal_code}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setAddress((prevAddress) => ({
          ...prevAddress,
          postal_code,
          state: data.estado,
          city: data.localidade,
          street: data.logradouro,
          neighborhood: data.bairro,
        }));
      } else {
        toast.current.show({
          severity: "error",
          summary: "Erro!",
          detail: `CEP não encontrado.`,
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Erro!",
        detail: `Erro ao buscar CEP.`,
        life: 3000,
      });
    }
  };

  const handleCepChange = (e) => {
    const cepInput = e.target.value.replace(/\D/g, "");
    setAddress((prevAddress) => ({ ...prevAddress, postal_code: cepInput }));

    if (cepInput.length === 8) {
      fetchCepData(cepInput);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <>
      <Toast ref={toast} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card title={<div style={{ display: "flex", alignItems: "center" }}>
          <i className="pi pi-map-marker" style={{ marginRight: '8px', fontSize: '0.9em' }}></i>
          Dados do endereço
        </div>} style={{ width: "auto", marginTop: '10px', margin: '15px' }} className="card">
          <div className="flex justify-content-center caixa mt-5">
            <FloatLabel>
              <InputText
                className="campos"
                id="postal_code"
                value={address?.postal_code || ""}
                onChange={handleCepChange}
                placeholder=""
              />
              <label htmlFor="postal_code">CEP</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                className="campos"
                id="state"
                name="state"
                keyfilter="alpha"
                value={address?.state || ""}
                onChange={handleChange}
              />
              <label htmlFor="state">Estado</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                className="campos"
                id="city"
                name="city"
                value={address?.city || ""}
                onChange={handleChange}
              />
              <label htmlFor="city">Cidade</label>
            </FloatLabel>
          </div>
          <div
            className="flex justify-content-center"
            style={{ display: "flex", marginTop: "27px", height: "50px" }}
          >
            <FloatLabel>
              <InputText
                className="campos"
                id="street"
                name="street"
                value={address?.street || ""}
                onChange={handleChange}
              />
              <label htmlFor="street">Logradouro</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                className="campos"
                id="neighborhood"
                name="neighborhood"
                value={address?.neighborhood || ""}
                onChange={handleChange}
              />
              <label htmlFor="neighborhood">Bairro</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                className="campos"
                id="number"
                name="number"
                value={address?.number || ""}
                onChange={handleChange}
              />
              <label htmlFor="number">Número</label>
            </FloatLabel>
          </div>
          <div className="flex justify-content-center  caixa">
            <FloatLabel>
              <InputText
                className="campos"
                id="complement"
                name="complement"
                value={address?.complement || ""}
                onChange={handleChange}
              />
              <label htmlFor="complement">Complemento</label>
            </FloatLabel>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "50px",
              marginTop: "20px",
            }}
          >
            <Button
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

export default Address;