export default async function handler(req, res) {
  const { protocolo } = req.query;

  // Verifica se o número do protocolo foi passado
  if (!protocolo) {
    return res.status(400).json({ error: "Número do ticket não informado." });
  }

  const token = process.env.MOVIDESK_TOKEN; // Token vindo das variáveis de ambiente

  const url = `https://api.movidesk.com/public/v1/tickets?token=${token}&$filter=id eq ${protocolo}&$select=id,slaSolutionDate,subject,createdDate,resolvedIn,status`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Erro ao consultar a API Movidesk." });
    }

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: "Ticket não encontrado." });
    }

    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Erro ao consultar os dados via API: ", err);
    return res.status(500).json({ error: "Erro ao consultar os dados via API." });
  }
}
