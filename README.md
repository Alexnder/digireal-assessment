# Balance Management API

NestJS application for managing user balance with PostgreSQL and Redis caching.

## Quick Start

```bash
docker compose up --build
```

Application: http://localhost:3000

## API Endpoints

### Get Balance
```bash
curl http://localhost:3000/balance/1
```

### Debit Balance
```bash
curl -X POST http://localhost:3000/balance/1/debit \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'
```

### Get History
```bash
curl http://localhost:3000/balance/1/history
```

## Stop Application

```bash
docker compose down
```

Remove all data:
```bash
docker compose down -v
```
