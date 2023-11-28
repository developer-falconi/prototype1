import { Route, Routes } from 'react-router-dom';
import './App.scss';
import TicketMain from './ticket/TicketMain';
import Admin from './admin/Admin';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<TicketMain />} />
        <Route exact path='/admin' element={<Admin />} />
      </Routes>
    </div >
  );
}

export default App;
