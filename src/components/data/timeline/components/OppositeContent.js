import React from "react";

const OppositeContent = ({ item, index }) => {
  if (!item.payment_amount) return null;

  return (
    <span
      className="caixaValorTL"
      style={{
        marginLeft: index % 2 === 0 ? "auto" : "unset",
        marginRight: index % 2 !== 0 ? "auto" : "unset",
      }}
    >
      <div style={{ textAlign: "center", alignItems: "center" }}>
        <i
          className="pi pi-money-bill"
          style={{
            backgroundColor: "green",
            borderRadius: "50%",
            width: "35px",
            height: "35px",
            display: "flex",
            color: "white",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "5px",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        ></i>
        <span style={{ color: "green", fontWeight: "bold" }}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(item.payment_amount)}
        </span>
      </div>
    </span>
  );
};

export default OppositeContent;