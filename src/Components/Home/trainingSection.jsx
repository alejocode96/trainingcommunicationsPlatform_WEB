import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


//contexto
import { TrainingLogiTransContext } from '../../Context';

//iconos
import { ChevronRight, ChevronLeft } from 'lucide-react';

//componentes
import Modal from './modal';



function TrainingSection() {
    const { defaultTrainings, userProgressTraining, isModalOpen, setIsModalOpen, selectedTraining, setSelectedTraining } = React.useContext(TrainingLogiTransContext)

    // Calcular cuántas cards mostrar por vista
    const [cardsPerView, setCardsPerView] = useState(1);

    //indice del carrusel
    const [currentIndexFormaciones, setCurrentIndexFormaciones] = useState(0);

    // Indica si el usuario está arrastrando activamente el carrusel con el mouse o el dedo.
    //Permite habilitar lógica especial solo durante el arrastre: seguir el movimiento bloquear clics no intencionales determinar si el gesto debe cambiar de slide o no
    const [isDraggingFormaciones, setIsDraggingFormaciones] = useState(false);

    // Guarda la posición X inicial donde el usuario comenzó a arrastrar.
    //Permite calcular el desplazamiento horizontal (diff = actualX - startX), necesario para: mover el carrusel visualmente medir velocidad del gesto saber si el swipe va hacia izquierda o derecha
    const [startXFormaciones, setStartXFormaciones] = useState(0);

    //Guarda la distancia momentánea del arrastre en píxeles. 
    //Es lo que desplaza visualmente las tarjetas mientras arrastras, antes de decidir si el carrusel cambia de slide.
    const [translateXFormaciones, setTranslateXFormaciones] = useState(0);

    //Guarda el tiempo exacto en que comenzó el arrastre.
    //Permite calcular la velocidad del gesto, usada para detectar swipes rápidos: velocity = distancia / tiempo
    const [startTimeFormaciones, setStartTimeFormaciones] = useState(0);

    //Referencia al contenedor DOM del carrusel. Permite: medir ancho del carrusel manipular scroll detectar límites ingresar listeners
    const carouselRefFormaciones = useRef(null);
    //Versión “mutable” de isDraggingComunicaciones que NO provoca re-render.
    //Evita retrasos o desincronización en eventos mousemove/touchmove donde la reactividad de React sería demasiado lenta.
    const isDraggingRefFormaciones = useRef(false);

    /**
         * Actualiza la cantidad de tarjetas visibles según el ancho de la ventana
         * y la cantidad total de tarjetas disponibles.
         *
         * Reglas:
         * - Si el ancho de pantalla es >= 768px, mostrar 2 tarjetas por vista
         *   (desktop), de lo contrario 1 tarjeta (mobile).
         * - Si `defaultTrainings` tiene solo 1 elemento, forzar `cardsPerView = 1`.
         */
    useEffect(() => {

        const updateCardsPerView = () => {
            let newCardsPerView = window.innerWidth >= 768 ? 2 : 1;

            // Forzar 1 tarjeta si hay menos de 2 elementos
            if (defaultTrainings.length <= 1) {
                newCardsPerView = 1;
            }

            // Actualiza solo si cambió la cantidad de tarjetas visibles
            if (newCardsPerView !== cardsPerView) {
                setCardsPerView(newCardsPerView);
                setCurrentIndexFormaciones(0); // reinicia el carrusel al primer slide
            }
        };

        // Evaluación inicial al montar el componente
        updateCardsPerView();

        // Escucha cambios de tamaño de ventana
        window.addEventListener("resize", updateCardsPerView);

        // Limpieza para evitar memory leaks
        return () => window.removeEventListener("resize", updateCardsPerView);

    }, [cardsPerView, defaultTrainings.length]);


    /**
     * Calcula el índice máximo permitido en el carrusel, es decir,
     * el índice del último slide que puede mostrarse correctamente.
     *
     * Esto asegura que el carrusel no intente moverse más allá
     * del contenido disponible y previene errores de visualización.
     *
     * - `defaultTrainings.length` → número total de tarjetas en Formaciones
     * - `cardsPerView` → cantidad de tarjetas visibles simultáneamente en el carrusel
     *
     * Lógica:
     *   maxIndex = totalTarjetas - tarjetasVisibles
     *   Si hay menos tarjetas que las visibles, el índice máximo será 0
     *   (gracias a Math.max(0, ...)).
     */
    const maxIndexFormaciones = Math.max(0, defaultTrainings.length - cardsPerView);

    /**
        * Navega al siguiente slide en el carrusel "Formaciones".
        *
        * Lógica:
        * - Si el índice actual (`currentIndexFormaciones`) es menor
        *   que el índice máximo (`maxIndexFormaciones`), avanza al siguiente slide.
        * - Si ya está en el último slide, se reinicia al primero (efecto loop/circular).
        */
    const goToNextFormaciones = () => {
        setCurrentIndexFormaciones((prev) => (prev >= maxIndexFormaciones ? 0 : prev + 1));
    };

    /**
     * Navega al slide anterior en el carrusel "Formaciones".
     *
     * Lógica:
     * - Si el índice actual (`currentIndexFormaciones`) es mayor que 0, retrocede un slide.
     * - Si ya está en el primer slide, se mueve al último (efecto loop/circular).
     */
    const goToPrevFormaciones = () => {
        setCurrentIndexFormaciones((prev) => (prev <= 0 ? maxIndexFormaciones : prev - 1));
    };
    /**
     * Controlador del evento `mousedown` para iniciar el proceso de arrastre
     * del componente correspondiente a "Formaciones".
     *
     * Su responsabilidad es:
     * - Verificar que el clic inicial no ocurra sobre un botón.
     * - Activar el modo de arrastre.
     * - Registrar la posición inicial del mouse.
     * - Guardar el tiempo inicial del arrastre (útil para medir velocidad o decidir
     *   si fue clic o arrastre).
     * - Reiniciar la traslación horizontal a un valor neutro.
     *
     * Parámetros:
     * @param {MouseEvent} e - Evento del mouse que contiene información como la posición X.
     */
    const handleMouseDownFormaciones = (e) => {

        /**
         * Si el usuario hizo clic sobre un <button> o dentro de un botón,
         * no se debe activar el arrastre para evitar interferencias con
         * la interacción normal de botones (por ejemplo, clics, acciones,
         * navegación o apertura de elementos).
         */
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }

        // Habilita el estado de arrastre lógico.
        setIsDraggingFormaciones(true);

        // Marca en la referencia que efectivamente se está arrastrando.
        isDraggingRefFormaciones.current = true;

        /**
         * Almacena la coordenada X del mouse al iniciar el arrastre.
         * Esta posición servirá como punto de referencia para calcular
         * el desplazamiento en `handleMouseMoveFormaciones`.
         */
        setStartXFormaciones(e.pageX);

        /**
         * Guarda el tiempo exacto del inicio del arrastre.
         * Esto permite medir cuánto tiempo transcurre entre "down"
         * y "up", útil para distinguir entre un clic rápido y un arrastre real.
         */
        setStartTimeFormaciones(Date.now());

        /**
         * Reinicia el valor de desplazamiento horizontal para asegurar que
         * cada arrastre comience desde cero y no arrastre valores previos.
         */
        setTranslateXFormaciones(0);

        // Previene comportamiento por defecto (como selección de texto).
        e.preventDefault();
    };

    /**
        * Maneja el evento de movimiento del mouse mientras el usuario arrastra
        * el elemento correspondiente a "Formaciones".
        *
        * Su función principal es calcular cuánto se ha movido horizontalmente
        * el mouse desde que inició el arrastre y aplicar dicho desplazamiento
        * de forma controlada (limitada) al componente, para generar el efecto
        * visual de "slide" o desplazamiento.
        *
        * Requisitos previos para que la función actúe:
        * - Debe existir un arrastre activo: `isDraggingFormaciones === true`.
        * - Debe existir una referencia válida al contenedor en arrastre: `isDraggingRefFormaciones.current`.
        *
        * Parámetros:
        * @param {MouseEvent} e - Evento de movimiento del mouse.
        */
    const handleMouseMoveFormaciones = (e) => {
        // Si no hay arrastre activo o no existe referencia, no hacer nada.
        if (!isDraggingFormaciones || !isDraggingRefFormaciones.current) return;

        // Previene comportamientos por defecto no deseados como selección de texto.
        e.preventDefault();

        // Obtiene la posición horizontal actual del mouse.
        const currentX = e.pageX;

        // Calcula cuántos píxeles se ha movido respecto al punto inicial.
        const diff = currentX - startXFormaciones;

        // Límite máximo permitido para el arrastre hacia ambos lados.
        // Esto evita que el elemento se mueva demasiado lejos.
        const maxDrag = 200;

        // Aplica un límite al desplazamiento para no superar ±200px.
        const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));

        // Actualiza el estado que controla la traducción (desplazamiento)
        // horizontal del elemento. Este estado normalmente se usa dentro del
        // estilo transform: translateX().
        setTranslateXFormaciones(limitedDiff);
    };

    /**
     * Controlador del evento `mouseup` que finaliza el proceso de arrastre
     * del componente "Formaciones". Esta función determina si el usuario
     * realizó un deslizamiento válido (swipe) para cambiar de elemento, o
     * si simplemente fue un clic sin intención de arrastrar.
     *
     * Su propósito principal es:
     * - Desactivar el modo arrastre.
     * - Calcular velocidad y tiempo del arrastre.
     * - Aplicar lógica de umbrales (thresholds) para decidir si cambiar de slide.
     * - Restaurar la posición del elemento al estado inicial.
     *
     * @param {MouseEvent} e - Evento del mouse al finalizar el clic/arrastre.
     */
    const handleMouseUpFormaciones = (e) => {

        /**
         * Si no hay un arrastre activo o la referencia del arrastre no está
         * marcada, se abandona la función. Esto evita ejecutar cálculos innecesarios.
         */
        if (!isDraggingFormaciones || !isDraggingRefFormaciones.current) return;

        // Desactiva el modo arrastre visual y lógico.
        setIsDraggingFormaciones(false);
        isDraggingRefFormaciones.current = false;

        /**
         * Tiempo total transcurrido desde que inició el arrastre.
         * Útil para evaluar la velocidad del movimiento.
         */
        const timeElapsed = Date.now() - startTimeFormaciones;

        /**
         * Calcula la velocidad aproximada del arrastre. Se mide como la distancia
         * horizontal recorrida dividido por el tiempo total (px/ms).
         */
        const velocity = Math.abs(translateXFormaciones) / timeElapsed;

        /**
         * Si la distancia desplazada es mínima (<5px) y el tiempo del clic es muy corto (<200ms),
         * se interpreta como un clic normal (no un swipe). En este caso se cancela cualquier
         * desplazamiento y se restablece la posición original.
         */
        if (Math.abs(translateXFormaciones) < 5 && timeElapsed < 200) {
            setTranslateXFormaciones(0);
            return;
        }

        /**
         * Define el umbral (threshold) para determinar si el arrastre califica
         * como swipe.
         *
         * - Si la velocidad del arrastre es alta (rápido), el threshold se reduce (50px).
         * - Si es lento, se requiere un arrastre mayor (100px).
         */
        const threshold = velocity > 0.5 ? 50 : 100;

        /**
         * Verificación de dirección del swipe:
         *
         * - Si el desplazamiento es positivo (hacia la derecha) y hay elementos previos,
         *   ejecuta navegación hacia atrás: goToPrevFormaciones().
         *
         * - Si el desplazamiento es negativo (hacia la izquierda) y todavía hay elementos
         *   siguientes, ejecuta navegación hacia adelante: goToNextFormaciones().
         */
        if (translateXFormaciones > threshold && currentIndexFormaciones > 0) {
            goToPrevFormaciones();
        } else if (translateXFormaciones < -threshold && currentIndexFormaciones < maxIndexFormaciones) {
            goToNextFormaciones();
        }

        // Finalmente, se restablece la posición del elemento para que vuelva a su lugar original.
        setTranslateXFormaciones(0);
    };

    /**
     * Controlador del evento `mouseleave` que se ejecuta cuando el cursor del mouse
     * abandona el área del componente mientras se está realizando un arrastre.
     *
     * Su función es garantizar que el proceso de arrastre se cierre correctamente,
     * incluso si el usuario saca el cursor fuera del contenedor. Esto evita efectos
     * indeseados como quedarse en estado de arrastre activo o dejar el componente
     * desplazado sin finalizar.
     *
     * Comportamiento:
     * - Si el arrastre está activo (`isDraggingFormaciones === true`),
     *   se llama manualmente a `handleMouseUpFormaciones()` para finalizar el arrastre.
     * - Si no hay arrastre en curso, simplemente no realiza ninguna acción.
     */
    const handleMouseLeaveFormaciones = () => {
        // Verifica si el arrastre está activo
        if (isDraggingFormaciones) {
            // Finaliza el arrastre igual que si el usuario hubiese soltado el mouse
            handleMouseUpFormaciones();
        }
    };


    /**
     * Controlador del evento `touchstart` para dispositivos táctiles.  
     * Este método inicializa el proceso de deslizamiento (swipe) al
     * detectar el primer contacto del usuario en pantallas touch.
     *
     * Su objetivo principal es:
     * - Registrar la posición inicial del toque.
     * - Registrar el tiempo de inicio del gesto para medir velocidad.
     * - Reiniciar el desplazamiento horizontal, garantizando que cada gesto
     *   comience desde un estado limpio.
     *
     * @param {TouchEvent} e - Evento táctil que contiene información del punto de contacto.
     */
    const handleTouchStartFormaciones = (e) => {
        /**
         * Registra la coordenada X del primer punto de contacto.
         * Esto se usa como referencia para calcular cuánto se desplazó
         * horizontalmente el usuario durante el gesto.
         */
        setStartXFormaciones(e.touches[0].clientX);

        /**
         * Guarda el timestamp del inicio del gesto.  
         * Se utiliza posteriormente para calcular la velocidad del swipe
         * al finalizar el toque.
         */
        setStartTimeFormaciones(Date.now());

        /**
         * Reinicia la traslación horizontal para evitar arrastrar valores previos
         * de gestos anteriores.
         */
        setTranslateXFormaciones(0);
    };

    /**
     * Controlador del evento `touchmove` que maneja el desplazamiento táctil
     * durante un gesto de arrastre (swipe) en dispositivos móviles.
     *
     * Su función principal es:
     * - Calcular en tiempo real el desplazamiento horizontal del dedo.
     * - Limitar el movimiento máximo permitido para evitar desbordes.
     * - Actualizar la posición visual del componente con un "arrastre" suave.
     * - Prevenir el scroll vertical cuando el gesto es predominantemente horizontal.
     *
     * @param {TouchEvent} e - Evento táctil con la posición actual del dedo.
     */
    const handleTouchMoveFormaciones = (e) => {

        // Obtiene la posición X actual del toque.
        const currentX = e.touches[0].clientX;

        // Calcula la diferencia entre el punto inicial del toque y la posición actual.
        const diff = currentX - startXFormaciones;

        /**
         * Define el desplazamiento máximo permitido (en píxeles),
         * tanto hacia la izquierda como hacia la derecha.
         * Esto evita que el usuario arrastre el contenedor demasiado.
         */
        const maxDrag = 200;

        // Aplica el límite de arrastre mediante un "clamp" entre -maxDrag y +maxDrag.
        const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));

        // Actualiza el estado responsable de mover visualmente el carrusel.
        setTranslateXFormaciones(limitedDiff);

        /**
         * Si el usuario está haciendo un arrastre principalmente horizontal
         * (más de 10px), se previene el comportamiento por defecto.
         *
         * Esto evita que la página se desplace verticalmente al intentar
         * realizar un swipe, mejorando la experiencia táctil.
         */
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    };

    /**
     * Controlador del evento `touchend` que se ejecuta cuando el usuario
     * levanta el dedo de la pantalla y finaliza el gesto táctil.
     *
     * Su objetivo es determinar si el gesto realizado califica como un
     * desplazamiento válido (swipe) para cambiar de elemento en el carrusel.
     * Para ello evalúa la distancia total recorrida y la velocidad del gesto.
     *
     * Comportamientos principales:
     * - Detecta la velocidad del movimiento.
     * - Ajusta dinámicamente el umbral (threshold) según la rapidez del gesto.
     * - Determina si debe avanzar al siguiente elemento o retroceder al anterior.
     * - Restablece la posición visual del componente una vez finalizado el gesto.
     */
    const handleTouchEndFormaciones = () => {

        /**
         * Tiempo total transcurrido desde que inició el toque.
         * Se utiliza para calcular la velocidad del gesto.
         */
        const timeElapsed = Date.now() - startTimeFormaciones;

        /**
         * Velocidad del gesto táctil.  
         * Se calcula como la distancia horizontal arrastrada (en px)
         * dividida por el tiempo del gesto (en ms).
         */
        const velocity = Math.abs(translateXFormaciones) / timeElapsed;

        /**
         * Determina el umbral mínimo de desplazamiento necesario para
         * considerar el gesto como un swipe válido.
         *
         * - Si el gesto fue rápido (velocidad > 0.5 px/ms), el threshold es menor (30px).
         * - Si el gesto fue lento, se requiere un desplazamiento mayor
         *   (50px) para aceptarlo como swipe.
         *
         * Esto permite una experiencia más natural: swipes rápidos requieren
         * menos distancia y swipes lentos requieren mayor desplazamiento.
         */
        const threshold = velocity > 0.5 ? 30 : 50;

        /**
         * Verifica la dirección del desplazamiento:
         *
         * - Si el desplazamiento final es positivo (hacia la derecha)
         *   y aún hay elementos previos, se navega al slide anterior.
         *
         * - Si el desplazamiento es negativo (hacia la izquierda)
         *   y no se está en el último elemento, se navega al siguiente slide.
         */
        if (translateXFormaciones > threshold && currentIndexFormaciones > 0) {
            goToPrevFormaciones();
        } else if (
            translateXFormaciones < -threshold &&
            currentIndexFormaciones < maxIndexFormaciones
        ) {
            goToNextFormaciones();
        }

        /**
         * Restablece la posición del carrusel a su estado original
         * luego de terminar la interacción táctil.
         */
        setTranslateXFormaciones(0);
    };

    /**
     * Calcula el valor de transformación CSS (transform) que se aplicará
     * al contenedor del carrusel "Formaciones".
     *
     * Este valor combina:
     * - La posición del slide actual (`currentIndexFormaciones`),
     * - El ancho relativo de cada tarjeta según las tarjetas visibles (`cardsPerView`),
     * - El desplazamiento dinámico generado por el arrastre (`translateXFormaciones`),
     * para producir un movimiento fluido y preciso.
     *
     * Retorna un valor tipo:
     *   translateX(calc(-{porcentaje}% + {pixels}px))
     *
     * Ejemplo:
     *   currentIndex = 2, cardsPerView = 3 → cardWidth = 33.33%
     *   Resultado: translateX(calc(-66.66% + 15px))
     *
     * @returns {string} Cadena CSS usada en la propiedad `transform`.
     */
    const getTransformValueFormaciones = () => {

        /**
         * Calcula el ancho relativo de cada tarjeta según cuántas
         * tarjetas se muestran simultáneamente.
         *
         * Ejemplo:
         *   cardsPerView = 3 → cada tarjeta ocupa 33.33% del ancho total.
         */
        const cardWidthPercentage = 100 / cardsPerView;

        /**
         * Construye el valor CSS que combina:
         *
         * 1. Desplazamiento base por índice:
         *      -currentIndex * ancho tarjeta%
         *    Esto mueve el carrusel exactamente al slide correspondiente.
         *
         * 2. Desplazamiento adicional por arrastre táctil o de mouse:
         *      + translateXFormaciones px
         *    Esto permite el arrastre suave mientras se mueve el dedo o mouse.
         *
         * El uso de `calc()` en CSS permite combinar unidades diferentes (% y px).
         */
        return `translateX(calc(-${currentIndexFormaciones * cardWidthPercentage}% + ${translateXFormaciones}px))`;
    };


    /**
     * Maneja la acción de clic sobre una tarjeta de formación.
     *
     * Comportamiento:
     * - Evita la acción si el usuario está realizando un arrastre en la lista.
     * - Establece la información de la formación seleccionada con los datos del
     *   entrenamiento y el progreso del usuario.
     * - Abre el modal que solicita la validación de identidad antes de continuar.
     *
     * @param {Object} training - Datos de configuración de la formación.
     * @returns {void}
     */
    const handleCardClick = (training, progress) => {
        // Evitar que se abra mientras se está arrastrando
        if (isDraggingFormaciones) return;

        setSelectedTraining({
            id: training.id,
            name: progress.name || '',
            documentId: progress.documentId || '',
            completion: progress.completion || 0,
            title: training.title,
            subtitle: training.subtitle,
            description:training.description,
            icon:training.icon,
            type: 'training'
        });

        setIsModalOpen(true);
    };

    /**
     * Cierra el modal de formación y restablece el estado de la formación seleccionada.
     *
     * Comportamiento:
     * - Oculta el modal actual.
     * - Limpia los datos almacenados en selectedTraining.
     *
     * @returns {void}
     */
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTraining(null);
    };


    return (
        <>
            <div className='relative w-[95%] items-center justify-center mx-auto'>
                <div className='relative z-10 mt-[120px] flex flex-col lg:flex-row  items-start lg:items-start justify-between gap-10'>

                    {/* Texto descriptivo - Izquierda */}
                    <div className='w-full lg:w-[40%]'>
                        <div className='relative z-10 mt-[20px]'>
                            <div className='sm:mb-12 lg:mb-10 px-2'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-6 sm:w-8  h-[2px] bg-gradient-to-br from-blue-800 dark:from-blue-600 to-transparent'></div>
                                    <p className='text-md uppercase tracking-[0.2em] text-blue-800/80 dark:text-blue/400/80 font-light'>Formación y Desarrollo</p>
                                </div>
                                <div className='space-y-1 sm:space-y-2'>
                                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold'>
                                        <span className='bg-gradient-to-r from-zinc-600 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-zinc-400 bg-clip-text text-transparent'> Nuestras Formaciones</span>
                                    </h2>
                                </div>
                                <div className='space-y-1 sm:space-y-2 text-zinc-700 dark:text-zinc-300 font-light leading-relaxed'>
                                    <p>A través de nuestras formaciones, acompañamos a cada colaborador en su ruta de crecimiento, brindando herramientas, conocimientos y experiencias que fortalecen sus habilidades y aportan al desarrollo colectivo.</p>
                                </div>

                                {/* botones de navegacion */}
                                {defaultTrainings.length > cardsPerView && (
                                    <div className="hidden md:flex items-center gap-4 mt-8">
                                        <button onClick={goToPrevFormaciones} disabled={currentIndexFormaciones === 0} className="bg-white hover:bg-zinc-50 border border-zinc-200 rounded-full p-3 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" >
                                            <ChevronLeft className="w-5 h-5 text-zinc-700" />
                                        </button>
                                        <button onClick={goToNextFormaciones} disabled={currentIndexFormaciones === maxIndexFormaciones} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm text-zinc-500">
                                            {currentIndexFormaciones + 1} - {Math.min(currentIndexFormaciones + cardsPerView, defaultTrainings.length)} de {defaultTrainings.length}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Carrusel de Formaciones - Derecha */}
                    <div className='w-full lg:w-[60%]'>
                        {/* //ref permite crear una referencia al elemento DOM real.,
                        //eventos mouse
                        // onMouseDown	Se usa para iniciar un arrastre. Se dispara cuando presionas el botón del mouse sobre el div.
                        // onMouseMove	Se usa para mover el carrusel mientras arrastras. Se dispara cuando mueves el mouse sobre el div.
                        // onMouseUp	Se usa para finalizar el arrastre. Se dispara cuando sueltas el botón del mouse.
                        //onMouseLeave	Se usa para detener el arrastre si el cursor sale del div. Se dispara cuando el cursor abandona el área del div. 
                        //eventos tactiles
                        // onTouchStart	Se usa para iniciar un swipe táctil. Se dispara al poner el dedo sobre el div.
                        // onTouchMove	Se usa para mover el carrusel mientras deslizas con el dedo. Se dispara al mover el dedo sobre el div.
                        // onTouchEnd	Se usa para finalizar el swipe. Se dispara al levantar el dedo de la pantalla.
                        // style .. cambia icono del cursor */}
                        <div ref={carouselRefFormaciones} onMouseDown={handleMouseDownFormaciones} onMouseMove={handleMouseMoveFormaciones} onMouseUp={handleMouseUpFormaciones} onMouseLeave={handleMouseLeaveFormaciones} onTouchStart={handleTouchStartFormaciones} onTouchMove={handleTouchMoveFormaciones} onTouchEnd={handleTouchEndFormaciones} className='relative overflow-hidden  cursor-grab active:cursor-grabbing select-none' style={{ cursor: isDraggingFormaciones ? 'grabbing' : 'grab' }}>
                            <div className='flex transition-transform duration-300 ease-out' style={{ transform: getTransformValueFormaciones() }}>
                                {userProgressTraining.map((progress) => {
                                    // Buscar el training correspondiente por ID
                                    const training = defaultTrainings.find(t => t.id === progress.id);
                                    // Si no existe el training, no renderizar nada
                                    if (!training) return null;
                                    return (
                                        <div key={training.id}  className={`flex-shrink-0 px-2 py-4 ${cardsPerView === 1 ? 'w-full' : 'w-1/2'}`}>
                                            <div className=' rounded-2xl shadow-lg  transition-all duration-300  hover:-translate-y-1 cursor-pointer group'>
                                                <div className='relative overflow-hidden rounded-2xl'>
                                                    <img src={training.imagePortada} alt={training.title} className='w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110' draggable="false" />
                                                    <div className='absolute inset-0  bg-gradient-to-t from-black/50 to-transparent opacity-0  group-hover:opacity-100 transition-opacity duration-300'></div>
                                                    <div className='absolute top-3 left-3 bg-blue-600 rounded-full px-4 py-1.5 shadow-lg'>
                                                        <span className='text-xs font-semibold text-white'> {training.date || 'Ene 2025'}</span>
                                                    </div>
                                                    {/* <div className={`absolute bottom-9 right-3 bg-white/50  dark:bg-zinc-800/50  backdrop-blur-xs rounded-full px-6 py-1.5 shadow-lg flex items-center gap-2`}>
                                                        <div className={`w-2 h-2 rounded-full ${progress.completion <= 0 ? 'bg-zinc-700 dark:bg-zinc-400' : progress.completion === 100 ? 'bg-blue-600' : 'bg-blue-300'}  animate-pulse `}></div>

                                                        <span className='text-xs font-bold text-zinc-900 dark:text-zinc-200'> {progress.completion <= 0 ? "Sin iniciar" : progress.completion >= 100 ? `Completado ${progress.completion}%` : `En curso ${progress.completion}%`}</span>

                                                    </div> */}
                                                    <div className={`absolute bottom-9 right-3 overflow-hidden rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${progress.completion <= 0 ? 'bg-zinc-100/90 dark:bg-zinc-800/90 border-zinc-200 dark:border-zinc-700' : progress.completion === 100 ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 dark:border-blue-500' : 'bg-white/90 dark:bg-zinc-800/90 border-blue-200 dark:border-blue-800'}  `}>
                                                        {/* Barra de progreso de fondo para estado "En curso" */}
                                                        {progress.completion > 0 && progress.completion < 100 && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700/30 to-blue-600/20 dark:from-blue-900/30 dark:to-blue-800/20" style={{ width: `${progress.completion}%` }}>
                                                            </div>
                                                        )}

                                                        <div className="relative px-3 py-1 flex items-center gap-2.5">
                                                            {/* Icono según el estado */}
                                                            {progress.completion <= 0 ? (
                                                                <div className="w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center">
                                                                    <div className="w-2 h-2 rounded-full bg-zinc-500 dark:bg-zinc-400"></div>
                                                                </div>
                                                            ) : progress.completion === 100 ? (
                                                                <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            ) : (
                                                                <div className="relative w-5 h-5">
                                                                    <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 20 20">
                                                                        <circle cx="10" cy="10" r="8" fill="none"
                                                                            className="stroke-zinc-200 dark:stroke-zinc-700"
                                                                            strokeWidth="2.5" />
                                                                        <circle cx="10" cy="10" r="8" fill="none"
                                                                            className="stroke-blue-600 dark:stroke-blue-400"
                                                                            strokeWidth="2.5"
                                                                            strokeDasharray={`${progress.completion * 0.503} 50.3`}
                                                                            strokeLinecap="round" />
                                                                    </svg>
                                                                </div>
                                                            )}

                                                            {/* Texto del estado */}
                                                            <div className="flex flex-col leading-tight">
                                                                <span className={`text-xs font-bold ${progress.completion === 100 ? 'text-white' : 'text-zinc-700 dark:text-zinc-200'}`}>
                                                                    {progress.completion <= 0 ? "Sin iniciar" : progress.completion === 100 ? "Completado" : `${progress.completion}%`}
                                                                </span>
                                                                {progress.completion > 0 && progress.completion < 100 && (
                                                                    <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                                                                        En progreso
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='relative -mt-6 bg-white dark:bg-[#1a1a1c] rounded-3xl p-5 z-10'>
                                                    <h3 className='text-lg font-semibold text-zinc-800 dark:text-zinc-300'>{training.title}</h3>
                                                    <p className='text-sm text-blue-600 font-medium mb-2'>{training.subtitle}</p>
                                                    {training.description.slice(0, 1).map((paragraph, index) => (
                                                        <p key={index} className={`text-base text-zinc-700 dark:text-zinc-400 text-justify mb-4 last:mb-0 ${cardsPerView === 1 ? '' : 'leading-snug line-clamp-2'} `}>
                                                            {paragraph.split('**').map((text, i) =>
                                                                i % 2 === 0 ? (text) : (<strong className='text-zinc-700 dark:text-zinc-300 ' key={i} >{text}</strong>)
                                                            )}
                                                        </p>
                                                    ))}
                                                    <button onClick={() => handleCardClick(training, progress)} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2 group">
                                                        <span className="font-medium">Ver curso</span>
                                                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                                    </button>
                                                </div>




                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Indicadores móvil */}
                        {defaultTrainings.length > 1 && (
                            <div className="flex md:hidden justify-center gap-2 mt-6">
                                {defaultTrainings.map((_, index) => (
                                    <button key={index} onClick={() => setCurrentIndexFormaciones(index)} className={`h-2 rounded-full transition-all duration-300 ${currentIndexFormaciones === index ? 'w-8 bg-blue-600' : 'w-2 bg-zinc-300'}`} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && <Modal isOpen={isModalOpen} onClose={handleCloseModal} modalData={selectedTraining} />}

        </>
    )
}

export default TrainingSection;