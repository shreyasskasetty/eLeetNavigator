import { Alert, Box, Card, CardActionArea, CircularProgress, Grid, Typography, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { formatProblemString } from "../utility";


export default function RecentView({currentUser} : any){
    const [recents, setRecents] = useState<{ accepted: boolean, memory: number, memory_beats : number, problem_id : string, runtime : number, time_beats: number }[]>([]);
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

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

    async function loadRecents(user_id:string) {
        setIsLoading(true)
        const message = {
          type: "GET_RECENTS",
          user_id: user_id
        }
        chrome.runtime.sendMessage(message, (response)=>{
          console.log("Getting response from service worker for recents")
          console.log(response);
          if(response.status)
          {
            console.log(typeof response.data)
            setRecents(response.data)
            setMessage("")
            setIsLoading(false)
          }
          else{
            setMessage("Sorry for the incovience. Unable to get recents rn")
            setIsLoading(false)
          }
        })
    }

    useEffect(()=>{
        if(recents.length === 0)
        {
            console.log("loading recents")
            loadRecents(currentUser.user_id)
        }
    },[])

    if (isLoading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        );
      }
      
      if(message)
      {
        return(
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Alert severity="warning">{message}</Alert>
          </Box>
        )
      }
    return (
        <Box sx={{
            marginTop : '60px',
          }}>
                <Box sx={{ marginTop: 3 }}>
                  <Typography
                    sx={{
                        color: 'black', // Sets the text color to grey
                        borderColor: 'black', // Sets the border color to grey
                        borderWidth: '1px', // Sets the border width to 1px
                        borderBottom: '1px solid #e0e0e0',
                        borderTop: '1px solid #e0e0e0',
                        padding: '10px 0px 10px 20px', // Adds some vertical padding for visual spacing
                        fontWeight: 'bold',
                    }}
                    >
                    {"RECENTS"}
                    </Typography>
                   <Grid container spacing={2} sx={{ marginTop: 2, marginBottom: 2 }}>
                        {recents.map((problem, index) => (
                            <Grid item xs={12} key={index}>
                            <Card
                                variant="outlined"
                                sx={{
                                display: 'flex',
                                marginX: 1,
                                alignItems: 'flex-start', // Ensure alignment to the start
                                '&:hover': {
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Light shadow effect on hover
                                    transform: 'translateY(-2px)', // Lift up effect
                                }
                                }}
                            >
                                <CardActionArea
                                onClick={() => handleCardClick(problem.problem_id)}
                                sx={{
                                    "&.Mui-selected": { outline: 'none' },
                                    "&:focus": { outline: 'none' },
                                    display: 'flex',
                                    flexGrow: 1,
                                    alignItems: 'flex-start', // Ensure alignment to the start
                                    padding: 1,
                                    width: '100%', // Ensure it takes up the full width of the card
                                }}
                                >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                    <AssignmentIcon sx={{ fontSize: 20, mr: 2 }} /> {/* Icon with right margin */}
                                    <Typography variant="body2">
                                        {formatProblemString(problem.problem_id)} 
                                    </Typography>
                                    </Box>
                                    <Chip
                                    label={problem.accepted ? 'Accepted' : 'Not Accepted'}
                                    color={problem.accepted ? 'success' : 'error'}
                                    size="small"
                                    />
                                </Box>
                                </CardActionArea>
                            </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
          </Box>
    )
}