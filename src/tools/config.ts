/**
 * Configuration utilities
 */

import dotenv from "dotenv";
import path from "path";

export interface AppConfig {
  geminiApiKey: string;
  nodeEnv: string;
  model: string;
}

/**
 * Load environment variables from .env file
 */
export function loadEnv(): void {
  const envPath = path.join(process.cwd(), ".env");
  dotenv.config({ path: envPath });
}

/**
 * Get application configuration
 */
export function getConfig(): AppConfig {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. Please create a .env file with your API key."
    );
  }

  return {
    geminiApiKey,
    nodeEnv: process.env.NODE_ENV || "development",
    model: "gemini-2.5-flash",
  };
}
