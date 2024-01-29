
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './history.css';
/*export const History = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the server's API endpoint
    axios.get('http://localhost:6005/api/data')
      .then(response => {
        setData(response.data);
        
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <center><h2>View your communication History</h2></center>
      <table className="data-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Subject</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {data.slice().reverse().map(item => (
            <tr key={item._id}>
              <td>{item.to}</td>

              <td>{item.subject}</td>
              <td>{item.body}</td>
            </tr>
          ))}
          
        </tbody>
      </table>
      

    </div>
  );
};
*/



export const CommunicationHistoryTable = () => {
  const [communicationHistory, setCommunicationHistory] = useState([]);

  useEffect(() => {
    const fetchCommunicationHistory = async () => {
      try {
        const response = await axios.get('http://localhost:6005/mailhistory'); // Replace with your server endpoint
        setCommunicationHistory(response.data.Messages);
      } catch (error) {
        console.error('Error fetching communication history:', error.message);
      }
    };

    fetchCommunicationHistory();
  }, []);

  return (
    <div >
      <center><h2>View your communication History</h2></center>
      <table className="data-table">
        <thead>
          <tr>
            <th>MessageID</th>
            <th>MessageStream</th>
            <th>To</th>
            <th>From</th>
            <th>Subject</th>
            <th>ReceivedAt</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {communicationHistory.map(message => (
            <tr key={message.MessageID}>
              <td>{message.MessageID}</td>
              <td>{message.MessageStream}</td>
              <td>{message.To[0].Email}</td> {/* Assuming there is only one recipient */}
              <td>{message.From}</td>
              <td>{message.Subject}</td>
              <td>{message.ReceivedAt}</td>
              <td>{message.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};




