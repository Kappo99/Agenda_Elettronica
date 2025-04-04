import React, { useEffect, useState } from 'react';
import { MdSave, MdSearch } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAccount, updateAccount } from '../redux/slices/accountSlice';
import IAccount, { exampleAccount } from '../types/IAccount';
import Loading from '../components/utils/Loading';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { isValidPassword } from '../utils/functions';
import { addNotification } from '../redux/slices/notificationSlice';
import { MessageType, PasswordType } from '../types';

function Profilo() {
    const dispatch = useAppDispatch();
    const { selectedAccount, loading, error } = useAppSelector((state) => state.account);

    const [formData, setFormData] = useState<IAccount>(exampleAccount);
    const [showPassword, setShowPassword] = useState<Record<PasswordType, boolean>>({
        [PasswordType.OLD]: false,
        [PasswordType.NEW]: false,
        [PasswordType.CONFIRM]: false,
    });

    useEffect(() => {
        dispatch(fetchAccount());
    }, []);

    useEffect(() => {
        if (selectedAccount && !error) {
            setFormData(selectedAccount);
        }
    }, [selectedAccount, error]);

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
        if (!formData.Password) {
            dispatch(addNotification({ message: "Inserisci la password attuale", type: MessageType.WARNING }));
            return;
        }
        if (!formData.NewPassword) {
            dispatch(addNotification({ message: "Inserisci la nuova password", type: MessageType.WARNING }));
            return;
        }
        if (!formData.NewPasswordConfirm) {
            dispatch(addNotification({ message: "Conferma la nuova password", type: MessageType.WARNING }));
            return;
        }
        if (!isValidPassword(formData.NewPassword)) {
            dispatch(addNotification({ message: "La nuova password non rispetta i requisiti minimi: almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale, per un totale di almeno 8 caratteri", type: MessageType.WARNING }));
            return;
        }
        if (formData.NewPassword !== formData.NewPasswordConfirm) {
            dispatch(addNotification({ message: "La nuova password non corrisponde con la conferma", type: MessageType.WARNING }));
            return;
        }
        dispatch(updateAccount(formData));
        dispatch(addNotification({ message: "Password aggiornata", type: MessageType.SUCCESS }));
    };

    return (
        <div className='container'>

            <div className='grid grid-cols-1 lg:grid-cols-5 gap-10'>

                <section className='col-span-1 lg:col-span-3 flex flex-col gap-4 bg-white border border-gray-300 rounded-2xl shadow-md p-6'>

                    <h2 className='h2'>Dati anagrafici</h2>

                    {loading && <Loading height='300px' />}

                    {!loading && !error && (
                        <>
                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='nome'>Nome</label>
                                <input type='text' id='nome' name='Anagrafica.Nome' className='col-span-3' disabled title='Modifica questo campo dalla pagina anagrafica' value={formData.Anagrafica.Nome} />
                            </div>

                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='cognome'>Cognome</label>
                                <input type='text' id='cognome' name='Anagrafica.Cognome' className='col-span-3' disabled title='Modifica questo campo dalla pagina anagrafica' value={formData.Anagrafica.Cognome} />
                            </div>

                            <div className='form-element !grid !grid-cols-4 gap-4'>
                                <label htmlFor='email'>Email</label>
                                <input type='email' id='email' name='Email' className='col-span-3' disabled title='Campo non modificabile' value={formData.Email} />
                            </div>
                        </>
                    )}

                    {selectedAccount && (
                        <div className='flex items-center justify-center mt-4'>

                            <Link to={`/anagrafica/${selectedAccount.Id_Anagrafica}`} className='btn btn-lg'>
                                Mostra <MdSearch size={20} />
                            </Link>

                        </div>
                    )}

                </section>

                <section className='col-span-1 lg:col-span-2 flex flex-col gap-4 bg-white border border-gray-300 rounded-2xl shadow-md p-6'>

                    <h2 className='h2'>Modifica password</h2>

                    <div className='form-element !grid !grid-cols-2 gap-4 relative'>
                        <label htmlFor='password_attuale'>Password attuale</label>
                        <input type={showPassword.old ? 'text' : 'password'} id='password_attuale' name='Password' value={formData.Password ?? ''} onChange={handleChangePassword} autoComplete='new-password' />
                        <span className='absolute right-3 cursor-pointer' onClick={() => handleShowPassword(PasswordType.OLD)}>
                            {showPassword.old ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <div className='form-element !grid !grid-cols-2 gap-4 relative'>
                        <label htmlFor='nuova_password'>Nuova Password</label>
                        <input type={showPassword.new ? 'text' : 'password'} id='nuova_password' name='NewPassword' value={formData.NewPassword ?? ''} onChange={handleChangePassword} />
                        <span className='absolute right-3 cursor-pointer' onClick={() => handleShowPassword(PasswordType.NEW)}>
                            {showPassword.new ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <div className='form-element !grid !grid-cols-2 gap-4 relative'>
                        <label htmlFor='conferma_password'>Conferma Password</label>
                        <input type={showPassword.confirm ? 'text' : 'password'} id='conferma_password' name='NewPasswordConfirm' value={formData.NewPasswordConfirm ?? ''} onChange={handleChangePassword} />
                        <span className='absolute right-3 cursor-pointer' onClick={() => handleShowPassword(PasswordType.CONFIRM)}>
                            {showPassword.confirm ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <div className='flex items-center justify-center mt-4'>

                        <button className='btn btn-lg' disabled={!formData.Password || !formData.NewPassword || !formData.NewPasswordConfirm} onClick={handleSave}>Salva <MdSave size={20} /></button>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Profilo;
