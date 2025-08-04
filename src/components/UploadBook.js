import React, { useState } from 'react';
import './UploadBook.css';

function UploadBook() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (res.ok) alert('Upload successful');
    else alert('Upload failed');
  };

  return (
    <div className="upload-form">
      <h2>Upload Document</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={() => window.location.href = '/dashboard'}>Back</button>
    </div>
  );
}

export default UploadBook;