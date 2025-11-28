import React from "react";
import { Card } from "primereact/card";
import Link from "next/link";
import PropTypes from "prop-types";

const NoContactCard = ({ viewName }) => {
  return (
    <Card
      className="no-contact-card"
      title="Contato não iniciado"
      style={viewName === "a linha do tempo" ? { marginTop: "25px" } : { marginTop: "0px" }}
      subTitle={
        <>
          Por favor, inicie o contato na aba{" "}
          <Link
            href="/macros/macros"
            style={{ color: "#1bcba8", textDecoration: "none" }}
          >
            Etapas
          </Link>{" "}
          para visualizar {viewName}.
        </>
      }
    ></Card>
  );
};

NoContactCard.propTypes = {
  viewName: PropTypes.string.isRequired,
};

export default NoContactCard;