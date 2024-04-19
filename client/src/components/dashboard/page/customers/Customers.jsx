/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Stack, useTheme } from '@mui/material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import APIService from '../../../APIService';

const Customers = (props) => {
  // Setting States and Navigation:
  const theme = useTheme();
  const [Rows, setRows] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const branchID = props.branchID;
  const nav = useNavigate();

  // Getting Order Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/customers/get', {
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
    APIService.DeleteCustomer(memberID);
    let filtredData = Rows.filter((item) => item.id !== memberID);
    setRows(filtredData);
    // window.location.reload();
  };

  // Passing the selected user id to the update form page:
  useEffect(() => {
    if (selectedUserId !== null) {
      nav(`/${props.branchID}/CustomersUpdateForm/${selectedUserId}`);
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
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'licensePlate', headerName: 'License plate', flex: 1 },
    {
      field: 'carBrand',
      headerName: 'Car brand',
      flex: 1,
      headerAlign: 'center',
    },
    { field: 'carModel', headerName: 'Car model', flex: 1 },
    { field: 'service', headerName: 'Service', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    {
      field: 'image1',
      headerName: 'Image 1',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 150,
      renderCell: (params) => {
        const isHttp =
          params.value.includes('http') || params.value.includes('https');
        const src = isHttp ? params.value : `/public/images/${params.value}`;

        return params.value === '' ? (
          <em>No image</em>
        ) : (
          <img
            src={src}
            alt="image"
            style={{ width: '100px', height: '100px' }}
          />
        );
      },
    },
    {
      field: 'image2',
      headerName: 'Image 2',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 150,
      renderCell: (params) => {
        const isHttp =
          params.value.includes('http') || params.value.includes('https');
        const src = isHttp ? params.value : `/public/images/${params.value}`;

        return params.value === '' ? (
          <em>No image</em>
        ) : (
          <img
            src={src}
            alt="image"
            style={{ width: '100px', height: '100px' }}
          />
        );
      },
    },
    {
      field: 'image3',
      headerName: 'Image 3',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 150,
      renderCell: (params) => {
        const isHttp =
          params.value.includes('http') || params.value.includes('https');
        const src = isHttp ? params.value : `/public/images/${params.value}`;

        return params.value === '' ? (
          <em>No image</em>
        ) : (
          <img
            src={src}
            alt="image"
            style={{ width: '100px', height: '100px' }}
          />
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
    return rows.filter((row) => row.branchID == branchID);
  };
  return (
    <div>
      <div style={{ height: 550, width: '100%' }}>
        <Stack direction={'row'} justifyContent={'space-between'} mt={2}>
          <PageHeader title="Customers" subtitle={'Customers Informations'} />
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
            onClick={() => nav(`/${props.branchID}/CustomersCreateForm`)}
          >
            + Add Customer
          </Button>
        </Stack>
        <DataGrid
          checkboxSelection
          rows={filterRows(Rows)}
          columns={columns}
          rowHeight={80}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </div>
  );
};

export default Customers;
