// consulta.js
export default async function handler(req, res) {
  const { protocolo } = req.query;

  // Verifica se o número do protocolo foi passado
  if (!protocolo) {
    return res.status(400).json({ error: "Número do ticket não informado." });
  }

  //const token = 'fce178e8-7cd7-440e-9f60-7ecec3472c94';
  
  const token = process.env.MOVIDESK_TOKEN; // Obtém o token de um arquivo de ambiente

  // URL da API Movidesk
  const url = `https://api.movidesk.com/public/v1/tickets?token=${token}&$filter=id eq ${protocolo}&$select=id,slaSolutionDate,subject,createdDate,resolvedIn,status`;

  try {
    // Realiza a requisição à API Movidesk
    const response = await fetch(url);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      return res.status(response.status).json({ error: "Erro ao consultar a API Movidesk." });
    }

    // Converte a resposta da API para JSON
    const data = await response.json();

    // Verifica se o ticket foi encontrado
    if (data.length === 0) {
      return res.status(404).json({ error: "Ticket não encontrado." });
    }

    // Retorna os dados do ticket
    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Erro ao consultar a API Movidesk: ", err);
    return res.status(500).json({ error: "Erro ao consultar a API Movidesk." });
  }
}
