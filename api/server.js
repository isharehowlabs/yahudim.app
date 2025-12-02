const express = require('express');
const cors = require('cors');
const { readDB, writeDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['*'];

app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Children\'s Church API is running' });
});

// ===== Q&A ENDPOINTS =====

// Get all questions
app.get('/api/qanda/questions', (req, res) => {
  try {
    const db = readDB();
    res.json(db.qanda_questions || []);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Submit a new question
app.post('/api/qanda/questions', (req, res) => {
  try {
    const { name, text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Question text is required' });
    }

    const db = readDB();
    const newQuestion = {
      id: Date.now(),
      name: name || 'Anonymous',
      text: text.trim(),
      isRead: false,
      timestamp: Date.now()
    };

    if (!db.qanda_questions) {
      db.qanda_questions = [];
    }

    db.qanda_questions.push(newQuestion);
    writeDB(db);

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Mark question as read
app.put('/api/qanda/questions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const db = readDB();
    const question = db.qanda_questions?.find(q => q.id === parseInt(id));

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    question.isRead = isRead !== undefined ? isRead : true;
    writeDB(db);

    res.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete a question
app.delete('/api/qanda/questions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const index = db.qanda_questions?.findIndex(q => q.id === parseInt(id));

    if (index === -1 || index === undefined) {
      return res.status(404).json({ error: 'Question not found' });
    }

    db.qanda_questions.splice(index, 1);
    writeDB(db);

    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// ===== SCRIPTURE NOTES ENDPOINTS =====

// Get all notes
app.get('/api/notes', (req, res) => {
  try {
    const db = readDB();
    res.json(db.scripture_notes || []);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get a specific note
app.get('/api/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const note = db.scripture_notes?.find(n => n.id === parseInt(id));

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create a new note
app.post('/api/notes', (req, res) => {
  try {
    const { title, verse, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const db = readDB();
    const newNote = {
      id: Date.now(),
      title,
      verse: verse || '',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!db.scripture_notes) {
      db.scripture_notes = [];
    }

    db.scripture_notes.push(newNote);
    writeDB(db);

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, verse, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const db = readDB();
    const note = db.scripture_notes?.find(n => n.id === parseInt(id));

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.title = title;
    note.verse = verse || '';
    note.content = content;
    note.updatedAt = new Date().toISOString();

    writeDB(db);
    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const index = db.scripture_notes?.findIndex(n => n.id === parseInt(id));

    if (index === -1 || index === undefined) {
      return res.status(404).json({ error: 'Note not found' });
    }

    db.scripture_notes.splice(index, 1);
    writeDB(db);

    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🙏 Children's Church API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
});
