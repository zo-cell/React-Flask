/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { Work } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import APIService from '../../../APIService';

const Workers = (props) => {
  // Setting States and Navigation:
  const [Rows, setRows] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const branchID = props.branchID;
  const nav = useNavigate();

  // getting Workers Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/workers/get', {
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

  // Handling update route navigation:
  const handleUpdateAccess = (userId) => {
    setSelectedUserId(userId);
  };

  // Handling Deleting Worker API :
  const handleDeleteAccess = (memberID) => {
    APIService.DeleteWorker(memberID);
    let filtredData = Rows.filter((item) => item.id !== memberID);
    setRows(filtredData);
    // window.location.reload();
  };

  // Passing the selected user id to the update form page:
  useEffect(() => {
    if (selectedUserId !== null) {
      nav(`/${props.branchID}/WorkersUpdateForm/${selectedUserId}`);
    }
  }, [nav, selectedUserId, props.branchID]);

  // Setting DateGrid:
  const theme = useTheme();
  const columns = [
    { field: 'id', headerName: 'ID', width: 55 },

    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },

    {
      field: 'access',
      headerName: 'Access',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      display: 'flex',
      aignItems: 'center',
      justifyContent: 'center',
      renderCell: ({ row: { access } }) => {
        return (
          <div>
            <Box
              sx={{
                p: '5px',
                width: '99px',
                borderRadius: '3px',
                textAlign: 'center',
                backgroundColor: theme.palette.error.dark,
                display: 'flex',
                justifyContent: 'space-evenly',
                position: 'relative',
              }}
            >
              {access === 'Worker' && (
                <Work sx={{ color: '#fff' }} fontSize="small" />
              )}
              <Typography
                varient="body1"
                sx={{ fontSize: '13px', color: '#fff' }}
              >
                {access}
              </Typography>
            </Box>
          </div>
        );
      },
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
    }, // Actions column
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
    return rows.filter((row) => row.branchID == branchID);
  };

  return (
    <div>
      <div style={{ height: 550, width: '100%' }}>
        <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
          <PageHeader title="Workers" subtitle={'Managing Workers'} />
          <Button
            variant="contained"
            sx={{
              height: '45px',
              width: '140px',
              fontSize: '13px',
              textTransform: 'capitalize',
              color: '#fff',
              bgcolor: theme.palette.primary.dark,
            }}
            onClick={() => nav(`/${props.branchID}/WorkersRegistration`)}
          >
            + Add Worker
          </Button>
        </Stack>
        <DataGrid
          rows={filterRows(Rows)}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </div>
  );
};

export default Workers;
