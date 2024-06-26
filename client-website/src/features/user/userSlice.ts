import { createSlice, isAction } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isSignedIn: false,
    userInfo: null,
    recommendation: {},
    username : ""
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSignedIn: (state, action) =>{
      console.log("dispatched action setSignedIn")
      return {
        ...state, 
        isSignedIn: action.payload
      }
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
    setRecommendation: (state, action)=>{
      console.log(state)
      return {
        ...state,
        recommendation : action.payload
      }
    },
    setUsername : (state, action)=>{
      console.log(state)
      return {
        ...state,
        username : action.payload
      }
    },
    setUserInfo: (state, action)=>{
      console.log("dispatched action setUserINfo")
      return {
        ...state, 
        userInfo: action.payload
      }
    }
  },
});


export const { setUserInfo, setIsAuthenticated, setSignedIn, setRecommendation , setUsername} = userSlice.actions;

export default userSlice.reducer;
