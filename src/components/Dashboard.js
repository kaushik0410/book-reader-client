import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem('token');
      // const res = await fetch('http://localhost:5000/api/books', {
      const res = await fetch('https://book-reader-server-a6uv.onrender.com/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setBooks(data);
    };
    fetchBooks();
  }, []);

  const playAudio = async (bookId) => {
    try {
      // const res = await fetch(`http://localhost:5000/api/books/${bookId}/audio`, {
      const res = await fetch(`https://book-reader-server-a6uv.onrender.com/api/books/${bookId}/audio`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch book content');
      }

      const text = await res.text();
      window.speechSynthesis.cancel(); // Stop any current speech

      const CHUNK_SIZE = 200;
      const chunks = text.match(new RegExp(`.{1,${CHUNK_SIZE}}`, 'g'));

      if (!chunks) return;

      setIsSpeaking(true); // ✅ Start speaking

      for (const chunk of chunks) {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => {
          // if this is the last chunk, stop tracking
          if (chunk === chunks[chunks.length - 1]) {
            setIsSpeaking(false);
          }
        };

        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Error playing audio:', err.message);
      alert('Unable to play book audio.');
      setIsSpeaking(false);
    }
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // ✅ clear the token
    navigate('/'); // ✅ redirect to login page
  };

  const handleDelete = async (bookId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;

    // const res = await fetch(`http://localhost:5000/api/books/${bookId}`, {
    const res = await fetch(`https://book-reader-server-a6uv.onrender.com/api/books/${bookId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const data = await res.json();
    if (res.ok) {
      setBooks(prev => prev.filter(book => book._id !== bookId));
      alert('Book deleted successfully');
    } else {
      alert(data.message || 'Failed to delete book');
    }
  };

  return (
    <div className="dashboard">
      <div className="top-bar">
        <button className="upload-btn" onClick={() => window.location.href = '/upload'}>
          Upload Document
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h2>Your uploaded books</h2>
      <hr />
      <div className="book-list">
        {books.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem', fontStyle: 'italic' }}>
            No books found. Kindly upload one.
          </p>
        ) : (
          books.map(book => (
            <div className="book-card-horizontal" key={book._id}>
              <div className="book-image">
                <img src="/book-icon.jpg" alt="Book" />
              </div>
              <div className="book-details">
                <h4>{book.title}</h4>
                <p>Pages: {book.pages || "N/A"}</p>
                <p>Uploaded at {new Date(book.uploadDate).toLocaleDateString()}{" "}{new Date(book.uploadDate).toLocaleTimeString()}</p>
                <div className="book-buttons">
                  {isSpeaking ? (<button onClick={stopAudio}>Stop Audio</button>) : (<button onClick={() => playAudio(book._id)}>Play Audio</button>)}
                  {/* <button onClick={() => window.open(`http://localhost:5000/uploads/${book.fileName}`, '_blank')}>View Document</button> */}
                  <button onClick={() => window.open(`https://book-reader-server-a6uv.onrender.com/uploads/${book.fileName}`, '_blank')}>View Document</button>
                  <button onClick={() => handleDelete(book._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
