// src/components/WelcomePage.tsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import FeatureCard from '../components/FeatureCard';

const features = [
  { title: 'Personalized Recommendations', description: 'Get problem recommendations based on your history and performance.' },
  { title: 'Diverse Problem Sets', description: 'Explore a wide range of problems to challenge various skill levels.' },
  { title: 'Progress Tracking', description: 'Monitor your progress and improve your problem solving skills over time.' }
];

const Welcome: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1}}>
      <Box sx={{ textAlign: 'center', p: 4 }}>
        {/* <img src={logo} alt="eLeetNavigator Logo" style={{ maxWidth: '150px'}} /> */}
        <Typography variant="h3" gutterBottom>
          eLeetNavigator
        </Typography>
        <Typography variant="h6">
          Your personalized path to mastering coding challenges.
        </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <FeatureCard title={feature.title} description={feature.description} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Welcome;
