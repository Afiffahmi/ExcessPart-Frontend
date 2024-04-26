import React, { useState, useEffect } from 'react';
import {Sheet ,Card, Divider, Stack,Table,List,ListItem,ListItemDecorator,CardActions,Button,Alert } from '@mui/joy';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import ErrorIcon from '@mui/icons-material/Error';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface Confirmation {
  itemNo: string;
  itemName: string;
  qty: string;
  location: string;
  excessDate: string;
}

interface Invalid {
  itemNo: string;
}

export default function InteractiveCard({ data,invalid,setTransaction,setFormData,setData}: any) {
  const [confirmation, setConfirmation] = useState<Confirmation[]>([]);
  const [invalidData, setInvalidData] = useState<Invalid[]>([]);
  useEffect(() => {
    // Set the confirmation state when the component mounts or when the data prop changes
    setConfirmation(data);
    setInvalidData(invalid);
  }, [data,invalid]); // Only re-run the effect if data changes

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:8080/EPMS/matecon-data/regexcess.php', confirmation);
       if (response.data.message) {
        toast.success(response.data.message, {
          position: "bottom-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      } else if (response.data.error) {
        toast.error(response.data.error, {
          position: "bottom-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
// Clear form after successful submission
        setFormData({
          excessParts: [
            {
              itemNo: "",
              qty: "",
              excessDate: "",
              pickingID: "",
              location: "",

            },
          ],
        });

         // Simulating a 2-second delay
      };

      setInvalidData([]);
        setData([]);
        setTransaction(false);
        return;
      
    }catch(e){
      console.log(e);
    }
  }

  return (
    <Sheet>

    <motion.div
      transition={{
        ease: 'linear',
        duration: 2,
        x: { duration: 1 }
      }}
    >

      <Card
        size="sm"
        orientation="horizontal"
        variant="soft"
        color="primary"
       
      >
        <CardContent>
          <Stack direction="row">
            <ListItemDecorator>
            <ErrorIcon />
            </ListItemDecorator>
            <Typography level="h3" id="card-description">
              Confirmation
            </Typography>
          </Stack>

          <Divider inset="none" />

          {confirmation?.length > 0 &&
            confirmation.map((item: any, index: number) => (
              <Table>
                <tbody key={index}>
                  <td>
                <Typography level="body-sm" aria-describedby="card-description">
                  {item?.itemNo}
                </Typography></td> <td>
                <Typography level="body-sm" aria-describedby="card-description">
                  {item?.itemName}
                </Typography></td>
                <td>
                <Typography level="body-sm" aria-describedby="card-description">
                  {item?.location}
                </Typography></td>
                <td>
                <Chip variant="outlined" color="primary" size="sm" sx={{ pointerEvents: 'none' }}>
                  Quantity: {item?.qty} pcs
                </Chip></td>
                <td>
                <Typography level="body-sm" aria-describedby="card-description">
                  {item?.excessDate}
                </Typography></td>
                </tbody>
              </Table>
            ))}

          
          
          <CardActions>
            <form onSubmit={handleSubmit}>
              <Stack direction="row" spacing={130} sx={{alignContent:"flex-start"}}>
              <Typography level="title-lg" sx={{ mr: 'auto' }}>
            {confirmation.length}{' '}
            <Typography fontSize="sm" textColor="text.tertiary">
               items
            </Typography>
          </Typography>
          <Button type="submit" endDecorator={<KeyboardArrowRight />} sx={{alignSelf:"center",alignItems:"center"}}>Submit</Button>
              </Stack>
          
          </form>
        </CardActions>
        <Divider inset="none" />
        {invalidData?.length > 0 ? (<Card variant="soft" color='primary' sx={{width:"500px", alignSelf:"center"}}>
        <Alert color='danger' variant='solid' size='sm'>Invalid Item Number</Alert>
        </Card>) : null}
          <List
            size="sm"
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              mx: 'calc(-1 * var(--ListItem-paddingX))',
            }}
          >
          {invalidData?.length > 0 && invalidData.map((item: any, index: number) => (
            
            <ListItem key={index}>
              <ListItemDecorator>
                <CloseIcon color="danger"/>
                
              </ListItemDecorator>
              {item?.itemNo}
            </ListItem>
          ))}
          </List>
        </CardContent>
        
      </Card>
    </motion.div>
    </Sheet>
  );
}
