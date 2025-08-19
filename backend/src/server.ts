import express from 'express';
import bodyParser from 'body-parser';
import { elasticClient, logToElasticsearch, healthCheck } from './logging/elastic-client';

const app = express();
const PORT = Number(process.env.BACKEND_PORT) || 3001;

app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.send('Welcome to the ELK Stack Backend!');
});

app.get('/health', async (_req, res) => {
  try {
    const status = await healthCheck();
    res.json(status);
  } catch (e) {
    res.status(500).json({ error: 'Elasticsearch not healthy' });
  }
});

// Simple log endpoint
app.post('/log', async (req, res) => {
  const { message = 'Test log message', level = 'info' } = req.body || {};
  try {
    await logToElasticsearch('app-logs', { message, level, timestamp: new Date().toISOString() });
    res.status(201).json({ stored: true });
  } catch (error) {
    console.error('Error saving log:', error);
    res.status(500).json({ error: 'Error saving log' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
