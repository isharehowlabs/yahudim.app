# Children's Church Streaming App 🙏

A React application for children's church that enables streaming via YouTube or Discord, with interactive features for learning and engagement.

## Features

### 📺 Video Streaming
- Support for YouTube embed (private or public streams)
- Discord channel embedding
- Easy stream source switching

### 🎨 Drawing Pad (Tab 1)
- HTML5 Canvas-based drawing tool
- 10 color options
- Adjustable brush size (1-20)
- Clear canvas function
- Save drawings as PNG
- Touch-friendly for tablets

### ❓ Quiz System (Tab 2)
- **Teacher Mode**: Create and manage questions
  - Multiple choice questions
  - True/False questions
  - Ask questions to students in real-time
- **Student Mode**: Answer questions and track score
- Questions stored in browser localStorage

### 📖 Scripture Notebook (Tab 3)
- Create lesson notes with scripture references
- Rich text editing
- Local storage persistence
- Export notes as text files
- Print functionality
- Manage multiple saved lessons

## Getting Started

### Development Mode
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

The production files will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Usage

### Setting up a Stream

1. Select stream type (YouTube or Discord)
2. Enter the stream URL:
   - **YouTube**: Paste the full URL or video ID
   - **Discord**: Paste the Discord channel embed URL
3. Click "Load Stream"

### Using the Drawing Pad

- Select a color from the palette
- Adjust brush size with the slider
- Draw on the canvas with mouse or touch
- Click "Clear" to start over
- Click "Save" to download your drawing

### Creating Quiz Questions

1. Switch to "Teacher Mode"
2. Select question type (Multiple Choice or True/False)
3. Enter your question
4. Add answer options (for multiple choice)
5. Select the correct answer
6. Click "Add Question"
7. Click "Ask" to present the question to students

### Taking the Quiz (Student Mode)

1. Switch to "Student Mode"
2. Wait for teacher to ask a question
3. Select your answer
4. Submit to see your score update

### Writing Scripture Notes

1. Enter a lesson title
2. Add scripture reference (e.g., "John 3:16")
3. Write your lesson notes
4. Click "Save Lesson"
5. Access saved lessons from the sidebar
6. Export or print lessons as needed

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Local Storage** - Data persistence

## Browser Support

Modern browsers with support for:
- HTML5 Canvas
- ES6+
- Local Storage
- CSS Grid/Flexbox

## License

Created for Yeladim Church with ❤️
