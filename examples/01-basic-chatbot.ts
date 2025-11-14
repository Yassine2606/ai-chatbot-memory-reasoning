/**
 * Example 1: Basic Chatbot
 * A simple conversational chatbot with memory
 */

import { loadEnv, getConfig } from "../src/tools/config.js";
import { IntelligentChatbot } from "../src/chatbot/index.js";

async function main() {
  try {
    // Load environment variables
    loadEnv();
    const config = getConfig();

    console.log("=== Basic Chatbot Example ===\n");

    // Create chatbot instance
    const chatbot = new IntelligentChatbot({
      apiKey: config.geminiApiKey,
      systemPrompt:
        "You are a friendly assistant who remembers conversation context and provides helpful answers.",
      contextWindow: 6,
    });

    // Simulate multi-turn conversation
    const userMessages = [
      "Hello! My name is Alice and I'm interested in learning about AI.",
      "Can you explain what machine learning is?",
      "How is that different from deep learning?",
      "What was my name again?",
    ];

    console.log(
      "Starting a 4-turn conversation with memory...\n"
    );

    for (const message of userMessages) {
      console.log(`\nUser: ${message}`);
      console.log("Waiting for response...");

      try {
        const response = await chatbot.chat(message);

        console.log(`\nBot: ${response.message}`);
        console.log(
          `Conversation turns: ${response.conversationTurns}`
        );
      } catch (error) {
        console.error(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // Show full conversation history
    console.log("\n\n=== Full Conversation History ===");
    const history = chatbot.getConversationHistory();
    history.forEach((msg, idx) => {
      console.log(
        `[${idx + 1}] ${msg.role.toUpperCase()}: ${msg.content.substring(0, 50)}...`
      );
    });
  } catch (error) {
    console.error(
      "Setup error:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

main();
