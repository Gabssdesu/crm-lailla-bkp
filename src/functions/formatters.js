export const formatBRLCurrency = (value) => {
  if (typeof value !== "number") return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const formatName = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  return words.slice(0, 2).join(" ");
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date
    .toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", " -");
};