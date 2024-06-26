import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import List from "@mui/joy/List";
import Sheet from "@mui/joy/Sheet";

import Layout from "../components/Layout";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { ListItemContent, Typography } from "@mui/joy";
import { Divider } from "@mui/joy";
import { useLocation } from "react-router-dom";

import {FormLabel } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Input from "@mui/joy/Input";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ConsumePart {
  itemNo: string;
  itemName: string;
  location: string;
  excessQty: string;
  excessDate: string;
  planlot: string;
  openqty: string;
  startDate: string;
}

export default function TeamExample() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [consume, setConsume] = React.useState<ConsumePart[]>([]);
  const [date, setDate] = React.useState("");
  const [qty, setQty] = React.useState("");
  const location = useLocation();
  const item = location.state;

  React.useEffect(() => {
    setConsume(item);
  }, [item]);

  const handleSubmit = async () => {
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0 || Number(qty) > Number(item.openqty)){
      toast.error(`Invalid Consume Quantity`, {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      setOpen(false);
      return;
    } else if (!date || date === "") {
      toast.error("Invalid Consume Date", {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      setOpen(false);
      return;
    } else{

      console.log(qty);
      console.log(consume)
      const updatedConsume = [
        {
          ...consume,
          consumeQty: qty,
          consumeDate: date,
        },
      ];
      
      try {
        const response = await axios.post(
          "/api/regconsume.php",
          updatedConsume
        );
        console.log(response.data);

        console.log("Consume data submitted:", updatedConsume);

        // Handle successful API response (e.g., navigate to confirmation page)
        if (response.data.status == 200) {
          try {
            const consumeData = await axios.post(
              "/api/consume.php",
              updatedConsume
            );

            if (consumeData.data.status == 200) {
              toast.success("Part consumed successfully", {
                position: "bottom-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
              });
              setTimeout(() => {
                window.location.href = "/excess";
              }, 6000);
            } else if (consumeData.data.error) {
              toast.error(consumeData.data.error, {
                position: "bottom-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
              });
            }
          } catch (e) {
            console.error("Error submitting consume data:", e);
          }
        } else {
          toast.error(response.data.error, {
            position: "bottom-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
        }

        setOpen(false);
      } catch (error) {
        console.error("Error submitting consume data:", error);
        // Handle API errors (e.g., display error message to the user)
      }
    }
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Navigation />
        </Layout.SideDrawer>
      )}
      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: "100vh",
            overflow: "hidden",
          }),
        }}
      >
        <Layout.SideNav>
          <Typography component={"h1"}>EPMS</Typography>
          <Divider />
          <Navigation />
          <Header />
        </Layout.SideNav>

        <Layout.Main>
          <List
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(1000px, 1fr))",
              gap: 1,
            }}
          >
            <Sheet
              component="li"
              variant="outlined"
              sx={{
                borderRadius: "sm",
                p: 2,
                listStyle: "none",
              }}
            >
              <Layout.SidePane sx={{}}>
                <ToastContainer
                  position="top-center"
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                />

                <Modal
                  aria-labelledby="modal-title"
                  aria-describedby="modal-desc"
                  open={open}
                  onClose={() => setOpen(false)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Sheet
                    variant="outlined"
                    sx={{
                      maxWidth: 500,
                      borderRadius: "md",
                      p: 3,
                      boxShadow: "lg",
                    }}
                  >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                      component="h3"
                      id="modal-title"
                      level="h4"
                      textColor="inherit"
                      fontWeight="md"
                      mb={1}
                      sx={{ textAlign: "center" }}
                    >
                      Confirm to Consume this part ?
                    </Typography>
                    <img
                      src="https://assets-v2.lottiefiles.com/a/5f52011c-1167-11ee-bb7a-87ae82e79a64/WoZMYyosBw.gif"
                      width={320}
                      height={320}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        "& > button": { flex: 1 },
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="neutral"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="solid"
                        color="primary"
                        onClick={() => handleSubmit()}
                      >
                        Confirm
                      </Button>
                    </Box>
                  </Sheet>
                </Modal>

                <Card
                  orientation="horizontal"
                  sx={{
                    width: "100%",
                    flexWrap: "wrap",
                    [`& > *`]: {
                      "--stack-point": "500px",
                      minWidth:
                        "clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)",
                    },
                    overflow: "auto",
                  }}
                >
                  <CardContent>
                    <ListItemContent sx={{ alignSelf: "end" }}>
                      <ShoppingCartCheckoutIcon />
                    </ListItemContent>
                    <Typography level="h3" sx={{ alignSelf: "center" }}>
                      {" "}
                      Excess Part Consume Plan
                    </Typography>

                    <Chip>
                      <Typography fontSize="xl" fontWeight="lg">
                        {item.itemNo}
                      </Typography>
                    </Chip>
                    <Typography
                      level="title-lg"
                      fontWeight="lg"
                      textColor="text.tertiary"
                    >
                      {item.itemName}
                    </Typography>
                    <Sheet
                      sx={{
                        bgcolor: "background.level1",
                        borderRadius: "sm",
                        p: 1.5,
                        my: 1.5,
                        display: "flex",
                        gap: 2,
                        "& > div": { flex: 1 },
                      }}
                    >
                      <div>
                        <Typography level="body-xs" fontWeight="lg">
                          Location
                        </Typography>
                        <Typography fontWeight="lg">{item.location}</Typography>
                      </div>
                      <div>
                        <Typography level="body-xs" fontWeight="lg">
                          Excess Quantity
                        </Typography>
                        <Typography fontWeight="lg">
                          {item.excessQty}
                        </Typography>
                      </div>
                      <div>
                        <Typography level="body-xs" fontWeight="lg">
                          Excess Date
                        </Typography>
                        <Typography fontWeight="lg">
                          {item.excessDate}
                        </Typography>
                      </div>
                    </Sheet>

                    <Sheet
                      sx={{
                        bgcolor: "background.level2",
                        borderRadius: "lg",
                        p: 1.5,
                        my: 1.5,
                        display: "flex",
                        gap: 2,
                        "& > div": { flex: 1 },
                      }}
                    >
                      <div>
                        <Typography level="body-xs" fontWeight="lg">
                          Plan lot
                        </Typography>
                        <Typography fontWeight="lg">
                          {String(item.planlot).replace(/^\*|\*$/g, "")}
                        </Typography>
                      </div>
                      <div>
                        <Typography level="body-xs" fontWeight="lg">
                          Plan lot Usage Qty
                        </Typography>
                        <Typography fontWeight="lg">{item.openqty}</Typography>
                      </div>
                      <div>
                        <Typography level="body-xs" fontWeight="lg">
                          Start Date
                        </Typography>
                        <Typography fontWeight="lg">
                          {String(item.startDate).replace(
                            /(\d{4})(\d{2})(\d{2})/,
                            "$1-$2-$3"
                          )}
                        </Typography>
                      </div>
                    </Sheet>
                    <form onSubmit={handleSubmit}>
                      <Box
                        sx={{
                          borderRadius: "lg",
                          p: 1.5,
                          my: 1.5,
                          display: "flex",
                          gap: 2,
                          "& > div": { flex: 1 },
                        }}
                      >
                        <FormLabel>Consume Quantity</FormLabel>
                        <Input
                          type="number"
                          onChange={(e) => {
                            setQty(e.target.value);
                          }}
                          placeholder={`0/${item.excessQty}`}
                          sx={{ width: "30%" }}
                          required
                        />

                        <FormLabel>Request Date</FormLabel>
                        <Input
                          type="date"
                          onChange={(e) => {
                            setDate(e.target.value);
                          }}
                          sx={{ width: "30%" }}
                          required
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          "& > button": { flex: 0 },
                        }}
                      >
                        <Link to="/excess">
                          <Button variant="outlined" color="neutral">
                            Cancel
                          </Button>
                        </Link>
                        <Button
                          variant="solid"
                          color="primary"
                          onClick={() => setOpen(true)}
                        >
                          Consume
                        </Button>
                      </Box>
                    </form>
                  </CardContent>
                </Card>
              </Layout.SidePane>
            </Sheet>
          </List>
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  );
}
