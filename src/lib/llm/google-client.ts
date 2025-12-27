import { LLMConfig } from "@/config/llm-config";

export async function generateWithGoogle(
  config: LLMConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const url = `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `System: ${systemPrompt}\n\nUser: ${userPrompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Google API error: ${response.status}`;

    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error?.message) {
        errorMessage = `Google API Error: ${errorData.error.message}`;
      }
    } catch {
      errorMessage = `Google API Error: ${errorText}`;
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("Google API returned no candidates");
  }

  return data.candidates[0].content.parts[0].text;
}
