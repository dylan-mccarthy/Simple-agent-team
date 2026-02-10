import OpenAI from 'openai';
import { Agent } from './Agent';
import { ManagerAgent } from './ManagerAgent';
import { PlannerAgent } from './PlannerAgent';
import { WorkerAgent } from './WorkerAgent';
import { CollaborationSystem } from '../collaboration/CollaborationSystem';
import { AgentConfig, AgentRole, AgentState } from '../types';

export class AgentRunner {
  private agents: Map<string, Agent> = new Map();
  private collaboration: CollaborationSystem;
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.collaboration = new CollaborationSystem();
    this.openai = new OpenAI({ apiKey });
  }

  public createAgent(config: AgentConfig): Agent {
    let agent: Agent;

    switch (config.role) {
      case AgentRole.MANAGER:
        agent = new ManagerAgent(config, this.collaboration, this.openai);
        break;
      case AgentRole.PLANNER:
        agent = new PlannerAgent(config, this.collaboration, this.openai);
        break;
      case AgentRole.WORKER:
        agent = new WorkerAgent(config, this.collaboration, this.openai);
        break;
      default:
        throw new Error(`Unknown agent role: ${config.role}`);
    }

    this.agents.set(config.id, agent);
    console.log(`[AgentRunner] Created ${config.role} agent: ${config.name} (${config.id})`);
    
    return agent;
  }

  public getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public getAgentStates(): AgentState[] {
    return this.getAllAgents().map(agent => agent.getState());
  }

  public getCollaboration(): CollaborationSystem {
    return this.collaboration;
  }

  public assignWorkerToManager(managerId: string, workerId: string): void {
    const manager = this.agents.get(managerId);
    const worker = this.agents.get(workerId);

    if (!manager || !(manager instanceof ManagerAgent)) {
      throw new Error(`Manager not found: ${managerId}`);
    }

    if (!worker || !(worker instanceof WorkerAgent)) {
      throw new Error(`Worker not found: ${workerId}`);
    }

    manager.assignWorker(workerId);
    worker.setManager(managerId);
    
    console.log(`[AgentRunner] Assigned worker ${workerId} to manager ${managerId}`);
  }
}
