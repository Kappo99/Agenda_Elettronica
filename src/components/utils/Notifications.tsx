import React, { useEffect, useRef } from 'react';
import INotification from '../../types/INotification';
import { MessageType } from '../../types';
import { MdCheckCircle, MdError, MdInfo, MdWarning } from 'react-icons/md';

interface IProps {
    notifications: INotification[];
    removeNotification: (id: string) => void;
}

function Notifications({ notifications, removeNotification }: IProps) {
    const processedNotifications = useRef(new Set<string>()); // Registro delle notifiche processate

    const icons = {
        [MessageType.SUCCESS]: <MdCheckCircle size={24} className='text-green-600' />,
        [MessageType.ERROR]: <MdError size={24} className='text-red-600' />,
        [MessageType.WARNING]: <MdWarning size={24} className='text-yellow-500' />,
        [MessageType.INFO]: <MdInfo size={24} className='text-cyan-500' />,
    };

    useEffect(() => {
        notifications.forEach(({ id, duration }) => {
            if (!processedNotifications.current.has(id)) {
                // Aggiungi la notifica al registro
                processedNotifications.current.add(id);

                // Imposta il timer
                setTimeout(() => {
                    removeNotification(id);
                    processedNotifications.current.delete(id); // Rimuovi dal registro
                }, duration ?? 4000);
            }
        });
    }, [notifications, removeNotification]);

    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[500]">
            {notifications.map(({ id, message, type }) => (
                <div
                    key={id}
                    className={`p-4 rounded-lg shadow-lg flex items-center gap-2 bg-white border bold`}
                >
                    {icons[type]}
                    {message}
                </div>
            ))}
        </div>
    );
}

export default Notifications;
