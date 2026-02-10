import { Agent } from './Agent';
import { Message, MessageType, AgentStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ManagerAgent extends Agent {
  private workers: string[] = [];

  public assignWorker(workerId: string): void {
    if (!this.workers.includes(workerId)) {
      this.workers.push(workerId);
      console.log(`[${this.config.name}] Assigned worker: ${workerId}`);
    }
  }

  protected async handleTask(message: Message): Promise<void> {
    this.status = AgentStatus.WORKING;
    console.log(`[${this.config.name}] Processing task: ${message.content}`);

    const taskAnalysis = await this.getLLMResponse(
      `As a manager, analyze this task and break it down into subtasks: ${message.content}`
    );

    console.log(`[${this.config.name}] Task analysis: ${taskAnalysis}`);

    if (this.workers.length > 0) {
      const workerId = this.workers[0];
      this.collaboration.sendMessage(
        this.config.id,
        workerId,
        MessageType.TASK,
        taskAnalysis,
        { originalTask: message.content }
      );
      console.log(`[${this.config.name}] Delegated task to worker: ${workerId}`);
    } else {
      console.log(`[${this.config.name}] No workers available to delegate task`);
    }

    this.status = AgentStatus.WAITING;
  }

  protected async handleQuestion(message: Message): Promise<void> {
    console.log(`[${this.config.name}] Answering question: ${message.content}`);

    const answer = await this.getLLMResponse(
      `As a manager, answer this question from a team member: ${message.content}`
    );

    this.collaboration.sendMessage(
      this.config.id,
      message.from,
      MessageType.RESPONSE,
      answer
    );
  }

  protected async handleResponse(message: Message): Promise<void> {
    console.log(`[${this.config.name}] Received response: ${message.content}`);
    
    this.collaboration.sendMessage(
      this.config.id,
      'system',
      MessageType.STATUS_UPDATE,
      `Task completed: ${message.content}`
    );
    
    this.status = AgentStatus.COMPLETED;
  }

  public async delegateTask(taskDescription: string): Promise<void> {
    const message: Message = {
      id: uuidv4(),
      type: MessageType.TASK,
      from: 'system',
      to: this.config.id,
      content: taskDescription,
      timestamp: new Date()
    };

    await this.handleTask(message);
  }
}
