import React, { useEffect, useState } from 'react';
import { MdAdd, MdClear } from 'react-icons/md';
import { FaAddressCard } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAnagrafiche, fetchAnagraficheArchived } from '../redux/slices/anagraficaSlice';
import Loading from './utils/Loading';
import { todayStr } from '../utils/functions';
import SearchBar from './utils/SearchBar';
import { addNotification } from '../redux/slices/notificationSlice';
import { MessageType, UserSex } from '../types';

interface IProps {
    isArchived?: boolean;
}

function Anagrafiche({ isArchived }: IProps) {
    const dispatch = useAppDispatch();
    const { anagrafiche, loadingAnagrafica: loading, errorAnagrafica: error } = useAppSelector((state) => state.anagrafica);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(isArchived ? fetchAnagraficheArchived() : fetchAnagrafiche());
    }, []);

    useEffect(() => {
        if (searchTerm) {
            dispatch(isArchived ? fetchAnagraficheArchived(searchTerm) : fetchAnagrafiche(searchTerm));
        } else {
            dispatch(isArchived ? fetchAnagraficheArchived() : fetchAnagrafiche());
        }
    }, [searchTerm, dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(addNotification({ message: error, type: MessageType.ERROR }));
        }
    }, [error]);

    const handleRowClick = (id: number, isEducatore: boolean = false) => {
        navigate(isEducatore || isArchived ? `/anagrafica/${id}` : `/giornata/${id}/${todayStr()}`);
    };

    return (
        <div className='container'>

            <div className='grid grid-cols-2 items-center mb-6 gap-6'>
                <div className='col-span-1'>
                    <h1 className='h1'>Anagrafiche {isArchived && 'archiviate'}</h1>
                </div>
                <div className='col-span-1 flex items-center gap-5'>
                    <SearchBar value={searchTerm} onChange={setSearchTerm} />
                    <Link className={`btn ${isArchived && 'disabled'}`} to={'/anagrafica'}>Nuova <MdAdd size={18} /></Link>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Cognome</th>
                        <th>Nome</th>
                        <th>Codice Fiscale</th>
                        <th>Data Nascita</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={6}>
                                {loading && <Loading />}
                            </td>
                        </tr>
                    )}
                    {!loading && !error && anagrafiche.map((anagrafica) => (
                        <tr key={anagrafica.Id}
                            className='hover:bg-gray-200 cursor-pointer'
                            onClick={() => handleRowClick(anagrafica.Id, anagrafica.IsEducatore)}
                        >
                            <td className='text-xl'>
                                {anagrafica.IsEducatore ?
                                    '🎓' :
                                    (anagrafica.Sesso === UserSex.MALE ? '👦🏻' : '👧🏻')}
                            </td>
                            <td>{anagrafica.Cognome}</td>
                            <td>{anagrafica.Nome}</td>
                            <td>{anagrafica.CF}</td>
                            <td>{anagrafica.DataNascita}</td>
                            <td>
                                <button className='btn btn-sm !p-0' onClick={(e) => e.stopPropagation()}>
                                    <Link className='btn btn-sm' to={`/anagrafica/${anagrafica.Id}`}><FaAddressCard /></Link>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {!loading && !error && anagrafiche.length === 0 && (
                        <tr>
                            <td colSpan={6} className='italic text-gray-600'>Nessun risultato trovato...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Anagrafiche;
