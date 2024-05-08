import { useState, useEffect } from 'react';
import './App.css';

interface RowData {
  [key: string]: string | string[];
}

function App(): JSX.Element {
  const [jsonData, setJsonData] = useState<RowData[]>([]);
  const [page, setPage] = useState<number>(1);
  const totalPages = 1 ;

  const fetchData = async (): Promise<void> => {
    const response = await fetch(`http://localhost:3000/api/extract-excel?filePath=C:\\Users\\5004705295\\Desktop\\picking0204.xlsx`);
    const data = await response.json();
    setJsonData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePaginationClick = (newPage: number): void => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="App">
      <h1>Fetch JSON Data from Database</h1>
      <table>
        <thead>
          <tr>
            {Object.keys(jsonData[0] || {}).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jsonData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td key={index}>{Array.isArray(value) ? value.join(', ') : value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        Pages: 
        {[...Array(totalPages).keys()].map((pageIndex) => (
          <button key={pageIndex} onClick={() => handlePaginationClick(pageIndex + 1)}>{pageIndex + 1}</button>
        ))}
      </div>
    </div>
  );
}

export default App;
