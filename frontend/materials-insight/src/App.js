import React, {useState} from 'react';
import logo from './logo.svg';
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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <form onSubmit={handleSubmit}>
          <label for='alloy'>Choose an alloy to inquire about: </label>
          <select id='alloy' name='alloy'>
            <option value='alloy1'>Alloy 1</option>
            <option value='alloy2'>Alloy 2</option>
            <option value='alloy3'>Alloy 3</option>
          </select>
          <label>Enter inquiry: </label>
          <input placeholder='Enter inquiry' name='inquiry'></input>
          <input type='submit'></input>
        </form>
          {response && <div><h3>Response:</h3><p>{response}</p></div>}
          {error && <div><h3>Error:</h3><p>{error}</p></div>}
      </header>
    </div>
  );
}

export default App;
