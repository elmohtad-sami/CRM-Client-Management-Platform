import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ClientsProvider } from './context/ClientsContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ClientsProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/clients/:id" element={<App />} />
            <Route path="*" element={<App />} />
          </Routes>
        </ClientsProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
