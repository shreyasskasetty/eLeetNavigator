import Recommendations from './Recommendations';

export default function HomeView({currentUser} : any){
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

    return (
        <>
          {currentUser? <Recommendations currentUser={currentUser}/> : <></>}
        </>
    )
}