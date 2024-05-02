import * as React from 'react';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import { Link } from 'react-router-dom';


import CategoryIcon from '@mui/icons-material/Category';
import CheckIcon from '@mui/icons-material/Verified';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import { Stack,Sheet,Chip } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

export default function Navigation() {
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleItemClick = (item:any) => {
    setSelectedItem(item);
  };


  return (<Sheet>
    <List
      size="sm"
      sx={{ '--ListItem-radius': 'var(--joy-radius-sm)', '--List-gap': '4px' }}
    >
      <ListItem nested>
        <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
          Browse
        </ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            '& .JoyListItemButton-root': { p: '8px' },
          }}
        >
          <ListItem>
            
            <ListItemButton selected={selectedItem === 'excess'}
              onClick={() => handleItemClick('excess')}>
            <Link to="/excess" style={{ textDecoration: 'none' }}>
              <Stack direction="row" spacing={1}>
              <ListItemDecorator>
                <CategoryIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Excess Parts</ListItemContent>
              </Stack>
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => handleItemClick('regex')}>
            
            <ListItemButton selected={selectedItem === 'regex'}
              >
            <Link to="/regex" style={{ textDecoration: 'none' }}>
              <Stack direction="row" spacing={1}>
              <ListItemDecorator>
                <AddIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Register Excess Parts</ListItemContent>
              </Stack>
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton selected={selectedItem === 'disposeHistory'}
              onClick={() => handleItemClick('disposeHistory')}>
              <ListItemDecorator sx={{ color: 'neutral.500' }}>
                <DeleteIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Dispose History</ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
            selected={selectedItem === 'consumeList'}
            onClick={() => handleItemClick('consumeList')}>
              <Link to="/consume" style={{ textDecoration: 'none' }}>
                <Stack direction="row" spacing={1}>
              <ListItemDecorator sx={{ color: 'neutral.500' }}>
                <ShoppingCartCheckoutIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Consume list</ListItemContent>
              </Stack>
              </Link>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
            selected={selectedItem === 'consumeHistory'}
            onClick={() => handleItemClick('consumeHistory')}>
              <Link to="/history" style={{ textDecoration: 'none' }}>
                <Stack direction="row" spacing={1}>
              <ListItemDecorator sx={{ color: 'neutral.500' }}>
                <CheckIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Consume History</ListItemContent>
              </Stack>
              </Link>
            </ListItemButton>
          </ListItem>


          <ListItem>
            <ListItemButton
            selected={selectedItem === 'database'}
            onClick={() => handleItemClick('database')}>
            <Link to="/database" style={{ textDecoration: 'none' }}>
              <Stack direction="row" spacing={1}>
              <ListItemDecorator sx={{ color: 'neutral.500' }}>
                <StorageRoundedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Database</ListItemContent>
              </Stack>
             
              </Link>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
      
    </List>
    </Sheet>
  );
}