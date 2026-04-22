const statusMap = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  BLOCKED: 'blocked',
  DONE: 'done'
};

let boardData = null;
let previousTaskIds = new Set();

async function init() {
  const res = await fetch('/api/board');
  boardData = await res.json();
  render(boardData);
  connectEventSource();
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function detectChanges(newData, oldData) {
  const oldTasks = new Map(oldData.tasks.map(t => [t.id, t]));
  const newTasks = new Map(newData.tasks.map(t => [t.id, t]));
  
  let added = 0, moved = 0, updated = 0;
  const changedIds = [];
  
  for (const [id, task] of newTasks) {
    if (!oldTasks.has(id)) {
      added++;
      changedIds.push(id);
    } else {
      const old = oldTasks.get(id);
      if (old.status !== task.status) {
        moved++;
        changedIds.push(id);
      }
      if (old.title !== task.title || old.description !== task.description) {
        updated++;
        if (!changedIds.includes(id)) {
          changedIds.push(id);
        }
      }
    }
  }
  
  return { added, moved, updated, changedIds };
}

function render(data, changedIds = []) {
  document.getElementById('board-title').textContent = data.title || 'Agent Board';

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
    card.setAttribute('data-task-id', task.id);
    if (task.priority) card.classList.add(`priority-${task.priority}`);
    
    let cardContent = `<h3>${escapeHtml(task.title)}</h3>`;
    if (task.description) cardContent += `<p>${escapeHtml(task.description)}</p>`;
    
    if (task.agent) {
      cardContent += `<span class="badge agent">${escapeHtml(task.agent)}</span>`;
    }
    
    if (task.priority) {
      cardContent += `<span class="badge priority priority-${task.priority}">${task.priority}</span>`;
    }
    
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

  if (changedIds.length > 0) {
    setTimeout(() => {
      for (const id of changedIds) {
        const card = document.querySelector(`[data-task-id="${id}"]`);
        if (card) {
          card.classList.add('updated');
          setTimeout(() => card.classList.remove('updated'), 1000);
        }
      }
    }, 100);
  }
}

function connectEventSource() {
  const eventSource = new EventSource('/api/events');
  eventSource.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    if (payload.type === 'reload') {
      const { added, moved, updated, changedIds } = detectChanges(payload.data, boardData);
      
      const msgs = [];
      if (added > 0) msgs.push(`+${added} added`);
      if (moved > 0) msgs.push(`${moved} moved`);
      if (updated > 0) msgs.push(`${updated} updated`);
      
      if (msgs.length > 0) {
        showToast(msgs.join(', '), 'success');
      }
      
      render(payload.data, changedIds);
      boardData = payload.data;
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