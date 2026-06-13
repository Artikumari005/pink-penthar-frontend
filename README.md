# Pink Panther AI Pipeline Builder (Frontend + FastAPI Backend)

## Overview
This project is a **visual AI pipeline builder**.
- **Frontend (Vercel / React)**: lets users drag nodes (Input, LLM, Filter, API, etc.) onto a canvas, connect them, and run/validate the pipeline.
- **Backend (Render / FastAPI)**: validates whether the pipeline is a **DAG (Directed Acyclic Graph)** and returns basic counts (nodes/edges).

The backend exposes an API endpoint that the frontend calls when running the pipeline.

## Architecture
- **Frontend**: React + ReactFlow + Zustand store
- **Backend**: FastAPI
  - CORS enabled
  - DAG check implemented in Python

## Tech Stack
### Frontend
- React (CRA)
- ReactFlow
- Zustand

### Backend
- FastAPI
- Uvicorn
- Pydantic
- (CORS middleware)

## Deployment
### Frontend (Vercel)
1. Build: `npm run build`
2. Deploy the `frontend/` project.

### Backend (Render)
1. Deploy `backend/` as a web service.
2. Uses the `render.yaml` configuration.

## Backend API
### Health
- `GET /`
  - Returns: `{"Ping": "Pong"}`

### Parse / Validate Pipeline
- `POST /pipelines/parse`

**Request body (JSON):**
```json
{
  "nodes": [{ "id": "input-1" }, { "id": "llm-1" }],
  "edges": [{ "source": "input-1", "target": "llm-1" }]
}
```

**Response:**
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

## CORS Configuration
Backend enables CORS via `CORSMiddleware`.

Important:
- `allow_origins` must include the **exact** Vercel frontend domain (and any preview domains you use).
- If your frontend domain changes, requests may fail with CORS errors.

## How “Run Pipeline” Works
1. Frontend collects the pipeline graph (**nodes + edges**) from the ReactFlow canvas.
2. Frontend sends a request to the backend.
3. Backend returns:
   - node count
   - edge count
   - whether the graph is a DAG

frontend live : https://pink-penthar-frontend-34bu.vercel.app/
