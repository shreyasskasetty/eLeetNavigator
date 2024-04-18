function Welcome() {
  const handleButtonClick = ()=>{
    const message = {
      type: "create_new_tab",
      url: "http://localhost:3000"
    }
    chrome.runtime.sendMessage(message, (response)=>{
      console.log(response);
    })
  }
  return (
    <div className="welcome-page-container">
        <div className="eln-welcome-banner">
            <p className="eln-welcome-text">
                Welcome to <br />
                eLeetNavigator!
            </p>
            <img className="eln-logo" src="/welcome-logo.png" />
        </div>
        <p className="eln-getting-started-message">
          As you embark on your journey to conquer the coding challenges ahead 🌟,<br/> <br/><strong>eLeetNavigator</strong> is here to guide you through the vast seas of algorithms and data structures. <br/><br/>Tailored to your personal coding style and based on cutting-edge technology 🖥️, our recommendations are crafted just for you. <br /><br/><em>Ready to get started?🚀</em>
        </p>
        <button className="eln-get-started-button" onClick={()=>{handleButtonClick()}}>Get Started 🎯</button>
    </div>
  )
}

export default Welcome;
