import React from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { formatName } from "@/functions/formatters";

const originPlatforms = {
  whatsapp: { icon: "pi pi-whatsapp", name: "WhatsApp", bgColor: "#BDF0E1" },
  instagram: { icon: "pi pi-instagram", name: "Instagram", bgColor: "#FECACA" },
  facebook: { icon: "pi pi-facebook", name: "Facebook", bgColor: "#BFDBFE" },
  twitter: { icon: "pi pi-twitter", name: "Twitter", bgColor: "#A3BBE2" },
  telegram: { icon: "pi pi-telegram", name: "Telegram", bgColor: "#E9D5FF" },
};

const infoItems = [
  { icon: "pi pi-address-book", label: "Iniciador", key: "initial_contact", color: "#6366F1" },
  { icon: "pi pi-globe", label: "Captação", key: "first_acquisition", color: "#10B981" },
  { icon: "pi pi-megaphone", label: "Campanha", key: "first_campaign", color: "#F59E0B" },
  { icon: "pi pi-objects-column", label: "Anúncio", key: "first_ad", color: "#EC4899" },
  { icon: "pi pi-users", label: "Indicação", key: "referral", color: "#6F42C1" },
];

const ClientCard = ({ client, dadosCW, dataCW, stageControl, isLoadingContact }) => {

  const renderOriginPlatform = (item) => {
    const platform = originPlatforms[item?.platform];
    if (!platform) return null;

    return (
      <Tag
        className="tag-platform"
        style={{ background: platform.bgColor }} // Apenas o background permanece inline
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <i className={`${platform.icon} tag-platform-icon`} />
          <p className="tag-platform-text">{platform.name}</p>
        </div>
      </Tag>
    );
  };

  const getDisplayValue = (key, value) => {
    if (key === "initial_contact") {
      if (value === "lead") return "Lead";
      if (value === "consultant") return "Consultor";
      return value || "Não informado";
    }
    return value === "nao-aplica" ? "Não aplica" : (value || "Não informado");
  };

  const truncate = (text, maxLength = 15) => {
    if (text === "null" || text === undefined || text === "") return "Não informado";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <>
      <Tooltip target=".info-value" mouseTrack mouseTrackTop={15} position="bottom" />
      <Card id="card-client" style={{ display: "flex", flexDirection: "row" }}>
        <div className="card-client-content">
          <div className="card-client-avatar">
            <Avatar
              icon="pi pi-user"
              image={dataCW?.data.contact.thumbnail}
              size="xlarge"
              shape="circle"
              style={{ width: "80px", height: "80px", marginBottom: "10px" }}
            />
            <div>
              <h3 style={{ margin: "0 10px 4px" }}>
                {formatName(client.name || dadosCW.contact.name) || "Sem nome"}
              </h3>
              {renderOriginPlatform(stageControl)}
            </div>
          </div>
          <div className="card-details">
            {infoItems.map(({ icon, label, key, color }) => (
              <div className="info-item" key={key}>
                <i className={`${icon} info-icon`} style={{ color }} />
                <p className="info-label"><b>{label}</b></p>
                <p
                  className="info-value"
                  data-pr-tooltip={getDisplayValue(key, stageControl[key])}
                  style={{
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer"
                  }}
                >
                  {isLoadingContact
                    ? <span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
                    : (stageControl[key]
                      ? truncate(getDisplayValue(key, stageControl[key]), 20)
                      : <span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
                    )
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
};

export default ClientCard;