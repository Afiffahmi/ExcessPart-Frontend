import { LockOutlined } from "@mui/icons-material";
import {
  Sheet,
  Box,
  Avatar,
  Typography,
  Input,
  Button,
  Grid,
  Card,

} from "@mui/joy";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [staff, setStaff] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async () => {
    if (staff !== "" && password !== "") {
        const url = "/api/register.php";
        const headers = {
          "Content-Type": "application/json",
          "Accept": "application/json",
        };
        const data = {
          StaffID: staff,
          Password: password,
          Name: name,
        };
        console.log(data);
  
        const response = await axios.post(url, JSON.stringify(data), {
          headers: headers,
        });
        console.log(response.data);
      }
  };

  return (
    <>
      <Sheet sx={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        width: '100vw',
        top: '50%',

      }}>
    
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "40%",
            p: 4,
            borderRadius: "lg",
            shadow: "xl",
          }}
        >
            
            
            <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography level="h3">Register</Typography>
          

          <Box sx={{ mt: 1 }}>
          <Input
            type="text"
                placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Input
            type="text"
                placeholder="Staff ID"
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Input
            type="password"
                placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="soft"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid >
                <Link to="/login">Already have an account? Login</Link>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Sheet>
    </>
  );
};

export default Login;