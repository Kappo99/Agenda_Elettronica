import React from 'react';
import KMsolution_white from '../images/KMsolution_white.svg';
import KMsolution from '../images/KMsolution.png';
import { MdFolderOpen } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
    const location = useLocation();

    return (
        <footer className='w-full bg-slate-800 text-white text-sm mt-12'>

            <div className='container w-full py-5 lg:py-8'>

                <div className='flex flex-col md:flex-row items-center justify-around gap-y-4'>

                    <span className='credits'>&copy; {(new Date().getFullYear())} - Tutti i diritti riservati</span>

                    {/* <img src={KMsolution} className='w-auto h-8' alt='DailyCare' /> */}
                    <button>
                        {location.pathname === '/' ? (
                            <Link to='/archivio' className='btn'>Archivio <MdFolderOpen size={18} /></Link>
                        ) : (
                            <Link to='/' className='btn'>Agenda <MdFolderOpen size={18} /></Link>
                        )}
                    </button>

                    <div className='flex items-center gap-2'>
                        <span data-translate='footer_credits'>Powered by</span>
                        <a href='https://kmsolution.it/dailycare-agenda-elettronica/' target='_blank'>
                            <img src={KMsolution_white} className='w-auto h-4' alt='KMsolution - DailyCare' />
                        </a>
                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;
