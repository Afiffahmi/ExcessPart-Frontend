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
} from "@mui/joy";
import { Route, Link as RouterLink } from "react-router-dom";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion, { accordionClasses } from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";
import DownloadIcon from '@mui/icons-material/Download';

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestoreIcon from "@mui/icons-material/Restore";
import PdfGenerator from '../components/PdfGenerator'

export interface Root {
  data: ExcessData[];
  search: string;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  sortField: string;
  sortOrder: string;
}

export interface ExcessData {
  excessID: number;
  itemNo: string;
  itemName: string;
  qty: number;
  excessDate: string;
  location: string;
  status: string;
  pickingID: number;
  ID: any;
  consume_data: ConsumeDaum[];
}

export interface ConsumeDaum {
  consumeDate: string;
  consumeQty: number;
  planlot: string;
  startDate: string;
}

function App(): JSX.Element {
  const [excessData, setExcessData] = useState<ExcessData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setPage] = useState(1);
  const [indexs, setIndex] = React.useState<number | null>(null);
  const today = new Date();

  const itemsPerPage = 6; // Adjust as needed
  const MAX_PAGES_DISPLAYED = 5; // Adjust the number of page buttons to display

  const fetchData = async (search = "", page = 1) => {
    try {
      const response = await fetch(
        `http://localhost:8080/EPMS/matecon-data/consumeData.php?search=${search}&page=${page}&pageSize=${itemsPerPage}`
      );
      const data = await response.json();

      const filteredData = data.data.filter(item => item.qty !== 0);

    setExcessData(filteredData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const pdfGenerate = (consumeData:any,dataItem:any) => {
    PdfGenerator({consumeData,dataItem});
  }

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
        <Typography level="h2" >
          Consume Part List
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
                      alignSelf: "end",
                      alignItems: "center",
                      display: {
                        all: "flex",
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
                    expanded={indexs === index}
                    onChange={(event, expanded) => {
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
                              <Typography level="body-xs">
                                Available Quantity
                              </Typography>
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
                                  {dataItem.qty == 0
                                    ? "completed"
                                    : "partial completed"}
                                </Typography>
                              </Chip>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Stack direction={"row"} spacing={2}>
                          <Avatar color="neutral" variant="solid">
                            <RestoreIcon />
                          </Avatar>
                          <ListItemContent>
                            <Typography level="title-md">
                              Consume History :
                            </Typography>
                            <Typography level="body-sm">
                              shows the consume history of the selected item
                            </Typography>
                          </ListItemContent>
                        </Stack>
                        {dataItem.consume_data.map((consumeData, index) => (
                          <Table key={index}>
                            <tbody>
                              <tr>
                                <td>
                                  <Typography level="body-xs">
                                    Request Date
                                  </Typography>
                                  <Typography level="title-md">
                                    {consumeData.consumeDate}
                                  </Typography>
                                </td>
                                <td>
                                <Typography level="body-xs">
                                    Start Date
                                  </Typography>
                                  <Typography level="title-md">
                                    {consumeData.startDate}
                                  </Typography>
                                </td>
                                <td>
                                  <Typography level="body-xs">
                                    Planlot
                                  </Typography>
                                  <Typography level="title-md">
                                    {String(consumeData.planlot).replace(
                                      /^\*|\*$/g,
                                      ""
                                    )}
                                  </Typography>
                                </td>
                                <td>
                                  <Typography level="body-xs">
                                    Consume Quantity
                                  </Typography>
                                  <Typography level="title-md">
                                    {consumeData.consumeQty}
                                  </Typography>
                                </td>
                                <td>
                                  <Button onClick={() => pdfGenerate(consumeData,dataItem)} startDecorator={<DownloadIcon/>}>Download file</Button>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        ))}
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
