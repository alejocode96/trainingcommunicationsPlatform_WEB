import React, { useState, useEffect } from 'react';

const TrainingLogiTransContext = React.createContext();



function TrainingLogiTransProvider({ children }) {

    //manejo de modo dark
    const [theme, setTheme] = useState(() => { return localStorage.getItem('theme') || 'light'; });
    //manejo de navar home
    const [sideBarHome, setSideBarHome] = useState(false);

    /**
     * Alterna entre los temas "light" y "dark" de la aplicación.
     *
     * Esta función invierte el valor del estado `theme`, guardando la nueva
     * preferencia en `localStorage` para que persista entre sesiones. Además,
     * actualiza dinámicamente la clase `dark` en el elemento raíz (`<html>`),
     * permitiendo que Tailwind CSS active las variantes de modo oscuro (`dark:`).
     *
     * @function toggleTheme
     * @description
     * - Cambia el valor del estado `theme` usando `setTheme`.
     * - Guarda el tema actualizado en `localStorage`.
     * - Agrega o elimina la clase `dark` en `document.documentElement`.
     * - Activa o desactiva las variaciones `dark:` provistas por Tailwind CSS.
    */
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        // Guardar preferencia en localStorage
        localStorage.setItem('theme', newTheme);

        //cambiar la clase en el html
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    /**
     * Sincroniza el estado `theme` con la clase `dark` en el elemento raíz (`<html>`).
     *
     * Este efecto se ejecuta cada vez que cambia `theme`, garantizando que la
     * clase correspondiente se aplique correctamente incluso si el estado se carga
     * desde `localStorage` o desde un contexto global.
     *
     * @effect
     * @description
     * - Si `theme` es "dark", agrega la clase `dark` al `<html>`.
     * - Si `theme` es "light", elimina la clase `dark`.
     * - Tailwind CSS utiliza esta clase para habilitar sus variantes de modo oscuro.
     *
     * @dependencies [theme]
     * Este efecto se ejecuta únicamente cuando cambia el valor de `theme`.
    */
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    /**
     * Oculta automáticamente el sidebar (`sidebarHome`) cuando la ventana cambia
     * a un ancho menor que 1024px.
     *
     * Este efecto garantiza que si el usuario está en pantalla grande (desktop)
     * y reduce el tamaño a una vista móvil, el sidebar se cierre automáticamente.
     * También se ejecuta al montar el componente para cubrir el caso en el que
     * la página se abra directamente en un dispositivo móvil.
     *
     * @effect
     * @description
     * - Escucha cambios en el tamaño de la ventana (`resize`).
     * - Si el ancho es menor a 1024px (punto `lg` de Tailwind), cierra `sidebarHome`.
     * - Limpia el listener cuando el componente se desmonta.
     *
     * @dependencies []
     * Este efecto se ejecuta solo una vez al montar el componente.
    */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSideBarHome(false);
            }
        };
        //Ejecutar una vez al montar (por si el usuario abre desde movil)
        handleResize();

        //Escuhar cambios de tamaño
        window.addEventListener('resize', handleResize);

        //limpiar el listener
        return () => window.removeEventListener('resize', handleResize)

    }, []);

    return (
        <TrainingLogiTransContext.Provider value={{
            theme, setTheme, toggleTheme,
            sideBarHome, setSideBarHome,
        }}>
            {children}
        </TrainingLogiTransContext.Provider>
    )
}

export { TrainingLogiTransContext, TrainingLogiTransProvider };