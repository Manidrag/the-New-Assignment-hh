import React from 'react'
import { useState } from 'react'
import './index.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

import { Home } from './the components/Home.jsx'
import {  Sun} from './the components/thefavourite.jsx'
import { Signup } from './the components/signup'
import { Signin } from './the components/Signin.jsx'
import {NotesDashboard} from './the components/newNavbar.jsx'

const BrowserRouter = createBrowserRouter([
    {
        path: '/',
        element: <NotesDashboard />,
        children: [
            {
                path: 'signup',
                element: <Signup />
            },
            {
                path: 'signin',
                element: <Signin />
            },
            
        ]
    },{
        
            path: '/Home/',
            element: <Home />,
            children: [
                {
                    path: 'favourite',
                    element: <Sun/>
                }
            ]
        }
    
], {
    errorElement: <ErrorBoundary />
})

function ErrorBoundary({ error }) {
    return (
        <div>
            <h1>Something went wrong</h1>
            <p>{error.message}</p>
        </div>
    )
}

function Project() {
    return (
        <RouterProvider router={BrowserRouter} />
    )
}

export default Project