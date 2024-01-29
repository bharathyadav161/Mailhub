// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './history.css';
import { NavLink } from "react-router-dom"

function App() {
  const [email, setEmail] = useState({
    to: '',
    subject: '',
    body: '',
  });

  const handleInputChange = (e) => {
    setEmail({
      ...email,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = async () => {
    try {
      // Send email information to Express.js server
      await axios.post('http://localhost:6005/api/send-email', email);

      // Clear form after sending
      setEmail({
        to: '',
        subject: '',
        body: '',
      });
      alert('Email sent');
      console.log('Email sent and information stored.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="email-form">
    <h1>Email Sender</h1>
    <label htmlFor="to">To:</label>
    <input type="text" name="to" id="to" value={email.to} onChange={handleInputChange} />
    
    <label htmlFor="subject">Subject:</label>
    <input type="text" name="subject" id="subject" value={email.subject} onChange={handleInputChange} />
    
    <label htmlFor="body">Body:</label>
    <textarea name="body" id="body" value={email.body} onChange={handleInputChange}></textarea>
    
    <button onClick={sendEmail}>Send Email</button>
    <br></br>
    <br></br>
    
    <li> <NavLink to="/data-table" className="button-link"> History </NavLink></li>
   
    <li> <NavLink to="/test" className="button-link"> Group Mail </NavLink></li>
    
  </div>
  );
}

export default App;
