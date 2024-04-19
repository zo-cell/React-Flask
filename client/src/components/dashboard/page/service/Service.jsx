/* eslint-disable react/prop-types */
import { Button, Stack, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import APIService from '../../../APIService';
import { useNavigate } from 'react-router-dom';

const Service = (props) => {
  // Setting States and Navigation:
  const theme = useTheme();
  const [Rows, setRows] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const branchID = props.branchID
  const [oldServicesService, setOldServicesService] = useState('');
  const [oldServicesPrice, setOldServicesPrice] = useState('');
  const [oldServiceType, setOldServiceType] = useState('');
  const [oldPercentage, setOldPercentage] = useState('');
  const branchName = localStorage.getItem('branchName');
  const auth = localStorage.getItem('token');
  const nav = useNavigate();

  // Getting Order Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/Services/get', {
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
    APIService.DeleteService(memberID);
    let filtredData = Rows.filter((item) => item.id !== memberID);
    setRows(filtredData);
    // window.location.reload();
  };

  // Passing the selected user id to the update form page:
  useEffect(() => {
    if (selectedUserId !== null) {
      nav(`/${props.branchID}/ServiceUpdateForm/${selectedUserId}`);
    }
  }, [nav, selectedUserId]);

  function sendAction(action, id) {
    fetch(`http://127.0.0.1:5000/api/service/get/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {

        setOldServicesService(data.service);
        setOldServicesPrice(data.price);
        setOldServiceType(data.serviceType);
        setOldPercentage(data.percentage);
      })
      .catch((error) => console.log(error));

    fetch('http://127.0.0.1:5000/notify_frontend_action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        branchName: branchName,
        auth: auth,
        serviceID: id,
        oldServicesService: oldServicesService,
        oldServicesPrice: oldServicesPrice,
        oldServiceType: oldServiceType,
        oldPercentage: oldPercentage,
      }),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }


  // Setting DataGrid:
  const columns = [
    { field: 'id', headerName: 'ID', width: 55 },
    {
      field: 'service',
      headerName: 'Service',
      flex: 1,
    },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'serviceType', headerName: 'Service Type', flex: 1 },
    { field: 'percentage', headerName: 'Percentage', flex: 1 },

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
            onClick={() => {
              sendAction("deleted_service", params.row.id);
              handleDeleteAccess(params.row.id, event);
            }}
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
          <PageHeader title="Services" subtitle={'Service Details'} />

        </Stack>
        <DataGrid
          checkboxSelection
          rows={filterRows(Rows)}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </div>
  );
};

export default Service;
