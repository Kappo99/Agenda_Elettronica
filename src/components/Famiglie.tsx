import React, { useEffect } from 'react';
import { MdAdd } from 'react-icons/md';
import { FaAddressCard, FaClipboardList } from 'react-icons/fa6';
import { BsCalendarCheckFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchFamiglie, fetchFamiglieArchived } from '../redux/slices/famigliaSlice';
import Loading from './utils/Loading';
import { todayStr } from '../utils/functions';
import { addNotification } from '../redux/slices/notificationSlice';
import { MessageType, Role, UserSex } from '../types';

interface IProps {
    isArchived?: boolean;
}

function Famiglie({ isArchived }: IProps) {
    const dispatch = useAppDispatch();
    const { famiglie, loadingFamiglia, errorFamiglia } = useAppSelector((state) => state.famiglia);

    useEffect(() => {
        dispatch(isArchived ? fetchFamiglieArchived() : fetchFamiglie());
    }, [dispatch, isArchived]);

    useEffect(() => {
        if (errorFamiglia) {
            dispatch(addNotification({ message: errorFamiglia, type: MessageType.ERROR }));
        }
    }, [errorFamiglia]);

    return (
        <div className='container'>

            <div className='grid grid-cols-3 items-center mb-4'>
                <div className='col-span-2'>
                    <h1 className='h1'>Nuclei Famigliari {isArchived && 'archiviati'}</h1>
                </div>
                <div className='col-span-1 flex items-center justify-end gap-5'>
                    <Link className={`btn ${isArchived && 'disabled'}`} to={'/famiglia'}>Nuovo <MdAdd size={18} /></Link>
                </div>
            </div>

            <div className='grid grid-cols-2 xl:grid-cols-3 gap-4'>
                {!loadingFamiglia && !errorFamiglia && famiglie.map((famiglia, index) => (
                    <div key={index} className='col-span-1 pt-2 pb-4 bg-white border border-gray-300 shadow-md rounded-xl'>
                        <div className='h-full flex flex-col justify-between gap-4'>
                            <div>
                                <h4 className='h4 text-center'>{famiglia.Cognome}</h4>
                                <table className='mt-2 !border-none rows-border'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Cognome</th>
                                            <th>Nome</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {famiglia.Anagrafiche.map((anagrafica, index) => (
                                            <tr key={index}>
                                                <td className='text-xl'>
                                                    {anagrafica.Ruolo === Role.GENITORE
                                                        ? (anagrafica.Sesso === UserSex.MALE ? '👨🏻' : '👩🏻')
                                                        : (anagrafica.Sesso === UserSex.MALE ? '👦🏻' : '👧🏻')
                                                    }
                                                </td>
                                                <td className='text-wrap'>{anagrafica.Cognome}</td>
                                                <td className='text-wrap'>{anagrafica.Nome}</td>
                                            </tr>
                                        ))}
                                        {famiglia.Anagrafiche.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className='italic text-gray-600'>Nessun risultato trovato...</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className='w-full flex items-center justify-between gap-3 px-10'>
                                <Link className='btn' to={`/giornata/${famiglia.Id}/${todayStr()}`}><BsCalendarCheckFill size={18} /></Link>
                                <Link className='btn' to={`/storico/${famiglia.Id}`}><FaClipboardList size={18} /></Link>
                                <Link className='btn' to={`/famiglia/${famiglia.Id}`}><FaAddressCard size={18} /></Link>
                            </div>
                        </div>
                    </div>
                ))}
                {loadingFamiglia && <Loading height='300px' />}
            </div>

        </div>
    );
}

export default Famiglie;
