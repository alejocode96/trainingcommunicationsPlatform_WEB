import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//contexto
import { TrainingLogiTransContext } from '../../Context';


//imagenes
import formacionesycomunicaciones from '../../assets/formacionesycomunicaciones.png';

//componentes
import TrainingSection from '../../Components/Home/trainingSection';
import ComunicationSection from '../../Components/Home/comunicationSection';
function Home() {



    return (
        <>
            <div className='w-full min-h-screen'>
                {/* Fondo decorativo */}
                <div className='absolute inset-0 z-10 mx-0 max-w-none overflow-hidden'>
                    <div className='absolute top-0 left-1/2 -ml-152 h-100 w-325 dark:mask-[linear-gradient(white,transparent)]'>
                        <div className='absolute inset-0 bg-linear-to-r from-[#00A3E0] to-[#2b68e0] mask-[radial-gradient(farthest-side_at_top,white,transparent)] opacity-40 dark:from-[#00A3E0]/30 dark:to-[#2b68e0]/30 dark:opacity-100'>
                            <svg aria-hidden="true" className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5">
                                <defs>
                                    <pattern id="_S_1_" width="72" height="56" patternUnits="userSpaceOnUse" x="-12" y="4">
                                        <path d="M.5 56V.5H72" fill="none"></path>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" strokeWidth="0" fill="url(#_S_1_)"></rect>
                                <svg x="-12" y="4" className="overflow-visible">
                                    <rect strokeWidth="0" width="73" height="57" x="288" y="168"></rect>
                                    <rect strokeWidth="0" width="73" height="57" x="144" y="56"></rect>
                                    <rect strokeWidth="0" width="73" height="57" x="504" y="168"></rect>
                                    <rect strokeWidth="0" width="73" height="57" x="720" y="336"></rect>
                                </svg>
                            </svg>
                        </div>
                        <svg viewBox="0 0 1113 440" aria-hidden="true" className="absolute top-0 left-1/2 -ml-76 w-278.25 fill-white blur-[26px] dark:fill-zinc-900" >
                            <path d="M.016 439.5s-9.5-300 434-300S882.516 20 882.516 20V0h230.004v439.5H.016Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Sección inicial */}
                <div className='relative w-full flex items-center justify-center min-h-screen'>
                    <div className='w-full max-w-[95%] mx-auto flex items-center justify-center'>
                        <div className='flex flex-col lg:flex-row w-full items-center justify-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12 py-8 lg:py-12 '>

                            {/* Sección de texto */}
                            <div className="w-full lg:w-[55%] flex items-center justify-center lg:justify-start z-30">
                                <div className="flex flex-col w-full max-w-full px-4 lg:px-0">
                                    <p className="text-zinc-400 font-extralight leading-none mb-0 text-center lg:text-left text-[5vw] sm:text-2xl md:text-3xl lg:text-4xl">
                                        FORMACIONES Y COMUNICACIONES
                                    </p>
                                    <h1 className="bg-gradient-to-br from-gray-600 to-gray-900 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent font-bold tracking-tight leading-none text-center lg:text-left -mt-1 -ml-1 text-[16vw] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                                        LOGITRANS
                                    </h1>
                                </div>
                            </div>

                            {/* Sección de imagen */}
                            <div className='w-full lg:w-[45%] flex items-center justify-center relative z-30 mt-4 lg:mt-0'>
                                <div className='flex items-end justify-center w-full max-w-[380px] sm:max-w-[380px] md:max-w-[400px] lg:max-w-[420px] xl:max-w-[480px] transform scale-100 rotate-[-2deg]'>
                                    <img
                                        src={formacionesycomunicaciones}
                                        alt="Formaciones Y Comunicaciones"
                                        className='w-full h-auto object-cover object-top grayscale'
                                        style={{
                                            maskImage: 'linear-gradient(to bottom, black 70%, transparent 95%)',
                                            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 95%)'
                                        }}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Franja inclinada debajo del contenido principal */}
                <div className='absolute left-1/2 -translate-x-1/2 w-[110vw] h-[1100px] md:h-[800px] -rotate-2 bg-[#f5f5f5] dark:bg-[#0b0b0d] overflow-hidden z-0 shadow-[0_-15px_50px_rgba(0,0,0,0.1),0_15px_50px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.08)] dark:shadow-[0_-20px_60px_rgba(0,0,0,0.4),0_20px_60px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.03),inset_0_-1px_3px_rgba(0,0,0,0.5)]'></div>

                {/* ========== SECCIÓN FORMACIONES ========== */}
                <TrainingSection />

                {/* ========== SECCIÓN COMUNICACIONES ========== */}
                <ComunicationSection />
            </div>
        </>
    )
}

export default Home;