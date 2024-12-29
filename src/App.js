import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import FavoriteMovies from './pages/FavoriteMovies';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/favorites" element={<FavoriteMovies/>} />
      </Routes>
    </div>
  );
}

export default App;
