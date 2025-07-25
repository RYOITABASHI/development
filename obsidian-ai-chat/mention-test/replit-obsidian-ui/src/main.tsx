import React from 'react'
import ReactDOM from 'react-dom/client'
import ConductorPanel from './components/ConductorPanel'
import './index.css'

// Set dark mode by default for Obsidian-like experience
document.documentElement.classList.add('dark')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConductorPanel />
  </React.StrictMode>,
)