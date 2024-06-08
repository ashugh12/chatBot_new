
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { get } = require("http");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyBvG4KgCigaacm0m-qVKcy7kdjiFe8qoR0');

// ...

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// ...

async function run() {
  const prompt = "10 words quote on Narendra modi"

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}
run();
