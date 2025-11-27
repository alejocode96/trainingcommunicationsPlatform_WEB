import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCircle, X, User, IdCard, Sparkles } from 'lucide-react';
import { TrainingLogiTransContext } from '../../Context';
function Modal({ isOpen, onClose, modalData }) {

    //navegacion
    const navigate = useNavigate();

    //manejo del modal
    const [isVisible, setIsVisible] = useState(false);
    // Estados para los inputs
    const [name, setName] = React.useState('');
    const [documentId, setDocumentId] = React.useState('');
    const [errors, setErrors] = React.useState({});

    const { createCourseProgress, resetCourseProgress, userProgressTraining } = React.useContext(TrainingLogiTransContext)

    console.log(userProgressTraining)
    /**
     * Efecto que controla la animación de entrada y salida del modal.
     * 
     * - Cuando `isOpen` es true:
     *      Se activa un pequeño retardo (10 ms) antes de establecer `isVisible` en true.
     *      Esto permite que las clases CSS de transición se apliquen correctamente
     *      y la animación de entrada ocurra de forma fluida.
     * 
     * - Cuando `isOpen` es false:
     *      Se desactiva `isVisible`, iniciando la animación de salida.
     * 
     * El temporizador es limpiado automáticamente cuando el componente se desmonta
     * o cuando `isOpen` cambia, evitando efectos secundarios o fugas de memoria.
    */
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            document.body.style.overflow = "hidden"; //deshabilita scroll global
            return () => clearTimeout(timer);
        } else {
            document.body.style.overflow = ""; //habilita scroll global
            setIsVisible(false);
        }
    }, [isOpen]);


    /**
     * Maneja el cierre del modal con animación controlada.
     * 
     * 1. Se establece `isVisible` en false para iniciar la animación de salida.
     * 2. Después de 300 ms (coincide con la duración definida en CSS o Tailwind),
     *    se ejecuta la función `onClose`, que efectivamente desmonta el modal.
     *
     * Esto asegura una experiencia visual fluida al mostrar y ocultar la interfaz.
     */
    const handleClose = () => {
        setIsVisible(false);
        document.body.style.overflow = ""; //habilita scroll global
        setTimeout(() => {
            onClose();
        }, 300); // Duración sincronizada con la transición CSS
    };


    /**
  * Valida los campos del formulario de inicio del curso.
  *
  * Esta función verifica que el nombre y el número de cédula hayan sido
  * proporcionados correctamente. El nombre es obligatorio y no puede estar vacío.
  * La cédula también es obligatoria y debe contener únicamente caracteres numéricos.
  *
  * Si se encuentran errores, estos se almacenan en el estado `errors`.
  *
  * @function validateForm
  * @returns {boolean} Retorna `true` si el formulario es válido; de lo contrario, `false`.
  *
  * @description
  * Reglas de validación:
  * - name: obligatorio, no puede ser una cadena vacía.
  * - documentId: obligatorio, debe contener solo dígitos (0–9).
  *
  * @example
  * const isValid = validateForm();
  * if (isValid) {
  *   // Procesar envío de formulario
  * }
  */
    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!name.trim()) {
            newErrors.name = 'El Nombre es obligatorio';
        }

        // Validar documento
        if (!documentId.trim()) {
            newErrors.documentId = 'La cédula es obligatoria';
        } else if (!/^\d+$/.test(documentId.trim())) {
            newErrors.documentId = 'La cédula debe contener solo números';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    /**
     * Inicia un curso validando los datos del usuario y registrando su progreso en localStorage.
     *
     * Este método verifica los datos del formulario mediante `validateForm()`. Si la validación es exitosa,
     * construye un objeto con la información del usuario y ejecuta `createCourseProgress()` para crear
     * o actualizar el registro del curso. Si la operación es exitosa, se notifica al usuario y se redirige
     * al primer módulo del curso.
     *
     * @function handleStartCourse
     * @returns {void}
     *
     * @description
     * Flujo de operación:
     * 1. Valida formulario (nombre y cédula).
     * 2. Registra o actualiza el progreso del curso.
     * 3. Limpia errores previos.
     * 4. Redirige al módulo inicial.
     *
     * @example
     * <button onClick={handleStartCourse}>Iniciar curso</button>
     */
    const handleStartCourse = () => {
        if (validateForm()) {
            const userData = {
                name: name.trim(),
                documentId: documentId.trim()
            };

            const result = createCourseProgress(modalData.id, userData);

            if (result.success) {
                alert(result.message);
                setErrors({});
                navigate(`/training/${modalData.id}/module/1`);
            } else {
                const newErrors = { general: result.message };
                setErrors(newErrors);
                alert(result.message);
            }

            alert('Datos validados correctamente: ' + JSON.stringify(userData));
        }
    };


    /**
     * Continúa el curso en la última posición registrada del usuario.
     *
     * Busca el registro del curso dentro del arreglo `userProgressTraining` utilizando el ID del curso actual.
     * Redirige al usuario al módulo correspondiente; si no existe información previa, inicia en el módulo 1.
     *
     * @function handleContinueCourse
     * @returns {void}
     *
     * @example
     * <button onClick={handleContinueCourse}>Continuar curso</button>
     */
    const handleContinueCourse = () => {
        const training = userProgressTraining.find(item => item.id === modalData.id);
        navigate(`/training/${modalData.id}/module/${training?.currentModule || 1}`);
    };


    /**
     * Restablece los datos del usuario asociados a un curso específico.
     *
     * Ejecuta `resetCourseProgress()` para borrar la información del progreso y dejar los campos del curso vacíos.
     * Si la operación es exitosa, limpia la información mostrada en el modal y muestra un mensaje al usuario.
     *
     * @function handleChangeData
     * @returns {void}
     *
     * @description
     * Campos que se reinician:
     * - name
     * - documentId
     * - completion
     * - startedAt
     * - lastAccessAt
     * - currentModule
     * - completedModules
     *
     * @example
     * <button onClick={handleChangeData}>Cambiar datos</button>
     */
    const handleChangeData = () => {
        const result = resetCourseProgress(modalData.id);

        if (result.success) {
            modalData.name = "";
            modalData.documentId = "";
            modalData.completion = 0;
            alert(result.message);
            setErrors({});
        } else {
            const newErrors = { general: result.message };
            setErrors(newErrors);
            alert(result.message);
        }
    };


    // Siempre renderizar si isOpen es true O si está en proceso de cierre
    if (!isOpen && !isVisible) return null;

    const renderContent = () => {
        if (((!modalData.name || !modalData.documentId) && modalData.completion === 0) || ((modalData.name || modalData.documentId) && modalData.completion === 0)) {
            return (
                <div className="space-y-6">
                    {modalData.description.map((paragraph, index) => (
                        <p key={index} className={`text-base text-zinc-700 dark:text-zinc-400 text-justify mb-4 last:mb-0`}>
                            {paragraph.split('**').map((text, i) =>
                                i % 2 === 0 ? (text) : (<strong className='text-zinc-700 dark:text-zinc-300 ' key={i} >{text}</strong>)
                            )}
                        </p>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Input Nombre */}
                        <div className='flex flex-col items-start'>
                            <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">  Nombre Completo </label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className={`h-5 w-5 ${errors.name ? 'text-red-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                                </div>
                                <input type="text" id="nombre" value={name} onChange={(e) => { setName(e.target.value); if (errors.name) { setErrors(prev => ({ ...prev, name: "" })); } }} placeholder='Ingrese Nombre Completo' className={`block w-full pl-10 pr-3 py-3 border  rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-300 dark:border-zinc-700 focus:ring-blue-500'}`} />
                            </div>
                            {<errors className="name"></errors> && (
                                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Input Cédula */}
                        <div className='flex flex-col items-start w-full'>
                            <label htmlFor="cedula" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"> Número de Cédula  </label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IdCard className={`h-5 w-5  ${errors.documentId ? 'text-red-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                                </div>
                                <input type="number" id="cedula" value={documentId} onChange={(e) => { setDocumentId(e.target.value); if (errors.documentId) { setErrors(prev => ({ ...prev, documentId: "" })); } }} placeholder='Ingrese Número de identificación' className={`block w-full pl-10 pr-3 py-3 border  rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-200 ${errors.documentId ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-300 dark:border-zinc-700 focus:ring-blue-500'}`} />
                            </div>
                            {errors.documentId && (
                                <p className="mt-2 text-sm text-red-400">{errors.documentId}</p>
                            )}
                        </div>
                    </div>
                    {errors.general && (
                        <p className="mt-2 text-sm text-red-400">{errors.general}</p>
                    )}
                    <div className="flex justify-center  items-center">
                        <button onClick={handleStartCourse} className="bg-gradient-to-r w-full md:w-[50%]  from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-32  rounded-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg text-lg">Comenzar</button>
                    </div>
                </div>
            )

        }

        if (modalData.name && modalData.documentId && modalData.completion > 0 && modalData.completion < 100) {
            const radius = 70;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (modalData.completion / 100) * circumference;

            return (
                <div className="space-y-6">
                    {modalData.description.map((paragraph, index) => (
                        <p key={index} className={`text-base text-zinc-700 dark:text-zinc-400 text-justify mb-4 last:mb-0`}>
                            {paragraph.split('**').map((text, i) =>
                                i % 2 === 0 ? (text) : (<strong className='text-zinc-700 dark:text-zinc-300 ' key={i} >{text}</strong>)
                            )}
                        </p>
                    ))}

                    <div className="bg-gradient-to-br from-zinc-100 to-zinc-100/50 dark:from-zinc-800 dark:to-zinc-800/80 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700">
                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="relative flex-shrink-0">
                                <svg className="w-40 h-40 transform -rotate-90">
                                    <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="12" fill="none" className="text-zinc-200 dark:text-zinc-700" />
                                    <circle cx="80" cy="80" r={radius} stroke="url(#gradient)" strokeWidth="12" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" style={{ filter: 'drop-shadow(0 2px 8px rgba(6, 182, 212, 0.3))' }} />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="50%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#2563eb" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-zinc-900 dark:text-white">{modalData.completion}</p>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div>
                                    <h3 className="text-zinc-900 dark:text-white text-2xl font-bold mb-1">Progreso del Curso</h3>
                                    <p className="text-zinc-500 dark:text-zinc-300">¡Sigue así! Estás avanzando muy bien.</p>
                                </div>

                                <div className="flex-row md:flex space-y-3 md:space-y-0 gap-3">
                                    <div className="w-full md:w-1/2 flex items-center gap-3 p-3 bg-zinc-200/50 dark:bg-zinc-700/30 rounded-xl">
                                        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <IdCard className="text-cyan-600 dark:text-cyan-400" size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-zinc-700 dark:text-zinc-400 text-xs">Documento</p>
                                            <p className="text-zinc-900 dark:text-white font-medium truncate">{modalData.documentId}</p>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2 flex items-center gap-3 p-3 bg-zinc-200/50 dark:bg-zinc-700/30 rounded-xl">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <User className="text-blue-600 dark:text-blue-400" size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-zinc-700 dark:text-zinc-400 text-xs">Nombre</p>
                                            <p className="text-zinc-900 dark:text-white font-medium truncate">{modalData.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className='md:flex space-x-3 md:space-y-0 space-y-3'>
                            <button onClick={handleContinueCourse} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">Continuar curso</button>
                            <button onClick={handleChangeData} className="w-full  bg-[#0f2e6b] hover:bg-[#071D49] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">Cambiar datos</button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={`fixed inset-0 bg-zinc-400/90 dark:bg-zinc-950/90 flex items-center justify-center p-4 backdrop-blur-sm z-[99999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} >
            <div className={`bg-white dark:bg-[#1a1a1c] rounded-xl shadow-2xl w-full max-w-[95%] overflow-hidden min-h-[300px] transition-all duration-300 max-h-[95%] ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}  >
                <div className="relative bg-gradient-to-r from-[#071D49] to-[#1a4fff] p-3 px-6 text-white rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-4xl">
                                {modalData?.icon}
                            </div>
                            <div>
                                <h2 className="text-xl lg:text-2xl font-black">
                                    {modalData?.title}
                                </h2>
                                <p className="text-white text-opacity-90 text-sm hidden md:block"> {modalData?.subtitle}</p>
                            </div>
                        </div>

                        <button onClick={handleClose} className="text-white hover:bg-white/20 rounded-md p-2 transition-colors duration-300">
                            <X size={22} />
                        </button>
                    </div>
                </div>

                <div className="p-8 overflow-auto max-h-[calc(95vh-100px)]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Modal;