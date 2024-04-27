const SESSION_EXPIRY_LIMIT = 1
const BASE_URL = 'http://localhost:3000/'

const PROBLEM_LOG_URL = 'user/problemLog'
const USER_INFO_URL = 'user/userInfo'
const RECOMMENDATION_URL = 'user/recommendations'
const AT_ME_URL = 'auth/@me'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if(message.type == "create_new_tab"){
        console.log("Creating new tab")
        chrome.tabs.create({
            url: 'http:localhost:3001/',
            active: true  
        });
        sendResponse({ status: "Chrome tab successfully created" });
    }
    else if(message.type == "problem_log"){
        chrome.storage.local.get(['user_id'],function(result) {
            console.log(result.user_id)
            fetch(`${BASE_URL}${PROBLEM_LOG_URL}?user_id=${result.user_id}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(message.response_data),
            })
            .then(response => {
                    console.log(response);
                    return response.json();
                }
            )
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
            // console.log(message)
            // Optionally, you can use sendResponse to send data back to the content script
            setTimeout(function() {
                sendResponse({ status: "Data sent to backend" });
            },1000);
        });
    }else{
         // Assuming `message` is the data you want to send to your backend
         chrome.storage.local.get(['user_id'],function(result){
            message.userId = result.user_id;
            console.log(message)
            fetch(`${BASE_URL}${USER_INFO_URL}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            })
            .then(response => {
                    console.log(response);
                    return response.json();
                }
            )
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
            // console.log(message)
            // Optionally, you can use sendResponse to send data back to the content script
            setTimeout(function() {
                sendResponse({ status: "Data sent to backend" });
            },1000);
         })
    }
    return true;
});



async function loadRecommendation(username){
    try {
        response = await fetch(`${BASE_URL}${RECOMMENDATION_URL}?username=${username}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        })
        console.log(`Got recommendations Status-Code ${response.status}`)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log("Error Fecting recommendations")
        console.log(error)
    }
    return undefined;
}

async function getUserData()
{
    try {
        response = await fetch(`${BASE_URL}${AT_ME_URL}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        })
        console.log(`Response Status(user/@me): ${response.status}`)
        const data = await response.json()
        console.log('user session data:',data)
        return data
    } catch (error) {
        console.log("Error fetching user session details")
        console.log(error)
    }
    return null;
}

let debounceTimer;
let dataDebounceTimer;

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Check if the URL has changed
    clearTimeout(dataDebounceTimer);    
    if (changeInfo.status === 'complete' && tab.url &&
        tab.url.includes("leetcode.com/problems/") && 
        tab.url.includes("/submissions/") &&
        tab.url.endsWith("/")) {
        dataDebounceTimer = setTimeout(async () => {
            const response = await chrome.tabs.sendMessage(tab.id, {type:"GET_PROBLEM_DATA",greeting: "hello", url:`${tab.url}`});
        },2000);
    }
    else if(changeInfo.status == "complete" && tab.url && tab.url.includes("https://leetcode.com/u/")){   
        data = await getUserData();
        console.log(data);
        chrome.storage.local.set({'user_id':data.user_id,'username':data.username});
        dataDebounceTimer = setTimeout(async () => {
            const response = await chrome.tabs.sendMessage(tab.id, {type:"GET_USER_PROFILE_DATA", url:`${tab.url}${data.username}/`});
        }, 2000); 
    }
});
