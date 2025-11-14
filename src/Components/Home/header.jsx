import React, { useState, useContext, useEffect } from 'react';


import { Outlet } from 'react-router-dom';
//contexto
import { TrainingLogiTransContext } from '../../Context';

//img
import logo from '../../assets/logitranslogo.png';
//icons
import { Sun, Moon, Menu } from 'lucide-react';

function Header() {

    const { theme, toggleTheme, } = useContext(TrainingLogiTransContext)
    return (
        <>
            <header className='fixed w-full flex items-center justify-between px-4 sm:px-6 py-2.5 gap-4 sm:gap-8 backdrop-blur-md bg-white/50 dark:bg-zinc-900/20 border-b border-zinc-200/50 dark:border-white/10   transition-all duration-300 z-[999]'>
                {/* Línea inferior sutil */}
                <div className='absolute  inset-x-0 top-full h-px bg-zinc-900/5 dark:bg-white/5'></div>

                {/*Logo and text */}
                <div className='flex items-center gap-2 sm:gap-2.5 min-w-0'>
                    <div className='relative bg-white/30 dark:bg-zinc-800/30 backdrop-blur-md h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center p-1.5 shadow-lg transition-all duration-300 flex-shrink-0'>
                        <img src={logo} className='w-full h-full object-contain opacity-90' alt='Logo'></img>
                    </div>

                    <div className='flex flex-col leading-tight min-w-0'>
                        <span className='text-base sm:text-lg md:text-xl bg-gradient-to-br from-gray-700 to-gray-900  bg-clip-text font-bold text-transparent dark:from-white to-zinc-500 truncate'>LOGITRANS</span>
                        <span className='hidden sm:block text-[10px] text-slate-700 dark:text-zinc-400  font-medium tracking-wider truncate'> Transformamos el presente, construimos el futuro.</span>
                    </div>
                </div>
                {/*Navegation */}
                <div className='flex items-center gap-3 sm:gap-4'>
                    <nav className='hidden lg:flex'>
                        <ul className='flex items-center gap-4 lg:gap-6'>
                            <li>
                                <a className='text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition cursor-pointer whitespace-nowrap'>Inicio</a>
                            </li>
                            <li>
                                <a className='text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition cursor-pointer whitespace-nowrap'>Cursos</a>
                            </li>
                            <li>
                                <a className='text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition cursor-pointer whitespace-nowrap'>Comunicaciones</a>
                            </li>
                        </ul>
                    </nav>

                    <div className='h-6 w-px bg-zinc-900/10 dark:bg-white/10 hidden lg:flex'></div>

                    <button onClick={toggleTheme} className={`hidden lg:flex relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${theme==='light'? 'bg-zinc-200 hover:bg-zinc-300':'bg-zinc-700 hover:bg-zinc-600'}`} aria-label='Toggle theme'>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow flex items-center  justify-center transition-all duration-300  ${theme==='dark' ? 'translate-x-6': 'translate-x-0'}`}>
                            {theme === 'light' ? (
                                <Sun className='w-3 h-3 text-amber-500'/>
                            ):(
                                <Moon className='w-3 h-3 text-blue-400'/>
                            )}
                        </div>
                    </button>

                    <button className='block lg:hidden w-6 h-6 text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200 dar_hover:text-zinc-200 transition cursor-pointer flex-shrink-0'>
                        <Menu/>
                    </button>
                </div>
            </header>
        </>
    );
}

//Layout que incluye el Header
function LayoutWithHeader() {
    return (
        <div className='min-h-screen'>
            <Header />
            <main className='pt-10'>
                <Outlet />
            </main>
        </div>
    )
}

export default LayoutWithHeader;