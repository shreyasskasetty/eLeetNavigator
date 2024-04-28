import { useSelector } from "react-redux";
import api from "../api/api";
import { useDispatch } from "react-redux";
import { setSignedIn } from "../features/user/userSlice";
import { setOpen } from "../features/ui/modalSlice";
import { setIsLoading } from "../features/ui/commonSlice";

function Navbar() {
  const isSignedIn = useSelector((state: any) => state.user.isSignedIn);
  const dispatch = useDispatch();

  const handleSignIn = () => {
    console.log(isSignedIn)
    if(isSignedIn){
      api.logout().then((res)=>{
        console.log(res)
        if(res.status === 200){
          dispatch(setIsLoading(true));
          dispatch(setSignedIn(false));
        }
        dispatch(setIsLoading(false));
        window.location.href = "/"
      }).catch((error: any)=>{
          console.log(error)
      })
    }else{
      dispatch(setOpen(true));
    }
  }
    
  return (
    <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
      <div className="logo">
        <img src="src/assets/logo2.png" alt="Logo" className="h-8 w-auto" />
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" onClick={()=>{handleSignIn()}}>
        {isSignedIn? "Logout" : "Sign In"}
      </button>
    </div>
  )
}

export default Navbar
