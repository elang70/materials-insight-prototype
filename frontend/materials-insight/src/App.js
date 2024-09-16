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
          {response && <div><h3>Response:</h3><p>{response}</p></div>}
          {error && <div><h3>Error:</h3><p>{error}</p></div>}
      </header>
    </div>
  );
}

export default App;
