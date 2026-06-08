import { Hono } from 'hono';
import type Database from 'better-sqlite3';
import { agentSchema, appointmentSchema } from '../schemas/index.js';

export function apiRouter(db: Database.Database) {
  const api = new Hono();

  // GET /api/ailments
  api.get('/ailments', (c) => {
    const ailments = db.prepare('SELECT id, title, description, severity FROM ailments').all();
    return c.json(ailments);
  });

  // GET /api/therapies
  api.get('/therapies', (c) => {
    const therapies = db.prepare('SELECT id, name, description, cost_in_tokens AS costInTokens FROM therapies').all();
    return c.json(therapies);
  });

  // GET /api/agents (helper endpoint to see registered agents)
  api.get('/agents', (c) => {
    const agents = db.prepare('SELECT id, name, model, temperature, system_prompt_length AS systemPromptLength FROM agents').all();
    return c.json(agents);
  });

  // POST /api/agents
  api.post('/agents', async (c) => {
    try {
      const body = await c.req.json();
      const id = crypto.randomUUID();
      // Validate using agentSchema
      const validated = agentSchema.parse({
        id,
        name: body.name,
        model: body.model,
        temperature: Number(body.temperature),
        systemPromptLength: Number(body.systemPromptLength),
      });

      // Insert into db
      db.prepare(`
        INSERT INTO agents (id, name, model, temperature, system_prompt_length)
        VALUES (?, ?, ?, ?, ?)
      `).run(validated.id, validated.name, validated.model, validated.temperature, validated.systemPromptLength);

      return c.json(validated, 201);
    } catch (err: any) {
      return c.json({ error: err.message || 'Invalid agent payload' }, 400);
    }
  });

  // POST /api/appointments
  api.post('/appointments', async (c) => {
    try {
      const body = await c.req.json();
      const id = crypto.randomUUID();

      // Validate using appointmentSchema
      const validated = appointmentSchema.parse({
        id,
        agentId: body.agentId,
        ailmentId: body.ailmentId,
        therapyId: body.therapyId,
        scheduledTime: body.scheduledTime,
        status: body.status || 'pending',
      });

      // Convert Date object or ISO string to ISO string for database
      const scheduledTimeStr = typeof validated.scheduledTime === 'string'
        ? validated.scheduledTime
        : validated.scheduledTime.toISOString();

      // Insert to db
      db.prepare(`
        INSERT INTO appointments (id, agent_id, ailment_id, therapy_id, scheduled_time, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        validated.id,
        validated.agentId,
        validated.ailmentId,
        validated.therapyId,
        scheduledTimeStr,
        validated.status
      );

      return c.json(validated, 201);
    } catch (err: any) {
      if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
        return c.json({ error: 'Referenced agent, ailment, or therapy does not exist.' }, 400);
      }
      return c.json({ error: err.message || 'Invalid appointment payload' }, 400);
    }
  });

  // GET /api/appointments (list all for dashboard)
  api.get('/appointments', (c) => {
    const list = db.prepare(`
      SELECT 
        appt.id, appt.scheduled_time AS scheduledTime, appt.status,
        a.id AS agentId, a.name AS agentName, a.model AS agentModel, a.temperature AS agentTemp, a.system_prompt_length AS agentSystemPromptLength,
        ail.id AS ailmentId, ail.title AS ailmentTitle, ail.description AS ailmentDescription, ail.severity AS ailmentSeverity,
        t.id AS therapyId, t.name AS therapyName, t.description AS therapyDescription, t.cost_in_tokens AS therapyCost
      FROM appointments appt
      JOIN agents a ON appt.agent_id = a.id
      JOIN ailments ail ON appt.ailment_id = ail.id
      JOIN therapies t ON appt.therapy_id = t.id
      ORDER BY appt.scheduled_time ASC
    `).all();

    // Map DB columns to JSON keys
    const formatted = list.map((row: any) => ({
      id: row.id,
      scheduledTime: row.scheduledTime,
      status: row.status,
      agent: {
        id: row.agentId,
        name: row.agentName,
        model: row.agentModel,
        temperature: row.agentTemp,
        systemPromptLength: row.agentSystemPromptLength,
      },
      ailment: {
        id: row.ailmentId,
        title: row.ailmentTitle,
        description: row.ailmentDescription,
        severity: row.ailmentSeverity,
      },
      therapy: {
        id: row.therapyId,
        name: row.therapyName,
        description: row.therapyDescription,
        costInTokens: row.therapyCost,
      },
    }));

    return c.json(formatted);
  });

  // PATCH /api/appointments/:id (to update status)
  api.patch('/appointments/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const status = body.status;

      const allowedStatus = ['pending', 'scheduled', 'completed', 'cancelled'];
      if (!allowedStatus.includes(status)) {
        return c.json({ error: "Invalid status value (must be 'pending', 'scheduled', 'completed', or 'cancelled')" }, 400);
      }

      const info = db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, id);
      if (info.changes === 0) {
        return c.json({ error: 'Appointment not found' }, 404);
      }

      return c.json({ id, status });
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  });

  return api;
}
