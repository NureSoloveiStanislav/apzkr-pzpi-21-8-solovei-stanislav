import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.scss';
import {LanguageProvider, useLanguage} from './LanguageContext';
import {TypeUser} from "./types/TypeUser";
import Home from "./pages/Home/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Users from "./pages/Admin/Users/Users";
import Materials from "./pages/Admin/Materials/Materials";
import Services from "./pages/Admin/Services/Services";
import Cleaning from "./pages/Admin/Cleaning/Cleaning";

const AppContent = () => {
  const {translate, setLanguage, language} = useLanguage();
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [user, setUser] = useState<TypeUser>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <Routes>
        <Route path={'/'}
               element={<Home user={user} setShowLoginForm={setShowLoginForm} showLoginForm={showLoginForm}
                              setUser={setUser}/>}/>
        <Route path={'/admin/users'} element={<Users user={user} setShowLoginForm={setShowLoginForm} />} />
        <Route path={'/admin/services'} element={<Services user={user} setShowLoginForm={setShowLoginForm} />} />
        <Route path={'/admin/cleaning'} element={<Cleaning user={user} setShowLoginForm={setShowLoginForm} />} />
        <Route path={'/admin/materials'} element={<Materials user={user} setShowLoginForm={setShowLoginForm} />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent/>
    </LanguageProvider>
  );
}

export default App;
