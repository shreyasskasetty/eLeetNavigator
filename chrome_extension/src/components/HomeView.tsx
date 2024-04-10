import Typography from '@mui/material/Typography';
import Recommendations from './Recommendations';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import axios from 'axios';

export default function HomeView(){

    useEffect(()=>{
        axios.get('http://10.183.214.232:3000/user/recommendations', {
        params: {
         'username':'kote'
        }
    })
    .then(function (response) {
        console.log(response.data); // Handle the response data in here
    })
    .catch(function (error) {
        console.error(error); // Handle errors here
    });
    },[]);

    const collectData = async () => {
        let [tab] = await chrome.tabs.query({active: true});
        chrome.scripting.executeScript({
          target: {tabId : tab.id!},
          func: () =>{
            console.log("Happy")
            let userElement = document.querySelector("div.break-all");
            let user: string | null = userElement instanceof HTMLElement ? userElement.innerText : null;
            console.log(user);
          }
        });
      };

    return (
        <div className="main-content">
            <Typography
                sx={{
                    color: 'grey', // Sets the text color to grey
                    borderColor: 'grey', // Sets the border color to grey
                    borderWidth: '1px', // Sets the border width to 1px
                    borderBottom: '1px solid #e0e0e0',
                    borderTop: '1px solid #e0e0e0',
                    padding: '10px 0px 10px 20px', // Adds some vertical padding for visual spacing
                }}
                >
                Recommended Problems
                </Typography>
                <Button onClick={()=>collectData()}>
                 Click me
                </Button>
                <Recommendations />
        </div>
    )
}