
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

function Navbar() {
  const closePopUp = ()=>{
    window.close();
  }
  return (
    <AppBar sx={{backgroundColor: 'white', boxShadow:"inherit"}} style={{ width: '100%' , zIndex:10}} position="fixed">
      <Container maxWidth="xl" style={{ maxWidth: '100%' }}>
        <Toolbar disableGutters>
            <IconButton sx={{ "&.Mui-selected": { outline: 'none' }, "&:focus": { outline: 'none' } }}>
                <img src="logo2.png" alt="Custom Icon" style={{ width: 24, height: 24 }} />
            </IconButton>
            <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                mr: 2,
                display: {sx: 'flex', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'black',
                textDecoration: 'none',
                }}
            >
            eLeetNavigator
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <IconButton sx={{color:'grey', "&.Mui-selected": { outline: 'none' }, "&:focus": { outline: 'none' }}} aria-label="open settings" >
                <SettingsIcon />
            </IconButton>

            <IconButton sx={{color:'grey', "&.Mui-selected": { outline: 'none' }, "&:focus": { outline: 'none' }}} aria-label="close" onClick={()=>{closePopUp()}}>
                <CloseIcon />
            </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
