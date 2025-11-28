// /pages/api/save-sales.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }
  
    try {
      const response = await fetch(process.env.WEBHOOK_SALES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`, // Token seguro (sem NEXT_PUBLIC_)
        },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: "Erro ao salvar venda: " + error.message });
    }
  }
  