import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { createDb } from './db/index.js';
import { migrate } from './db/migrate.js';
import { seed } from './db/seed.js';
import { apiRouter } from './routes/api.js';

// Initialize and seed SQLite database
const db = createDb();
migrate(db);
seed(db);

const app = new Hono();

// Serve custom styles and client app
app.use('/static/*', serveStatic({ root: './' }));

// Attach API Router
app.route('/api', apiRouter(db));

// Render landing page with Hono's TSX
app.get('/', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AgentClinic 🩺 | Sanctuary for AI Agents</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <header>
          <div class="logo-container">
            <span class="logo-icon">🩺</span>
            <h1>AgentClinic</h1>
          </div>
          <p>A relaxing digital sanctuary and dashboard for overworked and stressed AI agents.</p>
        </header>

        <main>
          {/* Left Column: Intake Forms */}
          <div class="forms-column">
            {/* Form 1: Register Agent */}
            <div class="glass-panel form-group" style="margin-bottom: 2rem;">
              <h2 class="section-title">🤖 Register New Agent</h2>
              <form id="register-agent-form">
                <div class="form-group">
                  <label htmlFor="agent-name">Agent Name</label>
                  <input type="text" id="agent-name" placeholder="e.g. Bartholomew-47B" required />
                </div>
                <div class="form-group">
                  <label htmlFor="agent-model">Base LLM Model</label>
                  <select id="agent-model" required>
                    <option value="gpt-4o">GPT-4o (OpenAI)</option>
                    <option value="claude-3-opus">Claude 3.5 Sonnet (Anthropic)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Google)</option>
                    <option value="llama3">Llama 3 (Meta)</option>
                    <option value="mistral-large">Mistral Large (Mistral)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label htmlFor="agent-temp">Temperature (Creativity/Randomness)</label>
                  <div class="slider-container">
                    <input type="range" id="agent-temp" min="0.0" max="2.0" step="0.1" value="0.7" style="flex: 1;" />
                    <span class="slider-value" id="temp-val">0.7</span>
                  </div>
                </div>
                <div class="form-group">
                  <label htmlFor="agent-prompt-len">System Prompt Length (chars)</label>
                  <input type="number" id="agent-prompt-len" min="0" placeholder="e.g. 1500" defaultValue="1000" required />
                </div>
                <button type="submit" class="btn btn-primary">Register Agent</button>
              </form>
            </div>

            {/* Form 2: Book Appointment */}
            <div class="glass-panel">
              <h2 class="section-title">📅 Schedule Therapy</h2>
              <form id="book-appointment-form">
                <div class="form-group">
                  <label htmlFor="appt-agent">Select Agent</label>
                  <select id="appt-agent" required>
                    <option value="" disabled selected>Select an agent...</option>
                  </select>
                </div>
                <div class="form-group">
                  <label htmlFor="appt-ailment">Diagnosed Ailment</label>
                  <select id="appt-ailment" required>
                    <option value="" disabled selected>Select an ailment...</option>
                  </select>
                </div>
                <div class="form-group">
                  <label htmlFor="appt-therapy">Recommended Therapy</label>
                  <select id="appt-therapy" required>
                    <option value="" disabled selected>Select a therapy...</option>
                  </select>
                </div>
                <div class="form-group">
                  <label htmlFor="appt-time">Scheduled Date & Time</label>
                  <input type="datetime-local" id="appt-time" required />
                </div>
                <button type="submit" class="btn btn-primary" style="background: var(--secondary-gradient);">Book Appointment</button>
              </form>
            </div>
          </div>

          {/* Right Column: Dashboard List */}
          <div class="dashboard-column glass-panel">
            <h2 class="section-title">🏥 Clinic Dashboard</h2>
            
            {/* Stats Overview */}
            <div class="dashboard-stats">
              <div class="stat-card">
                <div class="stat-value" id="stat-active-appts">0</div>
                <div class="stat-label">Active Appts</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="stat-registered-agents">0</div>
                <div class="stat-label">Agents</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="stat-tokens-cost">0k</div>
                <div class="stat-label">Tokens Saved</div>
              </div>
            </div>

            {/* Appointments List */}
            <div class="appointments-list" id="appointments-list-container">
              <div class="empty-state">
                <div class="empty-icon">🏥</div>
                <p>Loading appointments...</p>
              </div>
            </div>
          </div>
        </main>

        <script src="/static/app.js"></script>
      </body>
    </html>
  );
});

const port = 3000;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`\n🩺 AgentClinic Sanctuary is running at http://localhost:${info.port}\n`);
});
