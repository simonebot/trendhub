function jsonResp(body, status=200){
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=120'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function() {
  try {
    const url = 'https://www.reddit.com/r/italy/hot.json?limit=10';
    const res = await fetch(url, { headers: { 'User-Agent': 'TrendFacile/1.0 (contact: app@example.com)' } });
    if (!res.ok) return jsonResp([], 200);

    const data = await res.json();
    const posts = (data && data.data && data.data.children) ? data.data.children : [];
    const items = posts.slice(0,5).map(p => {
      const d = p.data || {};
      const selftext = d.selftext || '';
      return {
        titolo: d.title || 'Post',
        descrizione: (selftext || 'Discussione trending su r/italy').slice(0,150) + (selftext.length>150?'...':''),
        volume: `${(d.score||0).toLocaleString('it-IT')} upvotes`,
        crescita: `+${Math.floor(Math.random()*300 + 50)}%`,
        categoria: 'REDDIT 🔗',
        link: `https://www.reddit.com${d.permalink || ''}`
      };
    });

    return jsonResp(items, 200);
  } catch (e) {
    return jsonResp([], 200);
  }
};