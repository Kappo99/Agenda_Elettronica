import React, { useEffect, useState } from 'react';
import { MdAdd, MdArchive, MdCancel, MdDelete, MdDownload, MdEdit, MdOutlineRestorePage, MdSave, MdSearch, MdUploadFile } from 'react-icons/md';
import AgendaNavbar from '../components/AgendaNavbar';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchFamigliaById, createFamiglia, updateFamiglia, deleteFamiglia, archiveFamiglia, unarchiveFamiglia } from '../redux/slices/famigliaSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/utils/Loading';
import IFamiglia, { exampleFamiglia } from '../types/IFamiglia';
import { isValidCF, todayStr } from '../utils/functions';
import { deleteDocumento } from '../redux/slices/documentoSlice';
import FormUploadFilePopup from '../components/popup/FormUploadFilePopup';
import IDocumento from '../types/IDocumento';
import { addNotification } from '../redux/slices/notificationSlice';
import { MessageType, Role, UserSex } from '../types';
import { hidePopup, showPopup } from '../redux/slices/popupSlice';
import { usePopup } from '../context/PopupContext';
import IAnagrafica, { exampleAnagrafica } from '../types/IAnagrafica';

interface IProps {
    isCreating?: boolean;
}

function Famiglia(props: IProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { selectedFamiglia, loadingFamiglia, errorFamiglia } = useAppSelector((state) => state.famiglia);
    const { loading: loadingDoc, error: errorDoc } = useAppSelector((state) => state.documento);
    const { idFamiglia } = useAppSelector((state) => state.auth);
    const { registerCallback } = usePopup();

    const [isEditing, setIsEditing] = useState(props.isCreating);
    const [isDisabled, setIsDisabled] = useState(false);
    const [showUploadDocIdAnagrafica, setShowUploadDocIdAnagrafica] = useState<number | null>(null);
    const [formData, setFormData] = useState<IFamiglia>(exampleFamiglia);

    useEffect(() => {
        if (id) {
            dispatch(fetchFamigliaById(Number(id)));
        }
    }, [id, dispatch, idFamiglia]);

    useEffect(() => {
        if (selectedFamiglia && !errorFamiglia && !props.isCreating) {
            setFormData(selectedFamiglia);
        }
    }, [selectedFamiglia, errorFamiglia, props.isCreating]);

    useEffect(() => {
        setIsDisabled(
            (!props.isCreating && (selectedFamiglia?.IsArchiviato ?? false)) ||
            ((/* selectedFamiglia?.IsEducatore ?? */ false) && (selectedFamiglia?.Id ?? -1) !== idFamiglia)
        );
    }, [props, selectedFamiglia, idFamiglia]);

    useEffect(() => {
        if (errorFamiglia) {
            dispatch(addNotification({ message: errorFamiglia, type: MessageType.ERROR }));
        }
    }, [errorFamiglia]);

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

    const addAnagrafica = () => {
        setFormData((prevData) => ({
            ...prevData,
            Anagrafiche: [
                ...(prevData.Anagrafiche || []),
                exampleAnagrafica
            ]
        }));
        dispatch(addNotification({ message: 'Nuovo membro aggiunto', type: MessageType.INFO }));
    };

    const removeAnagrafica = (index: number) => {
        setFormData((prevData) => ({
            ...prevData,
            Anagrafiche: prevData.Anagrafiche?.filter((_, i) => i !== index) || []
        }));
        dispatch(addNotification({ message: 'Membro rimosso', type: MessageType.INFO }));
        dispatch(hidePopup());
    };

    const handleAnagraficaChange = (index: number, field: keyof IAnagrafica, value: string) => {
        setFormData((prevData) => {
            const updatedAnagrafiche = [...(prevData.Anagrafiche || [])];
            let formattedValue = value;

            if (field === 'Nome' || field === 'Cognome') {
                formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
            }
            if (field === 'CF') {
                formattedValue = value.toUpperCase();
            }

            updatedAnagrafiche[index] = { ...updatedAnagrafiche[index], [field]: formattedValue };
            return { ...prevData, Anagrafiche: updatedAnagrafiche };
        });
    };

    const handleDeleteAnagraficaConfirmClick = (anagrafica: IAnagrafica, index: number) => {
        const callbackId = 'confirmDeleteAnagrafica';
        registerCallback(callbackId, () => removeAnagrafica(index));

        dispatch(
            showPopup({
                type: MessageType.ERROR,
                message: `Sei sicuro di voler eliminare l'anagrafica di ${anagrafica.Nome} ${anagrafica.Cognome}? Verranno eliminati tutti i suoi documenti. I dati non saranno recuperabili`,
                onConfirmId: callbackId,
            })
        );
    };

    const handleSave = () => {
        if (!formData.Cognome || formData.Anagrafiche.some(anagrafica => !anagrafica.Nome || !anagrafica.Cognome || !anagrafica.DataNascita || !anagrafica.CF /* || !anagrafica.Residenza */ || anagrafica.Sesso === UserSex.NONE)) {
            dispatch(addNotification({ message: 'Compilare tutti i campi', type: MessageType.WARNING, tag: 'saveFamiglia' }));
            return;
        }
        if (formData.Anagrafiche.some(anagrafica => !isValidCF(anagrafica.CF))) {
            dispatch(addNotification({ message: 'Codice Fiscale non valido', type: MessageType.WARNING, tag: 'saveFamiglia' }));
            return;
        }
        if (props.isCreating) {
            dispatch(createFamiglia(formData));
            setIsEditing(false);
            // TODO: navigate to the new famiglia page (verificare che salva correttamente la famiglia)
            // navigate(`/famiglia/${result.payload.Id}`);
        } else if (id) {
            dispatch(updateFamiglia({ id: Number(id), newFamiglia: formData }));
            setIsEditing(false);
        }
        dispatch(addNotification({ message: 'Famiglia salvata', type: MessageType.SUCCESS }));
    };

    const handleDeleteConfirmClick = () => {
        const callbackId = 'confirmDelete';
        registerCallback(callbackId, handleDelete);

        dispatch(
            showPopup({
                type: MessageType.ERROR,
                message: `Sei sicuro di voler eliminare la famiglia ${selectedFamiglia?.Cognome}? Verrà eliminato tutto lo storico delle giornate. I dati non saranno recuperabili`,
                onConfirmId: callbackId,
            })
        );
    };

    const handleDelete = () => {
        if (id) {
            dispatch(deleteFamiglia(Number(id)));
            dispatch(addNotification({ message: 'Famiglia eliminata', type: MessageType.SUCCESS }));
            dispatch(hidePopup());
            navigate('/');
        }
    };

    const handleDeleteDocConfirmClick = (idAnagrafica: number, documento: IDocumento) => {
        const callbackId = 'confirmDeleteDoc';
        registerCallback(callbackId, () => handleDeleteDoc(idAnagrafica, documento));

        dispatch(
            showPopup({
                type: MessageType.ERROR,
                message: "Sei sicuro di voler eliminare il documento? L'operazione è irreversibile",
                onConfirmId: callbackId,
            })
        );
    }

    const handleDeleteDoc = (idAnagrafica: number, documento: IDocumento) => {
        if (id && documento) {
            dispatch(deleteDocumento({ idAnagrafica, documento }));
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
                message: "Sei sicuro di voler archiviare la famiglia? Verrà impostata in uno stato di sola lettura",
                onConfirmId: callbackId,
            })
        );
    };

    const handleArchive = () => {
        if (id) {
            dispatch(archiveFamiglia(Number(id)));
            dispatch(addNotification({ message: 'Famiglia archiviata', type: MessageType.SUCCESS }));
            dispatch(hidePopup());
            navigate('/');
        }
    };

    const handleUnarchive = () => {
        if (id) {
            dispatch(unarchiveFamiglia(Number(id)));
            dispatch(addNotification({ message: 'Famiglia ripristinata', type: MessageType.SUCCESS }));
            dispatch(hidePopup());
            // dispatch(fetchFamigliaById(Number(id)));
        }
    };

    const handleAnnulla = () => {
        if (props.isCreating) {
            navigate('/');
        } else {
            setIsEditing(false);
            setFormData(selectedFamiglia || formData);
        }
    };

    return (
        <div className='container'>
            {(loadingFamiglia || loadingDoc) && <Loading />}

            <FormUploadFilePopup
                message='Carica un documento'
                show={showUploadDocIdAnagrafica !== null}
                onClose={() => setShowUploadDocIdAnagrafica(null)}
                idAnagrafica={showUploadDocIdAnagrafica}
            />

            {(!loadingFamiglia && !loadingDoc) && (selectedFamiglia || props.isCreating) && (
                <>
                    <AgendaNavbar isFamiglia={true} isCreating={props.isCreating} />

                    <div className='grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-10 mb-10 lg:mb-0'>

                        <section className='col-span-1 lg:col-span-6 2xl:col-span-7 flex flex-col gap-4 bg-white border border-gray-300 rounded-2xl rounded-tl-none shadow-md p-6'>

                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='cognome_famiglia'>Cognome</label>
                                <input type='text' id='cognome_famiglia' name='Cognome' className='col-span-3' disabled={!isEditing} value={formData.Cognome} onChange={handleChange} />
                            </div>

                        </section>

                        <section className={`col-span-1 lg:col-span-5 2xl:col-span-4`}>

                            <div className='flex flex-col lg:flex-row justify-end gap-4'>
                                {isEditing ? (
                                    <button className='btn btn-lg' disabled={isDisabled} onClick={handleSave}>
                                        Salva <MdSave size={18} />
                                    </button>
                                ) : (
                                    <button className='btn btn-lg' disabled={isDisabled} onClick={() => setIsEditing(true)}>
                                        Modifica <MdEdit size={18} />
                                    </button>
                                )}

                                <button className='btn btn-lg' disabled={!isEditing} onClick={addAnagrafica}>
                                    Nuovo membro <MdAdd size={18} />
                                </button>
                            </div>

                        </section>

                    </div>

                    {!errorFamiglia && !errorDoc && formData.Anagrafiche.map((anagrafica, index) => (
                        <div key={index} className='grid grid-cols-1 lg:grid-cols-11 gap-0 lg:gap-10 mb-10 lg:mb-0'>

                            <section className='col-span-1 lg:col-span-6 2xl:col-span-7 flex flex-col gap-4 bg-white border border-gray-300 rounded-2xl -mt-2 shadow-md p-6 pb-8'>

                                {<div className='form-element !grid !grid-cols-4 gap-4'>
                                    <label htmlFor={`nome_${index}`}>Nome</label>
                                    <input type='text'
                                        id={`nome_${index}`}
                                        className='col-span-3'
                                        disabled={!isEditing}
                                        value={anagrafica.Nome}
                                        onChange={(e) => handleAnagraficaChange(index, 'Nome', e.target.value)}
                                    />
                                </div>}

                                <div className='form-element !grid !grid-cols-4 gap-4'>
                                    <label htmlFor={`cognome_${index}`}>Cognome</label>
                                    <input type='text'
                                        id={`cognome_${index}`}
                                        className='col-span-3'
                                        disabled={!isEditing}
                                        value={anagrafica.Cognome}
                                        onChange={(e) => handleAnagraficaChange(index, 'Cognome', e.target.value)}
                                    />
                                </div>

                                <div className='form-element !grid !grid-cols-4 gap-4'>
                                    <label htmlFor={`data_nascita_${index}`}>Data di nascita</label>
                                    <input type='date'
                                        id={`data_nascita_${index}`}
                                        className='col-span-3'
                                        disabled={!isEditing}
                                        value={anagrafica.DataNascita}
                                        max={todayStr()}
                                        onChange={(e) => handleAnagraficaChange(index, 'DataNascita', e.target.value)}
                                    />
                                </div>

                                <div className='form-element !grid !grid-cols-4 gap-4'>
                                    <label htmlFor={`cf_${index}`}>Codice Fiscale</label>
                                    <input type='text'
                                        id={`cf_${index}`}
                                        maxLength={16}
                                        className='col-span-3'
                                        disabled={!isEditing}
                                        value={anagrafica.CF}
                                        onChange={(e) => handleAnagraficaChange(index, 'CF', e.target.value)}
                                    />
                                </div>

                                <div className='form-element !grid !grid-cols-4 gap-4'>
                                    <label htmlFor={`residenza_${index}`}>Residenza</label>
                                    <input type='text'
                                        id={`residenza_${index}`}
                                        className='col-span-3'
                                        disabled={!isEditing}
                                        value={anagrafica.Residenza ?? ""}
                                        onChange={(e) => handleAnagraficaChange(index, 'Residenza', e.target.value)}
                                        placeholder='(Opzionale)'
                                    />
                                </div>

                                <div className='form-element !grid !grid-cols-4 gap-4'>
                                    <label htmlFor={`sesso_${index}`}>Sesso</label>
                                    <select id={`sesso_${index}`} className='col-span-3' disabled={!isEditing} value={anagrafica.Sesso} onChange={(e) => handleAnagraficaChange(index, 'Sesso', e.target.value)}                                     >
                                        <option value={UserSex.NONE} hidden></option>
                                        <option value={UserSex.MALE}>Maschio</option>
                                        <option value={UserSex.FEMALE}>Femmina</option>
                                    </select>
                                </div>

                                {!anagrafica?.IsEducatore && (
                                    <>
                                        <div className='form-element !grid !grid-cols-4 gap-4'>
                                            <label htmlFor={`ingresso_${index}`}>Ingresso</label>
                                            <input type='text'
                                                id={`ingresso_${index}`}
                                                className='col-span-3'
                                                disabled={!isEditing}
                                                value={anagrafica.Ingresso || ''}
                                                onChange={(e) => handleAnagraficaChange(index, 'Ingresso', e.target.value)}
                                                placeholder='(Opzionale)'
                                            />
                                        </div>
                                        <div className='form-element !grid !grid-cols-4 gap-4'>
                                            <label htmlFor={`ruolo_${index}`}>Ruolo</label>
                                            <select id={`ruolo_${index}`} className='col-span-3' disabled={!isEditing} value={anagrafica.Ruolo} onChange={(e) => handleAnagraficaChange(index, 'Ruolo', e.target.value)}                                     >
                                                {/* <option value={Role.NONE} hidden></option> */}
                                                <option value={Role.GENITORE}>{Role.GENITORE}</option>
                                                <option value={Role.FIGLIO}>{Role.FIGLIO}</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div className='w-full flex justify-end'>
                                    <button className='btn btn-danger' disabled={!isEditing} onClick={() => handleDeleteAnagraficaConfirmClick(anagrafica, index)}>Rimuovi <MdDelete size={18} /></button>
                                </div>

                            </section>

                            <section className={`col-span-1 lg:col-span-5 2xl:col-span-4 ${props.isCreating ? 'bg-gray-200' : 'bg-white'} border border-gray-300 rounded-2xl -mt-2 shadow-md p-6 pb-8`}>

                                <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-y-3 mb-4'>
                                    <h2 className='h2'>Documenti</h2>
                                    <button className='btn' disabled={isEditing || isDisabled} onClick={() => setShowUploadDocIdAnagrafica(anagrafica.Id)}>Carica <MdUploadFile size={16} /></button>
                                </div>

                                {!props.isCreating && (anagrafica.Documenti?.length || 0 > 0) ? (
                                    <table className='text-sm !border-none rows-border'>
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
                                            {anagrafica.Documenti.map((documento) => (
                                                <tr key={documento.Id} className='text-nowrap'>
                                                    <td className='text-wrap'>{documento.Nome}</td>
                                                    <td>{documento.Creation?.split('T')[0]}</td>
                                                    <td className='pr-0.5'>
                                                        <Link className='btn btn-sm' to={documento.Path.replace("/documents", "/documents/view")} target='_blank'><MdSearch /></Link>
                                                    </td>
                                                    <td className='px-0.5'>
                                                        <Link className='btn btn-sm btn-outline' to={documento.Path.replace("/documents", "/documents/download")} target='_blank'><MdDownload /></Link>
                                                    </td>
                                                    <td className='pl-0.5'>
                                                        <button className='btn btn-sm btn-danger' onClick={() => handleDeleteDocConfirmClick(anagrafica.Id, documento)}><MdDelete /></button>
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
                    ))}

                    <div className='flex flex-col lg:flex-row items-center justify-between gap-y-4 mt-8'>

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

                        <div className='flex-1 flex lg:justify-center'>
                            {isEditing ? (
                                <button className='btn btn-lg' disabled={!isEditing} onClick={addAnagrafica}>
                                    Nuovo membro <MdAdd size={18} />
                                </button>
                            ) : (
                                !props.isCreating && selectedFamiglia?.IsArchiviato ? (
                                    <div className="flex items-center gap-4">
                                        <button className='btn btn-lg' onClick={handleUnarchive}>Ripristina <MdOutlineRestorePage size={20} /></button>
                                    </div>
                                ) : (
                                    <button className='btn btn-lg' disabled={isEditing} onClick={handleArchiveConfirmClick}>Archivia <MdArchive size={20} /></button>
                                )
                            )}

                        </div>

                        <div className='flex-1 flex lg:justify-end'>
                            <button className='btn btn-lg btn-danger' disabled={isEditing} onClick={handleDeleteConfirmClick}>Elimina <MdDelete size={20} /></button>
                        </div>
                    </div>

                </>
            )}

        </div>
    );
}

export default Famiglia;
