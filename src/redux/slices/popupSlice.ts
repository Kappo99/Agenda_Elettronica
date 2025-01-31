import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageType } from '../../types';

interface IState {
    visible: boolean;
    type: MessageType;
    message: string;
    onConfirmId?: string;
}

const initialState: IState = {
    visible: false,
    type: MessageType.INFO,
    message: '',
    onConfirmId: undefined,
};

const popupSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        showPopup: (
            state,
            action: PayloadAction<{
                type: MessageType;
                message: string;
                onConfirmId?: string;
            }>
        ) => {
            state.visible = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
            state.onConfirmId = action.payload.onConfirmId;
        },
        hidePopup: (state) => {
            state.visible = false;
            state.type = MessageType.INFO;
            state.message = '';
            state.onConfirmId = undefined;
        },
    },
});

export const { showPopup, hidePopup } = popupSlice.actions;
export default popupSlice.reducer;
