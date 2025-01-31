import { useState } from 'react';
import { MdCancel, MdCheck, MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { uploadDocumento } from '../../redux/slices/documentoSlice';
import { useAppDispatch } from '../../redux/hooks';
import { addNotification } from '../../redux/slices/notificationSlice';
import { MessageType } from '../../types';

interface IProps {
    message: string;
    show: boolean;
    onClose: () => void;
}

function FormUploadFilePopup(props: IProps) {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleConfirm = () => {
        if (!name || !file) {
            dispatch(addNotification({ message: 'Compilare tutti i campi', type: MessageType.ERROR }));
            return;
        }

        if (id) {
            dispatch(uploadDocumento({ idAnagrafica: Number(id), name }));
            dispatch(addNotification({ message: 'Documento caricato', type: MessageType.SUCCESS }));
            setName('');
            setFile(null);
            props.onClose();
        }
    }

    return (
        <>
            <div className={`fixed inset-0 flex items-center justify-center bg-black/50 z-[900] ${!props.show && 'hidden'}`}>
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
                                    <label htmlFor='nome'>Nome</label>
                                    <input type='text' id='nome' name='Nome' className='col-span-3' value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div className='form-element !grid !grid-cols-4 gap-4'>
                                    <label htmlFor='file'>Documento</label>
                                    <input type='file' id='file' name='file' className='col-span-3' onChange={handleFileChange} />
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