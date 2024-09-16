import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <form action='http://localhost:3001/inquiry' method='POST'>
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
      </header>
    </div>
  );
}

export default App;
