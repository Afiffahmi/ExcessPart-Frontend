import React, { useState, useEffect } from 'react';
import { Sheet, Table,MenuButton,Dropdown,Box,Menu,MenuItem,ListDivider,Typography,Avatar,Button } from '@mui/joy';

interface ExcessData {
  itemNo: string;
  itemName: string;
  qty: string;
  excessDate: string;
  pickingID: string;
  location: string;

}

function App(): JSX.Element {
  const [excessData, setExcessData] = useState<ExcessData[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/EPMS/matecon-data/excessData.php`);
      const data = await response.json();
      setExcessData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <h2>Excess</h2>
      <Sheet>
        <Table>
          <thead>
            <tr>
              <th>Item No</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Excess Date</th>
              <th>Location</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {excessData.map((dataItem, index) => (
              <tr key={index}>
                <td>{dataItem.itemNo}</td>
                <td>{dataItem.itemName}</td>
                <td>{dataItem.qty}</td>
                <td>{dataItem.excessDate}</td>
                <td>{dataItem.location}</td>
                <td><Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
            sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
          >
            <Button
              type="submit"
              variant="outlined"
              size="sm"
              color="danger"
            >
              Action
            </Button>
            
          </MenuButton>
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
            
              Search plan lot
            </MenuItem>
            <ListDivider />
            <MenuItem>
            
              Dispose
            </MenuItem>
          </Menu>
        </Dropdown></td>
              
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </div>
  );
}

export default App;
