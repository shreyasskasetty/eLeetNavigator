import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { setRecommendation } from "../features/user/userSlice";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles } from "@mui/material";
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
    const data = [
      {
        title : "A",
        problems : [
          {
            problemId : "ABC",
            difficultyLevel : "Hard"
          }
        ]
      },
      {
        title : "B",
        problems : [
          {
            problemId : "ABC",
            difficultyLevel : "Hard"
          }
        ]
      }
    ]
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
        Dashboard
      </div>
    )
  }

return (
  <Box sx={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    {
    recommendation?.data.map((group : any, groupIndex : any)=>(
      <Box key={groupIndex}>
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
        {group.title}
        </Typography>
        <div >
        <Paper style={styles.root} >
          <Table style={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell>Problem</TableCell>
                <TableCell align="right">Difficulty</TableCell>
                <TableCell align="right">Accepatance Rate</TableCell>
                <TableCell align="right">Submissions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.problems.map((problem, problemId) => (
                <TableRow key={problemId}>
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
        </div>
      </Box>
    ))
  }
  </Box>

)

}

export default (Dashboard);;
