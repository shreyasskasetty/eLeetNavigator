const SESSION_EXPIRY_LIMIT = 1
const BASE_URL = 'http://localhost:3000/'

const RECOMMENDATION_LIMIT = 3

const PROBLEM_LOG_URL = 'user/problemLog'
const USER_INFO_URL = 'user/userInfo'
const RECOMMENDATION_URL = 'user/recommendations'
const RECENTS_URL = 'user/userRecent'

const AT_ME_URL = 'auth/@me'

const SESSION_LENGTH = 2

function getTimeDiffInMinutes(timestamp1, timestamp2)
{
    const diffMilliseconds = timestamp2 - timestamp1;
    return diffMilliseconds / (1000 * 60);
}

function notify(message, title) {
    chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'logo2.png',
        title: title,
        message: message,
        priority: 1
    }, function(notificationId) {});
}

async function loadRecommendation(user_id){
    try {
        response = await fetch(`${BASE_URL}${RECOMMENDATION_URL}?user_id=${user_id}&limit=${RECOMMENDATION_LIMIT}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        })
        console.log(`Got recommendations Status-Code ${response.status}`)
        if(response.status == 200)
        {
            const data = await response.json()
            console.log(data)
            const eLeetRecommendation = {
                updatedTs : Date.now(),
                recommendation: data
            }
            chrome.storage.local.set({
                eLeetRecommendation : eLeetRecommendation
            })
            return {
                data : data,
                status : true
            }
        }else {
            return {
                status : false,
                error : "Failed to fetch data"
            }
        }

    } catch (error) {
        console.log("Error Fecting recommendations")
        console.log(error)
        return {
            status : false,
            error : error
        }
    }
}
function getRecommendation(message , sendResponse)
{
    const user_id = message.user_id
    const refresh = message.refresh
    if(refresh)
    {
        loadRecommendation(user_id)
        .then(data => {
            // Save the recommenaditon to storage
            sendResponse({...data})
        })
        .catch(error => {
            console.log("Error fetching the recommendation")
            console.log(error)
            sendResponse({
                status : false,
                error : "Unable to fetch the recommendations at the moment"
            })
        })
    }else {
        // LoadRecommendation from storage
        chrome.storage.local.get(['eLeetRecommendation'], function(result){
            console.log("Fecting recommendation from the storage")
            console.log(result.eLeetRecommendation)
            let shouldReload = false
            if(result.eLeetRecommendation)
            {
                shouldReload = getTimeDiffInMinutes(result.eLeetRecommendation.updatedTs, Date.now()) > SESSION_LENGTH
            }else{
                shouldReload = true
            }

            if (!shouldReload)
            {
                sendResponse({
                    status : true,
                    data : result.eLeetRecommendation.recommendation
                })
            }
            else{
                loadRecommendation(user_id)
                .then(data => {
                    // Save the recommenaditon to storage
                    sendResponse({...data})
                })
                .catch(error => {
                    console.log("Error fetching the recommendation")
                    console.log(error)
                    sendResponse({
                        status : false,
                        error : "Unable to fetch the recommendations at the moment"
                    })
                })
            }
        })
    }
}
async function fetchRecentsFromBackend(user_id){
    try {
        response = await fetch(`${BASE_URL}${RECENTS_URL}?user_id=${user_id}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        })
        console.log(`Got recents Status-Code ${response.status}`)
        if(response.status == 200)
        {
            const data = await response.json()
            const recents = {
                ...data
            }
            chrome.storage.local.set({recents : data})
            chrome.storage.local.set({use_stored_recents : true})
            return {
                data : data,
                status : true
            }
        }else {
            return {
                status : false,
                error : "Failed to fetch data"
            }
        }

    } catch (error) {
        console.log("Error Fecting recommendations")
        console.log(error)
        return {
            status : false,
            error : error
        }
    }
}

