import OpenAI from 'openai';
import { AgentConfig, AgentRole, AgentState, AgentStatus, Message, MessageType, Task } from '../types';
import { CollaborationSystem } from '../collaboration/CollaborationSystem';
import { v4 as uuidv4 } from 'uuid';

export abstract class Agent {
  protected config: AgentConfig;
  protected status: AgentStatus = AgentStatus.IDLE;
  protected currentTask?: Task;
  protected collaboration: CollaborationSystem;
  protected openai: OpenAI;

  constructor(config: AgentConfig, collaboration: CollaborationSystem, openai: OpenAI) {
    this.config = config;
    this.collaboration = collaboration;
    this.openai = openai;

    this.collaboration.on(`message:${this.config.id}`, (message: Message) => {
      this.handleMessage(message);
    });
  }

  protected async handleMessage(message: Message): Promise<void> {
    console.log(`[${this.config.name}] Received message: ${message.type} from ${message.from}`);
    
    switch (message.type) {
      case MessageType.TASK:
        await this.handleTask(message);
        break;
      case MessageType.QUESTION:
        await this.handleQuestion(message);
        break;
      case MessageType.RESPONSE:
        await this.handleResponse(message);
        break;
      default:
        console.log(`[${this.config.name}] Unknown message type: ${message.type}`);
    }
  }

  protected abstract handleTask(message: Message): Promise<void>;
  protected abstract handleQuestion(message: Message): Promise<void>;
  protected abstract handleResponse(message: Message): Promise<void>;

  protected async getLLMResponse(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: this.config.systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0].message.content || 'No response generated';
    } catch (error) {
      console.error(`[${this.config.name}] LLM Error:`, error);
      return 'Error generating response';
    }
  }

  public getState(): AgentState {
    return {
      id: this.config.id,
      name: this.config.name,
      role: this.config.role,
      status: this.status,
      currentTask: this.currentTask,
      messageQueue: this.collaboration.getMessagesForAgent(this.config.id)
    };
  }

  public getId(): string {
    return this.config.id;
  }

  public getName(): string {
    return this.config.name;
  }

  public getRole(): AgentRole {
    return this.config.role;
  }
}
