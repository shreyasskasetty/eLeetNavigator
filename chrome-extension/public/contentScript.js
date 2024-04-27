chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type == "GET_PROBLEM_DATA"){
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
  }
  if(message.type == "GET_USER_PROFILE_DATA"){
    console.log("Delayed: Page loaded and content is being scanned.");
    let userElement = document.querySelector("div.break-all");
    let user = userElement instanceof HTMLElement ? userElement.innerText : null;
    console.log(user);
    let targetElement1 = document.querySelector('.mt-4 div:nth-of-type(1) .items-center span.cursor-pointer');
    let targetElement2 = document.querySelector('.mt-4 div:nth-of-type(2) .items-center span.cursor-pointer');
    let targetElement3 = document.querySelector('.pb-3 span.cursor-pointer');
    if (targetElement1 instanceof HTMLElement ) {
        targetElement1.click();
    }
    if (targetElement2 instanceof HTMLElement) {
        targetElement2.click();
    }
    if (targetElement3 instanceof HTMLElement) {
        targetElement3.click();
    }

    executeWithDelay(2000);
  }
});

function executeWithDelay(delay) {
  setTimeout(function() {
      var userInfo = extractData();
      console.log(userInfo);
      chrome.runtime.sendMessage(userInfo);
  }, delay);
}

