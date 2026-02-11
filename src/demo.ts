import dotenv from 'dotenv';
import { AgentRunner } from './agents/AgentRunner';
import { Dashboard } from './dashboard/Dashboard';
import { AgentRole, MessageType } from './types';
import { ManagerAgent } from './agents/ManagerAgent';
import { WorkerAgent } from './agents/WorkerAgent';

dotenv.config();

async function demo() {
  console.log('🚀 Starting Agent Team Collaboration Demo...\n');

  const apiKey = process.env.GITHUB_TOKEN;
  
  if (!apiKey) {
    console.warn('⚠️  Warning: GITHUB_TOKEN not set. Using placeholder key for demo.');
    console.warn('⚠️  LLM responses will fail, but collaboration system will still work.');
    console.warn('⚠️  Set GITHUB_TOKEN in .env for full LLM functionality.\n');
  }
  
  const agentRunner = new AgentRunner(apiKey || 'demo_key');

  const manager = agentRunner.createAgent({
    id: 'manager-1',
    name: 'Project Manager Alice',
    role: AgentRole.MANAGER,
    persona: 'experienced project manager',
    systemPrompt: 'You are an experienced project manager.'
  });

  const planner = agentRunner.createAgent({
    id: 'planner-1',
    name: 'Strategic Planner Bob',
    role: AgentRole.PLANNER,
    persona: 'strategic planner',
    systemPrompt: 'You are a strategic planner.'
  });

  const worker1 = agentRunner.createAgent({
    id: 'worker-1',
    name: 'Developer Charlie',
    role: AgentRole.WORKER,
    persona: 'software developer',
    systemPrompt: 'You are a skilled software developer.'
  });

  const worker2 = agentRunner.createAgent({
    id: 'worker-2',
    name: 'Designer Diana',
    role: AgentRole.WORKER,
    persona: 'UI/UX designer',
    systemPrompt: 'You are a creative UI/UX designer.'
  });

  agentRunner.assignWorkerToManager('manager-1', 'worker-1');
  agentRunner.assignWorkerToManager('manager-1', 'worker-2');

  const dashboard = new Dashboard(agentRunner, 3000);
  dashboard.start();

  console.log('\n✅ System ready!');
  console.log('📊 Dashboard: http://localhost:3000\n');

  console.log('🎬 Starting collaboration demo...\n');

  const collaboration = agentRunner.getCollaboration();

  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('📝 Manager sends task to Developer...');
  collaboration.sendMessage(
    'manager-1',
    'worker-1',
    MessageType.TASK,
    'Implement user authentication with JWT tokens'
  );

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('📝 Manager sends task to Designer...');
  collaboration.sendMessage(
    'manager-1',
    'worker-2',
    MessageType.TASK,
    'Design the login and registration pages'
  );

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('❓ Developer asks Manager a question...');
  collaboration.sendMessage(
    'worker-1',
    'manager-1',
    MessageType.QUESTION,
    'Should we use refresh tokens for the authentication system?'
  );

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('💬 Manager responds to Developer...');
  collaboration.sendMessage(
    'manager-1',
    'worker-1',
    MessageType.RESPONSE,
    'Yes, please implement refresh tokens for better security'
  );

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('✅ Developer completes task...');
  collaboration.sendMessage(
    'worker-1',
    'manager-1',
    MessageType.RESPONSE,
    'Authentication system implemented with JWT and refresh tokens'
  );

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('✅ Designer completes task...');
  collaboration.sendMessage(
    'worker-2',
    'manager-1',
    MessageType.RESPONSE,
    'Login and registration page designs completed'
  );

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('📊 Final status update...');
  collaboration.sendMessage(
    'manager-1',
    'system',
    MessageType.STATUS_UPDATE,
    'User authentication feature completed successfully!'
  );

  console.log('\n✨ Demo completed! Check the dashboard to see the collaboration logs.\n');
  console.log('💡 System is running. Press Ctrl+C to stop.\n');

  const states = agentRunner.getAgentStates();
  console.log('📊 Current Agent States:');
  states.forEach(state => {
    console.log(`  - ${state.name} (${state.role}): ${state.messageQueue.length} messages in queue`);
  });

  const messages = collaboration.getMessageHistory();
  console.log(`\n📨 Total messages exchanged: ${messages.length}\n`);
}

demo().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
