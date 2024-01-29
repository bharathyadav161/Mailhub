
import './App.css';
import Home from './Components/Home';
import Headers from './Components/Headers';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import { CommunicationHistoryTable } from './Components/History';
import Group from './Components/Test';
import Error from './Components/Error';
import { Routes, Route } from "react-router-dom"
import { Footer } from './Components/Footer';

function App() {
  return (
    <>
      <Headers />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/test' element={<Group/>}/>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/data-table' element={<CommunicationHistoryTable/>} />
        <Route path='*' element={<Error />} />
      </Routes>
     <Footer/>
    </>
  );
}

export default App;
