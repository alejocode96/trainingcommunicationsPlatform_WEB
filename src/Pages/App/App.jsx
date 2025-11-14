import { useEffect } from "react";
import { BrowserRouter, useRoutes } from 'react-router-dom';
import React from 'react'

//contexto
import { TrainingLogiTransProvider } from '../../Context';


//Pages
import Home from "../Home";

//Components
import LayoutWithHeader from "../../Components/Home/header";

//Rutas
const AppRoutes = () => {
  let routes = useRoutes([
    {
      element: <LayoutWithHeader />,
      children: [
        { path: '/', element: <Home /> }
      ]
    },
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
