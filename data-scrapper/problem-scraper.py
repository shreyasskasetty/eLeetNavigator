from selenium import webdriver
from time import sleep
from bs4 import BeautifulSoup
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
    columns = ["name","submissions", "likes", "topics", "description"]
    df = pd.DataFrame(columns=columns)
    login_base_url = "https://leetcode.com/accounts/login/?next=%2Fproblemset%2F"
    driver.get(login_base_url)
    sleep(10)
    password = "shreyas@leetcode123"
    email = "shreyas30kasetty@gmail.com"
    email_input_element = driver.find_element("css selector", "input#id_login")
    email_input_element.send_keys(email)
    password_input_element = driver.find_element("css selector", "input#id_password")
    password_input_element.send_keys(password)

    login_element = driver.find_element("css selector","button.btn__3Y3g")
    login_element.click()

    # Example of navigation, adjust based on actual site structure
    for i in range(1, 64):  # You'll need a condition to exit this loop
        # Find 'Next' button and click, or break if at the end
        base_url = f"https://leetcode.com/problemset/?page={i}"
        driver.get(base_url)
        print(f"Starting Page {1}:")
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR,"a.h-5")))
        except:
            print("Wait error")
        sleep(2)  # Be nice, don't hammer their servers

        problem_elements = driver.find_elements("css selector", "a.h-5")
        problem_urls = []

        for problem_element in problem_elements:
            try:
                problem_url = problem_element.get_attribute("href")
                problem_urls.append(problem_url)
            except:
                print('Error in finding problem url')
        
        for problem_url in problem_urls:
            driver.get(problem_url)
            try:
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div:nth-of-type(3) div.text-label-1.text-sm")))
            except:
                print("Timeout Exception")
            sleep(8)

            try:
                problem_submission_count = driver.find_element("css selector", "div:nth-of-type(3) div.text-label-1.text-sm")
            except:
                print("Error in finding submission count attribute")
            topic_list = []
            topics_string = ""
            description = None
            try:
                description_element = driver.find_element("css selector", "div.elfjS")
                if(description_element):
                    description = description_element.text
            except:
                print("Parsing description error")
            try:
                topics = driver.find_element("css selector", "div.text-body.text-text-primary")
                if(topics.text.lower() == "topics"):
                    topics.click()
                    topic_elements = driver.find_elements("css selector", "a.hover\:text-current")
                    topic_list =list(map(lambda x: x.get_attribute("href").split("/")[-2], topic_elements))
            except:
                print("error occurred in finding topics")
            topics_string = ",".join(topic_list)

            try:
                problem_likes_element = driver.find_element("css selector", ".rounded-none div:nth-of-type(2)")
            except:
                problem_likes_element = ""
                print("error finding problem_likes_element")
            while(problem_submission_count.text == '0'):
                problem_submission_count = driver.find_element("css selector", "div:nth-of-type(3) div.text-label-1.text-sm")
                
            problem_name = driver.find_element("css selector", "a.cursor-text")
            try:
                print(problem_name.text, problem_submission_count.text, topics_string, problem_likes_element.text)
                new_row = pd.DataFrame([[problem_name.text,problem_submission_count.text,problem_likes_element.text,topics_string, description]],columns=columns)
                df = pd.concat([df,new_row],ignore_index=True)
            except:
                print("Error occured while accessing the variables")
            # print(df)

    # Save or process your data
    df.to_csv('problem_remaing_data1.csv')

    driver.close()

if __name__ == '__main__':
    scrape_leetcode()
