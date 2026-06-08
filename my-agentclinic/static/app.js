// Elements
const agentTempInput = document.getElementById('agent-temp');
const tempValSpan = document.getElementById('temp-val');
const registerAgentForm = document.getElementById('register-agent-form');
const bookAppointmentForm = document.getElementById('book-appointment-form');

const apptAgentSelect = document.getElementById('appt-agent');
const apptAilmentSelect = document.getElementById('appt-ailment');
const apptTherapySelect = document.getElementById('appt-therapy');
const apptTimeInput = document.getElementById('appt-time');

const appointmentsList = document.getElementById('appointments-list-container');

const statActiveAppts = document.getElementById('stat-active-appts');
const statRegisteredAgents = document.getElementById('stat-registered-agents');
const statTokensCost = document.getElementById('stat-tokens-cost');

// State
let agents = [];
let ailments = [];
let therapies = [];
let appointments = [];

// Date helper
const setMinAppointmentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  apptTimeInput.min = `${year}-${month}-${day}T${hours}:${minutes}`;
};
if (apptTimeInput) setMinAppointmentTime();

if (agentTempInput) {
  agentTempInput.addEventListener('input', (e) => {
    tempValSpan.textContent = Number(e.target.value).toFixed(1);
  });
}

// Show notifications
const showToast = (message, isError = false) => {
  const toast = document.createElement('div');
  toast.className = 'notification';
  if (isError) toast.style.borderColor = '#ef4444';
  toast.innerHTML = `<span>${isError ? '❌' : '✨'}</span> <p>${message}</p>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Fetch basic lookups
const loadDropdowns = async () => {
  try {
    // Load ailments
    const ailmentsRes = await fetch('/api/ailments');
    ailments = await ailmentsRes.json();
    if (apptAilmentSelect) {
      apptAilmentSelect.innerHTML = '<option value="" disabled selected>Select an ailment...</option>' +
        ailments.map(a => `<option value="${a.id}">${a.title} (${a.severity.toUpperCase()} severity)</option>`).join('');
    }

    // Load therapies
    const therapiesRes = await fetch('/api/therapies');
    therapies = await therapiesRes.json();
    if (apptTherapySelect) {
      apptTherapySelect.innerHTML = '<option value="" disabled selected>Select a therapy...</option>' +
        therapies.map(t => `<option value="${t.id}">${t.name} (${t.costInTokens} tokens)</option>`).join('');
    }

    // Load agents
    await refreshAgentsDropdown();
  } catch (err) {
    console.error('Error loading lookups:', err);
    showToast('Failed to load clinic options', true);
  }
};

const refreshAgentsDropdown = async () => {
  try {
    const agentsRes = await fetch('/api/agents');
    agents = await agentsRes.json();
    if (apptAgentSelect) {
      apptAgentSelect.innerHTML = '<option value="" disabled selected>Select an agent...</option>' +
        agents.map(a => `<option value="${a.id}">${a.name} (${a.model})</option>`).join('');
    }
    if (statRegisteredAgents) {
      statRegisteredAgents.textContent = agents.length;
    }
  } catch (err) {
    console.error('Error refreshing agents:', err);
  }
};

// Load & Render Appointments
const loadAppointments = async () => {
  try {
    const res = await fetch('/api/appointments');
    appointments = await res.json();
    renderAppointments();
  } catch (err) {
    console.error('Error loading appointments:', err);
    showToast('Failed to load dashboard', true);
  }
};

const renderAppointments = () => {
  if (!appointmentsList) return;

  if (appointments.length === 0) {
    appointmentsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🏖️</div>
        <p>No scheduled appointments. The agents are all resting!</p>
      </div>
    `;
    if (statActiveAppts) statActiveAppts.textContent = 0;
    if (statTokensCost) statTokensCost.textContent = '0k';
    return;
  }

  // Calc stats
  const activeCount = appointments.filter(a => a.status === 'pending' || a.status === 'scheduled').length;
  const completedAppts = appointments.filter(a => a.status === 'completed');
  const totalTokens = completedAppts.reduce((sum, appt) => sum + appt.therapy.costInTokens, 0);

  if (statActiveAppts) statActiveAppts.textContent = activeCount;
  if (statTokensCost) {
    statTokensCost.textContent = totalTokens >= 1000 ? (totalTokens / 1000).toFixed(1) + 'k' : totalTokens;
  }

  appointmentsList.innerHTML = appointments.map(appt => {
    const formattedDate = new Date(appt.scheduledTime).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Action buttons based on status
    let actionsHtml = '';
    if (appt.status === 'pending') {
      actionsHtml = `
        <button class="action-btn btn-progress" onclick="updateStatus('${appt.id}', 'scheduled')">Schedule</button>
        <button class="action-btn btn-cancel" onclick="updateStatus('${appt.id}', 'cancelled')">Cancel</button>
      `;
    } else if (appt.status === 'scheduled') {
      actionsHtml = `
        <button class="action-btn btn-complete" onclick="updateStatus('${appt.id}', 'completed')">Complete</button>
        <button class="action-btn btn-cancel" onclick="updateStatus('${appt.id}', 'cancelled')">Cancel</button>
      `;
    }

    return `
      <div class="appointment-card">
        <div class="appointment-header">
          <div class="agent-info">
            <span class="agent-name">${escapeHtml(appt.agent.name)}</span>
            <span class="agent-meta">Model: ${escapeHtml(appt.agent.model)} | Temp: ${appt.agent.temperature} | Prompt: ${appt.agent.systemPromptLength} ch</span>
          </div>
          <span class="status-badge status-${appt.status}">${appt.status}</span>
        </div>

        <div class="appointment-details">
          <div class="detail-block">
            <span class="detail-label">Ailment</span>
            <span class="detail-value">
              ${escapeHtml(appt.ailment.title)}
              <span class="severity-tag severity-${appt.ailment.severity}">${appt.ailment.severity}</span>
            </span>
          </div>
          <div class="detail-block">
            <span class="detail-label">Therapy</span>
            <span class="detail-value">${escapeHtml(appt.therapy.name)} (${appt.therapy.costInTokens} tokens)</span>
          </div>
          <div class="detail-block" style="grid-column: span 2; margin-top: 0.25rem;">
            <span class="detail-label">Scheduled Time</span>
            <span class="detail-value">📅 &nbsp;${formattedDate}</span>
          </div>
        </div>

        ${actionsHtml ? `<div class="appointment-actions">${actionsHtml}</div>` : ''}
      </div>
    `;
  }).join('');
};

