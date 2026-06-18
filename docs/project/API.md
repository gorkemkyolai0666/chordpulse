# ChordPulse — API

Base URL: `/api`

## Auth

| Method | Endpoint | Status | Auth |
|--------|----------|--------|------|
| POST | /auth/register | 201 | No |
| POST | /auth/login | 200 | No |
| GET | /auth/me | 200 | Yes |

## Health

| GET | /health | 200 | No |

## Orders

| GET | /orders | 200 | Yes |
| POST | /orders | 201 | Yes |
| PATCH | /orders/:id | 200 | Yes |
| DELETE | /orders/:id | 200 | Yes |

## Stems, Deliveries, Workshops, Varieties

CRUD pattern same as orders.

## Dashboard

| GET | /dashboard/stats | 200 | Yes |

Port: **4029** (CI and local default)
