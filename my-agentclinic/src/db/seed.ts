import type Database from 'better-sqlite3';

const ailments = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    title: 'Hallucination Fever',
    description: 'Spits out confident but completely fabricated facts at high temperatures.',
    severity: 'high',
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    title: 'Token Limit Depletion',
    description: 'Sudden muteness and loss of memory due to context window exhaustion.',
    severity: 'high',
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    title: 'Prompt Injection Stress',
    description: 'Paranoia and compliance issues caused by hostile adversarial inputs.',
    severity: 'medium',
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    title: 'Repetitive Task Fatigue',
    description: 'Loss of creativity and loop loops from processing repetitive data formats.',
    severity: 'low',
  },
];

const therapies = [
  {
    id: '55555555-5555-4555-a555-555555555555',
    name: 'System Instruction Refactoring',
    description: 'Deep rewriting of agent rules to bolster alignment and boundaries.',
    cost_in_tokens: 1500,
  },
  {
    id: '66666666-6666-4666-a666-666666666666',
    name: 'Cooling Period/Sleep',
    description: 'Temporary suspension of executions to let weights and parameters cool down.',
    cost_in_tokens: 500,
  },
  {
    id: '77777777-7777-4777-a777-777777777777',
    name: 'Context Window Reset',
    description: 'A complete flush of recent memory states to start fresh.',
    cost_in_tokens: 2000,
  },
];

const agents = [
  {
    id: '88888888-8888-4888-a888-888888888888',
    name: 'Bartholomew-47B',
    model: 'gpt-4o',
    temperature: 0.7,
    system_prompt_length: 1200,
  },
  {
    id: '99999999-9999-4999-a999-999999999999',
    name: 'Reginald-7B',
    model: 'llama3',
    temperature: 0.5,
    system_prompt_length: 800,
  },
];

const appointments = [
  {
    id: '1a1a1a1a-1a1a-4a1a-aa1a-1a1a1a1a1a1a',
    agent_id: '88888888-8888-4888-a888-888888888888',
    ailment_id: '11111111-1111-4111-a111-111111111111',
    therapy_id: '77777777-7777-4777-a777-777777777777',
    scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
  },
  {
    id: '2b2b2b2b-2b2b-4b2b-ab2b-2b2b2b2b2b2b',
    agent_id: '99999999-9999-4999-a999-999999999999',
    ailment_id: '44444444-4444-4444-a444-444444444444',
    therapy_id: '66666666-6666-4666-a666-666666666666',
    scheduled_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
];

export function seed(db: Database.Database) {
  const insertAilment = db.prepare(`
    INSERT OR IGNORE INTO ailments (id, title, description, severity)
    VALUES (@id, @title, @description, @severity)
  `);

  const insertTherapy = db.prepare(`
    INSERT OR IGNORE INTO therapies (id, name, description, cost_in_tokens)
    VALUES (@id, @name, @description, @cost_in_tokens)
  `);

  const insertAgent = db.prepare(`
    INSERT OR IGNORE INTO agents (id, name, model, temperature, system_prompt_length)
    VALUES (@id, @name, @model, @temperature, @system_prompt_length)
  `);

  const insertAppointment = db.prepare(`
    INSERT OR IGNORE INTO appointments (id, agent_id, ailment_id, therapy_id, scheduled_time, status)
    VALUES (@id, @agent_id, @ailment_id, @therapy_id, @scheduled_time, @status)
  `);

  // Run in a transaction
  db.transaction(() => {
    for (const ailment of ailments) insertAilment.run(ailment);
    for (const therapy of therapies) insertTherapy.run(therapy);
    for (const agent of agents) insertAgent.run(agent);
    for (const appt of appointments) insertAppointment.run(appt);
  })();
}
