import { useState } from 'react';
import { MdCancel, MdCheck, MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { todayStr } from '../../utils/functions';
import { downloadZipStorico } from '../../redux/slices/agendaSlice';
import { useAppDispatch } from '../../redux/hooks';
import { addNotification } from '../../redux/slices/notificationSlice';
import { MessageType } from '../../types';

interface IProps {
    message: string;
    onClose: () => void;
}

function FormUploadFilePopup(props: IProps) {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({ Inizio: '', Fine: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleConfirm = async () => {
        const { Inizio, Fine } = formData;
        if (!Inizio || !Fine) {
            dispatch(addNotification({ message: 'Compilare tutti i campi', type: MessageType.ERROR }));
            return;
        }

        if (id) {
            try {
                const blob = await downloadZipStorico({ id: Number(id), from: Inizio, to: Fine });
                const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/zip' }));
                const a = document.createElement('a');
                a.href = url;
                a.download = `giornate_${Inizio}_${Fine}.zip`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                props.onClose();
            } catch (error) {
                console.error('Errore durante il download del file ZIP:', error);
                dispatch(addNotification({ message: `Errore durante il download del file ZIP: ${error}` ,type: MessageType.ERROR }));
            }
        }
    }

    return (
        <>
            <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-[900]'>
                <div className='bg-white rounded-2xl shadow-lg'>
                    <div className={`w-full h-14 bg-gray-300 rounded-t-2xl relative`}>
                        <button className='absolute top-4 right-4 text-black'>
                            <MdClose size={24} onClick={props.onClose} />
                        </button>
                    </div>
                    <div className='flex flex-col gap-4 px-6 pt-4 pb-6'>
                        <p className='text-lg'>{props.message}</p>

                        <form action=''>
                            <div className='flex flex-col gap-3'>
                                <div className='form-element !grid !grid-cols-4 gap-4'>
                                    <label htmlFor='inizio'>Inizio</label>
                                    <input type='date' id='inizio' name='Inizio' className='col-span-3' onChange={handleChange} max={todayStr()} />
                                </div>

                                <div className='form-element !grid !grid-cols-4 gap-4'>
                                    <label htmlFor='fine'>Fine</label>
                                    <input type='date' id='fine' name='Fine' className='col-span-3' onChange={handleChange} max={todayStr()} />
                                </div>
                            </div>
                        </form>

                        <div className='w-full flex items-center justify-between gap-10 mt-3'>
                            <button
                                onClick={props.onClose}
                                className='btn'
                            >
                                Annulla <MdCancel size={18} />
                            </button>
                            <button
                                onClick={handleConfirm}
                                className='btn btn-primary'
                            >
                                Conferma <MdCheck size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FormUploadFilePopup;