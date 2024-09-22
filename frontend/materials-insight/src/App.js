import React, {useState} from 'react';
import './App.css';

function App() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      alloy: formData.get('alloy'),
      inquiry: formData.get('inquiry'),
      inquiryType: formData.get('inquiryType'),
    };

    try {
      const res = await fetch('http://localhost:3001/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      setResponse(result.response);
      setError('');
    } catch (err) {
      console.error('Error message:', err);
      setResponse('');
      setError('Failed to fetch response from server');
    }
  };

  const renderResponse = (response) => {
    if (response.includes('\n')) {
      const items = response.split('\n').filter(item => item.trim() !== '');
      return (
        <ul>
          {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      );
    }
    if (response.includes('```')) {
      // If response includes code-like formatting (with backticks), format it as code
      const code = response.split('```')[1]; // Extract the code inside the backticks
      return (
        <pre><code>{code}</code></pre>
      );
    }
    return <p>{response}</p>;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Materials Inquiry Prototype</h1>
        <p>
        Enter the alloy you want to inquire about and ask your questions below
        </p>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='alloy'>Choose an alloy to inquire about: </label>
            <select id='alloy' name='alloy'>
              <option value='az31'>AZ31</option>
              <option value='ss316'>SS316</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='inquiryType'>Enter inquiry type: </label>
            <select id='inquiryType' name='inquiryType'>
              <option value='property'>Property</option>
              <option value='graph'>Graph</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='inquiry'>Enter your inquiry: </label>
            <input 
            type='text' 
            id='inquiry' 
            name='inquiry' 
            placeholder='What do you want to know?'
            required/>
          </div>
          <button type='submit' className="submit-button">Submit</button>
        </form>
          {response && <div><h3>Response:</h3><p>{renderResponse(response)}</p></div>}
          {error && <div><h3>Error:</h3><p>{error}</p></div>}
      </header>
    </div>
  );
}

export default App;
