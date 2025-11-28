import { React, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { formatBRLCurrency } from "@/functions/formatters";
import PaymentsTable from "../tables/PaymentsTable";

export default function PaymentsModal({
  paymentModal,
  sale,
  newPayment,
  setNewPayment,
  paymentMethods,
  checked,
  setChecked,
  isAdmin,
  setPaymentModal,
  setSale,
  sales,
  setSales,
  deletePaymentsDB,
  createId,
  dadosCW,
  stageID,
}) {

  const toast = useRef(null);

  const serviceValue = Number(sale?.service_value || 0);
  const discountValue = Number(sale?.discount || 0);
  const totalValue = serviceValue - discountValue;
  const signPayment = sale?.payments?.find((p) => p.is_sign);
  const signValue = Number(signPayment?.amount || 0);
  const paidValue = sale?.payments?.reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const remainingValue = totalValue - paidValue;

  const handleAddPayment = (sale) => {
    const newAmount = Number(newPayment.amount || 0);

    if (
      !newPayment.method ||
      !newPayment.amount ||
      isNaN(newAmount) ||
      newAmount <= 0
    ) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail:
          "Todos os campos são obrigatórios e o valor deve ser maior que R$ 0,00!",
        life: 3000,
      });
      return;
    }

    if (paidValue + newAmount > totalValue) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: `O valor total dos pagamentos não pode ultrapassar ${formatBRLCurrency(
          totalValue
        )}.`,
        life: 3000,
      });
      return;
    }

    const newPay = {
      ...newPayment,
      id: createId(),
      // payment_id: newPayment.payment_id,
      amount: newAmount,
      method: newPayment.method,
      date: new Date().toISOString(),
      ...(checked && { is_sign: true }),
    };

    const updatedPayments = [...(sale.payments || []), newPay];

    const updatedPaid = updatedPayments.reduce(
      (acc, p) => acc + Number(p.amount || 0),
      0
    );

    const hasSignOnly =
      updatedPayments.some((p) => p.is_sign) &&
      updatedPayments.filter((p) => !p.is_sign).length === 0;

    const updatedStatus =
      updatedPaid >= totalValue
        ? "PAGO TOTAL"
        : hasSignOnly
          ? "SINAL"
          : "AGUARDANDO PAGAMENTO";

    setSale((prev) => ({
      ...prev,
      payments: updatedPayments,
      payment_status: updatedStatus,
      payment_amount: updatedPaid.toFixed(2),
    }));

    setNewPayment({ amount: null, method: null });
    setChecked(false);

    fetch(process.env.NEXT_PUBLIC_WEBHOOK_PAYMENTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payments: updatedPayments,
        sale_id: sale.sale_id,
        account_id: dadosCW.conversation.account_id,
        stage_id: stageID,
        payment_status: updatedStatus,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao enviar os pagamentos");
        return response.json();
      })
      .then((data) => {
        setSales(data);
        const index = data.findIndex((item) => item.sale_id === sale.sale_id);
        setSale(data[index]);
        toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Pagamentos enviados com sucesso!",
          life: 3000,
        });
      })
      .catch((err) => {
        console.error("Erro ao enviar os pagamentos:", err);
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao enviar os pagamentos: " + err.message,
          life: 3000,
        });
      });
  };

  const closePaymentModal = () => {
    setPaymentModal(false);
  };

  const deletePayment = (paymentToDelete) => {
    const updatedPayments = sale.payments.filter(
      (p) => p.payment_id !== paymentToDelete.payment_id
    );

    const updatedSale = {
      ...sale,
      payments: updatedPayments,
      payment_amount: updatedPayments.reduce(
        (acc, p) => acc + Number(p.amount || 0),
        0
      ),
    };

    setSale(updatedSale);

    const updatedSales = sales.map((s) =>
      s.sale_id === sale.sale_id ? updatedSale : s
    );
    setSales(updatedSales);

    deletePaymentsDB(paymentToDelete.payment_id);
  };


  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={paymentModal}
        style={{ width: "32rem", overflowX: "hidden" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Cadastro de pagamento"
        modal
        draggable={false}
        onHide={closePaymentModal}
      >
        <div>
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "0.9rem" }}></i>
                  <b>Valor do serviço:</b>
                </div>
                <span>{formatBRLCurrency(serviceValue)}</span>
              </div>

              {discountValue > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "0.9rem" }}></i>
                    <b>Valor do desconto:</b>
                  </div>
                  <span>{formatBRLCurrency(discountValue)}</span>
                </div>
              )}

              {signPayment && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "0.9rem" }}></i>
                    <b>Valor do sinal:</b>
                  </div>
                  <span>{formatBRLCurrency(signValue)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "0.9rem", color: "#26B756" }}></i>
                  <b>Valor pago:</b>
                </div>
                <span>
                  <b style={{ color: "#26B756" }}>{formatBRLCurrency(paidValue)}</b>
                </span>
              </div>

              {remainingValue > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "0.9rem", color: "#FF0000" }}></i>
                    <b>Valor restante a ser pago:</b>
                  </div>
                  <span>
                    <b style={{ color: "#FF0000" }}>{formatBRLCurrency(remainingValue)}</b>
                  </span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F2F2F2", padding: "7px", borderRadius: "5px", marginTop: "10px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i className="pi pi-credit-card" style={{ marginRight: "5px", fontSize: "1rem", color: "#2B75ED" }}></i>
                  <b>Valor total:</b>
                </div>
                <span>
                  <b style={{ color: "#2B75ED" }}>{formatBRLCurrency(totalValue)}</b>
                </span>
              </div>

            
            </div>
          </div>

          <Divider align="left" style={{ paddingBottom: "0px" }}>
            <div className="inline-flex align-items-center">
              <b style={{fontSize:"1.1em"}}>Cadastrar pagamento</b>
            </div>
          </Divider>

          <div style={{ margin: "10px", marginTop: "-10px" }}>
            <Checkbox
              inputId="is_sign"
              name="is_sign"
              onChange={(e) => setChecked(e.checked)}
              checked={checked}
              disabled={sale?.payments?.some((p) => p.is_sign)}
            />
            <label htmlFor="is_sign" style={{ marginLeft: "10px" }}>
              Registrando pagamento de sinal
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div>
              <label htmlFor="new_payment_amount">Valor: </label>
              <InputNumber
                id="new_payment_amount"
                value={newPayment.amount || ""}
                onValueChange={(e) =>
                  setNewPayment((prev) => ({ ...prev, amount: e.value }))
                }
                name="new_payment_amount"
                mode="currency"
                currency="BRL"
                locale="pt-BR"
                className="campoValor"
                placeholder="R$ 0,00"
                disabled={paidValue >= totalValue}
              />
            </div>
            <div>
              <label htmlFor="new_payment_method">Forma de pagamento</label>
              <Dropdown
                id="new_payment_method"
                value={newPayment.method}
                options={paymentMethods}
                onChange={(e) =>
                  setNewPayment((prev) => ({ ...prev, method: e.value }))
                }
                name="new_payment_method"
                style={{ width: "240px" }}
                placeholder="Escolha uma opção"
                disabled={paidValue >= totalValue}
              />
            </div>
            <div>
              <Button
                icon="pi pi-plus"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  marginTop: "24px",
                  // marginRight: "25px",
                }}
                onClick={() => handleAddPayment(sale)}
                disabled={
                  !newPayment.amount ||
                  !newPayment.method ||
                  paidValue >= totalValue
                }
              />
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <PaymentsTable
              payments={sale?.payments || []}
              isAdmin={isAdmin}
              sale={sale}
              onDeletePayment={deletePayment}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}