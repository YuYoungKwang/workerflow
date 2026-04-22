const statusMap = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  BLOCKED: 'blocked',
  DONE: 'done'
};

let boardData = null;

async function init() {
  const res = await fetch('/api/board');
  boardData = await res.json();
  render(boardData);
  connectEventSource();
}

function render(data) {
  document.getElementById('board-title').textContent = data.title || 'Agent Board';

  // Render summary
  if (data.summary) {
    document.getElementById('stat-total').textContent = `Total: ${data.summary.total}`;
    document.getElementById('stat-completed').textContent = `Completed: ${data.summary.completed}`;
    document.getElementById('stat-inprogress').textContent = `In Progress: ${data.summary.inProgress}`;
    document.getElementById('stat-blocked').textContent = `Blocked: ${data.summary.blocked}`;
  }

  for (const status in statusMap) {
    const column = document.querySelector(`[data-status="${status}"] .cards`);
    if (column) column.innerHTML = '';
  }

  const counts = { TODO: 0, IN_PROGRESS: 0, REVIEW: 0, BLOCKED: 0, DONE: 0 };

  for (const task of data.tasks) {
    const column = document.querySelector(`[data-status="${task.status}"] .cards`);
    if (!column) continue;

    const card = document.createElement('div');
    card.className = 'card';
    if (task.priority) card.classList.add(`priority-${task.priority}`);
    
    let cardContent = `<h3>${escapeHtml(task.title)}</h3>`;
    if (task.description) cardContent += `<p>${escapeHtml(task.description)}</p>`;
    
    // Agent badge
    if (task.agent) {
      cardContent += `<span class="badge agent">${escapeHtml(task.agent)}</span>`;
    }
    
    // Priority badge
    if (task.priority) {
      cardContent += `<span class="badge priority priority-${task.priority}">${task.priority}</span>`;
    }
    
    // Tags
    if (task.tags && task.tags.length > 0) {
      cardContent += `<div class="tags">${task.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`;
    }
    
    cardContent += `<div class="meta">${formatDate(task.updatedAt)}</div>`;
    
    card.innerHTML = cardContent;
    column.appendChild(card);

    counts[task.status]++;
  }

  for (const [status, count] of Object.entries(counts)) {
    const el = document.getElementById(`count-${statusMap[status]}`);
    if (el) el.textContent = count.toString();
  }
}

function connectEventSource() {
  const eventSource = new EventSource('/api/events');
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'reload') {
      render(data.data);
    }
  };
  eventSource.onerror = () => {
    eventSource.close();
  };
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

init();