async function prendiTrendDaGoogle() {
  return safeFetch('/.netlify/functions/googleNews');
}
async function prendiTrendDaReddit() {
  return safeFetch('/.netlify/functions/reddit');
}
async function prendiTrendDaWikipedia() {
  return safeFetch('/.netlify/functions/wikipedia');
}

async function safeFetch(url) {
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }});
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.log('Fetch error', url, e);
    return [];
  }
}

async function ottieniTuttiITrend() {
  console.log('🔄 Sto cercando i trend del momento...');
  const [g, r, w] = await Promise.allSettled([
    prendiTrendDaGoogle(),
    prendiTrendDaReddit(),
    prendiTrendDaWikipedia()
  ]);

  const trends = [
    ...(g.value || []),
    ...(r.value || []),
    ...(w.value || [])
  ];

  trends.sort(() => Math.random() - 0.5);
  console.log(`✅ Trovati ${trends.length} trend!`);
  return trends;
}

async function mostraTrendReali() {
  const container = document.getElementById('trends');
  if (!container) return;
  container.innerHTML = '<div class="loading">⏰ Sto cercando i trend più hot del momento...</div>';

  const trends = await ottieniTuttiITrend();

  if (!trends.length && typeof mostraTrends === 'function') {
    console.log('Usando trend di esempio...');
    mostraTrends();
    return;
  }

  container.innerHTML = '';
  trends.forEach(trend => {
    const card = document.createElement('div');
    card.className = 'trend-card';
    card.innerHTML = `
      <span class="trend-badge">${trend.categoria || ''}</span>
      <h2 class="trend-title">${trend.titolo || 'Trend'}</h2>
      <p class="trend-description">${trend.descrizione || ''}</p>
      <div class="trend-stats">
        <span class="trend-volume">👁 ${trend.volume || ''}</span>
        <span class="trend-growth">📈 ${trend.crescita || ''}</span>
      </div>
      <button onclick="apriTrend('${(trend.titolo || 'Trend').replace(/'/g, "\\'")}')">Leggi di più →</button>
    `;
    container.appendChild(card);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    mostraTrendReali();
    setInterval(mostraTrendReali, 5 * 60 * 1000);
  });
}