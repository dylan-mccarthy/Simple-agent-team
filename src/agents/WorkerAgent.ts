import { Agent } from './Agent';
import { Message, MessageType, AgentStatus } from '../types';

export class WorkerAgent extends Agent {
  private managerId?: string;

  public setManager(managerId: string): void {
    this.managerId = managerId;
    console.log(`[${this.config.name}] Manager set: ${managerId}`);
  }

  protected async handleTask(message: Message): Promise<void> {
    this.status = AgentStatus.WORKING;
    console.log(`[${this.config.name}] Working on task: ${message.content}`);

    const result = await this.getLLMResponse(
      `As a worker, execute this task and provide the result: ${message.content}`
    );

    console.log(`[${this.config.name}] Task result: ${result}`);

    this.collaboration.sendMessage(
      this.config.id,
      message.from,
      MessageType.RESPONSE,
      result,
      { taskCompleted: message.content }
    );

    this.status = AgentStatus.COMPLETED;
  }

  protected async handleQuestion(message: Message): Promise<void> {
    console.log(`[${this.config.name}] Received question: ${message.content}`);
    
    const answer = await this.getLLMResponse(
      `As a worker, answer this question: ${message.content}`
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
    this.status = AgentStatus.IDLE;
  }

  public async askManager(question: string): Promise<void> {
    if (!this.managerId) {
      console.log(`[${this.config.name}] No manager assigned to ask questions`);
      return;
    }

    console.log(`[${this.config.name}] Asking manager: ${question}`);
    this.collaboration.sendMessage(
      this.config.id,
      this.managerId,
      MessageType.QUESTION,
      question
    );
  }
}
