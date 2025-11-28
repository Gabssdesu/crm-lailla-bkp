import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

export default function SalesModal({
  sale = {},
  setSale,
  sales,
  setSales,
  saleModal,
  isEditing,
  services = {},
  appointments,
  treatments,
  createId,
  saveSales,
  setSaleModal,
  emptySale,
}) {

  const toast = useRef(null);

  // Função para extrair hora de uma data
  const extractTimeFromDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toTimeString().slice(0, 5); // HH:MM
  };

  // Função para extrair apenas a data (sem hora)
  const extractDateFromDateTime = (date) => {
    if (!date) return null;
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0); // Remove a hora
    return dateObj;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount" || name === "method") {
      setSale((prevState) => {
        const updatedPayments = [...prevState.payments];
        updatedPayments[0] = {
          ...updatedPayments[0],
          [name]: value,
          is_sign: true,
        };
        return {
          ...prevState,
          payments: updatedPayments,
        };
      });
    } else if (name === "payment_status" && value === "SINAL") {
      setSale((prevState) => {
        const updatedPayments = [...prevState.payments];
        updatedPayments[0] = {
          ...updatedPayments[0],
          is_sign: true,
        };
        return {
          ...prevState,
          payment_status: value,
          payments: updatedPayments,
        };
      });
    } else {
      setSale((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSaveSale = () => {
    const required_fields = ["service_type", "service", "service_value"];

    if (
      ["acompanhamento", "acompanhamento-personalizado"].includes(
        sale?.service_type
      )
    ) {
      required_fields.push("beginning_date", "final_date");

      // Validação dos horários obrigatórios para acompanhamento
      if (!sale?.beginning_time) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "O horário de início é obrigatório!",
          life: 3000,
        });
        return;
      }

      if (!sale?.final_time) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "O horário final é obrigatório!",
          life: 3000,
        });
        return;
      }

      // Combina data e hora para criar objetos Date completos
      const beginningDateTime = new Date(sale.beginning_date);
      const [beginHours, beginMinutes] = sale.beginning_time.split(':');
      beginningDateTime.setHours(parseInt(beginHours), parseInt(beginMinutes), 0, 0);

      const finalDateTime = new Date(sale.final_date);
      const [finalHours, finalMinutes] = sale.final_time.split(':');
      finalDateTime.setHours(parseInt(finalHours), parseInt(finalMinutes), 0, 0);

      if (beginningDateTime > finalDateTime) {
        toast.current.show({
          severity: "warn",
          summary: "Conflito nas datas.",
          detail: "A data/hora de início não pode ser posterior à data/hora final.",
          life: 3000,
        });
        return;
      }

      // Atualiza o sale com as datas combinadas
      setSale((prevSale) => ({
        ...prevSale,
        beginning_date: beginningDateTime,
        final_date: finalDateTime,
      }));

    } else {
      required_fields.push("service_date");

      // Validação do horário obrigatório para outros serviços
      if (!sale?.service_time) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "O horário é obrigatório!",
          life: 3000,
        });
        return;
      }

      // Combina data e hora para service_date
      const serviceDateTime = new Date(sale.service_date);
      const [serviceHours, serviceMinutes] = sale.service_time.split(':');
      serviceDateTime.setHours(parseInt(serviceHours), parseInt(serviceMinutes), 0, 0);

      // Atualiza o sale com a data combinada
      setSale((prevSale) => ({
        ...prevSale,
        service_date: serviceDateTime,
      }));
    }

    const not_filled_fields = required_fields.filter((campo) => !sale[campo]);

    if (not_filled_fields.length > 0) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Todos os campos são obrigatórios!",
        life: 3000,
      });
      return;
    }

    const discount = sale.discount || 0;
    const serviceValue = sale.service_value || 0;

    if (discount >= serviceValue) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção!",
        detail: "O desconto não pode ser maior ou igual ao valor do serviço!",
        life: 3000,
      });
      return;
    }

    if (serviceValue < (sale?.payment_amount || 0)) {
      toast.current.show({
        severity: "warn",
        summary: "Valor inválido",
        detail: "O valor do serviço não pode ser menor do que o valor já pago.",
        life: 3000,
      });
      return;
    }


    // Aplica o desconto ao value do serviço
    const finalValue = serviceValue - discount;

    // Atualiza o estado da venda com o value final
    setSale((prevSale) => ({
      ...prevSale,
      payment_amount: finalValue, // Adiciona ou atualiza o campo com o value final
    }));

    const stageValue =
      sale?.service_type === "paciente-novo" ? "agendado" : sale?.service_type;

    if (isEditing) {
      // Atualiza a venda existente
      const index = sales.findIndex((v) => v.sale_id === sale.sale_id);
      if (index > -1) {
        const updatedSales = [...sales];
        updatedSales[index] = { ...sale, stage: stageValue };
        setSales(updatedSales);
        saveSales(updatedSales);
      }
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Venda editada com sucesso!",
        life: 3000,
      });
    } else {
      // Adiciona uma nova venda
      const newSale = { ...sale, id: createId(), stage: stageValue };
      const updatedSales = [newSale, ...sales];
      setSales(updatedSales);
      saveSales(updatedSales);

      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Venda salva com sucesso!",
        life: 3000,
      });
    }

    closeSaleModal();
  };

  const closeSaleModal = () => {
    setSale(emptySale);
    setSaleModal(false);
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={saleModal}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "90vw", "641px": "90vw" }}
        header={isEditing ? "Edição de Vendas" : "Cadastro de Vendas"}
        modal
        draggable={false}
        className="p-fluid"
        footer={
          <React.Fragment>
            <Button
              style={{ margin: "5px", borderRadius: "8px" }}
              label="Cancelar"
              icon="pi pi-times"
              outlined
              onClick={closeSaleModal}
            />
            <Button
              style={{ margin: "5px", borderRadius: "8px" }}
              label="Salvar"
              icon="pi pi-check"
              onClick={handleSaveSale}
            />
          </React.Fragment>
        }
        onHide={closeSaleModal}
      >
        <div className="p-fluid">
          <div
            style={{ display: "flex", flexDirection: "row", width: "100%" }}
          >
            <div className="p-field" style={{ width: "50%" }}>
              <label htmlFor="service_type">Tipo de serviço *</label>
              <Dropdown
                id="service_type"
                value={sale?.service_type || ""}
                options={Object.entries(services).map(([key, value]) => ({
                  label: value,
                  value: key,
                }))}
                onChange={(e) =>
                  handleChange({
                    target: { name: "service_type", value: e.value },
                  })
                }
                style={{ margin: "10px 0" }}
                name="service_type"
                placeholder="Escolha um tipo"
                disabled={isEditing}
              />
            </div>
            <div
              className="p-field"
              style={{ marginLeft: "10px", width: "50%" }}
            >
              <label htmlFor="service">Serviços *</label>
              <Dropdown
                id="service"
                value={sale?.service || ""}
                options={
                  Object.values(
                    sale?.service_type === "consulta" ? appointments : treatments
                  )
                  .filter(item => item.status === true)
                  .map(item => ({
                    label: item.display_name || item.label,
                    value: item.value
                  }))
                }
                onChange={(e) =>
                  handleChange({
                    target: { name: "service", value: e.value },
                  })
                }
                style={{ margin: "10px 0" }}
                name="service"
                placeholder="Escolha um serviço"
                disabled={!sale?.service_type || isEditing}
              />
            </div>
          </div>

          {["acompanhamento", "acompanhamento-personalizado"].includes(
            sale?.service_type
          ) ? (
            <>
              <div
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <div className="p-field" style={{ width: "60%" }}>
                  <label htmlFor="beginning_date">Data de início*</label>
                  <Calendar
                    id="beginning_date"
                    value={
                      sale?.beginning_date
                        ? extractDateFromDateTime(sale.beginning_date)
                        : null
                    }
                    onChange={(e) =>
                      handleChange({
                        target: { name: "beginning_date", value: e.value },
                      })
                    }
                    name="beginning_date"
                    dateFormat="dd/mm/yy"
                    placeholder="Escolha uma data"
                    locale="pt"
                    style={{ margin: "10px 0" }}
                    hideOnDateTimeSelect
                  />
                </div>
                <div
                  className="p-field"
                  style={{ marginLeft: "10px", width: "40%" }}
                >
                  <label htmlFor="beginning_time">Horário*</label>
                  <InputText
                    id="beginning_time"
                    value={sale?.beginning_time || extractTimeFromDate(sale?.beginning_date)}
                    onChange={handleChange}
                    placeholder="HH:MM"
                    name="beginning_time"
                    type="time"
                    style={{ margin: "10px 0" }}
                  />
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <div className="p-field" style={{ width: "60%" }}>
                  <label htmlFor="final_date">Data final*</label>
                  <Calendar
                    id="final_date"
                    value={sale?.final_date ? extractDateFromDateTime(sale.final_date) : null}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "final_date", value: e.value },
                      })
                    }
                    name="final_date"
                    dateFormat="dd/mm/yy"
                    placeholder="Escolha uma data"
                    locale="pt"
                    style={{ margin: "10px 0" }}
                    hideOnDateTimeSelect
                  />
                </div>
                <div
                  className="p-field"
                  style={{ marginLeft: "10px", width: "40%" }}
                >
                  <label htmlFor="final_time">Horário*</label>
                  <InputText
                    id="final_time"
                    value={sale?.final_time || extractTimeFromDate(sale?.final_date)}
                    onChange={handleChange}
                    placeholder="HH:MM"
                    name="final_time"
                    type="time"
                    style={{ margin: "10px 0" }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <div className="p-field" style={{ width: "60%" }}>
                <label htmlFor="service_date">Data de atendimento*</label>
                <Calendar
                  id="service_date"
                  value={
                    sale?.service_date ? extractDateFromDateTime(sale.service_date) : null
                  }
                  onChange={(e) =>
                    handleChange({
                      target: { name: "service_date", value: e.value },
                    })
                  }
                  name="service_date"
                  dateFormat="dd/mm/yy"
                  placeholder="Escolha uma data"
                  locale="pt"
                  style={{ margin: "10px 0" }}
                  hideOnDateTimeSelect
                />
              </div>
              <div
                className="p-field"
                style={{ marginLeft: "10px", width: "40%" }}
              >
                <label htmlFor="service_time">Horário*</label>
                <InputText
                  id="service_time"
                  value={sale?.service_time || extractTimeFromDate(sale?.service_date)}
                  onChange={handleChange}
                  placeholder="HH:MM"
                  name="service_time"
                  type="time"
                  style={{ margin: "10px 0" }}
                />
              </div>
            </div>
          )}

          <div
            style={{ display: "flex", flexDirection: "row", width: "100%" }}
          >
            <div className="p-field" style={{ width: "50%" }}>
              <label htmlFor="service_value">Valor do serviço *</label>
              <InputNumber
                id="service_value"
                value={sale?.service_value === 0 ? null : sale?.service_value}
                onValueChange={(e) => {
                  if (e.value < (sale?.payment_amount || 0)) {
                    toast.current.show({
                      severity: "warn",
                      summary: "Valor inválido",
                      detail: "O valor do serviço não pode ser menor do que o valor já pago.",
                      life: 3000,
                    });
                    return;
                  }
                  handleChange({
                    target: { name: "service_value", value: e.value },
                  });
                }}
                mode="currency"
                currency="BRL"
                style={{ margin: "10px 0" }}
                locale="pt-BR"
                placeholder="R$ 0,00"
              />
            </div>
            <div
              className="p-field"
              style={{ marginLeft: "10px", width: "50%" }}
            >
              <label htmlFor="discount">Desconto</label>
              <InputNumber
                id="discount"
                value={sale?.discount === 0 ? null : sale?.discount}
                onValueChange={(e) =>
                  handleChange({
                    target: { name: "discount", value: e.value },
                  })
                }
                mode="currency"
                currency="BRL"
                style={{ margin: "10px 0" }}
                locale="pt-BR"
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          <div className="p-field" style={{ marginBottom: "-30px" }}>
            <label htmlFor="notes">Observações</label>
            <InputTextarea
              id="notes"
              value={sale?.notes || ""}
              onChange={handleChange}
              style={{ margin: "10px 0" }}
              name="notes"
              autoResize
              rows={2}
              cols={50}
            />
          </div>
        </div>
      </Dialog>
    </>
  )
}