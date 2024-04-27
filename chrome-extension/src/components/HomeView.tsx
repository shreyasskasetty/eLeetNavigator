import Recommendations from './Recommendations';
import { useEffect, useState } from 'react';

export default function HomeView({currentUser} : any){
  const [userName, setUserName] = useState("")
// const collectData = async () => {
//     let [tab] = await chrome.tabs.query({active: true});
//     chrome.scripting.executeScript({
//       target: {tabId : tab.id!},
//       func: () =>{
//         console.log("Happy")
//         let userElement = document.querySelector("div.break-all");
//         let user: string | null = userElement instanceof HTMLElement ? userElement.innerText : null;
//         console.log(user);
//       }
//     });
//   };


    function fetchUserData(){
      let user_name = ""
      chrome.storage.local.get(['eLeetData'], function(result) {
        console.log('Data retrieved from local storage:', result.eLeetData);
          if(result.eLeetData) {
            user_name =  result.eLeetData.username;
            if(user_name !== userName)
              {
                setUserName(user_name)
              }
          }
      });
      return user_name;
    }

    useEffect(()=>{
      fetchUserData();
    }, [])
    return (
        <>
          {userName? <Recommendations currentUser={currentUser}/> : <></>}
        </>
    )
}