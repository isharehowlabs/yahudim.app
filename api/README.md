# Rise Yahudim API

Backend API for the Rise Yahudim streaming application.

## Features

- Quiz question management (CRUD operations)
- Current question tracking for live quizzes
- Scripture notes storage and management
- JSON file-based storage (no database setup required)
- CORS enabled for frontend access

## API Endpoints

### Health Check
- `GET /health` - Check if API is running

### Quiz Endpoints
- `GET /api/quiz/questions` - Get all questions
- `POST /api/quiz/questions` - Create a new question
- `DELETE /api/quiz/questions/:id` - Delete a question
- `POST /api/quiz/current` - Set current question for students
- `GET /api/quiz/current` - Get current active question

### Scripture Notes Endpoints
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm run dev
```

The API will run on `http://localhost:3001`

## Deployment to Render.com

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Select the `/api` directory as the root directory
6. Render will automatically detect the `render.yaml` configuration

### Environment Variables on Render

Set these in the Render dashboard:
- `NODE_ENV`: production
- `PORT`: 10000 (default)
- `CORS_ORIGIN`: https://yahudim.app

## Data Storage

The API uses a JSON file (`data.json`) for storage. This file is automatically created on first run.

**Note**: On Render.com's free tier, the filesystem is ephemeral. Data will be lost on service restarts. For persistent storage, consider:
- Upgrading to a paid plan with persistent disks
- Using a cloud database (MongoDB Atlas, PostgreSQL, etc.)
- Using external storage (AWS S3, etc.)

## Testing the API

Test with curl:
```bash
# Health check
curl http://localhost:3001/health

# Get all questions
curl http://localhost:3001/api/quiz/questions

# Create a question
curl -X POST http://localhost:3001/api/quiz/questions \
  -H "Content-Type: application/json" \
  -d '{"text":"What is 2+2?","type":"multiple-choice","options":["3","4","5","6"],"correctAnswer":"4"}'
```

## License

MIT
