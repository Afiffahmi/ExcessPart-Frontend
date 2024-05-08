import { useState, useEffect, ChangeEvent } from 'react';
import { Sheet, Table, Button, Input,IconButton,Typography } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface RowData {
  [key: string]: string | string[] | Record<string, string>;
}

function App(): JSX.Element {
  const [jsonData, setJsonData] = useState<RowData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const MAX_PAGES_DISPLAYED = 5;

  const fetchData = async (pageNumber: number): Promise<void> => {
    try {
      // Format the date value to YYYYMMDD
      const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
      const response = await fetch(`/api/mateconData.php?page=${pageNumber}&searchQuery=${searchQuery}&startDate=${formattedDate}`);
      const data = await response.json();
      setJsonData(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, searchQuery]);

  const handlePaginationClick = (newPage: number): void => {
    setPage(newPage);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value.toLocaleUpperCase());
  };

  const renderPagination = (): JSX.Element[] => {
    const pages = [];
    let startPage = Math.max(1, page - Math.floor(MAX_PAGES_DISPLAYED / 2));
    let endPage = Math.min(totalPages, startPage + MAX_PAGES_DISPLAYED - 1);

    if (endPage - startPage + 1 < MAX_PAGES_DISPLAYED) {
      startPage = Math.max(1, endPage - MAX_PAGES_DISPLAYED + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Button variant='soft' size='sm' key="first" onClick={() => handlePaginationClick(1)}>1</Button>,
        <span key="firstEllipsis"> . . . </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button variant='soft' size='sm' key={i} onClick={() => handlePaginationClick(i)}>{i}</Button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <span key="lastEllipsis"> . . . </span>,
        <Button variant='soft' size='sm' key="last" onClick={() => handlePaginationClick(totalPages)}>{totalPages}</Button>
      );
    }

    return pages;
  };

  return (
    <div className="App">
      <h2>Picking List Database</h2>
      
      <div>
      <Input
          size="sm"
          variant="outlined"
          placeholder="Search anything…"
          startDecorator={<SearchRoundedIcon color="primary" />}
          value={searchQuery}
          onChange={handleSearchChange}
          endDecorator={
            <IconButton
              variant="outlined"
              color="neutral"
              sx={{ bgcolor: 'background.level1' }}
            >
              <Typography level="title-sm" textColor="text.icon">
                ⌘ K
              </Typography>
            </IconButton>
          }
          sx={{
            alignSelf: 'center',
            display: {
              xs: 'none',
              sm: 'flex',
              width: '40%',
            },
          }}
        />
      </div>
      
      <Sheet>
        <Table
          color="primary"
          size="sm"
          stickyFooter
          stickyHeader
          stripe="even"
          variant="plain"
        >
          <thead>
            <tr>
              {Object.keys(jsonData[0] || {}).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          {jsonData.map((row, rowIndex) => (
  <tr key={rowIndex}>
    {Object.values(row).map((value, valueIndex) => (
      <td key={valueIndex}>
        {value !== undefined && value !== null && value !== '' ? (
          Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? Object.values(value).join(', ') : value
        ) : ''}
      </td>
    ))}
  </tr>
))}
          </tbody>
        </Table>
        <tfoot>
          <tr>
            Pages:
            <td>
              {renderPagination()}
            </td>
          </tr>
        </tfoot>
      </Sheet>
    </div>
  );
}

export default App;
