import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
};

export const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsLoading: (state, action) =>{
      console.log("dispatched action setIsLoading")
      return {
        ...state, 
        isLoading: action.payload
      }
    },
  },
});


export const { setIsLoading } = common.actions;

export default common.reducer;