function extractData() {
  var languages= [];
  var advance = [];
  var intermediate = [];
  var fundamental = [];

  var langElements = Array.from(document.querySelectorAll('span.inline-flex.text-label-3')).map(element => element.innerHTML).length ? Array.from(document.querySelectorAll('span.inline-flex.text-label-3')).map(element => element.innerHTML) : [];
  var langCountElements = Array.from(document.querySelectorAll('span.text-xs.font-medium.text-label-1')).map(element => element.innerHTML).length ? Array.from(document.querySelectorAll('span.text-xs.font-medium.text-label-1')).map(element => element.innerHTML) : [];

  var advElements = Array.from(document.querySelectorAll('.mt-4 div:nth-of-type(1) .mb-3 span.inline-flex')).map(element => element.innerHTML).length ? Array.from(document.querySelectorAll('.mt-4 div:nth-of-type(1) .mb-3 span.inline-flex')).map(element => element.innerHTML) : [];
  var advCountElements = Array.from(document.querySelectorAll('.mt-4 div:nth-of-type(1) .mb-3 span.pl-1')).map(element => element.innerHTML).length ? Array.from(document.querySelectorAll('.mt-4 div:nth-of-type(1) .mb-3 span.pl-1')).map(element => element.innerHTML) : [];

  var intElements = Array.from(document.querySelectorAll('.mt-4 div:nth-of-type(2) .mt-3 span.inline-flex')).map(element => element.innerHTML).length ? Array.from(document.querySelectorAll('.mt-4 div:nth-of-type(2) .mt-3 span.inline-flex')).map(element => element.innerHTML) : [];
  var intCountElements = Array.from(document.querySelectorAll('.mt-4 div:nth-of-type(2) .mt-3 span.pl-1')).map(element => element.innerHTML).length ? Array.from(document.querySelectorAll('.mt-4 div:nth-of-type(2) .mt-3 span.pl-1')).map(element => element.innerHTML) : [];

  var funElements = Array.from(document.querySelectorAll('.pb-1 span.inline-flex')).map(element => element.innerHTML).length ? Array.from(document.querySelectorAll('.pb-1 span.inline-flex')).map(element => element.innerHTML) : [];
  var funCountElements = Array.from(document.querySelectorAll('.pb-1 span.pl-1')).map(element => element.innerHTML).length ? Array.from(document.querySelectorAll('.pb-1 span.pl-1')).map(element => element.innerHTML) : [];

  console.log(langCountElements);
  console.log(advCountElements);


  if (langElements !== null && langCountElements != null) {
      langElements.forEach((element, index) => {
          var language = element;
          var count = langCountElements[index] ? parseInt(langCountElements[index]) : 0;
          languages.push({ language: language, count: count });
      });
  }

  if (advElements != null) {
      advElements.forEach((element, index) => {
          var skill_type = element;
          var count = advCountElements[index] ? parseInt(advCountElements[index].slice(1)) : 0;
          advance.push({ skill_type: skill_type, count: count });
      });
  }
  if (intElements != null) {
      intElements.forEach((element, index) => {
          var skill_type = element;
          var count = intCountElements[index] ? parseInt(intCountElements[index].slice(1)) : 0;
          intermediate.push({ skill_type: skill_type, count: count });
      });
  }
  if (funElements != null) {
      funElements.forEach((element, index) => {
          var skill_type = element;
          var count = funCountElements[index] ? parseInt(funCountElements[index].slice(1)) : 0;
          fundamental.push({ skill_type: skill_type, count: count });
      });
  }
  let skills = {
      advance: advance,
      intermediate: intermediate,
      fundamental: fundamental
  };

  //Solved problems easy count & easy beats percentage
  let slv_e = document.querySelector("div.space-y-2:nth-of-type(1) .flex div.flex");
  slv_e = slv_e ? parseInt(slv_e.innerText) : 0;

  // Querying the DOM for a specific span, removing the "%" character, and parsing it as an integer.
  let slv_e_b = document.querySelector("div.space-y-2:nth-of-type(1) span.text-label-2");
  slv_e_b = slv_e_b ? parseInt(slv_e_b.innerText.replace("%", "")) : 0;


  // Similar approach for slv_m and slv_h as done for slv_e and slv_e_b

  var slv_m = document.querySelector("div.space-y-2:nth-of-type(2) div.flex-1")?.innerText ? parseInt(document.querySelector("div.space-y-2:nth-of-type(2) div.flex-1").innerText) : 0;
  var slv_m_b = document.querySelector("div.space-y-2:nth-of-type(2) span.text-label-2")?.innerText ? parseInt(document.querySelector("div.space-y-2:nth-of-type(2) span.text-label-2").innerText) : 0;  


  var q_h_1 = "div:nth-of-type(3) div.flex-1.items-center"
  var q_h_2 = "div.space-y-2:nth-of-type(3) span.text-label-2"
  var slv_h = document.querySelector(q_h_1)?.innerText ? parseInt(document.querySelector(q_h_1).innerText) : 0;
  var slv_h_b = document.querySelector(q_h_2)?.innerText ? parseInt(document.querySelector(q_h_2).innerText) : 0;  

  let solved_problems= [];
  let easy = {
      type: 'easy',
      count: slv_e,
      beats: slv_e_b
  };
  let medium = {
      type: 'medium',
      count: slv_m,
      beats: slv_m_b
  };
  let hard = {
      type: 'hard',
      count: slv_h,
      beats: slv_h_b
  };

  solved_problems.push(easy);
  solved_problems.push(medium);
  solved_problems.push(hard);
  let rank = document.querySelector("span.text-label-1")?.innerText ? parseInt(document.querySelector("span.text-label-1").innerText) : 0;
  let username = document ? document.querySelector(".space-x-4 div.text-label-3")?.innerText || null : null;  

  let streak = document ? document.querySelector("div.space-x-1:nth-of-type(2) span.font-medium")?.innerText || null : null;

  let history = Array.from(document.querySelectorAll('span.line-clamp-1'))
  .map(element => ({
    "problem_id":(element).innerText.trim().toLowerCase().replace(/\s/g, "-"), 
    "problem_log": [
        {
            "runtime": 200,
            "memory": 256,
            "language": "Python",
            "timestamp": "2024-04-07T14:48:00.000Z",
            "time_beats": 75.4,
            "memory_beats": 60.2
        }
    ]
    }));

    return {
        username: username,
        rank: rank,
        languages: languages,
        skills: skills,
        solved_problems: solved_problems,
        history: history, 
        streak: streak
    };
}