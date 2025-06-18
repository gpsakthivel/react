import './App.css';
import Counter from './components/Counter';
// import Greet from './components/Greet';
// import Hello from './components/Hello';
// import Welcome from './components/Welcome';
import Message from './components/Message';

function App() {
  return (
    <div className="App">
      {/* Rendering components */}
      {/* <Greet></Greet> */}
      {/* <Welcome /> */}
      {/* <Hello /> */}

      {/* Props in Functional component */}
      {/* <Greet name="Bruce" heroName="Batman">
        <p>This is children props</p>
      </Greet>
      <Greet name="Clark" heroName="Superman">
        <button>Action</button>
      </Greet>
      <Greet name="Diana" heroName="Wonder Woman" /> */}

      {/* Props in Class component */}
      {/* <Welcome name="Bruce" heroName="Batman">
        <p>This is children props</p>
      </Welcome>
      <Welcome name="Clark" heroName="Superman">
        <button>Action</button>
      </Welcome>
      <Welcome name="Diana" heroName="Wonder Woman" /> */}

      {/* Use state */}
      {/* <Message /> */}

      {/* Use setState */}
      <Counter />
    </div>
  );
}

export default App;
