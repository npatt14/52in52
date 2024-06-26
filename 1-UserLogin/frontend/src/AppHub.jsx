import React from 'react'
import { Routes, Route } from 'react-router-dom';
import App from './App';
import SignUp from './SignUp';
import Success from './Success';

const AppHub = () => {
  return (
    <Routes>
        <Route path='/' element={<App />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/success' element={<Success message="Operation Successful" />} />
    </Routes>
  )
}

export default AppHub