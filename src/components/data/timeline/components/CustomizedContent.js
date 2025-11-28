import React from "react";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { RiRobot2Line } from "react-icons/ri";
import { formatDate } from "@/functions/formatters";

const CustomizedContent = ({
  item,
  index,
  departments,
  comercial_stages,
  relationship_stages,
  appointments,
  treatments,
  dadosCW,
  gatilhos,
  events,
}) => {
  let title;
  let icon;

  if (item.department) {
    if (
      item.trigger === "automacao" ||
      item.trigger === "bot_atendimento" ||
      item.trigger === "ia"
    ) {
      icon = (
        <RiRobot2Line
          style={{
            marginRight: index % 2 === 0 ? "8px" : "0px",
            marginLeft: index % 2 !== 0 ? "8px" : "0px",
            marginBottom: "16px",
            borderWidth: "2px",
          }}
        />
      );
    } else if (item.trigger === "macro" || item.trigger === "crm") {
      icon = (
        <i
          className="pi pi-user"
          style={{
            marginRight: index % 2 === 0 ? "8px" : "0px",
            marginLeft: index % 2 !== 0 ? "8px" : "0px",
            marginBottom: "16px",
            borderWidth: "2px",
          }}
        />
      );
    }
    title = (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "-24px",
          justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
          gap: "8px",
        }}
      >
        {index % 2 !== 0 ?
          item.trigger === "follow-up" && (
            <Tag
              className="tag-follow-up"
              style={{ marginBottom: "18px" }}
            >
              <div>
                <p className="tag-follow-up-text">Follow-Up</p>
              </div>
            </Tag>
          )
          : null}
        {index % 2 === 0 ? icon : null}
        <p> {departments[item.department]}</p>
        {index % 2 !== 0 ? icon : null}
        {index % 2 === 0 ?
          item.trigger === "follow-up" && (
            <Tag
              className="tag-follow-up"
              style={{ marginBottom: "18px" }}
            >
              <div>
                <p className="tag-follow-up-text">Follow-Up</p>
              </div>
            </Tag>
          )
          : null}
      </div>
    );
  }

  let subtitle;

  if (item.department === "comercial") {
    subtitle = comercial_stages[item.stage];
  }
  else if (item.department === "relacionamento") {
    subtitle = relationship_stages[item.stage];
    if (
      (item.stage === "agendado" || item.stage === "acompanhamento") &&
      item.service == null
    ) {
      subtitle = "Venda excluída";
    } else if (item.stage === "agendado" || item.stage === "acompanhamento" || item.stage === "em-acompanhamento") {
      subtitle += ` - ${item.service || "Serviço não encontrado"}`;
    }
  }

  return (
    <Card
      className="cardLinha"
      title={title}
      subTitle={
        <div
          style={{
            marginBottom: "24px",
            justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
          }}
        >
          {subtitle || "Etapa não disponível"}
        </div>
      }
      style={{
        marginRight: index % 2 === 0 ? "auto" : "unset",
        marginLeft: index % 2 !== 0 ? "auto" : "unset",
        width: "fitContent",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: index % 2 === 0 ? "flex-end" : "flex-start",
          width: "40%",
          height: "10px",
          position: "absolute",
          top: "25px",
          [index % 2 === 0 ? "right" : "left"]: "20px",
          textAlign: index % 2 === 0 ? "right" : "left",
          marginLeft: index % 2 === 0 ? "auto" : "5px",
          marginRight: index % 2 !== 0 ? "auto" : "5px",
        }}
      >
        {item.conversation_id && (
          <p>
            <a
              title="Abrir conversa no ChatWoot"
              style={{ textDecoration: "none", color: "#1bcba8" }}
              target="_blank"
              href={`https://chat.clientelaila.com.br/app/accounts/${dadosCW.conversation.account_id}/conversations/${item.conversation_id}`}
              rel="noreferrer"
            >
              #{item.conversation_id}
            </a>
          </p>
        )}
      </div>
      {item.agent && (
        <p style={{ marginTop: "-10px" }}>
          <b>Agente:</b> {item.agent}
        </p>
      )}
      {item.date_time && (
        <p>
          <b>Data:</b> {formatDate(item.date_time)}
        </p>
      )}
      <Inplace
        className="detalhes"
        closable
        closeIcon={
          <span className="ver-menos">
            Ver menos
            <i
              style={{ marginLeft: "5px", marginTop: "3px" }}
              className="pi pi-angle-up"
            ></i>
          </span>
        }
      >
        <InplaceDisplay>
          Ver mais <i className="pi pi-angle-down"></i>
        </InplaceDisplay>
        <InplaceContent>
          {item.reason && (
            <p>
              <b>Motivo:</b> {item.reason}
            </p>
          )}
          {item.inbox && (
            <p>
              <b>Canal de entrada:</b>{" "}
              {item.inbox === "nao-informado" ? "Não informado" : item.inbox}
            </p>
          )}
          {item.trigger && (
            <p>
              <b>Gatilho:</b> {gatilhos[item.trigger]}
            </p>
          )}
          {item.follow_up && (
            <p>
              <b>Follow Up:</b> {item.follow_up}
            </p>
          )}
        </InplaceContent>
      </Inplace>
      <div
        style={{
          width: "40%",
          height: "10px",
          position: "relative",
          top: "-21px",
          marginBottom: "-15px",
          textAlign: index % 2 === 0 ? "right" : "left",
          marginLeft: index % 2 === 0 ? "auto" : "5px",
          marginRight: index % 2 !== 0 ? "auto" : "5px",
        }}
      >
        {item.duration && events.length !== index + 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: index % 2 === 0 ? "flex-end" : "flex-start",
            }}
          >
            <i
              className="pi pi-clock"
              style={{ marginTop: "4px", marginRight: "4px" }}
            ></i>
            <p>{item.duration}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CustomizedContent;