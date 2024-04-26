import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Card, LinearProgress, Input } from '@mui/joy';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [insertedCount, setInsertedCount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [insertions, setInsertions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10)); // Set initial date to today

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (loading) {
        const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
        (event || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [loading]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    setLoading(true);
    toast('Uploading the file into database', {
      position: 'top-center',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      transition: Bounce,
    });

    try {
      const response = await axios.post('http://localhost:3000/api/upload-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const jsonData = response.data.jsonData;
      setInsertedCount(jsonData.length);
      setData(jsonData);
      let successfulInsertions = 0;

      for (const dataObject of jsonData) {
        try {
          // Add the date to the data object before sending it
          dataObject.date = date;

        

          const phpResponse = await axios.post('http://localhost:8080/EPMS/matecon-data/upload.php', dataObject);
          console.log(phpResponse.data);
          successfulInsertions++;
        } catch (error) {
          console.error('Error sending object:', dataObject, error);
        }

        const calculatedProgress = (successfulInsertions / jsonData.length) * 100;
        setInsertions(successfulInsertions);
        setProgress(calculatedProgress);
      }

      if (progress === 100) {
        toast.success(' Loading Complete!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ padding: '20px', width: '400px' }}>
        <LinearProgress determinate value={progress} />
        <h2>Upload Excel File</h2>
        <form onSubmit={handleSubmit}>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
                    />
          <Input type="file" onChange={handleFileChange} />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Upload'}
          </button>
        </form>
        <p>
          {progress === 100 ? 'Done!' : `${progress.toFixed(1)}%`} inserted ({insertions}/{data?.length})
        </p>
        <ToastContainer
          position="top-center"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
        />
      </Card>
    </div>
  );
}

export default App;
