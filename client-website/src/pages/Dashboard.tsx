import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { setRecommendation } from "../features/user/userSlice";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles } from "@mui/material";
import { Box } from "@mui/system";

const SESSION_LIMIT = 2

function getTimeDiffInMinutes(timestamp1 : any, timestamp2 : any)
{
    if(!timestamp1) return SESSION_LIMIT + 1
    const diffMilliseconds = timestamp2 - timestamp1;
    return diffMilliseconds / (1000 * 60);
}

const styles = {
  root: {
    width: '100%',
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

  function getRecommendation()
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
    dispatch(setRecommendation({
      updateTs: Date.now(),
      data : data
    }))
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
  <>
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
        <Paper style={styles.root}>
          <Table style={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat (g)</TableCell>
                <TableCell align="right">Carbs (g)</TableCell>
                <TableCell align="right">Protein (g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.problems.map((problem, problemId) => (
                <TableRow key={problemId}>
                  <TableCell component="th" scope="row">
                    {problem.problemId}
                  </TableCell>
                  <TableCell align="right">{problem.difficultyLevel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        </div>
      </Box>
    ))
  }
  </>

)

}

export default (Dashboard);;
