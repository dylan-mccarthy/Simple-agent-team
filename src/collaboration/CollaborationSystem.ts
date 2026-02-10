import { EventEmitter } from 'events';
import { Message, MessageType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CollaborationSystem extends EventEmitter {
  private messageHistory: Message[] = [];
  private messageQueues: Map<string, Message[]> = new Map();

  constructor() {
    super();
  }

  sendMessage(
    from: string,
    to: string,
    type: MessageType,
    content: string,
    metadata?: Record<string, any>
  ): Message {
    const message: Message = {
      id: uuidv4(),
      type,
      from,
      to,
      content,
      timestamp: new Date(),
      metadata
    };

    this.messageHistory.push(message);
    
    if (!this.messageQueues.has(to)) {
      this.messageQueues.set(to, []);
    }
    this.messageQueues.get(to)!.push(message);

    this.emit('message', message);
    this.emit(`message:${to}`, message);

    console.log(`[Collaboration] Message sent from ${from} to ${to}: ${type}`);
    
    return message;
  }

  getMessagesForAgent(agentId: string): Message[] {
    return this.messageQueues.get(agentId) || [];
  }

  clearMessagesForAgent(agentId: string): void {
    this.messageQueues.set(agentId, []);
  }

  getMessageHistory(limit?: number): Message[] {
    if (limit) {
      return this.messageHistory.slice(-limit);
    }
    return [...this.messageHistory];
  }

  broadcast(from: string, type: MessageType, content: string): void {
    this.emit('broadcast', { from, type, content, timestamp: new Date() });
    console.log(`[Collaboration] Broadcast from ${from}: ${content}`);
  }
}
