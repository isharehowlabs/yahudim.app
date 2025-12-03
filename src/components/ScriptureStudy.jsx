import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'\;

function ScriptureStudy() {
  // Verse reader state
  const [book, setBook] = useState('Genesis');
  const [startVerse, setStartVerse] = useState('1:1');
  const [endVerse, setEndVerse] = useState('1:3');
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Notes state
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle] = useState('');
  const [verseRef, setVerseRef] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`);
      if (!response.ok) throw new Error('Failed to load notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error('Error loading notes:', err);
    }
  };

  const fetchVerses = async () => {
    setLoading(true);
    setError('');
    setVerses([]);

    try {
      const reference = `${book}+${startVerse}-${endVerse}`;
      const response = await fetch(`https://bible-api.com/${reference}?translation=kjv`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${reference}`);
      }

      const data = await response.json();
      
      if (data.verses && data.verses.length > 0) {
        setVerses(data.verses);
      } else {
        setVerses([{ text: data.text, verse: data.reference }]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch verses. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      const noteData = {
        title: title || 'Untitled Lesson',
        verse: verseRef,
        content
      };

      if (currentNote) {
        const response = await fetch(`${API_BASE_URL}/api/notes/${currentNote.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error('Failed to update note');
      } else {
        const response = await fetch(`${API_BASE_URL}/api/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error('Failed to save note');
      }

      await loadNotes();
      resetNoteForm();
    } catch (err) {
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border-2 border-purple-200" className="className">
    }
  };

  const editNote = (note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setVerseRef(note.verse || '');
    setContent(note.content);
  };

  const deleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete note');
      await loadNotes();
      if (currentNote?.id === id) resetNoteForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetNoteForm = () => {
    setCurrentNote(null);
    setTitle('');
    setVerseRef('');
    setContent('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Left Side - Verse Reader */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border-2 border-purple-200">
        <h2 className="text-xl lg:text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
          📖 Scripture Reader
        </h2>

        {/* Verse Selection Form */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-semibold text-purple-600 mb-1">Book</label>
            <input
              type="text"
              value={book}
              onChange={(e) => setBook(e.target.value)}
              placeholder="e.g. Genesis, John, Psalms"
              className="w-full p-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-purple-600 mb-1">Start Verse</label>
              <input
                type="text"
                value={startVerse}
                onChange={(e) => setStartVerse(e.target.value)}
                placeholder="e.g. 1:1"
                className="w-full p-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-600 mb-1">End Verse</label>
              <input
                type="text"
                value={endVerse}
                onChange={(e) => setEndVerse(e.target.value)}
                placeholder="e.g. 1:5"
                className="w-full p-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            onClick={fetchVerses}
            disabled={loading || !book || !startVerse || !endVerse}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Loading...' : '📖 Fetch Verses'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-center">⚠️ {error}</p>
          </div>
        )}

        {/* Verses Display */}
        <div className="bg-purple-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          {verses.length === 0 && !loading && !error && (
            <p className="text-gray-500 text-center italic">
              Enter a book and verse range, then click Fetch Verses
            </p>
          )}
          {verses.map((verse, idx) => (
            <div key={idx} className="mb-3">
              <p className="text-purple-900 leading-relaxed">
                <span className="font-bold text-purple-600">{verse.verse || verse.chapter + ':' + verse.verse_number}</span>{' '}
                {verse.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Notes Panel */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border-2 border-pink-200">
        <h2 className="text-xl lg:text-2xl font-bold text-pink-700 mb-4 flex items-center gap-2">
          📝 Scripture Notes
        </h2>

        {/* Note Editor */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-sm font-semibold text-pink-600 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title..."
              className="w-full p-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-pink-600 mb-1">Verse Reference</label>
            <input
              type="text"
              value={verseRef}
              onChange={(e) => setVerseRef(e.target.value)}
              placeholder="e.g. Genesis 1:1-3"
              className="w-full p-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-pink-600 mb-1">Notes</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes here..."
              rows="6"
              className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveNote}
              disabled={!content.trim()}
              className="flex-1 bg-gradient-to-r from-pink-600 to-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-pink-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentNote ? '💾 Update' : '💾 Save'}
            </button>
            {currentNote && (
              <button
                onClick={resetNoteForm}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Saved Notes List */}
        <div className="border-t-2 border-pink-200 pt-4">
          <h3 className="text-lg font-bold text-pink-700 mb-3">Saved Notes</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-500 text-center italic text-sm">No notes yet. Start writing!</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                  <h4 className="font-bold text-pink-900">{note.title}</h4>
                  {note.verse && (
                    <p className="text-xs text-pink-600 mb-1">{note.verse}</p>
                  )}
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{note.content}</p>
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => editNote(note)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScriptureStudy;
