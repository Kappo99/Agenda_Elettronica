import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login } from '../redux/slices/authSlice';
import casa_gialla from '../images/casa_gialla.png';
import { isValidEmail } from '../utils/functions';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import FormForgotPasswordPopup from '../components/popup/FormForgotPasswordPopup';
import Loading from '../components/utils/Loading';
import { addNotification } from '../redux/slices/notificationSlice';
import { MessageType } from '../types';

function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({ Email: '', Password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showFormForgotPassword, setShowFormForgotPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogin = () => {
        const { Email, Password } = formData;
        if (!Email || !Password) {
            dispatch(addNotification({ message: 'Compilare tutti i campi', type: MessageType.ERROR }));
            return;
        }
        if (!isValidEmail(Email)) {
            dispatch(addNotification({ message: 'Email non valida', type: MessageType.ERROR }));
            return;
        }

        dispatch(login(formData))
            .then((result) => login.fulfilled.match(result) && navigate('/'));
    };

    return (
        <>
            <FormForgotPasswordPopup
                message='Inserisci la mail associata al tuo account'
                email={formData.Email}
                show={showFormForgotPassword}
                onClose={() => setShowFormForgotPassword(false)}
            />

            <div className='fixed top-0 left-0 w-screen h-svh bg-casa_gialla_yellow flex items-center justify-center'>

                <div className='container w-full max-w-5xl p-10 lg:p-32 mx-6 bg-white rounded-2xl flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-32'>

                    <div className='flex-1'>
                        <img className='w-full h-full' src={casa_gialla} alt='Casa Gialla' />
                    </div>

                    <div className='flex-1'>

                        <h1 className='h2 text-center mb-2'>Casa Gialla</h1>
                        <h3 className='h3 text-center mb-4 lg:mb-10'>Agenda Elettronica</h3>

                        {loading && <Loading height='300px' />}

                        {!loading && (
                            <form action='' className='flex flex-col gap-4'>
                                <div className='form-element'>
                                    <input className='!text-base' type='email' name='Email' placeholder='Email' onChange={handleChange} />
                                </div>
                                <div className='form-element relative'>
                                    <input className='!text-base' type={showPassword ? 'text' : 'password'} name='Password' placeholder='Password' onChange={handleChange} />
                                    <span className='absolute right-3 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <div className='form-element'>
                                    <button className='!text-base' disabled={loading} onClick={handleLogin}>Login</button>
                                </div>
                            </form>
                        )}

                        <p className='mt-6 text-center'>
                            Password dimenticata? <span className='hover:text-casa_gialla_yellow-dark cursor-pointer' onClick={() => setShowFormForgotPassword(true)}>Clicca qui</span>
                        </p>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Login;
