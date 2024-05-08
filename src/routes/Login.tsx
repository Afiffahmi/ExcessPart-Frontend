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
  ListItemDecorator,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [staff, setStaff] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (staff !== "" && password !== "") {
      const url = "/api/login.php";
      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
      const data = {
        StaffID: staff,
        Password: password,
      };

      const response = await axios.post(url, JSON.stringify(data), {
        headers: headers,
      });
      if(response.data.error){

      }else{
        localStorage.setItem("token", JSON.stringify(response.data));
        navigate("/excess", { replace: true });
      }
    }
  };

  return (
    <>
      <Sheet
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          width: "100vw",
          top: "50%",
          height: "100vh", // Set height for full viewport coverage
          position: "relative", // Required for background image positioning
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1, // Place background image behind content
            backgroundImage: `url()`, // Replace with your image path
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover", // Adjust as needed (e.g., "contain")
            backgroundPosition: "center", // Adjust as needed
          }}
        />
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
            p: 4,
            borderRadius: "lg",

          }}
        >
          <ListItemDecorator>
            <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
              <LockOutlined />
            </Avatar>
            <Typography level="h2">Excess Part Control System</Typography>
          </ListItemDecorator>

          <Typography level="h4">Login</Typography>
          <Box sx={{ mt: 1 }}>
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
              onClick={handleLogin}
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid>
                <Link to="/register">Don't have an account? Register</Link>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Sheet>
    </>
  );
};

export default Login;
