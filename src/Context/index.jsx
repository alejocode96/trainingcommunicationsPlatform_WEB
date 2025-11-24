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
    //manejo de progreso de entrenamientos
    const [userProgressTraining, setUserProgressTraining] = useState([]);

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
            title: "CAPACITACIÓN ANUAL SARLAFT 2026",
            subtitle: "Prevención y control en empresas de transporte",
            direcionamiento: "sarlaft", firma: firmaSarlaft, imagePortada: sarlaftCurso,
            description: [
                "Este curso tiene como propósito Fortalecer los conocimientos y la cultura de los colaboradores de la empresa de transporte frente a la ** prevención de los riesgos de lavado de activo, financiación del terrorismo y de la proliferación de armas de destrucción masiva.**",
                "A lo largo de la formación, los participantes adquirirán herramientas para identificar, reportar y mitigar operaciones sospechosas, contribuyendo al sistema de control de estos riesgos."
            ]
        },
        {
            id: 3,
            title: "CAPACITACIÓN ANUAL SARLAFT 2028",
            subtitle: "Prevención y control en empresas de transporte",
            direcionamiento: "sarlaft", firma: firmaSarlaft, imagePortada: sarlaftCurso,
            description: [
                "Este curso tiene como propósito Fortalecer los conocimientos y la cultura de los colaboradores de la empresa de transporte frente a la ** prevención de los riesgos de lavado de activo, financiación del terrorismo y de la proliferación de armas de destrucción masiva.**",
                "A lo largo de la formación, los participantes adquirirán herramientas para identificar, reportar y mitigar operaciones sospechosas, contribuyendo al sistema de control de estos riesgos."
            ]
        },


    ]

    const defaultcomunication = [
        {
            id: 1,
            title: "Boletín Informativo Enero",
            subtitle: "Noticias corporativas",
            description: ["Mantente al día con las últimas novedades de **Logitrans**. Descubre proyectos, logros y anuncios importantes para toda la organización."],
            imagePortada: sarlaftCurso,
            date: "Ene 2025"
        },
        {
            id: 2,
            title: "Actualización de Políticas",
            subtitle: "Recursos Humanos",
            description: ["Conoce las nuevas **políticas de seguridad** y procedimientos actualizados para mejorar nuestro ambiente laboral."],
            imagePortada: sarlaftCurso,
            date: "Feb 2025"
        },
        {
            id: 3,
            title: "Revista Corporativa",
            subtitle: "Cultura organizacional",
            description: ["Lee historias inspiradoras de nuestros colaboradores y descubre cómo **juntos construimos** un mejor futuro."],
            imagePortada: sarlaftCurso,
            date: "Mar 2025"
        }
    ];


    /**
      * Inicializa y sincroniza el progreso de entrenamientos con localStorage.
      * 
      * Comportamiento:
      * - Lee el localStorage 'userProgressTrainingV1'
      * - Si no existe, crea la estructura inicial con todos los defaultTrainings
      * - Si existe, valida que todos los entrenamientos estén sincronizados:
      *   * Agrega nuevos entrenamientos que falten
      *   * Actualiza títulos si han cambiado
      * - Actualiza el estado con la información sincronizada
      * 
      * Estructura de cada item de progreso:
      * {
      *   id: number,
      *   title: string,
      *   nombre: string,
      *   cedula: string,
      *   cumplimiento: number,
      *   startedAt: string,
      *   lastAccessAt: string,
      *   currentModule: number,
      *   completeModules: array
      * }
      */
    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem('userProgressTrainingV1');
            let progressData = [];

            if (!storedProgress) {
                // No existe el localStorage, crear estructura inicial
                progressData = defaultTrainings.map(training => ({
                    id: training.id,
                    title: training.title,
                    nombre: '',
                    cedula: '',
                    cumplimiento: 0,
                    startedAt: '',
                    lastAccessAt: '',
                    currentModule: 0,
                    completeModules: []
                }));

                localStorage.setItem('userProgressTrainingV1', JSON.stringify(progressData));
            } else {
                // Existe el localStorage, validar y sincronizar
                progressData = JSON.parse(storedProgress);

                // Crear un mapa de los entrenamientos actuales (defaultTrainings)
                const defaultTrainingsMap = new Map(
                    defaultTrainings.map(training => [training.id, training])
                );

                // Crear un mapa de los entrenamientos existentes para búsqueda rápida
                const existingProgressMap = new Map(
                    progressData.map(item => [item.id, item])
                );

                let needsUpdate = false;

                // 1. Filtrar: eliminar entrenamientos que ya no existen en defaultTrainings
                const filteredProgress = progressData.filter(item => {
                    if (!defaultTrainingsMap.has(item.id)) {
                        needsUpdate = true;
                        return false; // Eliminar este item
                    }
                    return true; // Mantener este item
                });

                progressData = filteredProgress;

                // Actualizar el mapa después del filtrado
                const updatedProgressMap = new Map(
                    progressData.map(item => [item.id, item])
                );

                // 2. Validar cada defaultTraining: agregar nuevos o actualizar títulos
                defaultTrainings.forEach(training => {
                    const existingProgress = updatedProgressMap.get(training.id);

                    if (!existingProgress) {
                        // No existe, agregarlo
                        progressData.push({
                            id: training.id,
                            title: training.title,
                            nombre: '',
                            cedula: '',
                            cumplimiento: 0,
                            startedAt: '',
                            lastAccessAt: '',
                            currentModule: 0,
                            completeModules: []
                        });
                        needsUpdate = true;
                    } else if (existingProgress.title !== training.title) {
                        // El título cambió, actualizarlo
                        existingProgress.title = training.title;
                        needsUpdate = true;
                    }
                });

                // Si hubo cambios, actualizar el localStorage
                if (needsUpdate) {
                    localStorage.setItem('userProgressTrainingV1', JSON.stringify(progressData));
                }
            }

            // Actualizar el estado
            setUserProgressTraining(progressData);

        } catch (e) {
            console.error('Error al manejar userProgressTrainingV1:', e);
            // En caso de error, inicializar con estructura vacía
            const initialData = defaultTrainings.map(training => ({
                id: training.id,
                title: training.title,
                nombre: '',
                cedula: '',
                cumplimiento: 0,
                startedAt: '',
                lastAccessAt: '',
                currentModule: 0,
                completeModules: []
            }));
            setUserProgressTraining(initialData);
        }
    }, []);




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
            defaultTrainings, defaultcomunication
        }}>
            {children}
        </TrainingLogiTransContext.Provider>
    )
}

export { TrainingLogiTransContext, TrainingLogiTransProvider };