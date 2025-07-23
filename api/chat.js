// api/chat.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = "2025-01-01-preview";
  
    try {
      const azureResponse = await fetch(
        `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
          body: JSON.stringify(req.body),
        }
      );
  
      const data = await azureResponse.json();
      res.status(azureResponse.status).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
  