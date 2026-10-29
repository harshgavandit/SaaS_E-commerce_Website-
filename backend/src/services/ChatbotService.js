require("dotenv").config();
const ProductService = require("./ProductService");

async function createGeminiClient() {
  if (!process.env.GEMINI_API_KEY) throw new Error("The AI service is not configured.");
  const { GoogleGenAI } = await import("@google/genai");
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { timeout: 30000 } });
}

class ChatboatService {
  constructor({ clientFactory = createGeminiClient, products = ProductService } = {}) {
    this.clientFactory = clientFactory;
    this.products = products;
  }

  async chatService(contents) {
    const ai = await this.clientFactory();
    const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        maxOutputTokens: 1200,
        ...(/^gemini-3\./.test(model) ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
      },
    });
    const text = response.text?.trim();
    if (!text) throw new Error("The AI service returned an empty answer.");
    return text;
  }

  async askProductQuestion(productId, userQuestion) {
    try {
      const product = await this.products.findProductById(productId);
      if (!product) {
        return "Sorry, the product you're asking about does not exist.";
      }

      const productDetails = JSON.stringify(product);

      const prompt = `
        You are an eCommerce assistant. 
        Answer the customer's question based only on the product details below.

        --- PRODUCT DETAILS ---
        ${productDetails}
        -----------------------

        Question: ${userQuestion}
        Answer:
      `;

      const contents = [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ];

      return await this.chatService(contents);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChatboatService();
module.exports.ChatboatService = ChatboatService;
