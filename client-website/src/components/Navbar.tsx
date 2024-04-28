import { useSelector } from "react-redux";
import api from "../api/api";
import { useDispatch } from "react-redux";
import { setSignedIn } from "../features/user/userSlice";
import { setOpen } from "../features/ui/modalSlice";
import { setIsLoading } from "../features/ui/commonSlice";

function Navbar() {
  const isSignedIn = useSelector((state: any) => state.user.isSignedIn);
  const dispatch = useDispatch();
  const handleDashboardClick = () =>{
    window.location.href = "/dashboard"
  }
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
  const noGridColumns = isSignedIn?2:1;
    
  return (
    <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
       <a className="logo" href="/">
          <img src="src/assets/logo2.png" alt="Logo" className="h-8 w-auto" />
        </a>
      <div className={`inline-grid grid-cols-${noGridColumns} gap-4`}>
        {
          isSignedIn?
          <button className="bg-slate-400 mr-2 hover:bg-slate-600 text-white font-bold py-1 px-4 rounded" onClick={()=>{handleDashboardClick()}}>
            Dashboard
          </button>:
          <></>
        }
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" onClick={()=>{handleSignIn()}}>
          {isSignedIn? "Logout" : "Sign In"}
        </button>
      </div>
    </div>
  )
}

export default Navbar
