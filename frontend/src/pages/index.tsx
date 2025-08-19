import React, { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Hello from frontend');
  const [status, setStatus] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL;

  async function sendLog() {
    try {
      const res = await fetch(`${api}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      setStatus(JSON.stringify(data));
    } catch (e: any) {
      setStatus(e.message);
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Next.js + ELK Stack Demo</h1>
      <p>API base: {api}</p>
      <input style={{ padding: 8, minWidth: 320 }} value={message} onChange={e => setMessage(e.target.value)} />
      <button style={{ marginLeft: 8, padding: '8px 16px' }} onClick={sendLog}>Send Log</button>
      {status && <pre style={{ background: '#eee', padding: 12 }}>{status}</pre>}
      <p>Open Kibana at http://localhost:5601 and create index pattern: app-logs*</p>
    </main>
  );
}
