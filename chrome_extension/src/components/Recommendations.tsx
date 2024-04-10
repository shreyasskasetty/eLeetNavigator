import { Card, CardActionArea, Typography, Grid, Box } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment'; // A generic icon for demonstration

const problems = [
  "Array Partition I",
  "Best Time to Buy and Sell Stock",
  "Contains Duplicate",
  "Product of Array Except Self",
  "Rotate Image",
  // Add more problems as needed
];

function Recommendations() {
  const handleCardClick = (problemName: any) => {
    console.log(`Clicked on: ${problemName}`);
    // Implement your click handling logic here
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: 2 }}>
      {problems.map((problem, index) => (
        <Grid item xs={12} key={index}>
            <Card 
            variant="outlined" 
            sx={{ 
                display: 'flex', 
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
                    {problem}
                </Typography>
                </Box>
            </CardActionArea>
            </Card>

        </Grid>
      ))}
    </Grid>
  );
}

export default Recommendations;
