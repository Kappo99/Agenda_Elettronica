import { useEffect, useState } from "react";
import { MdCancel, MdCheck, MdClose } from "react-icons/md";
import { forgotPassword } from "../../redux/slices/authSlice";
import { useAppDispatch } from "../../redux/hooks";
import { addNotification } from "../../redux/slices/notificationSlice";
import { MessageType } from "../../types";

interface IProps {
    message: string;
    email?: string;
    show: boolean;
    onClose: () => void;
}

function FormForgotPasswordPopup(props: IProps) {
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState(props.email ?? '');

    useEffect(() => {
        setEmail(props.email ?? '');
    }, [props.email]);

    const handleConfirm = () => {
        if (!email) {
            dispatch(addNotification({ message: 'Compilare tutti i campi', type: MessageType.ERROR }));
            return;
        }

        dispatch(forgotPassword(email));
        dispatch(addNotification({ message: 'Email di reset password inviata, controlla la casella di posta', type: MessageType.SUCCESS }));
        props.onClose();
    }

    return (
        <>
            <div className={`fixed inset-0 flex items-center justify-center bg-black/50 z-[999] ${!props.show && 'hidden'}`}>
                <div className='max-w-96 mx-10 lg:mx-0 bg-white rounded-2xl shadow-lg'>
                    <div className={`w-full h-14 bg-gray-300 rounded-t-2xl relative`}>
                        <button className='absolute top-4 right-4 text-black'>
                            <MdClose size={24} onClick={props.onClose} />
                        </button>
                    </div>
                    <div className='flex flex-col gap-4 px-6 pt-4 pb-6'>
                        <p className='text-lg'>{props.message}</p>

                        <div className="flex flex-col gap-3">
                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='email'>Email</label>
                                <input type='email' id='email' name='Email' className='col-span-3' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-between gap-10 mt-3">
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

export default FormForgotPasswordPopup;