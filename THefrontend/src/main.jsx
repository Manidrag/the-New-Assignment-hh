import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
//import { Provider } from "@/components/ui/provider"
import Project from './The'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Project />
    {/* </Provider> */}
  </StrictMode>,
)
