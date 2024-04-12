import Recommendations from './Recommendations';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

export default function HomeView(){
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

const redirectToNewPage = async (url: string): Promise<void> => {
  // Fetch the current active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tabs.length === 0) {
    console.error('No active tab found.');
    return;
  }

  const currentTab = tabs[0];
  if (currentTab.id === undefined) {
    console.error('The current tab ID is undefined.');
    return;
  }

  // Use the non-null assertion operator (!) after verifying tab.id is not undefined
  await chrome.tabs.update(currentTab.id, { url: url });

  // Wait for the tab to be updated and reloaded
  chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
    if (tabId === currentTab.id && changeInfo.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener);

      // Wait for a specified delay before executing the script
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tabId! },
          func: () => {
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

            function executeWithDelay(delay: number) {
                setTimeout(function() {
                    var userInfo = extractData();
                    console.log(userInfo);
                    chrome.runtime.sendMessage(userInfo);
                }, delay);
            }
            
            interface Language {
                language: string;
                count: number;
              }
              
              interface Skill {
                skill_type: string;
                count: number;
              }
              
              type ProblemLogEntry = {
                attempts: number;
                runtime: number;
                memory: number;
                language: string;
                timestamp: string; // Could also use Date type if converting to Date object
                time_beats: number;
                memory_beats: number;
              };
              
              type Problem = {
                problem_id: string;
                problem_log: ProblemLogEntry[];
              };
              
              interface SolvedProblem {
                type: 'easy' | 'medium' | 'hard';
                count: number;
                beats: number;
              }
              
              interface ExtractedData {
                username: string | null;
                rank: number | null;
                languages: Language[];
                skills: {
                  advance: Skill[];
                  intermediate: Skill[];
                  fundamental: Skill[];
                };
                solved_problems: SolvedProblem[];
                history: Problem[] | null;
                streak: string | null;
              }
            
            function extractData() : ExtractedData{
                var languages: Language[] = [];
                var advance: Skill[] = [];
                var intermediate: Skill[] = [];
                var fundamental: Skill[] = [];
            
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
              let slv_e: number  = (document.querySelector("div.space-y-2:nth-of-type(1) .flex div.flex") as HTMLElement | null)?.innerText ? parseInt((document.querySelector("div.space-y-2:nth-of-type(1) .flex div.flex") as HTMLElement).innerText) : 0;  
              let slv_e_b: number = (document.querySelector("div.space-y-2:nth-of-type(1) span.text-label-2") as HTMLElement | null)?.innerText ? parseInt((document.querySelector("div.space-y-2:nth-of-type(1) span.text-label-2") as HTMLElement).innerText.replace("%", "")) : 0;  
              
              // Similar approach for slv_m and slv_h as done for slv_e and slv_e_b
              
              var slv_m = (document.querySelector("div.space-y-2:nth-of-type(2) div.flex-1") as HTMLElement | null)?.innerText ? parseInt((document.querySelector("div.space-y-2:nth-of-type(2) div.flex-1") as HTMLElement).innerText) : 0;  
              var slv_m_b =   (document.querySelector("div.space-y-2:nth-of-type(2) span.text-label-2") as HTMLElement | null)?.innerText ? parseInt((document.querySelector("div.space-y-2:nth-of-type(2) span.text-label-2") as HTMLElement).innerText) : 0;  
            
            
              var q_h_1 = "div:nth-of-type(3) div.flex-1.items-center"
              var q_h_2 = "div.space-y-2:nth-of-type(3) span.text-label-2"
              var slv_h = (document.querySelector(q_h_1) as HTMLElement | null)?.innerText ? parseInt((document.querySelector(q_h_1) as HTMLElement).innerText) : 0;  
              var slv_h_b = (document.querySelector(q_h_2) as HTMLElement | null)?.innerText ? parseInt((document.querySelector(q_h_2) as HTMLElement).innerText) : 0;  
            
              let solved_problems: SolvedProblem[]= [];
              let easy : SolvedProblem= {
                  type: 'easy',
                  count: slv_e,
                  beats: slv_e_b
              };
              let medium :SolvedProblem= {
                  type: 'medium',
                  count: slv_m,
                  beats: slv_m_b
              };
              let hard :SolvedProblem= {
                  type: 'hard',
                  count: slv_h,
                  beats: slv_h_b
              };
            
              solved_problems.push(easy);
              solved_problems.push(medium);
              solved_problems.push(hard);
              let rank: number  = (document.querySelector("span.ttext-label-1") as HTMLElement | null)?.innerText ? parseInt((document.querySelector("span.ttext-label-1") as HTMLElement).innerText) : 0;  
              let username: string | null = document ? (document.querySelector(".space-x-4 div.text-label-3") as HTMLElement | null)?.innerText || null : null;

              let streak = document ? (document.querySelector("div.space-x-1:nth-of-type(2) span.font-medium")as HTMLElement | null)?.innerText || null : null;
              let history: Problem[] = Array.from(document.querySelectorAll('span.line-clamp-1'))
              .map(element => ({
                "problem_id":(element as HTMLElement).innerText.trim().toLowerCase().replace(/\s/g, "-"), 
                "problem_log": [
                    {
                        "attempts": 1,
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
            executeWithDelay(2000);
          },
        }).catch((error) => console.error('Scripting error:', error));
      }, 2000); // Delay in milliseconds, adjust as needed
    }
  });
};
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
        <Button onClick={()=>redirectToNewPage("https://leetcode.com/shreyas30kasetty/")}>
            Click me
        </Button>
        {userName? <Recommendations /> : <></>}
        </>
    )
}