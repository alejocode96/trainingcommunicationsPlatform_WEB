import React, { useState, useContext, useEffect } from 'react';


import { Outlet } from 'react-router-dom';
//contexto
import { TrainingLogiTransContext } from '../../Context';

//img
import logo from '../../assets/logitranslogo.png';
//icons
import { Sun, Moon, Menu, X, ChevronRight, Home, NotebookPen, Megaphone } from 'lucide-react';

function Header() {

    const { theme, toggleTheme, sideBarHome, setSideBarHome } = useContext(TrainingLogiTransContext)

    //mostrar sidebarHome
    const handleShowSideBarHome = () => {
        setSideBarHome(true);
    };

    //ocultar sidebarHome
    const handleCloseSideBarHome = () => {
        setSideBarHome(false);
    };

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

                    <button onClick={toggleTheme} className={`hidden lg:flex relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${theme === 'light' ? 'bg-zinc-200 hover:bg-zinc-300' : 'bg-zinc-700 hover:bg-zinc-600'}`} aria-label='Toggle theme'>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow flex items-center  justify-center transition-all duration-300  ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
                            {theme === 'light' ? (
                                <Sun className='w-3 h-3 text-amber-500' />
                            ) : (
                                <Moon className='w-3 h-3 text-blue-400' />
                            )}
                        </div>
                    </button>

                    <button onClick={handleShowSideBarHome} className='block lg:hidden w-6 h-6 text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200 dar_hover:text-zinc-200 transition cursor-pointer flex-shrink-0'>
                        <Menu />
                    </button>
                </div>
            </header>

            {/*Fondo oscuro con fade */}
            <div onClick={handleCloseSideBarHome} className={`block md:hidden fixed inset-0 bg-zinc-200/80 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${sideBarHome ? 'opacity-100 visible' : 'opacity-0 invisible'} z-[9998]`}> </div>

            {/* Sidebar deslizante */}
            <div className={`flex md:hidden flex-col fixed top-0 right-0 h-full w-[280px] sm:w-[300px] max-w-[85vw] bg-zinc-50 dark:bg-zinc-900/95 backdrop-blur-sm transform transition-transform duration-500 ease-out border-l border-zinc-500/50 dark:border-zinc-700/50  shadow-2xl rounded-l-2xl ${sideBarHome ? 'translate-x-0' : 'translate-x-full'} z-[9999]`}>
                {/* Contenido del sidebar */}
                <div className='flex flex-col h-full p-2'>
                    <div className='flex items-center justify-between gap-2 p-3 rounded-2xl w-full'>
                        <div className='flex items-center min-w-0 flex-1'>
                            <div className='relative bg-white/30 dark:bg-zinc-800/30 backdrop-blur-md h-10 w-10 rounded-lg flex items-center justify-center p-1.5 shadow-lg transition-all duration-300 flex-shrink-0'>
                                <img src={logo} className='w-full h-full object-contain opacity-90' alt='Logo' />
                            </div>
                            <div className='flex flex-col leading-tight ml-2 min-w-0'>
                                <span className='text-base sm:text-lg bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text font-bold text-transparent dark:from-white dark:to-zinc-500 truncate'>LOGITRANS</span>
                            </div>
                        </div>
                        <div className='group hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1 rounded-xl transition-all duration-300 text-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 flex-shrink-0 flex items-center'>
                            <button onClick={handleCloseSideBarHome} className='w-6 h-6 transition cursor-pointer'>
                                <X />
                            </button>
                        </div>
                    </div>

                    <div className='w-[90%] h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-auto my-2'></div>

                    <div className='flex-1 p-3 space-y-3 sm:space-y-4 overflow-y-auto '>
                        <button className='w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold shadow-lg transition hover:shadow-xl group '>
                            <div className='flex items-center gap-3 min-w-0'>
                                <Home className='w-5 h-5 flex-shrink-0' />
                                <span className='truncate'>Inicio</span>
                            </div>
                            <ChevronRight className="w-5 h-5 flex-shrink-0" />
                        </button>

                        <button className='w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition group'>
                            <div className='flex items-center gap-3 min-w-0'>
                                <NotebookPen className="w-5 h-5 flex-shrink-0" />
                                <span className="truncate">Formaciones</span>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
                        </button>
                        <button className='w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition group'>
                            <div className='flex items-center gap-3 min-w-0' >
                                <Megaphone className="w-5 h-5 flex-shrink-0" />
                                <span className="truncate" >Comunicaciones</span>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
                        </button>
                    </div>

                    {/* Botón de Dark/Light Mode en la parte inferior */}
                    <div className='p-3 pb-4'>
                        <div className='w-[90%] h-[1px] bg-zinc-200 dark:bg-zinc-800 mb-3 sm:mb-4 mx-auto'></div>
                        <button onClick={toggleTheme} className='w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-gradient-to-r form-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group'>
                            <div className='flex items-center gap-3 min-w-0'>
                                <div className='relative w-5 h-5 flex-shrink-0'>
                                    <Sun className='w-5 h-5 text-amber-500 absolute transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0' />
                                    <Moon className='w-5 h-5 text-blue-400 absolute transition-all duration-300 rotate-90 scale-0 dark:-rotate-0 dark:scale-100' />
                                </div>
                                <span className='truncate'>Tema</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-white/50 dark:bg-zinc-900/50 text-xs font-medium flex-shrink-0">
                                <span className="dark:hidden">Claro</span>
                                <span className="hidden dark:inline">Oscuro</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

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