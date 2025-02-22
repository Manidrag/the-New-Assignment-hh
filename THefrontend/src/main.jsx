import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import ErrorBoundary from './ErrorBoundary'
//import { Provider } from "@/components/ui/provider"
import Project from './The'
import { BackgroundImg } from './BackgroundImages'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <BackgroundImg interval={7000}>
    <Project />
    </BackgroundImg>
    </ErrorBoundary>
    {/* </Provider> */}
  </StrictMode>,
)
