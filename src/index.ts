import dotenv from 'dotenv';
import { AgentRunner } from './agents/AgentRunner';
import { Dashboard } from './dashboard/Dashboard';
import { AgentRole } from './types';
import { ManagerAgent } from './agents/ManagerAgent';

dotenv.config();

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY environment variable is required');
    console.log('Please create a .env file with your OpenAI API key:');
    console.log('OPENAI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  console.log('🚀 Starting Agent Team System...\n');

  const agentRunner = new AgentRunner(apiKey);

  const manager = agentRunner.createAgent({
    id: 'manager-1',
    name: 'Project Manager Alice',
    role: AgentRole.MANAGER,
    persona: 'experienced project manager',
    systemPrompt: 'You are an experienced project manager. Break down tasks, delegate to team members, and coordinate work effectively.'
  });

  const planner = agentRunner.createAgent({
    id: 'planner-1',
    name: 'Strategic Planner Bob',
    role: AgentRole.PLANNER,
    persona: 'strategic planner',
    systemPrompt: 'You are a strategic planner. Create detailed, step-by-step plans for tasks and answer planning-related questions.'
  });

  const worker1 = agentRunner.createAgent({
    id: 'worker-1',
    name: 'Developer Charlie',
    role: AgentRole.WORKER,
    persona: 'software developer',
    systemPrompt: 'You are a skilled software developer. Execute tasks assigned to you and ask questions when you need clarification.'
  });

  const worker2 = agentRunner.createAgent({
    id: 'worker-2',
    name: 'Designer Diana',
    role: AgentRole.WORKER,
    persona: 'UI/UX designer',
    systemPrompt: 'You are a creative UI/UX designer. Execute design tasks and collaborate with the team.'
  });

  agentRunner.assignWorkerToManager('manager-1', 'worker-1');
  agentRunner.assignWorkerToManager('manager-1', 'worker-2');

  const dashboard = new Dashboard(agentRunner, 3000);
  dashboard.start();

  console.log('\n✅ Agent Team System is running!');
  console.log('📊 Dashboard: http://localhost:3000');
  console.log('\nAgents created:');
  agentRunner.getAllAgents().forEach(agent => {
    console.log(`  - ${agent.getName()} (${agent.getRole()})`);
  });

  console.log('\n📝 Starting demo task...\n');

  await new Promise(resolve => setTimeout(resolve, 2000));

  if (manager instanceof ManagerAgent) {
    await manager.delegateTask('Build a new user authentication system with login and registration');
  }

  console.log('\n💡 The system is now running. Check the dashboard to see agent collaboration!');
  console.log('Press Ctrl+C to stop the system.\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
