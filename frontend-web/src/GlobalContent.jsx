import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Importar Nunito
import "@fontsource/nunito/400.css"; // regular
import "@fontsource/nunito/500.css"; // medium
import "@fontsource/nunito/700.css"; // bold

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      
      <a href="#main-content" className='sr-only'>
        Saltar al contenido principal
      </a>

      <App />
    </StrictMode>
  </BrowserRouter>
)
