import { Card, CardContent, Typography } from '@mui/material';

const FeatureCard : React.FC = ({ title, description }: any) => {
  return (
    <Card raised sx={{ minHeight: 200, maxWidth: 500, m: 2 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;