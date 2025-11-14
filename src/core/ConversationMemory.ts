/**
 * ConversationMemory
 * Manages conversation history with in-memory storage
 * Supports context windowing to keep recent messages in focus
 */

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface MemoryConfig {
  maxMessages?: number; // Maximum messages to keep in memory (0 = unlimited)
  contextWindow?: number; // Number of recent messages to use as context
}

export class ConversationMemory {
  private messages: Message[] = [];
  private maxMessages: number;
  private contextWindow: number;

  constructor(config: MemoryConfig = {}) {
    this.maxMessages = config.maxMessages || 0;
    this.contextWindow = config.contextWindow || 10;
  }

  /**
   * Add a message to conversation history
   */
  addMessage(
    role: "user" | "assistant" | "system",
    content: string,
    metadata?: Record<string, any>
  ): void {
    const message: Message = {
      role,
      content,
      timestamp: new Date(),
      metadata,
    };

    this.messages.push(message);

    // Enforce max message limit if set
    if (this.maxMessages > 0 && this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  }

  /**
   * Get context window (recent messages for LLM)
   */
  getContextWindow(): Message[] {
    if (this.messages.length <= this.contextWindow) {
      return this.messages;
    }
    return this.messages.slice(-this.contextWindow);
  }

  /**
   * Get all messages in memory
   */
  getAllMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Clear all conversation history
   */
  clear(): void {
    this.messages = [];
  }

  /**
   * Get conversation summary (for context injection)
   */
  getSummary(): string {
    const context = this.getContextWindow();
    return context
      .map(
        (msg) =>
          `[${msg.role.toUpperCase()}]: ${msg.content}`
      )
      .join("\n");
  }

  /**
   * Get message count
   */
  getMessageCount(): number {
    return this.messages.length;
  }

  /**
   * Get last N messages
   */
  getLastMessages(n: number): Message[] {
    if (n <= 0) return [];
    return this.messages.slice(-n);
  }

  /**
   * Update context window size
   */
  setContextWindow(size: number): void {
    this.contextWindow = Math.max(1, size);
  }
}
