const statusMap = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  BLOCKED: 'blocked',
  DONE: 'done'
};

async function init() {
  const res = await fetch('/api/board');
  const data = await res.json();

  document.getElementById('board-title').textContent = data.title || 'Agent Board';

  const counts = { TODO: 0, IN_PROGRESS: 0, REVIEW: 0, BLOCKED: 0, DONE: 0 };

  for (const task of data.tasks) {
    const column = document.querySelector(`[data-status="${task.status}"] .cards`);
    if (!column) continue;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${escapeHtml(task.title)}</h3>
      ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ''}
      <div class="meta">${formatDate(task.updatedAt)}</div>
    `;
    column.appendChild(card);

    counts[task.status]++;
  }

  for (const [status, count] of Object.entries(counts)) {
    const el = document.getElementById(`count-${statusMap[status]}`);
    if (el) el.textContent = count.toString();
  }
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