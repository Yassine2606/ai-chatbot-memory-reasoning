/**
 * Example 3: Specialized Domain Chatbot
 * A chatbot specialized for a specific domain (Code Assistant)
 */

import { loadEnv, getConfig } from "../src/tools/config.js";
import { IntelligentChatbot } from "../src/chatbot/index.js";

async function main() {
  try {
    // Load environment variables
    loadEnv();
    const config = getConfig();

    console.log("=== Code Assistant Chatbot Example ===\n");

    // Create specialized chatbot for code assistance
    const codeAssistant = new IntelligentChatbot({
      apiKey: config.geminiApiKey,
      systemPrompt: `You are an expert JavaScript/TypeScript code assistant. 
You help developers by:
- Writing clean, efficient code
- Explaining how code works
- Suggesting best practices
- Debugging issues

Always provide code examples when relevant and explain your reasoning.`,
      contextWindow: 8,
      useReasoningForComplexQueries: true,
    });

    // Code-related questions
    const codeQuestions = [
      "What's a good pattern for error handling in async/await?",
      "Can you show me an example?",
      "How does this differ from promises?",
    ];

    console.log(
      "Starting a code assistance conversation...\n"
    );

    for (const question of codeQuestions) {
      console.log(`\nDeveloper: ${question}`);
      console.log("Analyzing...\n");

      try {
        const response = await codeAssistant.chat(
          question
        );

        console.log(`Assistant:\n${response.message}`);
        console.log(
          `\nContext turns: ${response.conversationTurns}`
        );
      } catch (error) {
        console.error(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // Show memory stats
    const memory = codeAssistant.getMemory();
    console.log("\n\n=== Memory Statistics ===");
    console.log(
      `Total messages in memory: ${memory.getMessageCount()}`
    );
    console.log(
      `Context window size: ${memory.getContextWindow().length}`
    );
  } catch (error) {
    console.error(
      "Setup error:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

main();
