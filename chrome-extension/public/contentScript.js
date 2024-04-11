chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Your code here to handle the message
  var urlParts = window.location.pathname.split('/');
  var problemName = urlParts[urlParts.length - 4];
  var data = {
    problemName: problemName,
    status_acc: document.querySelector(".text-green-s.flex span") ? document.querySelector(".text-green-s.flex span").innerText : null,
    status_fail: document.querySelector("span.mr-1.flex-1") ? document.querySelector("span.mr-1.flex-1").innerText : null,
    runtime: document.querySelector(".bg-sd-accent span.text-lg") ? document.querySelector(".bg-sd-accent span.text-lg").innerText : null,
    time_beats: document.querySelector(".bg-sd-accent .text-xs span.font-semibold") ? document.querySelector(".bg-sd-accent .text-xs span.font-semibold").innerText : null,
    memory: document.querySelector(".opacity-40 span.text-lg") ? document.querySelector(".opacity-40 span.text-lg").innerText : null,
    memory_beats: document.querySelector(".opacity-40 .text-xs span.font-semibold") ? document.querySelector(".opacity-40 .text-xs span.font-semibold").innerText : null,
    time: document.querySelector("span.max-w-full") ? document.querySelector("span.max-w-full").innerText : null,
    test_case_passed: document.querySelector("span.text-label-3.mr-1") ? document.querySelector("span.text-label-3.mr-1").innerText : null,
    language: document.querySelector('div.items-center.pb-2') ? document.querySelector('div.items-center.pb-2').innerText.replace("Code","") : null
  }

    let timestamp = Date.now();

    // Create a Date object using the timestamp
    let date = new Date(timestamp);

    // Convert the Date object to an ISO 8601 format string
    let formattedDate = date.toISOString();
  let response_data = {problem_id:problemName}
  let problem_log = {timestamp: formattedDate, language: data.language}
  if(data.status_acc){
    problem_log['runtime'] = data.runtime;
    problem_log['memory'] = data.memory;
    problem_log['accepted'] = true;
    problem_log['time_beats'] = data.time_beats.slice(0,-1);
    problem_log['memory_beats'] = data.memory_beats.slice(0,-1);
  }else if(data.status_fail){

  }
  response_data['problem_log'] = [problem_log]
  console.log(response_data);
  (async () => {
    const response = await chrome.runtime.sendMessage({type: "problem_log",response_data});
    // do something with response here, not outside the function
    console.log(response);
  })();
  return true; // If you are using asynchronous sendResponse
});