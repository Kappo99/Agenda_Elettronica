import React, { useEffect, useState } from 'react';
import { MdArchive, MdCancel, MdDelete, MdDownload, MdEdit, MdOutlineRestorePage, MdSave, MdSearch, MdUploadFile } from 'react-icons/md';
import AgendaNavbar from '../components/AgendaNavbar';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAnagraficaById, createAnagrafica, updateAnagrafica, deleteAnagrafica, archiveAnagrafica, unarchiveAnagrafica } from '../redux/slices/anagraficaSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/utils/Loading';
import IAnagrafica, { exampleAnagrafica } from '../types/IAnagrafica';
import { isValidCF, todayStr } from '../utils/functions';
import { deleteDocumento } from '../redux/slices/documentoSlice';
import FormUploadFilePopup from '../components/popup/FormUploadFilePopup';
import IDocumento from '../types/IDocumento';
import { addNotification } from '../redux/slices/notificationSlice';
import { MessageType, UserSex } from '../types';
import { hidePopup, showPopup } from '../redux/slices/popupSlice';
import { usePopup } from '../context/PopupContext';

interface IProps {
    isCreating?: boolean;
}

function Anagrafica(props: IProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { selectedAnagrafica, loadingAnagrafica: loading, errorAnagrafica: error } = useAppSelector((state) => state.anagrafica);
    const { loading: loadingDoc, error: errorDoc } = useAppSelector((state) => state.documento);
    const { idAnagrafica } = useAppSelector((state) => state.auth);
    const { registerCallback } = usePopup();

    const [isEditing, setIsEditing] = useState(props.isCreating);
    const [isDisabled, setIsDisabled] = useState(false);
    const [showUploadDoc, setShowUploadDoc] = useState(false);
    const [formData, setFormData] = useState<IAnagrafica>(exampleAnagrafica);

    useEffect(() => {
        if (id) {
            dispatch(fetchAnagraficaById(Number(id)));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (selectedAnagrafica && !error && !props.isCreating) {
            setFormData(selectedAnagrafica);
        }
    }, [selectedAnagrafica, error, props.isCreating]);

    useEffect(() => {
        setIsDisabled(
            (!props.isCreating && (selectedAnagrafica?.IsArchiviato ?? false)) ||
            ((selectedAnagrafica?.IsEducatore ?? false) && (selectedAnagrafica?.Id ?? -1) !== idAnagrafica)
        );
    }, [props, selectedAnagrafica, idAnagrafica]);

    useEffect(() => {
        if (error) {
            dispatch(addNotification({ message: error, type: MessageType.ERROR }));
        }
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'Nome' || name === 'Cognome') {
            formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
        }

        if (name === 'CF') {
            formattedValue = value.toUpperCase();
        }

        setFormData({
            ...formData,
            [name]: formattedValue,
        });
    };

    const handleSave = () => {
        if (!formData.Nome || !formData.Cognome || !formData.DataNascita || !formData.CF /* || !formData.Residenza */ || formData.Sesso === UserSex.NONE /* || !formData.Ingresso */) {
            dispatch(addNotification({ message: 'Compilare tutti i campi', type: MessageType.WARNING }));
            return;
        }
        if (!isValidCF(formData.CF)) {
            dispatch(addNotification({ message: 'Codice Fiscale non valido', type: MessageType.WARNING }));
            return;
        }
        if (props.isCreating) {
            dispatch(createAnagrafica(formData));
            setIsEditing(false);
            // TODO: navigate to the new anagrafica page (verificare che salva correttamente l'anagrafica)
            // navigate(`/anagrafica/${result.payload.Id}`);
        } else if (id) {
            dispatch(updateAnagrafica({ id: Number(id), newAnagrafica: formData }));
            setIsEditing(false);
        }
        dispatch(addNotification({ message: 'Anagrafica salvata', type: MessageType.SUCCESS }));
    };

    const handleDeleteConfirmClick = () => {
        const callbackId = 'confirmDelete';
        registerCallback(callbackId, handleDelete);

        dispatch(
            showPopup({
                type: MessageType.ERROR,
                message: `Sei sicuro di voler eliminare l'anagrafica? Verrà eliminato tutto lo storico delle giornate di ${selectedAnagrafica?.Nome} ${selectedAnagrafica?.Cognome}. I dati non saranno recuperabili`,
                onConfirmId: callbackId,
            })
        );
    };

    const handleDelete = () => {
        if (id) {
            dispatch(deleteAnagrafica(Number(id)));
            dispatch(addNotification({ message: 'Anagrafica eliminata', type: MessageType.SUCCESS }));
            dispatch(hidePopup());
            navigate('/');
        }
    };

    const handleDeleteDocConfirmClick = (documento: IDocumento) => {
        const callbackId = 'confirmDeleteDoc';
        registerCallback(callbackId, () => handleDeleteDoc(documento));

        dispatch(
            showPopup({
                type: MessageType.ERROR,
                message: "Sei sicuro di voler eliminare il documento? L'operazione è irreversibile",
                onConfirmId: callbackId,
            })
        );
    }

    const handleDeleteDoc = (documento: IDocumento) => {
        if (id && documento) {
            dispatch(deleteDocumento({ idAnagrafica: Number(id), documento }));
            dispatch(addNotification({ message: 'Documento eliminato', type: MessageType.SUCCESS }));
            dispatch(hidePopup());
        }
    };

    const handleArchiveConfirmClick = () => {
        const callbackId = 'confirmArchive';
        registerCallback(callbackId, handleArchive);

        dispatch(
            showPopup({
                type: MessageType.WARNING,
                message: "Sei sicuro di voler archiviare l'anagrafica? Verrà impostata in uno stato di sola lettura",
                onConfirmId: callbackId,
            })
        );
    };

    const handleArchive = () => {
        if (id) {
            dispatch(archiveAnagrafica(Number(id)));
            dispatch(addNotification({ message: 'Anagrafica archiviata', type: MessageType.SUCCESS }));
            dispatch(hidePopup());
            navigate('/');
        }
    };

    const handleUnarchive = () => {
        if (id) {
            dispatch(unarchiveAnagrafica(Number(id)));
            dispatch(addNotification({ message: 'Anagrafica ripristinata', type: MessageType.SUCCESS }));
            dispatch(hidePopup());
            // dispatch(fetchAnagraficaById(Number(id)));
        }
    };

    const handleAnnulla = () => {
        if (props.isCreating) {
            navigate('/');
        } else {
            setIsEditing(false);
            setFormData(selectedAnagrafica || formData);
        }
    };

    return (
        <div className='container'>
            {(loading || loadingDoc) && <Loading />}

            <FormUploadFilePopup
                message='Carica un documento'
                show={showUploadDoc}
                onClose={() => setShowUploadDoc(false)}
            />

            {(!loading && !loadingDoc) && (selectedAnagrafica || props.isCreating) && (
                <>
                    <AgendaNavbar isFamiglia={false} isCreating={props.isCreating} />

                    <div className='grid grid-cols-11 gap-10'>

                        <section className='col-span-6 xl:col-span-7 flex flex-col gap-4 bg-white border border-gray-300 rounded-2xl rounded-tl-none shadow-md p-6'>

                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='nome'>Nome</label>
                                <input type='text' id='nome' name='Nome' className='col-span-3' disabled={!isEditing} value={formData.Nome} onChange={handleChange} />
                            </div>

                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='cognome'>Cognome</label>
                                <input type='text' id='cognome' name='Cognome' className='col-span-3' disabled={!isEditing} value={formData.Cognome} onChange={handleChange} />
                            </div>

                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='data_nascita'>Data di nascita</label>
                                <input type='date' id='data_nascita' name='DataNascita' className='col-span-3' disabled={!isEditing} value={formData.DataNascita} max={todayStr()} onChange={handleChange} />
                            </div>

                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='cf'>Codice Fiscale</label>
                                <input type='text' id='cf' name='CF' maxLength={16} className='col-span-3' disabled={!isEditing} value={formData.CF} onChange={handleChange} />
                            </div>

                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='residenza'>Residenza</label>
                                <input type='text' id='residenza' name='Residenza' className='col-span-3' disabled={!isEditing} value={formData.Residenza ?? ""} onChange={handleChange} placeholder='(Opzionale)' />
                            </div>

                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='sesso'>Sesso</label>
                                {/* <input type='text' id='sesso' name='sesso' /> */}
                                <select id='sesso' name='Sesso' className='col-span-3' disabled={!isEditing} value={formData.Sesso} onChange={handleChange}>
                                    <option value={UserSex.NONE} hidden></option>
                                    <option value={UserSex.MALE}>Maschio</option>
                                    <option value={UserSex.FEMALE}>Femmina</option>
                                </select>
                            </div>

                            {!selectedAnagrafica?.IsEducatore && (<div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='ingresso'>Ingresso</label>
                                <input type='text' id='ingresso' name='Ingresso' className='col-span-3' disabled={!isEditing} value={formData.Ingresso ?? ""} onChange={handleChange} placeholder='(Opzionale)' />
                            </div>)}

                        </section>

                        <section className={`col-span-5 xl:col-span-4 ${props.isCreating ? 'bg-gray-200' : 'bg-white'} border border-gray-300 rounded-2xl rounded-tr-none shadow-md p-6`}>

                            <div className='flex items-center justify-between mb-4'>
                                <h2 className='h2'>Documenti</h2>
                                <button className='btn' disabled={isEditing || isDisabled} onClick={() => setShowUploadDoc(true)}>Carica <MdUploadFile size={16} /></button>
                            </div>

                            {!props.isCreating && (selectedAnagrafica?.Documenti?.length || 0 > 0) ? (
                                <table className='text-sm'>
                                    <thead className='text-sm'>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Data</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedAnagrafica?.Documenti.map((documento) => (
                                            <tr key={documento.Id} className='text-nowrap'>
                                                <td>{documento.Nome}</td>
                                                <td>{documento.Creation?.split('T')[0]}</td>
                                                <td className='pr-0.5'>
                                                    <Link className='btn btn-sm' to={documento.Path.replace("/documents", "/documents/view")} target='_blank'><MdSearch /></Link>
                                                </td>
                                                <td className='px-0.5'>
                                                    <Link className='btn btn-sm btn-outline' to={documento.Path.replace("/documents", "/documents/download")} target='_blank'><MdDownload /></Link>
                                                </td>
                                                <td className='pl-0.5'>
                                                    <button className='btn btn-sm btn-danger' onClick={() => handleDeleteDocConfirmClick(documento)}><MdDelete /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className='italic text-gray-600'>Nessun documento caricato</p>
                            )}

                        </section>

                    </div>

                    <div className='flex items-center justify-between mt-8'>

                        <div className='flex-1'>
                            {isEditing ? (
                                <div className="flex items-center gap-4">
                                    <button className='btn btn-lg btn-primary' disabled={isDisabled} onClick={handleSave}>Salva <MdSave size={20} /></button>
                                    <button className='btn btn-lg' disabled={isDisabled} onClick={handleAnnulla}>Annulla <MdCancel size={20} /></button>
                                </div>
                            ) : (
                                <button className='btn btn-lg' disabled={isDisabled} onClick={() => setIsEditing(true)}>Modifica <MdEdit size={20} /></button>
                            )}
                        </div>

                        <div className='flex-1 flex justify-center'>
                            {!props.isCreating && selectedAnagrafica?.IsArchiviato ? (
                                <div className="flex items-center gap-4">
                                    <button className='btn btn-lg' onClick={handleUnarchive}>Ripristina <MdOutlineRestorePage size={20} /></button>
                                </div>
                            ) : (
                                <button className='btn btn-lg' disabled={isEditing || (selectedAnagrafica?.IsEducatore && selectedAnagrafica?.Id !== idAnagrafica)} onClick={handleArchiveConfirmClick}>Archivia <MdArchive size={20} /></button>
                            )}
                        </div>

                        <div className='flex-1 flex justify-end'>
                            <button className='btn btn-lg btn-danger' disabled={isEditing || (selectedAnagrafica?.IsEducatore && selectedAnagrafica?.Id !== idAnagrafica)} onClick={handleDeleteConfirmClick}>Elimina <MdDelete size={20} /></button>
                        </div>
                    </div>

                </>
            )}

        </div>
    );
}

export default Anagrafica;
