import React from 'react';
import { MdCancel, MdCheck, MdClose } from 'react-icons/md';
import { MessageType } from '../../types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { hidePopup } from '../../redux/slices/popupSlice';
import { usePopup } from '../../context/PopupContext';

function Popup() {
    const dispatch = useAppDispatch();
    const { executeCallback } = usePopup();
    const { visible, type, message, onConfirmId } = useAppSelector((state) => state.popup);

    const getBgColorByType = () => {
        switch (type) {
            case MessageType.SUCCESS:
                return 'bg-green-600';
            case MessageType.ERROR:
                return 'bg-red-600';
            case MessageType.WARNING:
                return 'bg-yellow-500';
            case MessageType.INFO:
                return 'bg-cyan-500';
            default:
                return 'bg-gray-500';
        }
    }

    if (!visible) return null;
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-[999]'>
            <div className='max-w-96 bg-white rounded-2xl shadow-lg'>
                <div className={`w-full h-14 ${getBgColorByType()} rounded-t-2xl relative`}>
                    <button className='absolute top-4 right-4 text-white'>
                        <MdClose size={24} onClick={() => dispatch(hidePopup())} />
                    </button>
                </div>
                <div className='flex flex-col items-center gap-6 px-6 pt-4 pb-6'>
                    <p className='text-lg text-center'>{message}</p>

                    {onConfirmId && (
                        <div className='w-full flex items-center justify-between gap-4'>
                            <button className={`btn btn-${type}`}
                                onClick={() => dispatch(hidePopup())}
                            >
                                Annulla <MdCancel size={18} />
                            </button>
                            <button className={`btn btn-${type}`}
                                onClick={() => executeCallback(onConfirmId)}
                            >
                                Conferma <MdCheck size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Popup;
