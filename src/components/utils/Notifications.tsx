import React, { useEffect, useRef } from 'react';
import INotification from '../../types/INotification';
import { MessageType } from '../../types';

interface IProps {
    notifications: INotification[];
    removeNotification: (id: string) => void;
}

function Notifications({ notifications, removeNotification }: IProps) {
    const processedNotifications = useRef(new Set<string>()); // Registro delle notifiche processate

    const typeStyles = {
        [MessageType.SUCCESS]: 'bg-green-600 text-white',
        [MessageType.ERROR]: 'bg-red-600 text-white',
        [MessageType.WARNING]: 'bg-yellow-500 text-black',
        [MessageType.INFO]: 'bg-cyan-500 text-white',
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
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[500]">
            {notifications.map(({ id, message, type }) => (
                <div
                    key={id}
                    className={`p-4 rounded-lg shadow-lg ${typeStyles[type]}`}
                >
                    {message}
                </div>
            ))}
        </div>
    );
}

export default Notifications;
