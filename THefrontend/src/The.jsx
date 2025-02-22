import React from 'react'
import { useState } from 'react'
import './index.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

import { Home } from './the components/the Home/Home.jsx'

import { Signup } from './the components/signup'
import { Signin } from './the components/Signin.jsx'
import {NotesDashboard} from './the components/newNavbar.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

const BrowserRouter = createBrowserRouter([
    {
        path: '/',
        element: <NotesDashboard />,
    },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/signin',
                element: <Signin />
            },
            
        
    ,{
        
            path: '/Home',
            element: <Home />,
            children: [
                
            ]
        }
    
], )

///t//t
function Project() {
    return (
        <ErrorBoundary>
        <RouterProvider router={BrowserRouter} />
        </ErrorBoundary>
    )
}

export default Project