import { Route, Routes } from 'react-router-dom';
import './App.scss';
import TicketMain from './ticket/TicketMain';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<TicketMain />} />
      </Routes>
    </div >
  );
}

export default App;
