import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setOpen: (state, action) =>{
      console.log("dispatched action setOpen")
      return {
        ...state, 
        open: action.payload
      }
    },
  },
});


export const { setOpen } = modalSlice.actions;

export default modalSlice.reducer;
