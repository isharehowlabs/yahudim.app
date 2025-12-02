import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'\;

function QandA() {
  const [mode, setMode] = useState('viewer');
  const [questions, setQuestions] = useState([]);
  
  // Viewer form state
  const [name, setName] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
    
    // Poll for new questions every 3 seconds when in host mode
    if (mode === 'host') {
      const interval = setInterval(loadQuestions, 3000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const loadQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/qanda/questions`);
      if (!response.ok) throw new Error('Failed to load questions');
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error('Error loading questions:', err);
    }
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/qanda/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous',
          text: questionText
        })
      });

      if (!response.ok) throw new Error('Failed to submit question');
      
      setName('');
      setQuestionText('');
      alert('✅ Your question has been submitted!');
      await loadQuestions();
    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/qanda/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      await loadQuestions();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteQuestion = async (id) => {
    if (!confirm('Delete this question?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/qanda/questions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete question');
      await loadQuestions();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const unreadCount = questions.filter(q => !q.isRead).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-md border-2 border-orange-200">
        <button
          onClick={() => setMode('viewer')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
            mode === 'viewer'
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          👤 Viewer
        </button>
        <button
          onClick={() => setMode('host')}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
            mode === 'host'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🎤 Host {unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
        </button>
      </div>

      {/* Viewer Mode */}
      {mode === 'viewer' && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            💬 Ask a Question or Leave a Comment
          </h2>
          
          <form onSubmit={submitQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
                className="w-full p-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-1">
                Question or Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Type your question or comment here..."
                rows="5"
                required
                className="w-full p-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!questionText.trim() || submitting}
              className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '📤 Submitting...' : '📤 Submit'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">
              💡 <strong>Tip:</strong> Your question will be visible to the host who can read it during the stream.
            </p>
          </div>
        </div>
      )}

      {/* Host Mode */}
      {mode === 'host' && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
              📋 Questions & Comments
            </h2>
            <button
              onClick={loadQuestions}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-all"
            >
              🔄 Refresh
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">📭 No questions yet</p>
              <p className="text-gray-400 text-sm mt-2">Questions will appear here when viewers submit them</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {questions
                .sort((a, b) => {
                  // Sort unread first, then by timestamp
                  if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
                  return b.timestamp - a.timestamp;
                })
                .map((question) => (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      question.isRead
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-purple-50 border-purple-300 shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-purple-900">{question.name}</span>
                          <span className="text-xs text-gray-500">{formatTimestamp(question.timestamp)}</span>
                          {!question.isRead && (
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap">{question.text}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {!question.isRead && (
                        <button
                          onClick={() => markAsRead(question.id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg font-semibold hover:bg-green-700 transition-all"
                        >
                          ✓ Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg font-semibold hover:bg-red-700 transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QandA;
