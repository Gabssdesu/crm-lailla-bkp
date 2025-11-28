import React from "react";
import { Card } from "primereact/card";

const SummaryCard = ({ events }) => {
  let servicesSold = 0;
  let totalSalesAmount = 0;

  events.forEach((item) => {
    if (item.service_type && item.service) servicesSold++;
    const amount = Number(item.payment_amount);
    if (!isNaN(amount)) totalSalesAmount += amount;
  });

  return (
    <Card className="text-center d-flex flex-column align-items-center ResumoTL" title="Resumo">
      <h5>
        <i className="pi pi-briefcase" style={{ marginRight: "6px" }}></i>
        {servicesSold} {servicesSold === 1 ? "serviço vendido" : "serviços vendidos"}
      </h5>
      <h5>
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(totalSalesAmount)}
      </h5>
    </Card>
  );
};

export default SummaryCard;