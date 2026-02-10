import { Agent } from './Agent';
import { Message, MessageType, AgentStatus } from '../types';

export class PlannerAgent extends Agent {
  protected async handleTask(message: Message): Promise<void> {
    this.status = AgentStatus.WORKING;
    console.log(`[${this.config.name}] Creating plan for: ${message.content}`);

    const plan = await this.getLLMResponse(
      `As a planner, create a detailed step-by-step plan for this task: ${message.content}`
    );

    console.log(`[${this.config.name}] Plan created: ${plan}`);

    this.collaboration.sendMessage(
      this.config.id,
      message.from,
      MessageType.RESPONSE,
      plan,
      { planFor: message.content }
    );

    this.status = AgentStatus.COMPLETED;
  }

  protected async handleQuestion(message: Message): Promise<void> {
    console.log(`[${this.config.name}] Answering planning question: ${message.content}`);

    const answer = await this.getLLMResponse(
      `As a planner, answer this planning-related question: ${message.content}`
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
}
