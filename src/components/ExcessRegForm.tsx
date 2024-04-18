import React, { useState } from "react";
import Input from "@mui/joy/Input";
import axios from "axios";
import { Button, Stack, Typography, Divider, Table, Sheet, Box,Radio } from "@mui/joy";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Receipt from '../components/Receipt'
import { motion } from 'framer-motion';
import Grid from '@mui/joy/Grid';

import Add from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import InventoryIcon from '@mui/icons-material/Inventory';
import CloseIcon from '@mui/icons-material/Close';

interface ExcessPart {
  itemNo: string;
  qty: string;
  excessDate: string;
  pickingID: string;
  location: string;

}

interface Data {
  data: [];
  invalid: [];
}

const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState<{ excessParts: ExcessPart[] }>({
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
  const [open, setOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Data>({ data: [], invalid: []});
  const [transaction, setTransaction] = React.useState<boolean>(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
    key: keyof ExcessPart
  ) => {
    const { value } = e.target;
    const updatedParts = [...formData.excessParts];
    updatedParts[i][key] = value;
    setFormData({ ...formData, excessParts: updatedParts });
  };

  const addPart = () => {
    setFormData({
      ...formData,
      excessParts: [
        ...formData.excessParts,
        {
          itemNo: "",
          qty: "",
          excessDate: "",
          pickingID: "",
          location: "",
        },
      ],
    });
  };

  const removePart = (i: number) => {
    const updatedParts = [...formData.excessParts];
    updatedParts.splice(i, 1);
    setFormData({ ...formData, excessParts: updatedParts });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/EPMS/matecon-data/excesstransaction.php",
        formData.excessParts
      );
      console.log(response.data);
      setData(response.data);

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

        setTransaction(true);
        return;
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

        return;
      }
    } catch (error) {
      // Error handling
      console.error("Error:", error);
    }
  };

  return (
   
    <Sheet>
       <Grid
  container
  direction="column"
  justifyContent="center"
  alignItems="center"
>
      <Typography level={"h2"} startDecorator={<InventoryIcon color="warning"/>}>Excess Registration Form</Typography>
      <form onSubmit={handleSubmit}>
        <ToastContainer
          position="bottom-right"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
        />
        <Typography >Register the excess part here.</Typography>
        <Divider />
        <Stack spacing={3}>
          <Table>
            <thead>
              <tr>
                <td>Part No</td>
                <td>Quantity</td>
                <td>Excess Date</td>
                <td>Picking ID</td>
                <td>Location</td>
              </tr>
            </thead>
            <tbody>
              {formData.excessParts.map((part, index) => (
                <tr key={index}>
                  <td>
                    <Input
                      type="text"
                      value={part.itemNo}
                      disabled = {transaction}
                      onChange={(e) => handleChange(e, index, "itemNo")}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={part.qty}
                      disabled = {transaction}
                      onChange={(e) => handleChange(e, index, "qty")}
                    />
                  </td>
                  <td>
                    <Input
                      type="date"
                      value={part.excessDate}
                      disabled = {transaction}
                      onChange={(e) => handleChange(e, index, "excessDate")}
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      value={part.pickingID}
                      disabled = {transaction}
                      onChange={(e) => handleChange(e, index, "pickingID")}
                    />
                  </td>
                  <td>
                    <Stack direction="row" spacing={2}>
                      <Radio
                        value="S2"
                        checked={part.location === "S2"}
                        onChange={(e) => handleChange(e, index, "location")}
                        disabled={transaction}
                      />
                      <Typography>S2</Typography>
                      <Radio
                        value="S4"
                        checked={part.location === "S4"}
                        onChange={(e) => handleChange(e, index, "location")}
                        disabled={transaction}
                      />
                      <Typography>S4</Typography>
                      <Radio
                        value="S7"
                        checked={part.location === "S7"}
                        onChange={(e) => handleChange(e, index, "location")}
                        disabled={transaction}
                      />
                      <Typography>S7</Typography>
                    </Stack>
                  </td>
                  <td>
                    <Button
                      type="button"
                      startDecorator={<CloseIcon />}
                      size="sm"
                      color="danger"
                      onClick={() => removePart(index)}
                      disabled = {transaction}
                    />
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Stack direction="row" spacing={5}>
            <Button
              type="button"
              startDecorator={<Add />}
              variant="soft"
              size="sm"
              sx={{ width: "50%" }}
              onClick={addPart}
              disabled = {transaction}
            >
              Add Excess Part
            </Button>
            <Button
              type="submit"
              endDecorator={<NavigateNextIcon />}
              variant="soft"
              size="sm"
              sx={{ width: "50%" }}
              color="success"
              disabled = {transaction}
            >
              Check
            </Button>
          </Stack>
        </Stack>
      </form>
      <Box sx={{ height: 50 }} />
      {transaction ?<motion.div
  transition={{
    ease: "linear",
    duration: 2,
    x: { duration: 1 }
  }}
> <Receipt data = {data.data} invalid = {data.invalid} setData = {setData} setTransaction = {setTransaction} setFormData={setFormData}/></motion.div> : null}
      </Grid>
    </Sheet>
    
  );
};

export default FormComponent;
