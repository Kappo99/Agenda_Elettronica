import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import INotification from '../../types/INotification';

interface IState {
    notifications: INotification[];
}

const initialState: IState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<INotification, 'id'>>) => {
            const { tag } = action.payload;

            // Rimuovi notifiche precedenti con lo stesso tag, se esiste
            if (tag) {
                state.notifications = state.notifications.filter(
                    (notification) => notification.tag !== tag
                );
            }

            // Aggiungi la nuova notifica
            const id = Date.now().toString();
            state.notifications.push({ id, ...action.payload });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            // Rimuovi la notifica
            state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        },
    },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
