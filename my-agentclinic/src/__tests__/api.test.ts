import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { createDb } from '../db/index.js';
import { migrate } from '../db/migrate.js';
import { seed } from '../db/seed.js';
import { apiRouter } from '../routes/api.js';

describe('API Routes Integration Tests', () => {
  const db = createDb(':memory:'); // Use in-memory SQLite for testing
  migrate(db);
  seed(db);

  const app = new Hono();
  app.route('/api', apiRouter(db));

  it('should return a list of ailments on GET /api/ailments', async () => {
    const res = await app.request('/api/ailments');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('title');
  });

  it('should return a list of therapies on GET /api/therapies', async () => {
    const res = await app.request('/api/therapies');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('costInTokens');
  });

  it('should successfully register a new agent on POST /api/agents', async () => {
    const newAgentPayload = {
      name: 'Agent Smith',
      model: 'gpt-4o',
      temperature: 0.9,
      systemPromptLength: 2500,
    };

    const res = await app.request('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgentPayload),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id');
    expect(body.name).toBe('Agent Smith');
  });

  it('should fail registering a new agent with invalid temperature on POST /api/agents', async () => {
    const newAgentPayload = {
      name: 'Agent Smith',
      model: 'gpt-4o',
      temperature: 3.5, // invalid (> 2.0)
      systemPromptLength: 2500,
    };

    const res = await app.request('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgentPayload),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  it('should successfully schedule a new appointment on POST /api/appointments', async () => {
    // Fetch an agent, ailment, and therapy from the test database to use valid UUIDs
    const agents: any = await (await app.request('/api/agents')).json();
    const ailments: any = await (await app.request('/api/ailments')).json();
    const therapies: any = await (await app.request('/api/therapies')).json();

    const apptPayload = {
      agentId: agents[0].id,
      ailmentId: ailments[0].id,
      therapyId: therapies[0].id,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    const res = await app.request('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apptPayload),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id');
    expect(body.status).toBe('pending');
  });

  it('should successfully update status on PATCH /api/appointments/:id', async () => {
    // Get all appointments
    const appointments: any = await (await app.request('/api/appointments')).json();
    const testApptId = appointments[0].id;

    const res = await app.request(`/api/appointments/${testApptId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('completed');
  });
});
