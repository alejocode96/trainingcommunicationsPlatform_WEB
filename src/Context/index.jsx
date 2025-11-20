import React, { useState, useEffect } from 'react';

const TrainingLogiTransContext = React.createContext();

//imagenes
import firmaSarlaft from '../assets/firma_vanesa.png';
import sarlaftCurso from '../assets/sarlaftCurso.png'

function TrainingLogiTransProvider({ children }) {

    //manejo de modo dark
    const [theme, setTheme] = useState(() => { return localStorage.getItem('theme') || 'light'; });
    //manejo de navar home
    const [sideBarHome, setSideBarHome] = useState(false);


    const defaultTrainings = [
        {
            id: 1,
            title: "CAPACITACIÓN ANUAL SARLAFT 2025",
            subtitle: "Prevención y control en empresas de transporte",
            direcionamiento: "sarlaft", firma: firmaSarlaft, imagePortada: sarlaftCurso,
            description: [
                "Este curso tiene como propósito Fortalecer los conocimientos y la cultura de los colaboradores de la empresa de transporte frente a la ** prevención de los riesgos de lavado de activo, financiación del terrorismo y de la proliferación de armas de destrucción masiva.**",
                "A lo largo de la formación, los participantes adquirirán herramientas para identificar, reportar y mitigar operaciones sospechosas, contribuyendo al sistema de control de estos riesgos."
            ]
        },
        {
            id: 2,
            title: "CAPACITACIÓN ANUAL SARLAFT 2025",
            subtitle: "Prevención y control en empresas de transporte",
            direcionamiento: "sarlaft", firma: firmaSarlaft, imagePortada: sarlaftCurso,
            description: [
                "Este curso tiene como propósito Fortalecer los conocimientos y la cultura de los colaboradores de la empresa de transporte frente a la ** prevención de los riesgos de lavado de activo, financiación del terrorismo y de la proliferación de armas de destrucción masiva.**",
                "A lo largo de la formación, los participantes adquirirán herramientas para identificar, reportar y mitigar operaciones sospechosas, contribuyendo al sistema de control de estos riesgos."
            ]
        },

        {
            id: 3,
            title: "CAPACITACIÓN ANUAL SARLAFT 2025",
            subtitle: "Prevención y control en empresas de transporte",
            direcionamiento: "sarlaft", firma: firmaSarlaft, imagePortada: sarlaftCurso,
            description: [
                "Este curso tiene como propósito Fortalecer los conocimientos y la cultura de los colaboradores de la empresa de transporte frente a la ** prevención de los riesgos de lavado de activo, financiación del terrorismo y de la proliferación de armas de destrucción masiva.**",
                "A lo largo de la formación, los participantes adquirirán herramientas para identificar, reportar y mitigar operaciones sospechosas, contribuyendo al sistema de control de estos riesgos."
            ]
        }
    ]


    /**
     * Alterna entre los temas "light" y "dark".
     *
     * - Invierte el valor actual del estado `theme`.
     * - Persiste la nueva preferencia en localStorage.
     * - Añade o remueve la clase `dark` en el elemento raíz (<html>) para
     *   activar las variantes `dark:` de Tailwind CSS.
     *
     * Nota: proteger el acceso a document/localStorage si el componente puede
     * ejecutarse en un entorno sin DOM (SSR).
     *
     * @function
     */
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            // Manejo suave si localStorage no está disponible
        }

        if (typeof document !== 'undefined') {
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    /**
     * Sincroniza la clase `dark` en <html> con el estado `theme`.
     *
     * Comportamiento:
     * - Si theme === 'dark' añade la clase `dark` al elemento raíz.
     * - Si theme === 'light' la elimina.
     *
     * Dependencias: [theme] — el efecto se ejecuta cada vez que cambia `theme`.
     */
    useEffect(() => {
        if (typeof document === 'undefined') return;

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);


    /**
     * Cierra automáticamente el sidebar cuando el ancho de la ventana es < 1024px.
     *
     * - Ejecuta la comprobación al montar (por si la página se carga en móvil).
     * - Suscribe un listener a 'resize' para ocultar el sidebar si se redimensiona a < 1024px.
     * - Limpia el listener al desmontar.
     *
     * Dependencias: [] — este efecto se ejecuta solo al montar/desmontar.
     */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSideBarHome(false);
            }
        };

        handleResize(); // ejecución inicial
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <TrainingLogiTransContext.Provider value={{
            theme, setTheme, toggleTheme,
            sideBarHome, setSideBarHome,
            defaultTrainings
        }}>
            {children}
        </TrainingLogiTransContext.Provider>
    )
}

export { TrainingLogiTransContext, TrainingLogiTransProvider };