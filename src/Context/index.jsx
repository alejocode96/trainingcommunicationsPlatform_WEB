import React, { useState, useEffect } from 'react';

const TrainingLogiTransContext = React.createContext();



function TrainingLogiTransProvider({ children }) {

    //manejo de modo dark
    const [theme, setTheme] = useState('light');
    //manejo de navar home
    const [sideBarHome, setSideBarHome] = useState(false);

    /**
     * Alterna entre los temas "Light" y "dark" de la aplicacion
     * 
     * Esta funcion cambia el estado ´theme´ al tema opuesto (de "light" a "dark" o viceversa)
     * y actualiza dinamicamente la clase 'dark' en el elemento raiz (´<html>´) lo que 
     * permite que Tailwind CSS aplique las variables de estilo correspondientes segun el modo activo.
     * 
     * @function toggleTheme
     * @description
     * - Cambia el valor de  `theme` utilizando el hook `setTheme`.
     * - Agrega o elimina la clase `dark` en  `document-docuemntElement`
     * - El uso de la clase `dark` es compatible con el modo oscuro de Tailwind (`dark:`)
     * 
     */
    const toggleTheme =()=>{
        const newTheme = theme ==='light'?'dark':'light';
        setTheme(newTheme);
        //cambiar la clase en el html
        if(newTheme==='dark'){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <TrainingLogiTransContext.Provider value={{
            theme, setTheme,toggleTheme,
            sideBarHome, setSideBarHome,
        }}>
            {children}
        </TrainingLogiTransContext.Provider>
    )
}

export { TrainingLogiTransContext, TrainingLogiTransProvider };