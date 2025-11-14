/**
 * ChainOfThoughtReasoner
 * Implements chain-of-thought reasoning pattern using LangChain
 * Shows step-by-step reasoning to solve complex problems
 */

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export interface ReasoningStep {
  stepNumber: number;
  thought: string;
  action: string;
}

export interface ReasoningResult {
  thinking: string;
  finalAnswer: string;
  steps: ReasoningStep[];
  executionTime: number;
}

export interface ReasonerConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  verbose?: boolean;
}

export class ChainOfThoughtReasoner {
  private model: ChatGoogleGenerativeAI;
  private verbose: boolean;

  constructor(config: ReasonerConfig) {
    if (!config.apiKey) {
      throw new Error("GEMINI_API_KEY is required");
    }

    this.model = new ChatGoogleGenerativeAI({
      apiKey: config.apiKey,
      model: config.model || "gemini-2.5-flash",
      temperature: config.temperature || 0.7,
    });

    this.verbose = config.verbose || false;
  }

  /**
   * Reason about a problem using chain-of-thought prompting
   */
  async reason(problem: string): Promise<ReasoningResult> {
    const startTime = Date.now();

    try {
      // Create chain-of-thought prompt
      const cotPrompt = PromptTemplate.fromTemplate(`
You are a thoughtful AI assistant. When solving problems, think through them step-by-step.

Format your response as follows:
THINKING:
[Show your step-by-step reasoning here. Break down the problem, consider different angles, explain your logic.]

FINAL ANSWER:
[Provide your clear, concise final answer based on your reasoning above.]

Problem: {problem}
`);

      // Create the chain
      const chain = RunnableSequence.from([
        cotPrompt,
        this.model,
      ]);

      // Execute reasoning
      const response = await chain.invoke({ problem });

      // Parse response
      const responseText =
        typeof response.content === "string"
          ? response.content
          : response.content
              .map((block: any) => block.text || "")
              .join("");

      const result = this.parseResponse(responseText, problem);

      if (this.verbose) {
        console.log("=== Chain of Thought Reasoning ===");
        console.log("Problem:", problem);
        console.log("---");
        console.log("Thinking:", result.thinking);
        console.log("---");
        console.log("Final Answer:", result.finalAnswer);
        console.log("===================================\n");
      }

      result.executionTime = Date.now() - startTime;
      return result;
    } catch (error) {
      throw new Error(
        `Reasoning failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Parse the response to extract thinking and final answer
   */
  private parseResponse(response: string, problem: string): ReasoningResult {
    const thinkingMatch = response.match(
      /THINKING:\s*([\s\S]*?)(?=FINAL ANSWER:|$)/i
    );
    const answerMatch = response.match(
      /FINAL ANSWER:\s*([\s\S]*?)(?:$)/i
    );

    const thinking = thinkingMatch
      ? thinkingMatch[1].trim()
      : "No explicit thinking provided";
    const finalAnswer = answerMatch
      ? answerMatch[1].trim()
      : response.trim();

    // Extract reasoning steps from thinking
    const steps = this.extractSteps(thinking);

    return {
      thinking,
      finalAnswer,
      steps,
      executionTime: 0,
    };
  }

  /**
   * Extract numbered steps from thinking section
   */
  private extractSteps(thinking: string): ReasoningStep[] {
    const steps: ReasoningStep[] = [];
    const lines = thinking.split("\n");
    let stepNum = 1;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 0) {
        steps.push({
          stepNumber: stepNum++,
          thought: trimmed,
          action: "consider",
        });
      }
    }

    return steps;
  }

  /**
   * Reason with conversation context
   */
  async reasonWithContext(
    problem: string,
    context: string
  ): Promise<ReasoningResult> {
    const contextualProblem = `
Context from conversation:
${context}

Current problem: ${problem}
`;

    return this.reason(contextualProblem);
  }
}