async function getRecents(message, sendResponse)
{
    console.log("Starting to get the recents")
    const result = await chrome.storage.local.get(['use_stored_recents'])
    const useStoredRecents = result.use_stored_recents
    if(!useStoredRecents)
    {
        const user_id = message.user_id
        fetchRecentsFromBackend(user_id)
        .then(data => {
            // Save the recommenaditon to storage
            sendResponse({...data})
        })
        .catch(error => {
            console.log("Error fetching the recents")
            console.log(error)
            sendResponse({
                status : false,
                error : "Unable to fetch the recents at the moment"
            })
        })

    }else {
        const recents = await chrome.storage.local.get(['recents'])
        // const recents = results.recents
        console.log("Obtaining recents from storage")
        if(recents)
        {
            sendResponse({
                status : true,
                data : recents.recents
            })
        }else{
            chrome.storage.local.set({use_stored_recents : false})
            sendResponse({
                status : false,
                error : "Unable to fetch the recents at the moment"
            })
        }

    }
}
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
    else if(message.type === "GET_RECOMMENDATION")
    {
        getRecommendation(message , sendResponse)   
    }
    else if(message.type === "GET_RECENTS")
    {
        getRecents(message, sendResponse)
    }
    else if(message.type == "PROBLEM_LOG"){
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
    }else if(message.type == "USER_INFO"){

         // Assuming `message` is the data you want to send to your backend
         chrome.storage.local.get(['user_id', 'username'],function(result){
           
            if(result.username !== message.userInfo.username)
            {
                console.log('Unauthorized user name')
                sendResponse({ status: "Unauthorized user name" });
            }
            else{
                notify('ELeetNavigator','User profile scan has Completed')
                chrome.runtime.sendMessage({type: 'show-notification', message: 'Profile scan completed'});
                message.userInfo.userId = result.user_id;
                console.log("GET USER INFO")
                console.log(message)
                fetch(`${BASE_URL}${USER_INFO_URL}`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message.userInfo),
                })
                .then(response => {
                        console.log(response);
                        return response.json();
                    }
                )
                .then(data => {
                    console.log('Success:', data)
                    sendResponse({ status: "Data sent to backend" });
                    
                })
                .catch((error) => {
                    console.error('Error:', error)
                    sendResponse({ status: "Failed to send the data" });
                });
            }
         })
    }
    return true;
});

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
        if(response.status === 200)
        {
            const data = await response.json()
            console.log('user session data:',data)
            return data
        }else {
            return null
        }
    } catch (error) {
        console.log("Error fetching user session details")
        console.log(error)
    }
    return null;
}

let debounceTimer;
let dataDebounceTimer;
let notificationDebounceTimer;

async function sendProblemLog(problemLog){
    data = await getUserData();
    fetch(`${BASE_URL}${PROBLEM_LOG_URL}?user_id=${data.user_id}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(problemLog),
    })
    .then(response => {
        chrome.storage.local.set({use_stored_recents : false})
            console.log(response);
            return response.json();
        }
    )
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Check if the URL has changed
    clearTimeout(dataDebounceTimer);    
    if (changeInfo.status === 'complete' && tab.url &&
        tab.url.includes("leetcode.com/problems/") && 
        tab.url.includes("/submissions/") &&
        tab.url.endsWith("/")) {
        dataDebounceTimer = setTimeout(async () => {
            const response = await chrome.tabs.sendMessage(tab.id, {type:"GET_PROBLEM_DATA",greeting: "hello", url:`${tab.url}`});
            sendProblemLog(response)
        },2000);
    }
    else if(changeInfo.status == "complete" && tab.url && tab.url.includes("https://leetcode.com/u/")){   
        try {
            data = await getUserData();
            console.log(data);
            if(data)
            {    
                chrome.storage.local.set({'user_id':data.user_id,'username':data.username});
                dataDebounceTimer = setTimeout(async () => {
                    notify('ELeetNavigator','User profile scan has started')
                    const response = await chrome.tabs.sendMessage(tab.id, {type:"GET_USER_PROFILE_DATA", url:`${tab.url}${data.username}/`});
                }, 2000);

                clearTimeout(notificationDebounceTimer);    
                notificationDebounceTimer = setTimeout(async () => {
                    const notification_response = chrome.tabs.sendMessage(tab.id, {type: 'show-notification', message: 'Profile scan started'});
                    notification_response.then((res)=>{
                        console.log(res)
                    }).catch((error)=>{
                        console.log(error)
                    })
                }, 2000);
            }

        } catch (error) {
             console.error("Failed to handle user profile data:", error);
        }
    }
});
