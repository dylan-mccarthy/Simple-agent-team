# Simple Agent Team 🤖

A collaborative multi-agent system built with Node.js and TypeScript, featuring LLM-backed agents with different personas, an inter-agent collaboration system, and a real-time dashboard.

## Features

- **Agent Runner**: Manages LLM-backed agents with different personas (Manager, Planner, Worker)
- **Collaboration System**: Message-based communication allowing agents to collaborate, delegate tasks, and ask questions
- **Real-time Dashboard**: Web-based UI showing running agents and collaboration logs with WebSocket support

## Architecture

### Components

1. **Agent Runner** (`src/agents/`)
   - Base Agent class with LLM integration (GitHub Models)
   - ManagerAgent: Breaks down tasks and delegates to workers
   - PlannerAgent: Creates detailed plans and strategies
   - WorkerAgent: Executes tasks and can ask questions to managers

2. **Collaboration System** (`src/collaboration/`)
   - Event-driven message bus for agent communication
   - Message types: Task, Question, Response, Status Update
   - Message history and per-agent queues

3. **Dashboard** (`src/dashboard/`)
   - Express.js REST API for agent and message data
   - WebSocket server for real-time updates
   - Web interface displaying agent status and collaboration logs

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key
```

## Configuration

Create a `.env` file with your GitHub personal access token:

```env
GITHUB_TOKEN=your_github_personal_access_token_here
DASHBOARD_PORT=3000
```

To get a GitHub token:
1. Go to https://github.com/settings/tokens
2. Choose either:
   - **Fine-grained token**: Click "Generate new token (fine-grained)" and enable the "models:read" permission
   - **Classic token**: Click "Generate new token (classic)" - no specific scope required
3. Copy the token and add it to your `.env` file

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
# Build the project
npm run build

# Run the compiled code
npm start
```

### Accessing the Dashboard

Once the system is running, open your browser to:
- **Dashboard**: http://localhost:3000

The dashboard displays:
- List of running agents with their current status
- Real-time collaboration logs showing messages between agents
- Color-coded agent roles and message types

## Agent Personas

### Manager Agent
- **Role**: Coordinates team activities
- **Capabilities**: 
  - Breaks down complex tasks into subtasks
  - Delegates work to worker agents
  - Answers questions from team members

### Planner Agent
- **Role**: Strategic planning and analysis
- **Capabilities**:
  - Creates detailed step-by-step plans
  - Analyzes tasks and provides guidance
  - Answers planning-related questions

### Worker Agent
- **Role**: Executes assigned tasks
- **Capabilities**:
  - Performs specific work assignments
  - Asks questions to managers when clarification is needed
  - Reports task completion

## Example Workflow

1. System starts with configured agents (Manager, Planner, Workers)
2. Manager receives a high-level task
3. Manager analyzes and breaks down the task using LLM
4. Manager delegates subtasks to worker agents
5. Workers execute tasks and can ask questions back to the manager
6. All communication is logged and visible in the dashboard
7. Real-time updates show agent status and message flow

## API Endpoints

- `GET /api/agents` - List all agents and their states
- `GET /api/messages` - Get collaboration message history (supports `?limit=N`)
- `GET /api/messages/:agentId` - Get messages for a specific agent
- `GET /api/health` - Health check endpoint

## WebSocket Events

The dashboard WebSocket provides real-time updates:
- `message` - New collaboration message between agents
- `broadcast` - System-wide announcements
- `connected` - Connection confirmation

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **LLM**: GitHub Models (gpt-4o-mini)
- **Web Framework**: Express.js
- **WebSocket**: ws library
- **Frontend**: Vanilla HTML/CSS/JavaScript

## Project Structure

```
Simple-agent-team/
├── src/
│   ├── agents/           # Agent implementations
│   │   ├── Agent.ts      # Base agent class
│   │   ├── AgentRunner.ts
│   │   ├── ManagerAgent.ts
│   │   ├── PlannerAgent.ts
│   │   └── WorkerAgent.ts
│   ├── collaboration/    # Communication system
│   │   └── CollaborationSystem.ts
│   ├── dashboard/        # Web dashboard
│   │   └── Dashboard.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts          # Main entry point
├── public/               # Static web files
│   └── index.html        # Dashboard UI
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies
└── .env.example          # Environment variables template
```

## Development

### Building

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Running

```bash
npm start
```

Runs the compiled application.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.