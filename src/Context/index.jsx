/**
 * @fileoverview Contexto global para la gestión de entrenamientos y configuración de usuario en LogiTrans.
 * Proporciona funcionalidades para el manejo del tema visual, progreso de capacitaciones,
 * y sincronización con localStorage.
 * 
 * @module TrainingLogiTransContext
 * @requires react
 * @requires ../assets/firma_vanesa.png
 * @requires ../assets/sarlaftCurso.png
 */

import React, { useState, useEffect } from 'react';

// ============================================================================
// IMPORTACIÓN DE RECURSOS
// ============================================================================

import firmaSarlaft from '../assets/firma_vanesa.png';
import sarlaftCurso from '../assets/sarlaftCurso.png';

// ============================================================================
// CONTEXTO DE REACT
// ============================================================================

/**
 * Contexto de React para compartir estado global relacionado con entrenamientos
 * y configuraciones de usuario en la aplicación LogiTrans.
 * 
 * @type {React.Context}
 */
const TrainingLogiTransContext = React.createContext();

// ============================================================================
// PROVEEDOR DEL CONTEXTO
// ============================================================================

/**
 * Proveedor del contexto de entrenamientos LogiTrans.
 * Gestiona el estado global de la aplicación y proporciona funciones para
 * interactuar con el progreso de capacitaciones almacenado en localStorage.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 * 
 * @example
 * // Uso en App.js o index.js
 * <TrainingLogiTransProvider>
 *   <App />
 * </TrainingLogiTransProvider>
 */
