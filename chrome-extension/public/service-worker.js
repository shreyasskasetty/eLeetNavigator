chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type == "problem_log"){
        console.log(message)
        fetch(`http://10.183.81.40:3000/user/problemLog?username=kote`, {
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
        fetch('http://localhost:3000/user/userInfo', {
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

let debounceTimer;

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
});
