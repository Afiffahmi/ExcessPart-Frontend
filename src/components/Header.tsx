import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Avatar from '@mui/joy/Avatar';

import Tooltip from '@mui/joy/Tooltip';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import Button from '@mui/joy/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';


function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="primary" />;
  }

  return (
    <Tooltip title="Change theme" variant="outlined">
      <IconButton
        id="toggle-mode"
        size="sm"
        variant="plain"
        color="neutral"
        sx={{ alignSelf: 'center' }}
        onClick={() => {
          if (mode === 'light') {
            setMode('dark');
          } else {
            setMode('light');
          }
        }}
      >
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login',{replace:true});
  };

  const id = (localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as string) : ""  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'space-between',
      }}
    >


      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <ColorSchemeToggle />
        <Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
            sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
          >
            <Avatar
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQutRuy3lhOPLjXxT0a0xzkgJd5NP3DaWWdyTu6j-UkYA&s"
           
              sx={{ maxWidth: '32px', maxHeight: '32px' }}
            />
            
          </MenuButton>
          <Typography level="title-sm" textColor="text.primary">
                    {id.name}
                  </Typography>
          <Menu
            placement="bottom-end"
            size="sm"
            sx={{
              zIndex: '99999',
              p: 1,
              gap: 1,
              '--ListItem-radius': 'var(--joy-radius-sm)',
            }}
          >
            <MenuItem>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQutRuy3lhOPLjXxT0a0xzkgJd5NP3DaWWdyTu6j-UkYA&s"
             
                  sx={{ borderRadius: '50%' }}
                />
                <Box sx={{ ml: 1.5 }}>
                  <Typography level="title-sm" textColor="text.primary">
                    {id.name}
                  </Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    {id.StaffID}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <ListDivider />
 
            <MenuItem onClick={() => handleLogout()}>
            
              <Button variant="plain" >
                
               <LogoutRoundedIcon /> 

              Log out</Button>
              
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}