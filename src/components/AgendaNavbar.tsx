import React, { useEffect, useMemo, useState } from 'react';
import { MdDownload, MdEdit, MdEditDocument, MdSave } from 'react-icons/md';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAnagraficaById } from '../redux/slices/anagraficaSlice';
import { todayStr } from '../utils/functions';
import SearchBar from './utils/SearchBar';

interface IProps {
    isEditing?: boolean;
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
    isCreating?: boolean;
    handleSave?: () => void;
    searchTerm?: string;
    setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
}

function AgendaNavbar(props: IProps) {
    const { id } = useParams<{ id: string }>();
    const { date } = useParams<{ date: string }>();
    const { selectedAnagrafica } = useAppSelector((state) => state.anagrafica);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState('Storico');

    const tabs = useMemo(() => {
        let baseTabs = [
            { name: 'Dati anagrafici', path: `/anagrafica/${id}` },
        ];
        const userTabs = [
            { name: 'Giornata', path: `/giornata/${id}/${todayStr()}` },
            { name: 'Storico', path: `/storico/${id}` },
        ];
        const famigliaTabs = [
            { name: 'Famiglia', path: `/famiglia/${id}` },
        ];

        if (Number(id) <= 6) {
            baseTabs = [
                ...famigliaTabs,
                ...baseTabs,
            ]
        }
        if (!selectedAnagrafica?.IsEducatore) { // sostituisci 'condizione' con la tua condizione
            return [
                ...userTabs,
                ...baseTabs,
            ];
        }

        return baseTabs;
    }, [id, selectedAnagrafica]);

    // Imposto l'activeTab in base alla rotta corrente
    useEffect(() => {
        // Ottieni la prima parte della rotta (ad esempio '/giornata', '/storico')
        const currentPath = location.pathname.split('/')[1];
        const matchedTab = tabs.find(tab => tab.path.includes(currentPath));

        if (matchedTab) {
            setActiveTab(matchedTab.name);
        }
    }, [location.pathname, tabs]);

    useEffect(() => {
        if (!selectedAnagrafica && id) {
            // Effettua la fetch solo se non esiste già un'anagrafica selezionata
            dispatch(fetchAnagraficaById(Number(id)));
        }
    }, [selectedAnagrafica, id, dispatch]);

    const handleSave = () => {
        if (props.handleSave) {
            props.handleSave();
        }
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        if (date) {
            navigate(location.pathname.replace(date, selectedDate));
        }
    };

    return (
        <>
            <div className='flex items-end justify-between mb-6'>
                <h1 className='h1'>
                    {props.isCreating ? 'Nuova anagrafica' : (
                        selectedAnagrafica ? `${selectedAnagrafica.Nome} ${selectedAnagrafica.Cognome}` : 'Caricamento...')}
                </h1>
                {date && (
                    <div className='flex items-center gap-4'>
                        <span className='text-lg font-medium uppercase'>Data</span>
                        <div className="form-element text-lg font-medium">
                            <input type="date" value={date} max={todayStr()} onChange={handleDateChange} />
                        </div>
                    </div>
                )}
            </div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                    {tabs.map((tab) => (
                        <Link
                            to={tab.path}
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`px-4 py-2 ${id && !selectedAnagrafica?.IsEducatore ? 'cursor-pointer' : 'pointer-events-none'} border border-b-0 border-gray-300 rounded-t-2xl relative ${activeTab === tab.name ? 'bg-white' : `bg-gray-100 ${id ? 'hover:bg-white' : ''}`}`}
                        >
                            {tab.name}
                            {activeTab === tab.name && (
                                <div className='absolute -bottom-1 left-0 w-full h-2 bg-white z-[800]'></div>
                            )}
                        </Link>
                    ))}
                </div>

                {activeTab === 'Giornata' && (
                    props.isEditing ? (
                        <button className='btn' disabled={selectedAnagrafica?.IsArchiviato} onClick={handleSave}>Salva <MdSave /></button>
                    ) : (
                        <button className='btn' disabled={selectedAnagrafica?.IsArchiviato} onClick={() => props.setIsEditing && props.setIsEditing(!props.isEditing)}>Modifica <MdEdit /></button>
                    )
                )}

                {activeTab === 'Storico' && (
                    <div className='flex items-center gap-4'>
                        {/* <SearchBar value={props.searchTerm ?? ''} onChange={props.setSearchTerm ?? (() => { })} /> */}
                        <Link to={`/giornata/${id}/${todayStr()}`} className={`btn ${selectedAnagrafica?.IsArchiviato && ' disabled'}`}>
                            Giornata <MdEditDocument size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

export default AgendaNavbar;
