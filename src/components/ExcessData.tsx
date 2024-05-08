import React, { useState, useEffect } from "react";
import {
  Input,
  Grid,
  Sheet,
  Table,
  Box,
  IconButton,
  Typography,
  Avatar,
  Button,
  ListItemContent,
  Stack,
  Chip,
  Link,
  CircularProgress
} from "@mui/joy";
import {Link as RouterLink } from "react-router-dom";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion, { accordionClasses } from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CheckIcon from "@mui/icons-material/Check";
import ChecklistIcon from "@mui/icons-material/Checklist";
import RestoreIcon from "@mui/icons-material/Restore";

import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Divider from '@mui/joy/Divider';

interface ExcessData {
  excessID : number;
  itemNo: string;
  itemName: string;
  qty: string;
  excessDate: string;
  pickingID: string;
  location: string;
  status: string;
  Name : string;
}

export interface Root {
  data: Daum[];
  message: string;
  invalid: any[];
}

export interface Daum {
  itemNo: any;
  itemName: string;
  disbursement: string;
  startDate: any;
  planlot: string;
  openqty: any;
  Name: string;
}

function App(): JSX.Element {
  const [excessData, setExcessData] = useState<ExcessData[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setPage] = useState(1);
  const [indexs, setIndex] = React.useState<number | null>(null);
  const [selectedItemNo, setSelectedItemNo] = useState(""); // To store selected itemNo
  const [additionalData, setAdditionalData] = useState<Daum[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const today = new Date();
  const formattedToday = today.toISOString().slice(0, 10).replace(/-/g, ""); // Format today's date as "YYYYMMDD"

  const itemsPerPage = 5; // Adjust as needed
  const MAX_PAGES_DISPLAYED = 5; // Adjust the number of page buttons to display

  const fetchData = async (search = "", page = 1) => {
    try {
      const response = await fetch(
        `/api/excessData.php?search=${search}&page=${page}&pageSize=${itemsPerPage}`
      );
      const data = await response.json();
      setExcessData(data.data);
      console.log(selectedItemNo);
   
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    fetchData(event.target.value, 1); // Reset to page 1 on search
  };

  const handlePaginationClick = (newPage: number): void => {
    setPage(newPage);
  };

  const fetchAdditionalData = async (itemNo: any) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/forecast.php?itemNo=${itemNo}`
      );
      const data = await response.json();
      console.log(data);
      setAdditionalData(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching additional data:", error);
    }
  };

  const handleRowClick = (itemNo: string) => {
    setSelectedItemNo(itemNo);
    fetchAdditionalData(itemNo); // Fetch additional data on row click
  };

  const renderPagination = (): JSX.Element[] => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage); // Calculate total pages based on filtered data
    const pages = [];
    let startPage = Math.max(
      1,
      currentPage - Math.floor(MAX_PAGES_DISPLAYED / 2)
    );
    let endPage = Math.min(totalPages, startPage + MAX_PAGES_DISPLAYED - 1);

    if (endPage - startPage + 1 < MAX_PAGES_DISPLAYED) {
      startPage = Math.max(1, endPage - MAX_PAGES_DISPLAYED + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Button
          variant="soft"
          size="sm"
          key="first"
          onClick={() => handlePaginationClick(1)}
        >
          1
        </Button>,
        <span key="firstEllipsis"> . . . </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          variant={currentPage === i ? "outlined" : "soft"}
          size="sm"
          key={i}
          onClick={() => handlePaginationClick(i)}
          sx={{ margin: 1 }}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <span key="lastEllipsis"> . . . </span>,
        <Button
          variant="soft"
          size="sm"
          key="last"
          onClick={() => handlePaginationClick(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  const filteredData = excessData.filter(
    (item) =>
      item.itemNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="App">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to dispose this item?
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => setOpen(false)}>
              Dispose
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
        <Typography level="h2" startDecorator={<ReceiptLongIcon />}>
          Excess Part List
        </Typography>

        <Sheet>
          <Table>
            <thead>
              <tr>
                <th>
                  <Input
                    size="sm"
                    value={searchTerm}
                    placeholder="Search by Item Number or Item Name…"
                    startDecorator={<SearchRoundedIcon color="primary" />}
                    onChange={handleSearchChange}
                    endDecorator={
                      <IconButton
                        variant="outlined"
                        color="neutral"
                        sx={{ bgcolor: "background.level1" }}
                      >
                        <Typography level="title-sm" textColor="text.icon">
                          Search
                        </Typography>
                      </IconButton>
                    }
                    sx={{
                      alignSelf: "center",
                      display: {
                        xs: "none",
                        sm: "flex",
                        width: "40%",
                      },
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr></tr>
              <AccordionGroup
                size={"sm"}
                transition={{
                  initial: "0.3s ease-out",
                  expanded: "0.2s ease",
                }}
                sx={{
                  [`& .${accordionClasses.root}`]: {
                    transition: "0.2s ease",
                    '& button:not([aria-expanded="true"])': {
                      transition: "0.2s ease",
                    },
                    "& button:hover": {
                      background: "transparent",
                    },
                  },
                  [`& .${accordionClasses.root}.${accordionClasses.expanded}`]:
                    {
                      bgcolor: "background.level1",
                      borderRadius: "lg",
                      borderBottom: "1px solid",
                      borderColor: "background.level2",
                    },
                  '& [aria-expanded="true"]': {
                    boxShadow: (theme) =>
                      `inset 0 -1px 0 ${theme.vars.palette.divider}`,
                  },
                }}
              >
                {paginatedData.map((dataItem, index) => (
                  <Accordion
                    key={index}
                    onClick={() => handleRowClick(dataItem.itemNo)}
                    expanded={indexs === index}
                    onChange={(expanded) => {
                      setIndex(expanded ? index : null);
                    }}
                  >
                    <AccordionSummary>
                      <Avatar color="primary" variant="plain">
                        <Typography>{index + 1}</Typography>
                      </Avatar>
                      <Table>
                        <tbody>
                          <tr>
                            <td>
                              <Typography level="body-xs">
                                Item Number
                              </Typography>
                              <Typography level="title-md">
                                {dataItem.itemNo}
                              </Typography>
                            </td>
                            <td>
                              <Typography level="body-xs">Item Name</Typography>
                              <Typography level="title-md">
                                {dataItem.itemName}
                              </Typography>
                            </td>
                            <td>
                              <Typography level="body-xs">Quantity</Typography>
                              <Typography level="title-md">
                                {dataItem.qty}
                              </Typography>
                            </td>
                            <td>
                              <Typography level="body-xs">
                                Excess Date
                              </Typography>
                              <Typography level="title-md">
                                {dataItem.excessDate}
                              </Typography>
                            </td>
                            <td>
                              <Typography level="body-xs">Location</Typography>
                              <Avatar>
                                <Typography level="title-md">
                                  {dataItem.location}
                                </Typography>
                              </Avatar>
                            </td>
                           
                            <td>
                              <Typography level="body-xs">Status</Typography>
                              <Chip color="primary">
                                <Typography level="title-md">
                                  {dataItem.status ? dataItem.status : "pending"}
                                </Typography>
                              </Chip>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Box sx={{
                      alignItems : 'end',
                      display: 'flex',
                      alignSelf: 'end',
                    }}>
                      <Typography level="body-xs">Person In Charge :  <Typography level="title-sm">
                                  {dataItem.Name ? dataItem.Name : 'not assigned'}
                                </Typography></Typography>
                    </Box>
                              
                           
                                
                          
                            
                      <Box>
                        <Stack direction={"row"} spacing={2}>
                          <Avatar color="success">
                            <CheckIcon />
                          </Avatar>
                          <ListItemContent>
                            <Typography level="title-md">
                              Available plan lot :
                            </Typography>
                            <Typography level="body-sm">
                              Forecast plan lot can be used for this item.
                            </Typography>
                          </ListItemContent>

                          <Button
                            variant="solid"
                            color="danger"
                            size="sm"
                            endDecorator={<DeleteForever />}
        onClick={() => setOpen(true)}
                            sx={{
                              alignSelf: "center",
                            }}
                          >
                            Dispose
                          </Button>
                        </Stack>
                       
                          <AccordionGroup
                          color="danger"
                          variant="soft"
                          sx={{
                            margin: "5",
                            padding: "1",
                          }}
                        >
                          <Accordion>
                            <AccordionSummary>
                              <RestoreIcon />

                              <Typography>
                                Previous available plan lot
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails color="success">
                              {loading ? (<CircularProgress
  color="neutral"
  determinate={false}
  size="sm"
  variant="solid"
  sx={{alignSelf: "center"}}
/>) :  ( <Table
                                key={index}
                                color="danger"
                                size="sm"
                                variant="soft"
                                borderAxis="both"
                                sx={{
                                  "& tr > *:not(:first-child)": {
                                    textAlign: "center",
                                  },
                                  width: "95%",
                                  borderRadius: "lg",
                                  alignSelf: "center",
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th>
                                      <Typography level="title-sm">
                                        Plan Lot
                                      </Typography>
                                    </th>
                                    <th>
                                      <Typography level="title-sm">
                                        Open Quantity
                                      </Typography>
                                    </th>
                                    <th>
                                      <Typography level="title-sm">
                                        Start Date
                                      </Typography>
                                    </th>
                                  </tr>
                                </thead>
                                
                                {additionalData.map((item) =>
                                  item.startDate >
                                    dataItem.excessDate.replace(/-/g, "") &&
                                  item.startDate < formattedToday ? (
                                    <tbody>
                                      <tr>
                                        <td>
                                          <Typography level="body-sm">
                                            {String(item.planlot).replace(
                                              /^\*|\*$/g,
                                              ""
                                            )}
                                          </Typography>
                                        </td>
                                        <td>
                                          <Typography level="body-sm">
                                            {item.openqty}
                                          </Typography>
                                        </td>
                                        <td>
                                          <Typography level="body-sm">
                                            {String(item.startDate).replace(
                                              /(\d{4})(\d{2})(\d{2})/,
                                              "$1-$2-$3"
                                            )}
                                          </Typography>
                                        </td>
                                      </tr>
                                    </tbody>
                                  ) : null
                                )}
                              </Table> )}
                             
                            </AccordionDetails>
                          </Accordion>
                          <AccordionGroup
                            color="success"
                            variant="soft"
                            sx={{
                              margin: "5",
                              padding: "1",
                            }}
                          >
                            <Accordion>
                              <AccordionSummary>
                                <ChecklistIcon />

                                <Typography>Next available plan lot</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {loading ? ((<CircularProgress
  color="neutral"
  determinate={false}
  size="sm"
  variant="solid"
  sx={{alignSelf: "center"}}
/>)) : (<Table
                                  key={index}
                                  color="success"
                                  size="sm"
                                  variant="soft"
                                  borderAxis="both"
                                  sx={{
                                    "& tr > *:not(:first-child)": {
                                      textAlign: "center",
                                    },
                                    width: "95%",
                                    borderRadius: "lg",
                                    alignSelf: "center",
                                  }}
                                >
                                  <thead>
                                    <tr>
                                      <th>
                                        <Typography level="title-sm">
                                          Plan Lot
                                        </Typography>
                                      </th>
                                      <th>
                                        <Typography level="title-sm">
                                          Open Quantity
                                        </Typography>
                                      </th>
                                      <th>
                                        <Typography level="title-sm">
                                          Start Date
                                        </Typography>
                                      </th>
                                    </tr>
                                  </thead>
                                  {additionalData.map((item) =>
                                    item.startDate >
                                      dataItem.excessDate.replace(/-/g, "") &&
                                    item.startDate > formattedToday ? (
                                      <tbody>
                                        <tr>
                                          <td>
                                            <Typography level="title-md">
                                              <Link
                                                component={RouterLink}
                                                to="/confirmation"
                                                state={{
                                                  excessID: dataItem.excessID,
                                                  planlot: item.planlot,
                                                  itemName: dataItem.itemName,
                                                  openqty: item.openqty,
                                                  startDate: item.startDate,
                                                  disbursement:
                                                    item.disbursement,
                                                  location: dataItem.location,
                                                  itemNo: dataItem.itemNo,
                                                  excessDate:
                                                    dataItem.excessDate,
                                                  excessQty:
                                                    dataItem.qty,
                                                }}
                                              >
                                                {String(item.planlot).replace(
                                                  /^\*|\*$/g,
                                                  ""
                                                )}
                                              </Link>
                                            </Typography>
                                          </td>
                                          <td>
                                            <Typography level="body-sm">
                                              {item.openqty}
                                            </Typography>
                                          </td>
                                          <td>
                                            <Typography level="body-sm">
                                              {String(item.startDate).replace(
                                                /(\d{4})(\d{2})(\d{2})/,
                                                "$1-$2-$3"
                                              )}
                                            </Typography>
                                          </td>
                                        </tr>
                                      </tbody>
                                    ) : null
                                  )}
                                </Table>)}
                                
                              </AccordionDetails>
                            </Accordion>
                          </AccordionGroup>
                        </AccordionGroup>
                        
                        
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionGroup>
            </tbody>
          </Table>
          <tfoot>
            <td>
              <Typography level="body-lg">Pages : </Typography>
            </td>

            <td>{renderPagination()}</td>
          </tfoot>
        </Sheet>
      </Grid>
    </div>
  );
}

export default App;
