/* eslint-disable react/prop-types */
import { Box, Button, Stack } from '@mui/material';
import Row1 from './Row1';
import Row2 from './Row2';
import Row3 from './Row3';
import { DownloadOutlined } from '@mui/icons-material';
import PageHeader from '../PageHeader';
import { useEffect } from 'react';



const DashHome = (props) => {
  const handleDownload = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/download_all_data', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      });

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all_data.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    const now = new Date();

    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);

    if (now <= targetTime) {
      setTimeout(handleDownload, targetTime - now);
    } else {
      setTimeout(handleDownload, 24 * 60 * 60 * 1000); // 1 day in milliseconds
    }


  }, []);
  return (
    <div>

      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <PageHeader title={`${props.branch.name} Dashboard`} subtitle={'Welcome to your dashboard'} />

        <Box textAlign={'right'}>
          <Button
            sx={{ p: '6px 8px', textTransform: 'capitalize' }}
            variant="contained"
            color="primary"
            onClick={handleDownload}
          >
            <DownloadOutlined />
            Download Reports
          </Button>
        </Box>
      </Stack>

      <Row1 />
      <Row2 />
      <Row3 />
    </div>
  );
};

export default DashHome;
