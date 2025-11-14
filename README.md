# AI Chatbot with Memory & Chain-of-Thought Reasoning

A TypeScript project that implements intelligent chatbots with persistent conversation memory and explicit chain-of-thought reasoning. Built with LangChain and Gemini 2.5 Flash API.

## Features

- **Conversational Memory**: In-memory storage of conversation history with configurable context windows
- **Chain-of-Thought Reasoning**: Multi-step reasoning for complex problems with visible thinking process
- **Gemini 2.5 Flash Integration**: Uses Google's fast and efficient Gemini model via free API
- **LangChain Framework**: Leverages LangChain's powerful chain and prompt management
- **Flexible Architecture**: Easy to customize system prompts and create specialized domain chatbots
- **TypeScript**: Full type safety and excellent developer experience

## Project Structure

```
mini-project/
├── src/
│   ├── core/                    # Core AI components
│   │   ├── ConversationMemory.ts  # In-memory message storage
│   │   ├── ChainOfThoughtReasoner.ts # Reasoning engine
│   │   └── index.ts
│   ├── chatbot/                 # Chatbot implementation
│   │   ├── IntelligentChatbot.ts   # Main chatbot class
│   │   └── index.ts
│   └── tools/                   # Utilities
│       ├── config.ts            # Configuration management
│       └── index.ts
├── examples/
│   ├── 01-basic-chatbot.ts      # Simple conversational chatbot
│   ├── 02-reasoning-chatbot.ts  # Chatbot with reasoning
│   └── 03-code-assistant.ts     # Specialized code assistant
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Gemini API key (get free at https://aistudio.google.com)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Yassine2606/ai-chatbot-memory-reasoning.git
cd ai-chatbot-memory-reasoning
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`
```env
GEMINI_API_KEY=your_api_key_here
NODE_ENV=development
```

## Usage

Run the examples:

- `npx ts-node examples/01-basic-chatbot.ts` - Simple multi-turn conversation
- `npx ts-node examples/02-reasoning-chatbot.ts` - Chatbot with chain-of-thought reasoning
- `npx ts-node examples/03-code-assistant.ts` - Specialized code assistant

## Core Components

- **ConversationMemory** - Manages conversation history with configurable context windows and message limits
- **ChainOfThoughtReasoner** - Performs multi-step reasoning for complex problems using Gemini's reasoning API
- **IntelligentChatbot** - Main class that combines memory and reasoning for intelligent conversations

## How It Works

**Chain-of-Thought Reasoning** - The chatbot can think step-by-step before answering complex questions, showing its reasoning process for improved transparency and accuracy.

**Conversation Memory** - Recent messages are kept in context to maintain coherent multi-turn conversations.

**Flow**: User Message → Memory Storage → Complexity Check → Reasoning (if needed) → Response → Memory Update

## Examples Explained

### Example 1: Basic Chatbot
- Demonstrates simple multi-turn conversation
- Shows how memory maintains context across turns
- Implements a general-purpose assistant

### Example 2: Reasoning Chatbot
- Shows chain-of-thought reasoning in action
- Demonstrates how reasoning is triggered for complex questions
- Displays thinking process and execution time

### Example 3: Code Assistant
- Creates a specialized chatbot for code help
- Shows custom system prompts
- Demonstrates memory statistics and context management

## Configuration

When creating an `IntelligentChatbot` instance, you can configure:
- `apiKey` - Your Gemini API key
- `temperature` - Response randomness (0-1)
- `contextWindow` - Number of recent messages to keep (default: 10)
- `useReasoningForComplexQueries` - Enable chain-of-thought reasoning (default: false)
- `systemPrompt` - Custom system instructions

## API Reference

See the source files in `src/` for detailed method documentation:
- `src/chatbot/IntelligentChatbot.ts`
- `src/core/ConversationMemory.ts`
- `src/core/ChainOfThoughtReasoner.ts`

## Troubleshooting

- **GEMINI_API_KEY is required** - Make sure `.env` file exists and contains your API key from https://aistudio.google.com
- **API Rate Limiting** - Free tier has limits; add delays between requests if needed
- **TypeScript Errors** - Run `npm install` and verify `tsconfig.json` is configured properly

## Contributing

Feel free to extend this project:
- Add new specialized chatbots
- Implement persistent storage (SQLite, MongoDB)
- Add support for other LLM providers
- Implement advanced reasoning patterns
- Add web UI with Express/Next.js
