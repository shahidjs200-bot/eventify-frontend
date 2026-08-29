import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster 
      position="top-right" 
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable/>
  </StrictMode>,
);
