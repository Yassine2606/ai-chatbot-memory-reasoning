/**
 * Example 2: Chatbot with Chain-of-Thought Reasoning
 * Demonstrates multi-step reasoning for complex problems
 */

import { loadEnv, getConfig } from "../src/tools/config.js";
import { IntelligentChatbot } from "../src/chatbot/index.js";

async function main() {
  try {
    // Load environment variables
    loadEnv();
    const config = getConfig();

    console.log("=== Chain-of-Thought Reasoning Example ===\n");

    // Create chatbot with reasoning enabled
    const chatbot = new IntelligentChatbot({
      apiKey: config.geminiApiKey,
      systemPrompt:
        "You are a logical problem solver who thinks through complex problems step-by-step.",
      useReasoningForComplexQueries: true,
    });

    // Complex reasoning questions
    const complexQuestions = [
      "How would you explain why the sky is blue?",
      "What are the steps to solve a complex problem?",
    ];

    console.log(
      "Asking complex questions that trigger chain-of-thought reasoning...\n"
    );

    for (const question of complexQuestions) {
      console.log(`\nUser: ${question}`);
      console.log("Thinking through reasoning steps...\n");

      try {
        const response = await chatbot.chat(question);

        if (response.reasoning) {
          console.log(
            "Thinking Process:"
          );
          console.log(
            response.reasoning.thinking
          );
          console.log("\n---\n");
        }

        console.log(`Final Answer: ${response.message}`);
        console.log(
          `Reasoning time: ${response.reasoning?.executionTime || 0}ms`
        );
      } catch (error) {
        console.error(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  } catch (error) {
    console.error(
      "Setup error:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

main();
