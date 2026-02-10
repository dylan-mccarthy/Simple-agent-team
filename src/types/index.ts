export enum AgentRole {
  MANAGER = 'manager',
  PLANNER = 'planner',
  WORKER = 'worker'
}

export enum MessageType {
  TASK = 'task',
  QUESTION = 'question',
  RESPONSE = 'response',
  STATUS_UPDATE = 'status_update'
}

export enum AgentStatus {
  IDLE = 'idle',
  WORKING = 'working',
  WAITING = 'waiting',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export interface Message {
  id: string;
  type: MessageType;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentConfig {
  id: string;
  name: string;
  role: AgentRole;
  persona: string;
  systemPrompt: string;
}

export interface Task {
  id: string;
  description: string;
  assignedTo?: string;
  status: AgentStatus;
  result?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface AgentState {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  currentTask?: Task;
  messageQueue: Message[];
}
