# Wellcome to my to do list

A personal task management application with an intuitive design, supporting filtration, sorting, and multiple views.

## Tech Stack

- **Backend:** Express.js 5 + MongoDB (Mongoose 9) + TypeScript
- **Frontend:** React 19 + Redux Toolkit 2 + Material UI 7 + TypeScript
- **Build Tool:** Vite 7
- **Linting/Formatting:** ESLint 9 (flat config) + Prettier

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Docker](https://www.docker.com/) and Docker Compose (for running MongoDB)

## Getting Started

### 1. Clone the repository

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Start MongoDB with Docker Compose

```bash
docker-compose up -d
```

This starts MongoDB in a container with persistent volumes. Data will be preserved even if the container is removed and recreated.

To stop MongoDB:

```bash
docker-compose down
```

### 4. Configure environment variables

```bash
cp server/.env.example server/.env
```

The default configuration works with the Docker Compose MongoDB setup. Edit `server/.env` if needed:

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/todoList
```

### 5. Start development servers

```bash
npm run dev
```

This runs both servers concurrently:

- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:5173

### Individual commands

| Command          | Description                     |
| ---------------- | ------------------------------- |
| `npm run dev`    | Start both backend and frontend |
| `npm run server` | Start backend only              |
| `npm run client` | Start frontend only             |
| `npm run lint`   | Lint all files with ESLint      |
| `npm run format` | Format all files with Prettier  |
