## ELK Stack with Next.js & Node.js (Flattened Structure)

This repository provides a ready-to-run local development environment combining:

- Frontend: Next.js (React)
- Backend: Express + TypeScript
- Logging & Observability: Elasticsearch, Logstash, Kibana, Filebeat (ELK + Beats)

Everything runs via Docker Compose. The previous nested `nextjs-elk-stack-app` folder has been removed; all project folders now live at the repository root.

### Directory Layout

```
backend/            # Express + TypeScript API (emits logs)
frontend/           # Next.js UI (sends test log messages)
docker/             # Service configuration (elasticsearch, kibana, logstash, filebeat)
docker-compose.yml  # Orchestration of app + ELK stack
.env.example        # Environment variable template
```

### Quick Start

1. Copy env file:
```
cp .env.example .env   # (optional – values are already sensible defaults)
```
2. Build & start stack:
```
docker compose up -d --build
```
3. Visit services:
```
Frontend:   http://localhost:3000
Backend:    http://localhost:3001/health
Kibana:     http://localhost:5601
Elasticsearch API: http://localhost:9200
```

### Send a Test Log (Frontend)
Open the frontend, type a message, click "Send Log". It POSTs to `POST /log` on the backend. The backend indexes the log (via Logstash / Filebeat pipeline) into Elasticsearch under indices `app-logs-*`.

### View Logs in Kibana
1. Open Kibana → Analytics → Discover
2. Create data view with pattern: `app-logs-*`
3. Search / filter your log messages.

### Backend Endpoints
| Method | Path      | Description                |
|--------|-----------|----------------------------|
| GET    | /health   | Elasticsearch cluster health proxy |
| POST   | /log      | Accepts `{ message, level }` JSON and stores log |

### Development (without Docker for app code)
You can run services via Docker but code locally:
```
docker compose up -d elasticsearch kibana logstash filebeat
cd backend && npm install && npm run dev
cd ../frontend && npm install && npm run dev
```

### Rebuilding
```
docker compose build backend frontend
docker compose up -d
```

### Stopping & Cleanup
```
docker compose down            # stop containers
docker compose down -v         # also remove elasticsearch volume
```

### Notes
- Security is disabled for local simplicity (no xpack auth / TLS). Enable before production.
- Filebeat uses docker container log files (mounted docker.sock + containers path) for autodiscovery-like capture.
- Adjust JVM heap for Elasticsearch via `ES_JAVA_OPTS` in `docker-compose.yml` if needed.

### Next Steps / Enhancements
- Add index lifecycle management (ILM) policies
- Add structured application logging (pino / winston) shipped via Filebeat
- Enable Elasticsearch security & Kibana spaces
- Add metricbeat / apm-server for deeper telemetry

---
Happy logging!
