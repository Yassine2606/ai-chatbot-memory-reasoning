/**
 * IntelligentChatbot
 * Main chatbot class integrating memory and chain-of-thought reasoning
 * Provides conversational AI with persistent context and multi-step reasoning
 */

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ConversationMemory, Message } from "../core/ConversationMemory.js";
import {
  ChainOfThoughtReasoner,
  ReasoningResult,
} from "../core/ChainOfThoughtReasoner.js";

export interface ChatbotConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  contextWindow?: number;
  maxMemoryMessages?: number;
  useReasoningForComplexQueries?: boolean;
  systemPrompt?: string;
}

export interface ChatResponse {
  message: string;
  reasoning?: ReasoningResult;
  conversationTurns: number;
  timestamp: Date;
}

export class IntelligentChatbot {
  private model: ChatGoogleGenerativeAI;
  private memory: ConversationMemory;
  private reasoner: ChainOfThoughtReasoner;
  private systemPrompt: string;
  private useReasoningForComplex: boolean;

  constructor(config: ChatbotConfig) {
    if (!config.apiKey) {
      throw new Error("GEMINI_API_KEY is required");
    }

    this.model = new ChatGoogleGenerativeAI({
      apiKey: config.apiKey,
      model: config.model || "gemini-2.5-flash",
      temperature: config.temperature || 0.7,
    });

    this.memory = new ConversationMemory({
      contextWindow: config.contextWindow || 10,
      maxMessages: config.maxMemoryMessages || 0,
    });

    this.reasoner = new ChainOfThoughtReasoner({
      apiKey: config.apiKey,
      model: config.model || "gemini-2.5-flash",
    });

    this.systemPrompt =
      config.systemPrompt ||
      "You are a helpful, thoughtful assistant. Provide clear and accurate responses. Use the conversation history to maintain context and consistency.";

    this.useReasoningForComplex =
      config.useReasoningForComplexQueries || false;
  }

  /**
   * Send a message to the chatbot and get response
   */
  async chat(userMessage: string): Promise<ChatResponse> {
    try {
      // Add user message to memory
      this.memory.addMessage("user", userMessage);

      // Check if reasoning is needed for complex queries
      const needsReasoning =
        this.useReasoningForComplex &&
        this.isComplexQuery(userMessage);

      let reasoning: ReasoningResult | undefined;

      if (needsReasoning) {
        // Use chain-of-thought reasoning
        const contextSummary = this.memory.getSummary();
        reasoning = await this.reasoner.reasonWithContext(
          userMessage,
          contextSummary
        );

        // Add reasoning to memory
        this.memory.addMessage(
          "assistant",
          `[Reasoning Summary]\n${reasoning.thinking}\n\n[Response]\n${reasoning.finalAnswer}`,
          { reasoning: true }
        );

        return {
          message: reasoning.finalAnswer,
          reasoning,
          conversationTurns: this.memory.getMessageCount(),
          timestamp: new Date(),
        };
      }

      // Standard response generation
      const response = await this.generateResponse(userMessage);

      // Add assistant response to memory
      this.memory.addMessage("assistant", response);

      return {
        message: response,
        conversationTurns: this.memory.getMessageCount(),
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(
        `Chat failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Generate response using LangChain
   */
  private async generateResponse(userMessage: string): Promise<string> {
    // Get conversation context
    const contextWindow = this.memory.getContextWindow();
    const conversationContext = contextWindow
      .map(
        (msg: Message) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    // Create prompt with context
    const promptTemplate = PromptTemplate.fromTemplate(`
{systemPrompt}

Conversation history:
{context}

User: {userMessage}

Respond thoughtfully and maintain conversational context.`);

    // Create the chain
    const chain = RunnableSequence.from([
      promptTemplate,
      this.model,
    ]);

    // Execute
    const response = await chain.invoke({
      systemPrompt: this.systemPrompt,
      context:
        conversationContext || "(No prior context)",
      userMessage,
    });

    // Extract text from response
    return typeof response.content === "string"
      ? response.content
      : response.content
          .map((block: any) => block.text || "")
          .join("");
  }

  /**
   * Detect if query is complex and needs reasoning
   */
  private isComplexQuery(message: string): boolean {
    const complexKeywords = [
      "why",
      "how",
      "analyze",
      "explain",
      "reason",
      "think",
      "solve",
      "problem",
      "complex",
      "difficult",
    ];
    const lowerMessage = message.toLowerCase();
    return complexKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );
  }

  /**
   * Get conversation memory
   */
  getMemory(): ConversationMemory {
    return this.memory;
  }

  /**
   * Clear conversation memory
   */
  clearMemory(): void {
    this.memory.clear();
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): Message[] {
    return this.memory.getAllMessages();
  }

  /**
   * Set custom system prompt
   */
  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }

  /**
   * Enable or disable reasoning for complex queries
   */
  setUseReasoningForComplex(use: boolean): void {
    this.useReasoningForComplex = use;
  }
}