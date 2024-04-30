import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    alertConfig:{
      message: "",
      duration: 3000,
      severity: 'info'
    }
};

export const showAlert = createAsyncThunk(
    'notification/showAlert',
    async ({ severity, message, duration = 6000 }:any, { dispatch }) => {
      dispatch(setAlertConfig({ severity, message, duration }));
      dispatch(setOpen(true));
    }
);

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setOpen: (state, action) =>{
      console.log("dispatched action setOpen for notifications")
      return {
        ...state, 
        open: action.payload
      }
    },
    setAlertConfig: (state, action)=>{
        console.log("dispatched action setAlertConfig for notifications")
        return {
            ...state, 
            alertConfig: {
              ...action.payload
            }
        }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(showAlert.fulfilled, (state, action) => {
        console.log("showAlert action has been fulfilled");
        // Additional state updates can be made here if needed
      })
  }
});


export const { setOpen, setAlertConfig } = notificationSlice.actions;

export default notificationSlice.reducer;
