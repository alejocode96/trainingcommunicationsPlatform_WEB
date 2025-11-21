import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


//contexto
import { TrainingLogiTransContext } from '../../Context';

//iconos
import { ChevronRight, ChevronLeft } from 'lucide-react';

function ComunicationSection() {
    //uso del contexto
    const { defaultcomunication } = React.useContext(TrainingLogiTransContext);
    // Calcular cuántas cards mostrar por vista
    const [cardsPerViewComunication, setCardsPerViewComunication] = useState(1);

    //indice del carrusel
    const [currentIndexComunicaciones, setCurrentIndexComunicaciones] = useState(0);

    //Indica si el usuario esta arrastrando activamente el carrusel con el mouse o el dedo.
    //Permite habilitar lógica especial solo durante el arrastre: seguir el movimiento bloquear clics no intencionales determinar si el gesto debe cambiar de slide o no
    const [isDraggingComunicaciones, setIsDraggingComunicaciones] = useState(false);

    //Guarda la posición X inicial donde el usuario comenzó a arrastrar.
    //Permite calcular el desplazamiento horizontal (diff - actualX-startX), necesario para: mover el carrusel visualmente medir velocidad del gesto saber si el swipe va hacia izquierda o derecha
    const [startXComunicaciones, setStartXComunicaciones] = useState(0);

    //guarda la distancia momentánea del arrastre en píxeles
    //es lo que desplaza visualmente las tarjetas mientras arrastras, antes de decidr si el carrusel cambia de slide
    const [translateXComunicaciones, setTranslateXComunicaciones] = useState(0);

    //Guarda el tiempo exacto en que comenzó el arrastre
    //Permite calcular la velocidad del gesto, usada para detectar swipes rápidos: velocity = distancia /tiempo
    const [startTimeComunicaciones, setStartTimeComunicaciones] = useState(0);

    //Referencia al contenedor DOM del carrusel. Permite medir ancho del carrusel manipular scroll detectar límites ingresar listeners 
    const carouselRefComunicaciones = useRef(null);

    //versión "mutable" de isDraggingComunicaciones que NO provoca re-render
    //Evita retrasos o desincronización en eventos mousemove/touchmove donde la reactividad de React sería demasiado lenta
    const isDraggingRefComunicaciones = useRef(false);

    /**
     * Actualiza la cantidad de tarjetas visibles según el ancho de la ventana
     * y la cantidad total de tarjetas disponibles.
     * 
     * Reglas:
     * - Si el ancho de pantalla es >= 768px, mostrar 2 tarjetas por vista
     *  (desktop), de lo contrario 1 tarjeta (mobile).
     * - si 'defaultcomunication' tiene solo 1 elemento, forzar 'cardsPerViewComunication' = 1
     */
    useEffect(() => {
        const updateCardsPerViewComunication = () => {
            let newCardsPerViewComunication = window.innerWidth >= 768 ? 2 : 1;
            //forzar 1 tarjeta si hay menos de dos elementos
            if (defaultcomunication.length <= 1) {
                newCardsPerViewComunication = 1;
            }

            //Actualiza solo si cambió la cantidad de tarjetas visibles
            if (newCardsPerViewComunication !== cardsPerViewComunication) {
                setCardsPerViewComunication(newCardsPerViewComunication);
                setCurrentIndexComunicaciones(0); // reinicia el carrusel al primer slide
            }

        }

        //Evaluacion inicial al montar componente
        updateCardsPerViewComunication();
        //Escucha cambios de tamaño de ventana
        window.addEventListener('resize', updateCardsPerViewComunication);
        //Limpieza para evitar memory leaks
        return () => window.removeEventListener('resize', updateCardsPerViewComunication);

    }, [cardsPerViewComunication, defaultcomunication.length])


    /**
     * Navega al siguiente slide en el carrusel "Comunicaciones".
     *
     * Lógica:
     * - Si el índice actual (`currentIndexComunicaciones`) es menor
     *   que el índice máximo (`maxIndexComunicaciones`), avanza al siguiente slide.
     * - Si ya está en el último slide, se reinicia al primero (efecto loop/circular).
     */
    const goToNextComunicaciones = () => {
        setCurrentIndexComunicaciones((prev) => (prev >= maxIndexComunicaciones ? 0 : prev + 1));
    };

    /**
     * Navega al slide anterior en el carrusel "Comunicaciones".
     *
     * Lógica:
     * - Si el índice actual (`currentIndexComunicaciones`) es mayor que 0, retrocede un slide.
     * - Si ya está en el primer slide, se mueve al último (efecto loop/circular).
     */
    const goToPrevComunicaciones = () => {
        setCurrentIndexComunicaciones((prev) => (prev <= 0 ? maxIndexComunicaciones : prev - 1));
    };

    /**
     * Calcula el índice máximo permitido en el carrusel, es decir,
     * el indice del último slide que puede mostrarse correctamente.
     * 
     * Esto asegura que el carrusel no intente moverse más allá
     * del contenido disponible y previene errores de visualización
     * 
     * - defaultcomunication.length -> numero total de tarjetas de comunicaciones
     * - cardsPerViewComunication -> cantidad de tarjetas visibles simultáneamente en el carrusel
     * 
     * Lógica:
     *  maxIndex = totlaTarjetas - tarjetasVisibles
     *  si hay menos tarjetas que las visibles, el índice máximo será 0 (gracias a Math.max(0,...))
     */
    const maxIndexComunicaciones = Math.max(0, defaultcomunication.length - cardsPerViewComunication);

    /**
     * Controlador del evento 'mousedown' para iniciar el proceso de arrastre
     * del componente correspondiente a "Comunicaciones"
     * 
     * Su responsabilidad es 
     * - Verificar que el clic inicial no ocurra sobre un botón
     * - Activar el modo de arrastre.
     * - Registrar la posición inicial del mouse
     * - Guardar el tiempo inicial del arrastre (9útil para medir velocidad o decidir si fue clic o arrastre)
     * - Reiniciar la traslación horizontal a un valor neutro
     * 
     * Parámetros:
     * @param {MouseEvent} e - Evento del mouse que contiene informacion como la posición X 
     */
    const handleMouseDownComunicaciones = (e) => {
        /**
         * Si el usuario hizo clic sobre un <button> o dentro de un botón
         * no se debe activar el arrastre para evitar interferencias con
         * la interacción normal de botones (por ejemplo, clics, acciones,
         * naveación o apertura de elementos)
         */
        if (e.target.tagName == 'BUTTON' || e.target.closest('button')) {
            return;
        }

        //Habilita el estado de arrastre lógico
        setIsDraggingComunicaciones(true);

        //Marca en la referencia que eectivamente se está arrastrando
        isDraggingRefComunicaciones.current = true;

        /**
         * Almacena la coordenada X del mouse al inicar el arrastre.
         * Esta posición servirá como punto de referencia para calcular 
         * el desplazamiento en handleMouseMoveComunicaciones
         */
        setStartXComunicaciones(e.pageX);

        /**
         * Guara el tiempo exacto del inicio del arrastre.
         * Esto permite medir cuánto tiempo trasncurre entre "down" y "up",
         * útil para distinguie entre un clic rápido y un arrastre real.
         */
        setStartTimeComunicaciones(Date.now());

        /**
         * Reinicia el valor de desplazamiento horizontal para asegurar que 
         * cada arrastre comience desde cero y no arrastre valores previos
         */
        setTranslateXComunicaciones(0);

        //previene comportamiento por defecto (como selección de texto)
        e.preventDefault();
    }

    /**
     * Maneja el evento de movimiento del mouse mientras el usuario arrastra
     * el elemento correspondiente a "Comunicaciones"
     * 
     * Su función principal es calcular cuánto se ha movido morizontalmente
     * el mouse desde que inició el arrastre y aplicar dicho desplazamiento
     * de forma controlada (limitada) al componente, para generar el efecto
     * visual de "slide" o desplazamiento
     * 
     * Requisitos previos para que la función actúe:
     * - Debe existir un arrastre activo: 'isDraggingComunicaciones == true'
     * - Debe exisitr una referencia válida al contenedor en arrastre: isDraggingComunicaciones.current
     * 
     * Parámetros:
     * @param {MouseEvent} e - Evento de movimeinto del mouse. 
     */
    const handleMouseMoveComunicaciones = (e) => {
        //Si no hay arrastre activo o no existe referencia, no hacer nada.
        if (!isDraggingComunicaciones || !isDraggingRefComunicaciones.current) return;

        //previene comportamientos por defecto no deseados como selección de texto.
        e.preventDefault();

        //obtiene la posición horizontal actual del mouse.
        const currentX = e.pageX;

        //calcula cuántos píxeles se ha movido respecto al punto inicial
        const diff = currentX - startXComunicaciones;

        //Límite máximo permitido para el arrastre hacia ambos lados.
        //Esto evita que el elemento se mueva demasiado lejos.
        const maxDrag = 200

        //Aplica un límite al desplazamiento para no superar  ±200px.
        const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));

        //Actualiza el estado que controla la traducción (desplazamiento)
        //horizontal del elemento este estado normalmente se usa dentro del 
        //estilo transform: translateX()
        setTranslateXComunicaciones(limitedDiff);
    };

    /**
     * Controlador del evento 'mouseup' que finaliza el proceso de arrastre
     * del componente 'Comunicaciones' esta función determina si el usuario
     * realizó un deslizamiento válido (swipe) para cambiar de elemento, o
     * si simplemente fue un clic sin intención de arrastrar
     * 
     * Su propósito principal es:
     * - Desactivar el modo arrastre.
     * - Calcular velocidad y tiempo del arrastre.
     * - Aplicar lógica de umbrales (thresholds) para decidir si cmabiar de slide.
     * - Restaurar la posición del elemento al estado inicial.
     * 
     * @param {MouseEvent} e - Evento del mouse al finalizar el Clic/Arrastre 
     */
    const handleMouseUpComunicaciones = (e) => {
        /**
         * Si no hay un arrastre activo o la referencia del arrastre no esta
         * marcada, se abandona la funcion esto evita ejecutar calculos inecesarios
         */
        if (!isDraggingComunicaciones || !isDraggingRefComunicaciones.current) return;

        //Desactiva el modo arrastre visual y lógico
        setIsDraggingComunicaciones(false);
        isDraggingRefComunicaciones.current = false;

        /**
         * Tiempo total transcurrido desde que inició el arrastre
         * útil para evaluar la velocidad del movimiento.
         */
        const timeElapsed = Date.now() - startTimeComunicaciones;

        /**
         * calcula la velocidad aproximada del arrastre. se mide como la distancia
         * horizontal recorrida dividido por e tiempo total (px/ms)
         */
        const velocity = Math.abs(translateXComunicaciones) / timeElapsed;

        /**
         * si la distancia desplazada es minima (<5px) y el tiempo del clic es muy corto (<200ms),
         * se interpreta como un clic normal (no un swipe) en este caso se cancela cualquier
         * desplazamiento y se restablece la posición original
         */
        if (Math.abs(translateXComunicaciones) < 5 && timeElapsed < 200) {
            setTranslateXComunicaciones(0);
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
        if (translateXComunicaciones > threshold && currentIndexComunicaciones > 0) {
            goToPrevComunicaciones();
        } else if (translateXComunicaciones < -threshold && currentIndexComunicaciones < maxIndexComunicaciones) {
            goToNextComunicaciones();
        }

        // Finalmente, se restablece la posición del elemento para que vuelva a su lugar original.
        setTranslateXComunicaciones(0);
    }

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
     * - Si el arrastre está activo (`isDraggingComunicaciones === true`),
     *   se llama manualmente a `handleMouseUpComunicaciones()` para finalizar el arrastre.
     * - Si no hay arrastre en curso, simplemente no realiza ninguna acción.
     */
    const handleMouseLeaveComunicaciones = () => {
        // Verifica si el arrastre está activo
        if (isDraggingComunicaciones) {
            // Finaliza el arrastre igual que si el usuario hubiese soltado el mouse
            handleMouseUpComunicaciones();
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
    const handleTouchStartComunicaciones = (e) => {
        /**
         * Registra la coordenada X del primer punto de contacto.
         * Esto se usa como referencia para calcular cuánto se desplazó
         * horizontalmente el usuario durante el gesto.
         */
        setStartXComunicaciones(e.touches[0].clientX);

        /**
         * Guarda el timestamp del inicio del gesto.  
         * Se utiliza posteriormente para calcular la velocidad del swipe
         * al finalizar el toque.
         */
        setStartTimeComunicaciones(Date.now());

        /**
         * Reinicia la traslación horizontal para evitar arrastrar valores previos
         * de gestos anteriores.
         */
        setTranslateXComunicaciones(0);
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
    const handleTouchMoveComunicaciones = (e) => {

        // Obtiene la posición X actual del toque.
        const currentX = e.touches[0].clientX;

        // Calcula la diferencia entre el punto inicial del toque y la posición actual.
        const diff = currentX - startXComunicaciones;

        /**
         * Define el desplazamiento máximo permitido (en píxeles),
         * tanto hacia la izquierda como hacia la derecha.
         * Esto evita que el usuario arrastre el contenedor demasiado.
         */
        const maxDrag = 200;

        // Aplica el límite de arrastre mediante un "clamp" entre -maxDrag y +maxDrag.
        const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));

        // Actualiza el estado responsable de mover visualmente el carrusel.
        setTranslateXComunicaciones(limitedDiff);

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
    const handleTouchEndComunicaciones = () => {

        /**
         * Tiempo total transcurrido desde que inició el toque.
         * Se utiliza para calcular la velocidad del gesto.
         */
        const timeElapsed = Date.now() - startTimeComunicaciones;

        /**
         * Velocidad del gesto táctil.  
         * Se calcula como la distancia horizontal arrastrada (en px)
         * dividida por el tiempo del gesto (en ms).
         */
        const velocity = Math.abs(translateXComunicaciones) / timeElapsed;

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
        if (translateXComunicaciones > threshold && currentIndexComunicaciones > 0) {
            goToPrevComunicaciones();
        } else if (
            translateXComunicaciones < -threshold &&
            currentIndexComunicaciones < maxIndexComunicaciones
        ) {
            goToNextComunicaciones();
        }

        /**
         * Restablece la posición del carrusel a su estado original
         * luego de terminar la interacción táctil.
         */
        setTranslateXComunicaciones(0);
    };

    /**
     * Calcula el valor de transformación CSS (transform) que se aplicará
     * al contenedor del carrusel "Comunicaciones".
     *
     * Este valor combina:
     * - La posición del slide actual (`currentIndexComunicaciones`),
     * - El ancho relativo de cada tarjeta según las tarjetas visibles (`cardsPerViewComunicaciones`),
     * - El desplazamiento dinámico generado por el arrastre (`translateXComunicaciones`),
     * para producir un movimiento fluido y preciso.
     *
     * Retorna un valor tipo:
     *   translateX(calc(-{porcentaje}% + {pixels}px))
     *
     * Ejemplo:
     *   currentIndex = 2, cardsPerViewComunicaciones = 3 → cardWidth = 33.33%
     *   Resultado: translateX(calc(-66.66% + 15px))
     *
     * @returns {string} Cadena CSS usada en la propiedad `transform`.
     */
    const getTransformValueComunicaciones = () => {

        /**
         * Calcula el ancho relativo de cada tarjeta según cuántas
         * tarjetas se muestran simultáneamente.
         *
         * Ejemplo:
         *   cardsPerView = 3 → cada tarjeta ocupa 33.33% del ancho total.
         */
        const cardWidthPercentage = 100 / cardsPerViewComunication;

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
        return `translateX(calc(-${currentIndexComunicaciones * cardWidthPercentage}% + ${translateXComunicaciones}px))`;
    };

    return (
        <>
            <div className='relative w-[95%] items-center justify-center mx-auto'>
                <div className='relative z-10 mt-[360px] flex flex-col lg:flex-row-reverse items-start lg:items-start justify-between gap-10'>
                    {/* Texto descriptivo - Derecha (flex-row-reverse lo pone a la derecha) */}
                    <div className='w-full lg:w-[40%]'>
                        <div className='relative z-10 mt-[20px]'>
                            <div className='sm:mb-12 lg:mb-10 px-2'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-6 sm:w-8 h-[2px] bg-gradient-to-r from-[#02009b] dark:from-[#0500d5] to-transparent'></div>
                                    <p className='text-md uppercase tracking-[0.2em] text-[#02009b] dark:text-[#0500d5] font-light'>Información y Conexión</p>
                                </div>
                                <div className='space-y-1 sm:space-y-2'>
                                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold'>
                                        <span className='bg-gradient-to-r from-zinc-600 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-zinc-400 bg-clip-text text-transparent'>Nuestras Comunicaciones</span>
                                    </h2>
                                </div>
                                <div className='space-y-1 sm:space-y-2 text-zinc-700 dark:text-zinc-300 font-light leading-relaxed'>
                                    <p>Mantente informado con nuestras comunicaciones oficiales. Aquí encontrarás boletines, actualizaciones y contenido relevante que fortalece nuestra cultura organizacional y mantiene a todos conectados.</p>
                                </div>

                                {/* Botones de navegación */}
                                {defaultcomunication.length > cardsPerViewComunication && (
                                    <div className="hidden md:flex items-center gap-4 mt-8">
                                        <button onClick={goToPrevComunicaciones} disabled={currentIndexComunicaciones === 0} className="bg-white hover:bg-zinc-50 border border-zinc-200 rounded-full p-3 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" >
                                            <ChevronLeft className="w-5 h-5 text-zinc-700" />
                                        </button>
                                        <button onClick={goToNextComunicaciones} disabled={currentIndexComunicaciones === maxIndexComunicaciones} className="bg-[#0500d5] hover:bg-[#02009b] text-white rounded-full p-3 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm text-zinc-500">
                                            {currentIndexComunicaciones + 1} - {Math.min(currentIndexComunicaciones + cardsPerViewComunication, defaultcomunication.length)} de {defaultcomunication.length}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='w-full lg:w-[60%]'>
                        <div ref={carouselRefComunicaciones} onMouseDown={handleMouseDownComunicaciones} onMouseMove={handleMouseMoveComunicaciones} onMouseUp={handleMouseUpComunicaciones} onMouseLeave={handleMouseLeaveComunicaciones}  onTouchStart={handleTouchStartComunicaciones}  onTouchMove={handleTouchMoveComunicaciones} onTouchEnd={handleTouchEndComunicaciones} className='relative overflow-hidden cursor-grab active:cursor-grabbing select-none'style={{ cursor: isDraggingComunicaciones ? 'grabbing' : 'grab' }}>
                            <div className='flex transition-transform duration-300 ease-out'  style={{ transform: getTransformValueComunicaciones() }}>
                                {defaultcomunication.map((comunication) => (
                                    <div key={comunication.id} className={`flex-shrink-0 px-2 py-4 ${cardsPerViewComunication === 1 ? 'w-full' : 'w-1/2'}`}>
                                        <div className='bg-white dark:bg-[#1a1a1c] rounded-2xl shadow-lg overflow-hidden transition-all duration-300  hover:-translate-y-1 cursor-pointer group'>
                                            <div className='relative overflow-hidden rounded-t-2xl'>
                                                <img src={comunication.imagePortada} alt={comunication.title} className='w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110' draggable="false" />
                                                <div className='absolute inset-0  bg-gradient-to-t from-black/50 to-transparent opacity-0  group-hover:opacity-100 transition-opacity duration-300'></div>
                                                <div className='absolute top-3 left-3 bg-[#0500d5] rounded-full px-4 py-1.5 shadow-lg'>
                                                    <span className='text-xs font-semibold text-white'> {comunication.date || 'Ene 2025'}</span>
                                                </div>
                                                <div className="absolute bottom-9 right-3 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-xs rounded-full px-6 py-1.5 shadow-lg flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#0500d5] animate-pulse"></div>
                                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200"> Nueva </span>
                                                </div>
                                            </div>

                                            <div className='relative -mt-6 bg-white dark:bg-[#1a1a1c] rounded-t-3xl p-5 z-10'>
                                                <h3 className='text-lg font-semibold text-zinc-800 dark:text-zinc-300'>{comunication.title}</h3>
                                                <p className='text-sm text-[#0500d5]  font-medium mb-2'>{comunication.subtitle}</p>
                                                {comunication.description.slice(0, 1).map((paragraph, index) => (
                                                    <p key={index} className={`text-base text-zinc-700 dark:text-zinc-400 text-justify mb-4 last:mb-0 ${cardsPerViewComunication === 1 ? '' : 'leading-snug line-clamp-2'} `}>
                                                        {paragraph.split('**').map((text, i) =>
                                                            i % 2 === 0 ? (text) : (<strong className='text-zinc-700 dark:text-zinc-300 ' key={i} >{text}</strong>)
                                                        )}
                                                    </p>
                                                ))}
                                            </div>

                                            <div className="px-5 pb-5">
                                                <button className="w-full bg-[#0500d5] hover:bg-[#02009b] text-white rounded-full py-3 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2 group">
                                                    <span className="font-medium">Ver curso</span>
                                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Indicadores móvil */}
                        {defaultcomunication.length > 1 && (
                            <div className="flex md:hidden justify-center gap-2 mt-6">
                                {defaultcomunication.map((_, index) => (
                                    <button key={index} onClick={() => setCurrentIndexComunicaciones(index)} className={`h-2 rounded-full transition-all duration-300 ${currentIndexComunicaciones === index ? 'w-8 bg-[#0500d5] ' : 'w-2 bg-zinc-300'}`} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ComunicationSection;