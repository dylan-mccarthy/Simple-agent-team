import dotenv from 'dotenv';
import { AgentRunner } from './agents/AgentRunner';
import { Dashboard } from './dashboard/Dashboard';
import { AgentRole } from './types';

dotenv.config();

async function testSystem() {
  console.log('🧪 Testing Agent Team System Structure...\n');

  try {
    const apiKey = process.env.OPENAI_API_KEY || 'test_key';
    const agentRunner = new AgentRunner(apiKey);

    console.log('✅ AgentRunner initialized');

    const manager = agentRunner.createAgent({
      id: 'manager-1',
      name: 'Test Manager',
      role: AgentRole.MANAGER,
      persona: 'test manager',
      systemPrompt: 'You are a test manager.'
    });

    console.log('✅ Manager agent created');

    const planner = agentRunner.createAgent({
      id: 'planner-1',
      name: 'Test Planner',
      role: AgentRole.PLANNER,
      persona: 'test planner',
      systemPrompt: 'You are a test planner.'
    });

    console.log('✅ Planner agent created');

    const worker = agentRunner.createAgent({
      id: 'worker-1',
      name: 'Test Worker',
      role: AgentRole.WORKER,
      persona: 'test worker',
      systemPrompt: 'You are a test worker.'
    });

    console.log('✅ Worker agent created');

    agentRunner.assignWorkerToManager('manager-1', 'worker-1');
    console.log('✅ Worker assigned to manager');

    console.log('\n📊 Testing Dashboard...');
    const dashboard = new Dashboard(agentRunner, 3000);
    
    console.log('✅ Dashboard initialized');
    console.log('\n🎉 All components initialized successfully!');
    console.log('\nStarting dashboard server...');
    
    dashboard.start();
    
    console.log('\n📊 Dashboard: http://localhost:3000');
    console.log('\n🔧 Agent States:');
    const states = agentRunner.getAgentStates();
    states.forEach(state => {
      console.log(`  - ${state.name} (${state.role}): ${state.status}`);
    });

    console.log('\n💡 System is running. Press Ctrl+C to stop.\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSystem();
