import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import Paper from '@mui/material/Paper';
import HomeView from './HomeView';

function RecentView() {
  return <div>Recent View</div>;
}

function ProfileView() {
  return <div>Profile View</div>;
}

export default function BottomNavbar({currentUser}:any) {
  const [value, setValue] = React.useState(0);

  let contentView;
  switch (value) {
    case 0:
      contentView = <HomeView currentUser={currentUser}/>;
      break;
    case 1:
      contentView = <RecentView />;
      break;
    case 2:
      contentView = <ProfileView />;
      break;
    default:
      contentView = <div>Page not found</div>;
  }

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      {contentView}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} sx={{ "&.Mui-selected": { outline: 'none' }, "&:focus": { outline: 'none' } }}/>
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} sx={{ "&.Mui-selected": { outline: 'none' }, "&:focus": { outline: 'none' } }}/>
          <BottomNavigationAction label="Profile" icon={<PersonIcon />} sx={{ "&.Mui-selected": { outline: 'none' }, "&:focus": { outline: 'none' } }}/>
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