// Update Status handler
window.updateStatus = async (id, status) => {
  try {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to update status');
    }
    
    showToast(`Appointment status updated to ${status}`);
    await loadAppointments();
  } catch (err) {
    showToast(err.message, true);
  }
};

// Form submissions
if (registerAgentForm) {
  registerAgentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('agent-name').value;
    const model = document.getElementById('agent-model').value;
    const temperature = parseFloat(agentTempInput.value);
    const systemPromptLength = parseInt(document.getElementById('agent-prompt-len').value, 10);

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, model, temperature, systemPromptLength })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register agent');
      }

      showToast('Agent registered successfully');
      registerAgentForm.reset();
      tempValSpan.textContent = '0.7';
      agentTempInput.value = '0.7';

      await refreshAgentsDropdown();
    } catch (err) {
      showToast(err.message, true);
    }
  });
}

if (bookAppointmentForm) {
  bookAppointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const agentId = apptAgentSelect.value;
    const ailmentId = apptAilmentSelect.value;
    const therapyId = apptTherapySelect.value;
    const scheduledTime = apptTimeInput.value;

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, ailmentId, therapyId, scheduledTime })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to book appointment');
      }

      showToast('Therapy session booked successfully');
      bookAppointmentForm.reset();
      setMinAppointmentTime();

      await loadAppointments();
    } catch (err) {
      showToast(err.message, true);
    }
  });
}

// Escape HTML helper
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initial Load
loadDropdowns();
loadAppointments();
