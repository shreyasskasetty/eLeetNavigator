from selenium import webdriver
from time import sleep
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd

# Initialize Selenium WebDriver
driver = webdriver.Chrome()

# Function to navigate and scrape
def scrape_leetcode():
    problems = []
    columns = ["skills_adv", "skills_int", "skills_fun", "rank", "username", "language", "solved easy", "solved easy beats", "solved medium", "solved medium beats", "solved hard", "solved hard beats", "subs", "active days", "recent"]
    df = pd.DataFrame(columns = columns)
    login_base_url = "https://leetcode.com/contest/weekly-contest-394/ranking"
    driver.get(login_base_url)
    sleep(5)
    #password = "shreyas@leetcode123"
    #email = "shreyas30kasetty@gmail.com"
    #email_input_element = driver.find_element("css selector", "input#id_login")
    #email_input_element.send_keys(email)
    #password_input_element = driver.find_element("css selector", "input#id_password")
    #password_input_element.send_keys(password)

    #login_element = driver.find_element("css selector","button.btn__3Y3g")
    #login_element.click()
    # Example of navigation, adjust based on actual site structure
    for i in range(500,1001):  # You'll need a condition to exit this loop
        # Find 'Next' button and click, or break if at the end
        base_url = f"https://leetcode.com/contest/weekly-contest-394/ranking/{i}/"
        driver.get(base_url)
        print(f"Starting Page {i}:")
        try:
            WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR,"a.ranking-username")))
        except:
            print("Time Out Error")
        #sleep(2)  # Be nice, don't hammer their servers

        problem_elements = driver.find_elements("css selector", "a.ranking-username")
        problem_urls = []

        for problem_element in problem_elements:
            problem_url = problem_element.get_attribute("href")
            problem_urls.append(problem_url)
            
        for j, problem_url in enumerate(problem_urls):
            print("User Number:", j+1)
            driver.get(problem_url)
            sleep(5)

            try:
                skills_adv_button = driver.find_element("css selector", ".mt-4 div:nth-of-type(1) .items-center span.cursor-pointer")
                if(skills_adv_button):
                    skills_adv_button.click()
            except:
                print("Skills Adv button error")

            try:
                skills_int_button = driver.find_element("css selector", ".mt-4 div:nth-of-type(2) .items-center span.cursor-pointer")
                if(skills_int_button):
                    skills_int_button.click()
            except:
                print("Skills Int button error")

            try:
                skills_fun_button = driver.find_element("css selector", ".pb-3 span.cursor-pointer")
                if(skills_fun_button):
                    skills_fun_button.click()
            except:
                print("Skills Fun button error")

            sleep(5)

            skills_adv_list = []
            try:
                skills_adv_el = driver.find_elements("css selector", ".mt-4 div:nth-of-type(1) .mb-3 span.inline-flex")
                if(skills_adv_el):
                    for s in range(len(skills_adv_el)):
                        skills_adv_list.append(skills_adv_el[s].text)
            except:
                print("Parsing Adv skills error")

            try:
                skills_adv_count_el = driver.find_elements("css selector", ".mt-4 div:nth-of-type(1) .mb-3 span.pl-1")
                if(skills_adv_count_el):
                    for s in range(len(skills_adv_count_el)):
                        skills_adv_list[s] += skills_adv_count_el[s].text
            except:
                print("Parsing Adv skills count error")
                
            skills_adv_list = ",".join(skills_adv_list)
            #print(skills_adv_list)

            skills_int_list = []
            try:
                skills_int_el = driver.find_elements("css selector", ".mt-4 div:nth-of-type(2) .mt-3 span.inline-flex")
                if(skills_int_el):
                    for s in range(len(skills_int_el)):
                        skills_int_list.append(skills_int_el[s].text)
            except:
                print("Parsing Int skills error")

            try:
                skills_int_count_el = driver.find_elements("css selector", ".mt-4 div:nth-of-type(2) .mt-3 span.pl-1")
                if(skills_int_count_el):
                    for s in range(len(skills_int_count_el)):
                        skills_int_list[s] += skills_int_count_el[s].text
            except:
                print("Parsing Int skills count error")
                
            skills_int_list = ",".join(skills_int_list)
            #print('int', skills_int_list)

            skills_fun_list = []
            try:
                skills_fun_el = driver.find_elements("css selector", ".pb-1 span.inline-flex")
                if(skills_fun_el):
                    for s in range(len(skills_fun_el)):
                        skills_fun_list.append(skills_fun_el[s].text)
            except:
                print("Parsing Fun skills error")

            try:
                skills_fun_count_el = driver.find_elements("css selector", ".pb-1 span.pl-1")
                if(skills_fun_count_el):
                    for s in range(len(skills_fun_count_el)):
                        skills_fun_list[s] += skills_fun_count_el[s].text
            except:
                print("Parsing Fun skills count error")
                
            skills_fun_list = ",".join(skills_fun_list)

            rank = ''
            try:
                rank_el = driver.find_element("css selector", "span.ttext-label-1")
                if(rank_el):
                    rank = rank_el.text
            except:
                print("Parsing rank error")

            username = ''
            try:
                username_el = driver.find_element("css selector", "div.break-all")
                if(username_el):
                    username = username_el.text
            except:
                print("Parsing username error")

            lang_list = []
            try:
                lang_el = driver.find_elements("css selector", "span.inline-flex.text-label-3")
                if(lang_el):
                    for s in range(len(lang_el)):
                        lang_list.append(lang_el[s].text)
            except:
                print("Parsing Lang name error")

            try:
                lang_count_el = driver.find_elements("css selector", "span.text-xs.font-medium.text-label-1")
                if(lang_count_el):
                    for s in range(len(lang_count_el)):
                        lang_list[s] += ('_' + lang_count_el[s].text)
            except:
                print("Parsing Lang count error")
                
            lang_list = ",".join(lang_list)

            solved_easy = ''
            try:
                solved_easy_el = driver.find_element("css selector", "div.space-y-2:nth-of-type(1) span.leading-\[20px\]")
                if(solved_easy_el):
                    solved_easy = solved_easy_el.text
            except:
                print("Parsing solved easy error")

            #sleep(5)
            solved_easy_beats = ''
            try:
                solved_easy_beats_el = driver.find_element("css selector", "div.space-y-2:nth-of-type(1) span.text-label-2")
                if(solved_easy_beats_el):
                    solved_easy_beats = solved_easy_beats_el.get_attribute("innerHTML")
            except:
                print("Parsing solved easy beats error")

            solved_medium = ''
            try:
                solved_medium_el = driver.find_element("css selector", "div.space-y-2:nth-of-type(2) span.mr-\[5px\]")
                if(solved_medium_el):
                    solved_medium = solved_medium_el.text
            except:
                print("Parsing solved medium error")
                
            solved_medium_beats = ''
            try:
                solved_medium_beats_el = driver.find_element("css selector", "div.space-y-2:nth-of-type(2) span.text-label-2")
                if(solved_medium_beats_el):
                    solved_medium_beats = solved_medium_beats_el.get_attribute("innerHTML")
            except:
                print("Parsing solved medium beats error")

            solved_hard = ''
            try:
                solved_hard_el = driver.find_element("css selector", "div.space-y-2:nth-of-type(3) span.mr-\[5px\]")
                if(solved_hard_el):
                    solved_hard = solved_hard_el.text
            except:
                print("Parsing solved hard error")
                
            solved_hard_beats = ''
            try:
                solved_hard_beats_el = driver.find_element("css selector", "div.space-y-2:nth-of-type(3) span.text-label-2")
                if(solved_hard_beats_el):
                    solved_hard_beats = solved_hard_beats_el.get_attribute("innerHTML")
            except:
                print("Parsing solved hard beats error")

            subs = ''
            try:
                subs_el = driver.find_element("css selector", "span.lc-md\:text-xl")
                if(subs_el):
                    subs = subs_el.text
            except:
                print("Parsing subs error")

            ad = ''
            try:
                ad_el = driver.find_element("css selector", ".mr-4\.5 span.font-medium")
                if(ad_el):
                    ad = ad_el.text
            except:
                print("Parsing ad error")

            recent = ''
            try:
                recent_el = driver.find_elements("css selector", "span.line-clamp-1")
                if recent_el:
                    recent = ",".join([x.text for x in recent_el])
            except:
                print("Parsing recent error")
                
            try:
                # Assuming 'columns' is a list of column names
                new_row = pd.DataFrame([[skills_adv_list, skills_int_list, skills_fun_list, rank, username, lang_list, solved_easy, solved_easy_beats, solved_medium, solved_medium_beats, solved_hard, solved_hard_beats, subs, ad, recent]], columns=columns)

                # Concatenate the new row with the existing DataFrame
                df = pd.concat([df, new_row], ignore_index=True)

                # Write the updated DataFrame to the CSV file
                df.to_csv('profile_data.csv', index=False)  # Set index=False to avoid writing row indices to the CSV
            except:
                print("Error occured while accessing the variables")
            #print(df)
    # Save or process your data
    driver.close()

if __name__ == '__main__':
    scrape_leetcode()
