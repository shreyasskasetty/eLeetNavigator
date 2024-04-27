import { Card, CardActionArea, Typography, Grid, Box, Button } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { formatProblemString } from '../utility';
//import AppConfig from '../config/AppConfig';
// import api from '../apis/api';
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

  await chrome.tabs.update(currentTab.id, { url: url });
};

function Recommendations({currentUser} : any) {
  const [recommendations, setRecommendations] = useState<{ list: string[]; title: string; }[]>([]);
  const [message, setMessage] = useState("")

  function fetchRecommendation(user_id : string, refresh: boolean = false){
    const message = {
      type: "GET_RECOMMENDATION",
      refresh: refresh,
      user_id: user_id
    }
    chrome.runtime.sendMessage(message, (response)=>{
      console.log("Getting response from service worker")
      console.log(response);
      if(response.status)
      {
        setRecommendations(response.data)
        setMessage("")
      }
      else{
        setMessage("Sorry for the incovience. Unable to get recommendations rn")
      }
    })
  }
  
  const handleCardClick = async (problemName: string) => {
    console.log(`Clicked on: ${problemName}`);
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
    let problemUrlTemplate : string = `https://leetcode.com/problems/${problemName}`
    await chrome.tabs.update(currentTab.id, { url: problemUrlTemplate });
    // Implement your click handling logic here
  };

  function getRecommendationsFromBackend(){
    // setIsLoading(true); // Start loading
    if (!currentUser)
    {
      setMessage("Please login for recommendations")
      return;
    }
    if (!currentUser.user_info_exists)
    {
      setMessage("Onboard onto the system")
      return;
    }

    fetchRecommendation(currentUser.user_id, false)

    // const queryParams = {
    //   "user_id" : currentUser.user_id,
    //   "limit" : AppConfig.RECOMMENDATION_LIMIT
    // }
    // console.log("Fetching recommendation for ", currentUser.user_id)
    // console.log(currentUser)

    // api.getRecommendation(queryParams)
    // .then(function (response){
    //   setRecommendations(response.data)
    //   setMessage("")
    // })
    // .catch(function(error){
    //   setMessage("Sorry for the incovience. Unable to get recommendations rn")
    //   console.log(error)
    // })
    
    

    // axios.get('http://localhost:3000/user/recommendations', {
    //   params: {
    //     'username': userName
    //   }
    // })
    // .then(function (response) {
    //   setRecommendations(response.data); // Assuming the response data is directly in the required format
    //   console.log(response.data); // Handle the response data in here
    //   //setIsLoading(false); // Stop loading once data is received
    // })
    // .catch(function (error) {
    //   //setIsLoading(false); // Stop loading on error
    //   console.error(error); // Handle errors here
    // });
  }

  useEffect(() => {
    getRecommendationsFromBackend()
  }, []);

  if(!currentUser)
  {
    return <></>
  }
  
  if(message)
  {
    return(
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="warning">{message}</Alert>
        {
          !currentUser.user_info_exists && 
          <Button className="click-me" onClick={()=>redirectToNewPage(`https://leetcode.com/${currentUser.username}/`)}>
            Click Here
          </Button>
        }
      </Box>
    )
  }

  return (
    <>
      {recommendations?.map((group, groupIndex) => (
          <Box key={groupIndex} sx={{ marginTop: 3 }}>
            <Typography
              sx={{
                  color: 'grey', // Sets the text color to grey
                  borderColor: 'grey', // Sets the border color to grey
                  borderWidth: '1px', // Sets the border width to 1px
                  borderBottom: '1px solid #e0e0e0',
                  borderTop: '1px solid #e0e0e0',
                  padding: '10px 0px 10px 20px', // Adds some vertical padding for visual spacing
              }}
              >
              {group.title}
              </Typography>
            <Grid container spacing={2} sx={{ marginTop: 2, marginBottom: 2}}>
              {group.list.map((problem, index) => (
                  <Grid item xs={12} key={index}>
                      <Card 
                      variant="outlined" 
                      sx={{ 
                          display: 'flex', 
                          marginLeft: 1,
                          marginRight: 1, 
                          alignItems: 'flex-start', // Ensure alignment to the start
                          '&:hover': {
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Light shadow effect on hover
                          transform: 'translateY(-2px)', // Lift up effect
                          } 
                      }}
                      >
                      <CardActionArea 
                          onClick={() => handleCardClick(problem)} 
                          sx={{ 
                          "&.Mui-selected": { outline: 'none' }, "&:focus": { outline: 'none' },
                          display: 'flex', 
                          flexGrow: 1, 
                          alignItems: 'flex-start', // Ensure alignment to the start
                          padding: 1,
                          width: '100%', // Ensure it takes up the full width of the card
                          }}
                      >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mr: 2, width: '100%' }}> {/* Ensure icon and text alignment */}
                          <AssignmentIcon sx={{ fontSize: 20, mr: 2 }} /> {/* Icon with right margin */}
                          <Typography variant="body2" sx={{ flexShrink: 1, textAlign: 'left' }}>
                              {formatProblemString(problem)}
                          </Typography>
                          </Box>
                      </CardActionArea>
                      </Card>
    
                  </Grid>
              ))}
            </Grid>
          </Box>
          ))}
    </>
  );
}

export default Recommendations;
