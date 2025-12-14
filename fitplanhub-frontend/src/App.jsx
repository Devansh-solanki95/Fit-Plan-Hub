  import { Routes, Route } from 'react-router-dom';
  import Login from './Components/Login';
  import Register from './Components/Register';
  import UserDashboard from './Components/UserDashboard';
  import TrainerDashboard from './Components/TrainerDashboard';

  function App() {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} /> 
        <Route path="*" element={<div style={{textAlign: 'center', marginTop: '2rem'}}>Page not found</div>} />
      </Routes>
    );
  }

  export default App;