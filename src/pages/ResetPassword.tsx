import React, { useEffect, useState } from 'react';
import { MdSave } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import IAccount, { exampleAccount } from '../types/IAccount';
import Loading from '../components/utils/Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { isValidPassword } from '../utils/functions';
import { resetPassword } from '../redux/slices/authSlice';
import { addNotification } from '../redux/slices/notificationSlice';
import { MessageType, PasswordType } from '../types';

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token') ?? '';
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.account);

    const [formData, setFormData] = useState<IAccount>(exampleAccount);
    const [showPassword, setShowPassword] = useState<Record<PasswordType, boolean>>({
        [PasswordType.OLD]: false,
        [PasswordType.NEW]: false,
        [PasswordType.CONFIRM]: false,
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    useEffect(() => {
        if (error) {
            dispatch(addNotification({ message: error, type: MessageType.ERROR }));
        }
    }, [error]);

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        setFormData({
            ...formData,
            [name]: formattedValue,
        });
    };

    const handleShowPassword = (field: PasswordType) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSave = () => {
        if (!formData.NewPassword) {
            dispatch(addNotification({ message: 'Inserisci la nuova password', type: MessageType.WARNING }));
            return;
        }
        if (!formData.NewPasswordConfirm) {
            dispatch(addNotification({ message: 'Conferma la nuova password', type: MessageType.WARNING }));
            return;
        }
        if (!isValidPassword(formData.NewPassword)) {
            dispatch(addNotification({ message: 'La nuova password non rispetta i requisiti minimi: almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale, per un totale di almeno 8 caratteri', type: MessageType.WARNING }));
            return;
        }
        if (formData.NewPassword !== formData.NewPasswordConfirm) {
            dispatch(addNotification({ message: 'La nuova password non corrisponde con la conferma', type: MessageType.WARNING }));
            return;
        }
        dispatch(resetPassword({ token, Password: formData.NewPassword }));
        navigate('/login');
    };

    return (
        <div className='container'>

            <div className='grid grid-cols-5 gap-10'>

                <section className='col-span-1 hidden lg:block'></section>

                <section className='col-span-3 flex flex-col gap-4 bg-white border border-gray-300 rounded-2xl shadow-md p-6'>

                    <h2 className='h2 mb-4'>Reset password</h2>

                    {loading && <Loading height='300px' />}

                    {!loading && !error && (
                        <>
                            <div className='form-element !grid !grid-cols-3 gap-4 relative'>
                                <label htmlFor='nuova_password'>Nuova Password</label>
                                <input type={showPassword.new ? 'text' : 'password'} id='nuova_password' name='NewPassword' className='col-span-2' value={formData.NewPassword ?? ''} onChange={handleChangePassword} />
                                <span className='absolute right-3 cursor-pointer' onClick={() => handleShowPassword(PasswordType.NEW)}>
                                    {showPassword.new ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>

                            <div className='form-element !grid !grid-cols-3 gap-4 relative'>
                                <label htmlFor='conferma_password'>Conferma Password</label>
                                <input type={showPassword.confirm ? 'text' : 'password'} id='conferma_password' name='NewPasswordConfirm' className='col-span-2' value={formData.NewPasswordConfirm ?? ''} onChange={handleChangePassword} />
                                <span className='absolute right-3 cursor-pointer' onClick={() => handleShowPassword(PasswordType.CONFIRM)}>
                                    {showPassword.confirm ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>

                            <div className='flex items-center justify-center mt-4'>

                                <button className='btn btn-lg' disabled={!formData.NewPassword || !formData.NewPasswordConfirm} onClick={handleSave}>Salva <MdSave size={20} /></button>

                            </div>
                        </>
                    )}

                </section>

                <section className='col-span-1 hidden lg:block'></section>

            </div>

        </div>
    );
}

export default ResetPassword;
