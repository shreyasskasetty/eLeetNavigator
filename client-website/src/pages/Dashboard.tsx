import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { setRecommendation } from "../features/user/userSlice";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles, Card,LinearProgress, CardContent } from "@mui/material";
import { Box, display } from "@mui/system";
import { toTitleCase, normalizeDashes, convertDifficultyLevelToColor } from "../utility";
import { blue, green, red } from '@mui/material/colors';
import { useState } from "react";
import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import api from "../api/api";

const SESSION_LIMIT = 1
const BASE_URL = 'http://localhost:3000/'
const RECOMMENDATION_URL = 'user/decorRecommendation'


function getTimeDiffInMinutes(timestamp1 : any, timestamp2 : any)
{
    if(!timestamp1) return SESSION_LIMIT + 1
    const diffMilliseconds = timestamp2 - timestamp1;
    return diffMilliseconds / (1000 * 60);
}

const stats = {
  problemsSolved: 150,
  totalAttempts: 300,
  successRate: 50
};


function Dashboard() {
  const dispatch = useDispatch()
  const recommendation = useSelector((state: any) => state.user.recommendation); 
  const userInfo =  useSelector((state: any) => state.user.userInfo); 
  const [userStats, setUserStats] = useState({
    'loaded' : false,
    'rank' : "",
    'total' : 0,
    'easy' : 0,
    'easy_total' : 790,
    'medium' : 0,
    'medium_total' : 1646,
    'hard' : 0,
    'hard_total' : 698
  })

  const [expandedState, setExpandedState] = useState<any>({});

  const toggleExpansion = (groupIndex: any) => {
    setExpandedState((prevState: any) => ({
      ...prevState,
      [groupIndex]: !prevState[groupIndex]
    }));
  };

  async function loadRecommendation(user_id : any){
    try {
          const queryParams = {
            user_id : user_id
          }
          const response = await api.getRecommendation(queryParams)
          console.log(`Got recommendations Status-Code ${response.status}`)
          console.log(response)
          if(response.status == 200)
          {
              const data = await response.data
              console.log(data)
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

  async function getUserStats(user_id:string) {
    try {
      const queryParams = {
        user_id : user_id
      }
      const response = await api.getUserStats(queryParams)
      const stats = response.data
      console.log(stats)
      let userStats = {
        'loaded' : true,
        'rank' : "",
        'total' : 0,
        'easy' : 0,
        'easy_total' : 0,
        'medium' : 0,
        'medium_total' : 0,
        'hard' : 0,
        'hard_total' : 0
      }
      userStats['rank'] = stats.rank
      userStats['total'] = stats.total
      userStats['easy'] = stats.easy 
      userStats['easy_total'] = stats.easy_total 
      userStats['medium'] = stats.medium 
      userStats['medium_total'] = stats.medium_total 
      userStats['hard'] = stats.medium 
      userStats['hard_total'] = stats.medium_total 
      console.log(userStats)
      setUserStats(userStats)
    } catch (error) {
      console.log(error)
    }
  }

  async function getRecommendation()
  {
    const user_id = userInfo.user_id
    console.log(user_id)
    try {
      const response = await loadRecommendation(user_id)
      if(response.status){
        dispatch(setRecommendation({
          updateTs: Date.now(),
          data : response.data
        }))
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleRowClick = (problemId: string)=>{
    const leet_problem_url = `https://leetcode.com/problems/${normalizeDashes(problemId)}`
    window.open(leet_problem_url, '_blank')
  };

  useEffect(()=>{
    let shouldRefresh = recommendation.data ? false : true
    shouldRefresh = getTimeDiffInMinutes(recommendation.updateTs , Date.now()) > SESSION_LIMIT
    if(shouldRefresh)
    {
      getRecommendation()
    }

    if(!userStats.loaded)
    {
      getUserStats(userInfo.user_id)
    }
  },[])

  if(!recommendation.data)
  {
    return (
      <div>
        No Recommendation at this point
      </div>
    )
  }

  const calculateProgressColor = (percentage: any) => {
    if (percentage < 33) return red[500];
    if (percentage < 66) return blue[500];
    return green[500];
  };

return (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', p: 3 }}>
      {/* Stats Card */}
      <Card sx={{ width: '25%', minHeight: 500,position: 'fixed', top: '21%', left: 50, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            User Stats
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Total Solved</Typography>
            <Typography>{userStats?.total ? userStats.total : 0 }</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Easy Solved</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinearProgress variant="determinate" value={(userStats.easy / userStats.easy_total) * 100} sx={{ flexGrow: 1, mr: 1, height: 10, borderRadius: 5, backgroundColor: '#eee' }} />
              <Typography variant="body2">{`${userStats.easy} / ${userStats.easy_total}`}</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Medium Solved</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinearProgress variant="determinate" value={(userStats.medium / userStats.medium_total) * 100} sx={{ flexGrow: 1, mr: 1, height: 10, borderRadius: 5, backgroundColor: '#eee' }} />
              <Typography variant="body2">{`${userStats.medium} / ${userStats.medium_total}`}</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Hard Solved</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinearProgress variant="determinate" value={(userStats.hard / userStats.hard_total) * 100} sx={{ flexGrow: 1, mr: 1, height: 10, borderRadius: 5, backgroundColor: '#eee' }} />
              <Typography variant="body2">{`${userStats.hard} / ${userStats.hard_total}`}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Box sx={{ flex: 1, maxWidth: '60%', ml: '25%', mt: 2 }}>
        <Typography variant="h4" sx={{ marginBottom: '20px', color: '#0071A1', fontWeight: 'bold' }}>
          Your Personalized Recommendations
        </Typography>
        {recommendation?.data.map((group: any, groupIndex: any) => (
          <Card key={groupIndex} sx={{ marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'black', borderBottom: '1px solid #e0e0e0', padding: '10px 20px', fontWeight: 'bold' }}>
                {group.title}
              </Typography>
              <Paper sx={{ marginTop: '10px' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Problem</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Difficulty</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acceptance Rate</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Submissions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(expandedState[groupIndex] ? group.problems : group.problems.slice(0, 3)).map((problem:any, problemId:any) => (
                      <TableRow key={problemId} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#efefef' } }} onClick={() => handleRowClick(problem.problemId)}>
                        <TableCell component="th" scope="row">
                          {toTitleCase(problem.problemId)}
                        </TableCell>
                        <TableCell align="right" sx={{ color: convertDifficultyLevelToColor(problem.difficultyLevel) }}>
                          {problem.difficultyLevel}
                        </TableCell>
                        <TableCell align="right">{problem.acceptanceRate}</TableCell>
                        <TableCell align="right">{problem.submissions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'initial', mt: 1 }}>
                <Typography variant="body2">
                  {expandedState[groupIndex] ? 'Less Problems' : 'More Problems'}
                </Typography>
                <IconButton onClick={() => toggleExpansion(groupIndex)} size="large">
                  {expandedState[groupIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
);

}

export default (Dashboard);;
