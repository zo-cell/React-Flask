/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, useTheme } from '@mui/material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from '../../../APIService';
import CryptoJS from 'crypto-js';

const Jobs = (props) => {
  const theme = useTheme();
  const [Rows, setRows] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const branchID = props.branchID
  const nav = useNavigate();

  const encryptedDataa = localStorage.getItem('encryptedData');
  const bytes = CryptoJS.AES.decrypt(encryptedDataa, 'SeCrEt@@@19');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  const loggedID = localStorage.getItem('ID');


  // Getting Order Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/jobs/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  // Function to handle the click on a table row for Updating:
  const handleUpdateAccess = (userId) => {
    setSelectedUserId(userId);
  };

  // Handling Deleting Member API :
  const handleDeleteAccess = (memberID) => {
    APIService.DeleteJob(memberID);
    let filtredData = Rows.filter((item) => item.id !== memberID);
    setRows(filtredData);
    // window.location.reload();
  };

  // Passing the selected user id to the update form page:
  useEffect(() => {
    if (selectedUserId !== null) {
      nav(`/${props.branchID}/JobUpdateForm/${selectedUserId}`);
    }
  }, [nav, selectedUserId]);

  // Setting DataGrid:
  const columns = [
    { field: 'id', headerName: 'ID', width: 55 },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: 'jobs', headerName: 'Tasks', flex: 1 },
    { field: 'customer', headerName: 'Customer', flex: 1 },
    { field: 'check', headerName: 'Check', flex: 1 },
    { field: 'subMission', headerName: 'Status', flex: 1 },

    {
      field: 'image1',
      headerName: 'Image 1',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 150,
      renderCell: (params) =>
        params.value === '' ? (
          <em>No image</em>
        ) : (
          <img
            src={`/public/images/${params.value}`}
            alt="image"
            style={{ width: '100px', height: '100px' }}
          />
        ),
    },
    {
      field: 'image2',
      headerName: 'Image 2',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 150,
      renderCell: (params) =>
        params.value === '' ? (
          <em>No image</em>
        ) : (
          <img
            src={`/public/images/${params.value}`}
            alt="image"
            style={{ width: '100px', height: '100px' }}
          />
        ),
    },
    {
      field: 'image3',
      headerName: 'Image 3',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 150,
      renderCell: (params) =>
        params.value === '' ? (
          <em>No image</em>
        ) : (
          <img
            src={`/public/images/${params.value}`}
            alt="image"
            style={{ width: '100px', height: '100px' }}
          />
        ),
    },
    {
      field: 'update',
      headerName: 'Update',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <Button
            sx={{
              fontSize: '13px',
              textTransform: 'capitalize',
              width: '99px',
              borderRadius: '3px',
              height: '31px',
              color: '#fff',
              bgcolor: theme.palette.primary.dark,
            }}
            variant="contained"
            onClick={() => handleUpdateAccess(params.row.id, event)}
          >
            Update
          </Button>
        );
      },
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <Button
            sx={{
              fontSize: '13px',
              textTransform: 'capitalize',
              width: '99px',
              borderRadius: '3px',
              height: '31px',
              color: '#fff',
              bgcolor: theme.palette.primary.dark,
            }}
            variant="contained"
            onClick={() => handleDeleteAccess(params.row.id, event)}
          >
            Delete
          </Button>
        );
      },
    }, // Actions column
  ];

  const filterRows = (rows) => {
    return rows.filter((row) => row.worker_id == loggedID);
  };

  const filterRows2 = (rows) => {
    return rows.filter((row) => row.branchID == branchID);
  };

  return (
    <div>
      <div style={{ height: 550, width: '100%' }}>
        <PageHeader title="Jobs" subtitle={'Manage Job Details'} />
        {decryptedData === 'Worker' ? (
          <DataGrid
            checkboxSelection
            rows={filterRows(Rows)}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            rowHeight={80}
          />
        ) : (
          <DataGrid
            checkboxSelection
            rows={filterRows2(Rows)}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            rowHeight={80}
          />
        )}
      </div>
    </div>
  );
};

export default Jobs;
