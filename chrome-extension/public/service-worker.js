const SESSION_EXPIRY_LIMIT = 1
const BASE_URL = 'http://localhost:3000/'

const PROBLEM_LOG_URL = 'user/problemLog'
const USER_INFO_URL = 'user/userInfo'
const RECOMMENDATION_URL = 'user/recommendations'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type == "problem_log"){
        console.log(message)
        fetch(`${BASE_URL}${PROBLEM_LOG_URL}?username=kote`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(message.response_data),
        })
        .then(response => {
                console.log(response.status);
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
    }else{
         // Assuming `message` is the data you want to send to your backend
        fetch(`${BASE_URL}${USER_INFO_URL}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
        .then(response => {
                console.log(response.status);
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

function getUserName()
{
    return "kote"
}


async function updateExtensionData(username){
    eLeetData = {}
    recommendation = await loadRecommendation(username)
    eLeetData['username'] = username
    eLeetData['recommendation'] = recommendation
    eLeetData['createTs'] = Date.now()
    chrome.storage.local.set({ eLeetData: eLeetData}, function() {
        console.log('ELeetData saved to local storage');
        console.log(eLeetData)
      });
}

function isExpired(timestamp){
    if(!timestamp)
        return true;

    const currentTime = Date.now();
    const expity_ms = SESSION_EXPIRY_LIMIT * 60 * 1000; // 30 minutes in milliseconds
    const thirtyMinutesFromLastTs = timestamp + expity_ms;
    
    if(thirtyMinutesFromLastTs < currentTime)
        return true;
    
    return false;
}
async function loadExtensionData(){

    chrome.storage.local.get(['eLeetData'], function(result) {
        console.log('Data retrieved from local storage:', result.eLeetData);
        username = getUserName()
        if(!result.eLeetData || isExpired(result.eLeetData.createTs)) {
            console.log("Leet Data is expired.")
            updateExtensionData(username);
        }
        else{
            console.log("data is fine");
        }
        if(username !== result.eLeetData.username)
        {
            console.log("User Name is changed.")
            updateExtensionData(username);
        }
    });
}

let debounceTimer;
let dataDebounceTimer;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the URL has changed
    if (changeInfo.status === 'complete' && tab.url &&
        tab.url.includes("leetcode.com/problems/") && 
        tab.url.includes("/submissions/") &&
        tab.url.endsWith("/")) {
        
        // Clear the existing timer if there is one
        clearTimeout(debounceTimer);
        
        // Set a new timer
        debounceTimer = setTimeout(async () => {
            console.log(`Shreyas XXXX Happy ${tabId} times`);
            // scrapeDataBck(tab);
            const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello", url:`${tab.url}`});
        }, 500); // Delay in milliseconds
    }

    if(changeInfo.status === 'complete' && tab.url && 
        tab.url.includes("leetcode.com"))
        {
            clearTimeout(dataDebounceTimer);

            // Set a new timer
            dataDebounceTimer = setTimeout(async () => {
            loadExtensionData()
        }, 500); // Delay in milliseconds
        }
});
