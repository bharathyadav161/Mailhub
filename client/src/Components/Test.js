import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';


const FileUpload = () => {
    

    
    
    const [email, setEmail] = useState({
        
        subject: '',
        body: '',
      });
    
      const handleInputChange = (e) => {
        setEmail({
          ...email,
          [e.target.name]: e.target.value,
        });
      };
    
      const sendbulkEmail = async () => {
        try {
          // Send email information to Express.js server
          await axios.post('http://localhost:6005/api/sendbulk-emails', email);
    
          // Clear form after sending
          setEmail({

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
        <div>
            
            <div className="email-form">
    <h1>Send group mails</h1>
    
    <label htmlFor="subject">Subject:</label>
    <input type="text" name="subject" id="subject" value={email.subject} onChange={handleInputChange} />
    
    <label htmlFor="body">Body:</label>
    <textarea name="body" id="body" value={email.body} onChange={handleInputChange}></textarea>
    
`    <button onClick={sendbulkEmail}>sendmail</button>

        </div>

        </div>
    );
};











export default FileUpload;