function TrainingLogiTransProvider({ children }) {

    // ========================================================================
    // ESTADOS LOCALES
    // ========================================================================

    /**
     * Estado del tema visual de la aplicación ('light' | 'dark').
     * Se inicializa desde localStorage o usa 'light' como valor predeterminado.
     * 
     * @type {[string, Function]}
     */
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    /**
     * Estado de visibilidad del sidebar en la vista home.
     * 
     * @type {[boolean, Function]}
     */
    const [sideBarHome, setSideBarHome] = useState(false);

    /**
     * Estado que contiene el progreso de todos los entrenamientos del usuario.
     * Sincronizado con localStorage bajo la key 'userProgressTrainingV1'.
     * 
     * @type {[Array<TrainingProgress>, Function]}
     */
    const [userProgressTraining, setUserProgressTraining] = useState([]);

    /**
     * Estado que controla la visibilidad del modal de cursos.
     * 
     * @type {[boolean, Function]}
     */
    const [isModalOpen, setIsModalOpen] = useState(false);

    /**
     * Estado que almacena el entrenamiento actualmente seleccionado.
     * 
     * @type {[Training|null, Function]}
     */
    const [selectedTraining, setSelectedTraining] = useState(null);

    // ========================================================================
    // DATOS ESTÁTICOS - ENTRENAMIENTOS
    // ========================================================================

    /**
     * Catálogo de entrenamientos disponibles en la plataforma.
     * Define la estructura base de cada capacitación SARLAFT.
     * 
     * @typedef {Object} Training
     * @property {number} id - Identificador único del entrenamiento
     * @property {string} title - Título completo del curso
     * @property {string} date - Fecha de publicación o vigencia
     * @property {string} subtitle - Subtítulo o descripción corta
     * @property {string} direcionamiento - Ruta o identificador de navegación
     * @property {string} firma - URL de la imagen de firma del instructor
     * @property {string} imagePortada - URL de la imagen de portada del curso
     * @property {string} [icon] - Emoji o icono representativo (opcional)
     * @property {string[]} description - Array de párrafos descriptivos del curso
     * 
     * @type {Training[]}
     * @constant
     */
    const defaultTrainings = [
        {
            id: 1,
            title: "CAPACITACIÓN ANUAL SARLAFT 2025",
            date: 'SEP 2025',
            subtitle: "Prevención y control en empresas de transporte",
            direcionamiento: "sarlaft",
            firma: firmaSarlaft,
            imagePortada: sarlaftCurso,
            icon: '👨🏻‍💻',
            description: [
                "Este curso tiene como propósito Fortalecer los conocimientos y la cultura de los colaboradores de la empresa de transporte frente a la ** prevención de los riesgos de lavado de activo, financiación del terrorismo y de la proliferación de armas de destrucción masiva.**",
                "A lo largo de la formación, los participantes adquirirán herramientas para identificar, reportar y mitigar operaciones sospechosas, contribuyendo al sistema de control de estos riesgos."
            ]
        },
        {
            id: 2,
            title: "CAPACITACIÓN ANUAL SARLAFT 2026",
            date: 'SEP 2025',
            subtitle: "Prevención y control en empresas de transporte",
            direcionamiento: "sarlaft",
            firma: firmaSarlaft,
            imagePortada: sarlaftCurso,
            description: [
                "Este curso tiene como propósito Fortalecer los conocimientos y la cultura de los colaboradores de la empresa de transporte frente a la ** prevención de los riesgos de lavado de activo, financiación del terrorismo y de la proliferación de armas de destrucción masiva.**",
                "A lo largo de la formación, los participantes adquirirán herramientas para identificar, reportar y mitigar operaciones sospechosas, contribuyendo al sistema de control de estos riesgos."
            ]
        },
        {
            id: 3,
            title: "CAPACITACIÓN ANUAL SARLAFT 2028",
            date: 'SEP 2025',
            subtitle: "Prevención y control en empresas de transporte",
            direcionamiento: "sarlaft",
            firma: firmaSarlaft,
            imagePortada: sarlaftCurso,
            description: [
                "Este curso tiene como propósito Fortalecer los conocimientos y la cultura de los colaboradores de la empresa de transporte frente a la ** prevención de los riesgos de lavado de activo, financiación del terrorismo y de la proliferación de armas de destrucción masiva.**",
                "A lo largo de la formación, los participantes adquirirán herramientas para identificar, reportar y mitigar operaciones sospechosas, contribuyendo al sistema de control de estos riesgos."
            ]
        },
    ];

    // ========================================================================
    // DATOS ESTÁTICOS - COMUNICACIONES
    // ========================================================================

    /**
     * Catálogo de comunicaciones corporativas disponibles.
     * Define boletines, actualizaciones y contenido informativo para los colaboradores.
     * 
     * @typedef {Object} Communication
     * @property {number} id - Identificador único de la comunicación
     * @property {string} title - Título del comunicado
     * @property {string} subtitle - Categoría o tema del comunicado
     * @property {string[]} description - Contenido descriptivo (soporta Markdown)
     * @property {string} imagePortada - URL de la imagen de portada
     * @property {string} date - Fecha de publicación en formato corto
     * 
     * @type {Communication[]}
     * @constant
     */
    const defaultcomunication = [
        {
            id: 1,
            title: "Boletín Informativo Enero",
            subtitle: "Noticias corporativas",
            description: [
                "Mantente al día con las últimas novedades de **Logitrans**. Descubre proyectos, logros y anuncios importantes para toda la organización."
            ],
            imagePortada: sarlaftCurso,
            date: "Ene 2025"
        },
        {
            id: 2,
            title: "Actualización de Políticas",
            subtitle: "Recursos Humanos",
            description: [
                "Conoce las nuevas **políticas de seguridad** y procedimientos actualizados para mejorar nuestro ambiente laboral."
            ],
            imagePortada: sarlaftCurso,
            date: "Feb 2025"
        },
        {
            id: 3,
            title: "Revista Corporativa",
            subtitle: "Cultura organizacional",
            description: [
                "Lee historias inspiradoras de nuestros colaboradores y descubre cómo **juntos construimos** un mejor futuro."
            ],
            imagePortada: sarlaftCurso,
            date: "Mar 2025"
        }
    ];

    // ========================================================================
    // FUNCIONES DE UTILIDAD - SINCRONIZACIÓN
    // ========================================================================

    /**
     * Sincroniza el estado del componente con los datos almacenados en localStorage.
     * Lee la información de progreso de entrenamientos y actualiza el estado local.
     * 
     * Esta función es invocada automáticamente por los listeners de storage cuando:
     * - Se detecta un cambio en otra pestaña del navegador
     * - Se dispara un evento personalizado 'localStorageUpdated' en la misma pestaña
     * 
     * @function
     * @returns {void}
     * 
     * @fires Event#localStorageUpdated
     * 
     * @example
     * // Llamada directa (generalmente no necesaria, se ejecuta automáticamente)
     * syncProgressFromStorage();
     */
    const syncProgressFromStorage = () => {
        try {
            const storedProgress = localStorage.getItem('userProgressTrainingV1');
            
            if (!storedProgress) {
                // Crear estructura inicial si no existe
                const initialData = defaultTrainings.map(training => ({
                    id: training.id,
                    title: training.title,
                    name: '',
                    documentId: '',
                    completion: 0,
                    startedAt: '',
                    lastAccessAt: '',
                    currentModule: 0,
                    completedModules: []
                }));
                
                localStorage.setItem('userProgressTrainingV1', JSON.stringify(initialData));
                setUserProgressTraining(initialData);
                return;
            }

            const progressData = JSON.parse(storedProgress);
            setUserProgressTraining(progressData);

        } catch (e) {
            console.error('Error al sincronizar desde localStorage:', e);
        }
    };

    // ========================================================================
    // EFFECTS - INICIALIZACIÓN Y SINCRONIZACIÓN
    // ========================================================================

    /**
     * Efecto de inicialización del progreso de entrenamientos.
     * 
     * Ejecuta las siguientes operaciones al montar el componente:
     * 1. Lee la key 'userProgressTrainingV1' de localStorage
     * 2. Si no existe, crea la estructura inicial basada en defaultTrainings
     * 3. Si existe, valida y sincroniza todos los entrenamientos:
     *    - Remueve entrenamientos obsoletos (que ya no existen en defaultTrainings)
     *    - Agrega entrenamientos nuevos que falten
     *    - Actualiza títulos si han cambiado en defaultTrainings
     * 4. Actualiza el estado con la información sincronizada
     * 
     * @typedef {Object} TrainingProgress
     * @property {number} id - ID del entrenamiento (debe coincidir con Training.id)
     * @property {string} title - Título del curso
     * @property {string} name - Nombre del usuario que toma el curso
     * @property {string} documentId - Documento de identificación del usuario
     * @property {number} completion - Porcentaje de completitud (0-100)
     * @property {string} startedAt - Fecha ISO de inicio del curso
     * @property {string} lastAccessAt - Fecha ISO del último acceso
     * @property {number} currentModule - Módulo actual del usuario (índice)
     * @property {number[]} completedModules - Array de IDs de módulos completados
     * 
     * @hook
     * @effect
     * @dependencies [] - Se ejecuta solo al montar
     */
    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem('userProgressTrainingV1');
            let progressData = [];

            if (!storedProgress) {
                // Crear estructura inicial
                progressData = defaultTrainings.map(training => ({
                    id: training.id,
                    title: training.title,
                    name: '',
                    documentId: '',
                    completion: 0,
                    startedAt: '',
                    lastAccessAt: '',
                    currentModule: 0,
                    completedModules: []
                }));

                localStorage.setItem('userProgressTrainingV1', JSON.stringify(progressData));

            } else {
                // localStorage existe → validar y sincronizar
                progressData = JSON.parse(storedProgress);

                const defaultTrainingsMap = new Map(
                    defaultTrainings.map(training => [training.id, training])
                );

                let needsUpdate = false;

                // 1. Remover entrenamientos que ya no existen
                const filteredProgress = progressData.filter(item => {
                    if (!defaultTrainingsMap.has(item.id)) {
                        needsUpdate = true;
                        return false;
                    }
                    return true;
                });

                progressData = filteredProgress;

                const updatedProgressMap = new Map(
                    progressData.map(item => [item.id, item])
                );

                // 2. Agregar faltantes o actualizar títulos
                defaultTrainings.forEach(training => {
                    const existingProgress = updatedProgressMap.get(training.id);

                    if (!existingProgress) {
                        progressData.push({
                            id: training.id,
                            title: training.title,
                            name: '',
                            documentId: '',
                            completion: 0,
                            startedAt: '',
                            lastAccessAt: '',
                            currentModule: 0,
                            completedModules: []
                        });
                        needsUpdate = true;

                    } else if (existingProgress.title !== training.title) {
                        existingProgress.title = training.title;
                        needsUpdate = true;
                    }
                });

                if (needsUpdate) {
                    localStorage.setItem('userProgressTrainingV1', JSON.stringify(progressData));
                }
            }

            setUserProgressTraining(progressData);

        } catch (e) {
            console.error('Error al manejar userProgressTrainingV1:', e);

            const initialData = defaultTrainings.map(training => ({
                id: training.id,
                title: training.title,
                name: '',
                documentId: '',
                completion: 0,
                startedAt: '',
                lastAccessAt: '',
                currentModule: 0,
                completedModules: []
            }));

            setUserProgressTraining(initialData);
        }
    }, []);

    /**
     * Efecto de sincronización con localStorage.
     * 
     * Configura listeners para mantener sincronizado el estado de progreso
     * de entrenamientos cuando cambia el contenido de localStorage.
     * 
     * Tipos de eventos escuchados:
     * 
     * 1. **storage**: Evento nativo del navegador
     *    - Se dispara cuando localStorage cambia en OTRA pestaña/ventana
     *    - Permite sincronización cross-tab
     *    - Solo reacciona si la key modificada es 'userProgressTrainingV1'
     * 
     * 2. **localStorageUpdated**: Evento personalizado
     *    - Disparado manualmente por createCourseProgress y resetCourseProgress
     *    - Permite sincronización dentro de la MISMA pestaña
     *    - Soluciona la limitación de que 'storage' no se dispara en la pestaña que hace el cambio
     * 
     * @hook
     * @effect
     * @dependencies [] - Los listeners persisten durante toda la vida del componente
     * 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event|MDN: storage event}
     * 
     * @example
     * // El evento 'storage' se dispara automáticamente entre pestañas
     * // El evento 'localStorageUpdated' debe dispararse manualmente:
     * localStorage.setItem('userProgressTrainingV1', JSON.stringify(data));
     * window.dispatchEvent(new Event('localStorageUpdated'));
     */
    useEffect(() => {
        const handleStorageChange = (e) => {
            // Solo reaccionar si cambia nuestra key específica
            if (e.key === 'userProgressTrainingV1') {
                syncProgressFromStorage();
            }
        };

        // Escuchar cambios en storage (funciona entre pestañas)
        window.addEventListener('storage', handleStorageChange);

        // Para cambios en la misma pestaña, crear un evento personalizado
        const handleCustomStorageChange = () => {
            syncProgressFromStorage();
        };

        window.addEventListener('localStorageUpdated', handleCustomStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageUpdated', handleCustomStorageChange);
        };
    }, []);

    // ========================================================================
    // FUNCIONES DE UTILIDAD - GESTIÓN DE TEMA
    // ========================================================================

    /**
     * Alterna el tema visual entre 'light' y 'dark'.
     * 
     * Operaciones realizadas:
     * 1. Invierte el valor actual del estado theme
     * 2. Persiste la preferencia en localStorage bajo la key 'theme'
     * 3. Actualiza la clase CSS del elemento <html> para aplicar estilos de Tailwind
     * 
     * El sistema de temas utiliza la estrategia de clase de Tailwind CSS,
     * donde los estilos oscuros se aplican mediante el prefijo `dark:`.
     * 
     * @function
     * @returns {void}
     * 
     * @example
     * // Uso desde un componente hijo
     * const { toggleTheme } = useContext(TrainingLogiTransContext);
     * <button onClick={toggleTheme}>Cambiar tema</button>
     */
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            // Manejo silencioso si localStorage no está disponible (ej: modo privado)
            console.warn('No se pudo guardar el tema en localStorage:', e);
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
     * Sincroniza la clase CSS 'dark' en el elemento <html> con el estado actual del tema.
     * 
     * Este efecto se ejecuta cada vez que cambia el estado 'theme' y asegura que
     * la clase del documento esté sincronizada con la preferencia del usuario.
     * 
     * Es especialmente útil para:
     * - Aplicar el tema correcto al cargar la página
     * - Mantener sincronización después de cambios programáticos en 'theme'
     * - Manejar casos donde toggleTheme() no se use directamente
     * 
     * @hook
     * @effect
     * @dependencies [theme] - Se ejecuta cada vez que 'theme' cambia
     * 
     * @see {@link toggleTheme} Para cambiar el tema de forma interactiva
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
     * Gestiona el comportamiento responsivo del sidebar.
     * 
     * Cierra automáticamente el sidebar cuando el viewport es menor a 1024px (breakpoint lg de Tailwind).
     * 
     * Comportamiento:
     * - Ejecuta una comprobación inicial al montar (para detectar si la página se carga en móvil)
     * - Suscribe un listener al evento 'resize' de window
     * - Cierra el sidebar si el ancho de ventana cae por debajo de 1024px
     * - Limpia el listener al desmontar el componente
     * 
     * @hook
     * @effect
     * @dependencies [] - Configuración única al montar/desmontar
     * 
     * @example
     * // Este efecto trabaja en conjunto con el estado sideBarHome
     * // y responde automáticamente a cambios de tamaño de ventana
     */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSideBarHome(false);
            }
        };

        handleResize(); // Ejecutar comprobación inicial
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ========================================================================
    // FUNCIONES DE UTILIDAD - GESTIÓN DE PROGRESO
    // ========================================================================

    /**
     * Crea o actualiza el registro de progreso de un usuario para un curso específico.
     * 
     * Esta función realiza las siguientes operaciones:
     * 1. Valida el ID del curso y los datos del usuario
     * 2. Busca el registro de progreso correspondiente en localStorage
     * 3. Actualiza los campos de usuario y fechas de acceso
     * 4. Persiste los cambios en localStorage
     * 5. Dispara un evento para sincronizar el estado global
     * 
     * Campos actualizados:
     * - `name`: Nombre del usuario (trimmed)
     * - `documentId`: Documento de identificación (trimmed)
     * - `startedAt`: Fecha de inicio (solo si es la primera vez)
     * - `lastAccessAt`: Fecha del último acceso (siempre se actualiza)
     * - `currentModule`: Módulo actual (se inicializa en 1 si es nuevo)
     * 
     * @function
     * @param {number|string} courseId - Identificador único del curso a actualizar
     * @param {Object} userData - Información del usuario que inicia/continúa el curso
     * @param {string} userData.name - Nombre completo del usuario
     * @param {string} userData.documentId - Número de documento de identificación
     * 
     * @returns {Object} Resultado de la operación
     * @returns {boolean} return.success - Indica si la operación fue exitosa
     * @returns {TrainingProgress} [return.data] - Datos actualizados del curso (si success=true)
     * @returns {string} return.message - Mensaje descriptivo del resultado
     * @returns {string} [return.error] - Mensaje de error (si success=false)
     * 
     * @throws {Error} Si el courseId es null o undefined
     * @throws {Error} Si userData.name o userData.documentId están vacíos
     * @throws {Error} Si no existe información en localStorage
     * @throws {Error} Si no se encuentra el curso con el ID especificado
     * 
     * @fires Event#localStorageUpdated
     * 
     * @example
     * const result = createCourseProgress(1, {
     *   name: 'Juan Pérez',
     *   documentId: '12345678'
     * });
     * 
     * if (result.success) {
     *   console.log('Progreso guardado:', result.data);
     * } else {
     *   console.error('Error:', result.error);
     * }
     */
    const createCourseProgress = (courseId, userData) => {
        try {
            // 1. Validar courseId
            if (!courseId) {
                throw new Error('El ID del curso es requerido');
            }

            // 2. Validar userData
            if (!userData || !userData.name || !userData.documentId) {
                throw new Error('Los datos del usuario son incompletos');
            }

            // 3. Obtener datos de localStorage
            const storedData = localStorage.getItem('userProgressTrainingV1');

            if (!storedData) {
                throw new Error('No se encontró información de cursos en el sistema');
            }

            let progressData = JSON.parse(storedData);

            // 4. Buscar el curso por ID
            const courseIndex = progressData.findIndex(training => training.id === courseId);

            if (courseIndex === -1) {
                throw new Error(`No se encontró el curso con ID: ${courseId}`);
            }

            // 5. Obtener fecha actual en formato ISO
            const currentDate = new Date().toISOString();

            // 6. Actualizar los datos del curso
            progressData[courseIndex] = {
                ...progressData[courseIndex],
                name: userData.name.trim(),
                documentId: userData.documentId.trim(),
                startedAt: progressData[courseIndex].startedAt || currentDate,
                lastAccessAt: currentDate,
                currentModule: progressData[courseIndex].currentModule || 1
            };

            // 7. Guardar en localStorage
            localStorage.setItem('userProgressTrainingV1', JSON.stringify(progressData));
            
            // 8. Disparar evento para sincronización en la misma pestaña
            window.dispatchEvent(new Event('localStorageUpdated'));

            // 9. Retornar resultado exitoso
            return {
                success: true,
                data: progressData[courseIndex],
                message: 'Progreso del curso actualizado exitosamente'
            };

        } catch (error) {
            console.error('Error en createCourseProgress:', error);
            return {
                success: false,
                error: error.message,
                message: 'Error al actualizar el progreso del curso'
            };
        }
    };

    /**
     * Reinicia completamente el progreso de un usuario en un curso específico.
     * 
     * Esta función realiza una limpieza total del registro de progreso,
     * restaurando todos los campos a sus valores iniciales como si el usuario
     * nunca hubiera iniciado el curso.
     * 
     * Operaciones realizadas:
     * 1. Valida el ID del curso
     * 2. Busca el registro en localStorage
     * 3. Restablece todos los campos a valores vacíos o cero
     * 4. Persiste los cambios
     * 5. Sincroniza el estado global
     * 
     * Campos que se reinician:
     * - `name`: '' (vacío)
     * - `documentId`: '' (vacío)
     * - `completion`: 0
     * - `startedAt`: '' (vacío)
     * - `lastAccessAt`: '' (vacío)
     * - `currentModule`: 0
     * - `completedModules`: [] (array vacío)
     * 
     * Nota: El `id` y `title` del curso se preservan.
     * 
     * @function
     * @param {number|string} courseId - Identificador único del curso a reiniciar
     * 
     * @returns {Object} Resultado de la operación
     * @returns {boolean} return.success - Indica si la operación fue exitosa
     * @returns {TrainingProgress} [return.data] - Datos reiniciados del curso (si success=true)
     * @returns {string} return.message - Mensaje descriptivo del resultado
     * @returns {string} [return.error] - Mensaje de error (si success=false)
     * 
     * @throws {Error} Si el courseId es null o undefined
     * @throws {Error} Si no existe información en localStorage
     * @throws {Error} Si no se encuentra el curso con el ID especificado
     * 
     * @fires Event#localStorageUpdated
     * 
     * @example
     * const result = resetCourseProgress(1);
     * 
     * if (result.success) {
     *   console.log('Progreso reiniciado:', result.data);
     *   // result.data.completion === 0
     *   // result.data.name === ''
     * } else {
     *   console.error('Error:', result.error);
     * }
     * 
     * @example
     * // Uso típico al implementar botón "Reiniciar curso"
     * const handleReset = () => {
     *   const confirmed = window.confirm('¿Desea reiniciar su progreso?');
     *   if (confirmed) {
     *     const result = resetCourseProgress(courseId);
     *     if (result.success) {
     *       alert('Progreso reiniciado exitosamente');
     *     }
     *   }
     * };
     */
    const resetCourseProgress = (courseId) => {
        try {
            // 1. Validar courseId
            if (!courseId) {
                throw new Error("El ID del curso es requerido");
            }

            // 2. Obtener datos de localStorage
            const storedData = localStorage.getItem("userProgressTrainingV1");

            if (!storedData) {
                throw new Error("No se encontró información de cursos en el sistema");
            }

            let progressData = JSON.parse(storedData);

            // 3. Buscar el curso por ID
            const courseIndex = progressData.findIndex(training => training.id === courseId);

            if (courseIndex === -1) {
                throw new Error(`No se encontró el curso con ID: ${courseId}`);
            }

            // 4. Reiniciar todos los campos (preservando id y title)
            progressData[courseIndex] = {
                ...progressData[courseIndex],
                name: '',
                documentId: '',
                completion: 0,
                startedAt: '',
                lastAccessAt: '',
                currentModule: 0,
                completedModules: []
            };

            // 5. Guardar en localStorage
            localStorage.setItem("userProgressTrainingV1", JSON.stringify(progressData));
            
            // 6. Disparar evento para sincronización en la misma pestaña
            window.dispatchEvent(new Event('localStorageUpdated'));

            // 7. Retornar resultado exitoso
            return {
                success: true,
                data: progressData[courseIndex],
                message: "Progreso del curso reiniciado exitosamente"
            };

        } catch (error) {
            console.error("Error en resetCourseProgress:", error);
            return {
                success: false,
                error: error.message,
                message: "Error al reiniciar el progreso del curso"
            };
        }
    };

    // ========================================================================
    // PROVEEDOR DEL CONTEXTO
    // ========================================================================

    /**
     * Objeto de valores expuestos a través del contexto.
     * Todos los componentes descendientes pueden acceder a estos valores y funciones
     * mediante el hook useContext(TrainingLogiTransContext).
     * 
     * @type {Object}
     * @property {string} theme - Tema actual ('light' | 'dark')
     * @property {Function} setTheme - Setter directo del estado theme
     * @property {Function} toggleTheme - Alterna entre tema claro y oscuro
     * @property {boolean} sideBarHome - Estado de visibilidad del sidebar
     * @property {Function} setSideBarHome - Setter del estado de sidebar
     * @property {Training[]} defaultTrainings - Catálogo de entrenamientos disponibles
     * @property {Communication[]} defaultcomunication - Catálogo de comunicaciones corporativas
     * @property {TrainingProgress[]} userProgressTraining - Progreso actual del usuario en todos los cursos
     * @property {boolean} isModalOpen - Estado del modal de cursos
     * @property {Function} setIsModalOpen - Setter del estado del modal
     * @property {Training|null} selectedTraining - Entrenamiento seleccionado actualmente
     * @property {Function} setSelectedTraining - Setter del entrenamiento seleccionado
     * @property {Function} createCourseProgress - Crea/actualiza el progreso de un curso
     * @property {Function} resetCourseProgress - Reinicia el progreso de un curso
     * 
     * @example
     * // Consumir el contexto en un componente hijo
     * import { useContext } from 'react';
     * import { TrainingLogiTransContext } from './context/TrainingLogiTransContext';
     * 
     * function MyComponent() {
     *   const { 
     *     theme, 
     *     toggleTheme, 
     *     userProgressTraining,
     *     createCourseProgress 
     *   } = useContext(TrainingLogiTransContext);
     *   
     *   return (
     *     <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
     *       <button onClick={toggleTheme}>Cambiar tema</button>
     *       <p>Cursos completados: {userProgressTraining.filter(t => t.completion === 100).length}</p>
     *     </div>
     *   );
     * }
     */
    return (
        <TrainingLogiTransContext.Provider value={{
            theme,
            setTheme,
            toggleTheme,
            sideBarHome,
            setSideBarHome,
            defaultTrainings,
            defaultcomunication,
            userProgressTraining,
            isModalOpen,
            setIsModalOpen,
            selectedTraining,
            setSelectedTraining,
            createCourseProgress,
            resetCourseProgress
        }}>
            {children}
        </TrainingLogiTransContext.Provider>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * @exports TrainingLogiTransContext - Contexto de React para consumir con useContext
 * @exports TrainingLogiTransProvider - Componente proveedor del contexto
 */
export { TrainingLogiTransContext, TrainingLogiTransProvider };