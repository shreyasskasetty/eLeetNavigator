import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { setRecommendation } from "../features/user/userSlice";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles, Card, CardContent } from "@mui/material";
import { Box, display } from "@mui/system";

const SESSION_LIMIT = 20
const BASE_URL = 'http://localhost:3000/'
const RECOMMENDATION_URL = 'user/decorRecommendation'


function getTimeDiffInMinutes(timestamp1 : any, timestamp2 : any)
{
    if(!timestamp1) return SESSION_LIMIT + 1
    const diffMilliseconds = timestamp2 - timestamp1;
    return diffMilliseconds / (1000 * 60);
}

const styles = {
  root: {
    width: '80%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
};

function Dashboard() {
  const dispatch = useDispatch()
  const recommendation = useSelector((state: any) => state.user.recommendation); 
  const userInfo =  useSelector((state: any) => state.user.userInfo); 


  async function loadRecommendation(user_id : any){
    try {
          const response = await fetch(`${BASE_URL}${RECOMMENDATION_URL}?user_id=${user_id}`, {
              method: 'GET',
              headers: {
              'Content-Type': 'application/json',
              }
          })
          console.log(`Got recommendations Status-Code ${response.status}`)
          if(response.status == 200)
          {
              const data = await response.json()
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
    const leet_problem_url = `https://leetcode.com/problems/${problemId}`
    window.open(leet_problem_url, '_blank')
  };

  useEffect(()=>{
    let shouldRefresh = recommendation.data ? false : true
    shouldRefresh = getTimeDiffInMinutes(recommendation.updateTs , Date.now()) > SESSION_LIMIT
    if(shouldRefresh)
    {
      getRecommendation()
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

return (
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
  <Typography variant="h4" sx={{ marginTop: '20px', marginBottom: '20px', color: 'darkblue', fontWeight: 'bold' }}>
    Your Personalized Recommendations
  </Typography>
  {recommendation?.data.map((group: any, groupIndex: any) => (
    <Card key={groupIndex} sx={{ width: '90%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
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
              {group.problems.map((problem: any, problemId: any) => (
                <TableRow key={problemId} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#efefef' } }} onClick={() => handleRowClick(problem.problemId)}>
                  <TableCell component="th" scope="row">
                    {problem.problemId}
                  </TableCell>
                  <TableCell align="right">{problem.difficultyLevel}</TableCell>
                  <TableCell align="right">{problem.acceptanceRate}</TableCell>
                  <TableCell align="right">{problem.submissions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </CardContent>
    </Card>
  ))}
</Box>
);

}

export default (Dashboard);;
