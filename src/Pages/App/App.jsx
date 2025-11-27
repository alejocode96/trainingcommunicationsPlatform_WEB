import { useEffect } from "react";
import { BrowserRouter, useRoutes } from 'react-router-dom';
import React from 'react'

//contexto
import { TrainingLogiTransProvider } from '../../Context';


//Pages
import Home from "../Home";
import Training from "../Training";
//Components
import LayoutWithHeader from "../../Components/Home/header";

//Rutas
const AppRoutes = () => {
  let routes = useRoutes([
    {
      element: <LayoutWithHeader />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/training/:courseId', element: <Training /> },
      ]
    },
     { path: '/training/:courseId/module/:moduleId', element: <Training /> }
  ]);
  return routes
}

function App() {


  return (
    <TrainingLogiTransProvider>
      <BrowserRouter>
        <AppRoutes ></AppRoutes>
      </BrowserRouter>
    </TrainingLogiTransProvider>
  )
}

export default App
