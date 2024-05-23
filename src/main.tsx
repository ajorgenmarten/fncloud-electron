import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import { AppProvider } from './app/context.tsx'
import { FlowProvider } from './components/flow/context/context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <FlowProvider>
      <App />
      </FlowProvider>
    </AppProvider>
  </React.StrictMode>,
)