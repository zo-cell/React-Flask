/* eslint-disable react/prop-types */
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Stack, useTheme, TextField, Box } from '@mui/material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { useNavigate } from 'react-router-dom';
import APIService from '../../../APIService';
const CustomCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: ${props => (props.checked ? 'blue' : 'white')};
  border: 1px solid black;
  cursor: pointer;
`;
const Orders = (props) => {
  // Setting States and Navigation:
  const theme = useTheme();
  const [Rows, setRows] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const branchID = localStorage.getItem('branchID');
  const [oldDate, setOldDate] = useState('');
  const [oldLicensePlate, setOldLicensePlate] = useState('');
  const [oldCarBrand, setOldCarBrand] = useState('');
  const [oldCarModel, setOldCarModel] = useState('');
  const [oldCustomer, setOldCustomer] = useState('');
  const [oldService, setOldService] = useState('');
  const [oldW1, setOldW1] = useState('');
  const [oldW2, setOldW2] = useState('');
  const [oldW3, setOldW3] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [oldNotes, setOldNotes] = useState('');

  const branchName = localStorage.getItem('branchName');
  const auth = localStorage.getItem('token');

  const [searchInput, setSearchInput] = useState('');

  const nav = useNavigate();

  // Getting Order Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/orders/get', {
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

  function sendAction(action, id) {
    fetch(`http://127.0.0.1:5000/api/order/get/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setOldDate(data.date);
        setOldLicensePlate(data.licensePlate);
        setOldCarBrand(data.carBrand);
        setOldCarModel(data.carModel);
        setOldCustomer(data.customer);
        setOldService(data.service);
        setOldPrice(data.price);
        setOldNotes(data.notes);
        setOldW1(data.W1);
        setOldW2(data.W2);
        setOldW3(data.W3);
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
        id: id,
        oldDate: oldDate,
        oldCustomer: oldCustomer,
        oldService: oldService,
        oldPrice: oldPrice,
        oldW1: oldW1,
        oldW2: oldW2,
        oldW3: oldW3,
        oldNotes: oldNotes,
        oldCarBrand: oldCarBrand,
        oldCarModel: oldCarModel,
        oldLicensePlate: oldLicensePlate,
      }),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }

  // Function to handle the click on a table row for Updating:
  const handleUpdateAccess = (userId) => {
    setSelectedUserId(userId);
  };

  // Handling Deleting Member API :
  const handleDeleteAccess = (memberID) => {
    APIService.DeleteOrder(memberID);
    let filtredData = Rows.filter((item) => item.id !== memberID);
    setRows(filtredData);
    // window.location.reload();
  };

  // Passing the selected user id to the update form page:
  useEffect(() => {
    if (selectedUserId !== null) {
      nav(`/${props.branchID}/OrdersUpdateForm/${selectedUserId}`);
    }
  }, [nav, selectedUserId, props.branchID]);

  const [invoiceData, setInvoiceData] = useState([]);
  const handleSearch = async () => {
    const searchIds = searchInput.split(',').map((id) => id.trim());
    const filteredRows = Rows.filter((row) => searchIds.includes(row.id.toString()));
    setRows(filteredRows);
    setInvoiceData(filterRows);

    await handleDownloadPDF(filteredRows);
  };

  // Generating the report:
  const handleDownloadPDF = async (filteredRows) => {
    // const searchIds = searchInput.split(',').map((id) => id.trim());
    // const filteredRows = Rows.filter((row) =>
    //   searchIds.includes(row.id.toString()),
    // );
    // setRows(filteredRows);

    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
    const totalPrice = filteredRows.reduce((total, row) => total + row.price, 0); // Calculate the total price
    const data = filteredRows.map((row) => ({
      id: row.id,
      date: row.date,
      service: row.service,
      customer: row.customer,
      price: row.price,
    }));

    const body = {
      data: data,
      date: currentDate,
      total: totalPrice,
    };

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/invoices/download/pdf',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        response.responseType = 'blob';
        a.href = url;
        a.download = 'Invoice.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download PDF report');
      }
    } catch (error) {
      console.error('Error downloading PDF report:', error);
    }
  };

  // Setting DataGrid:
  const columns = [
    { field: 'id', headerName: 'ID', width: 55 },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
    },
    { field: 'licensePlate', headerName: 'License plate', flex: 1 },
    { field: 'carBrand', headerName: 'Car brand', flex: 1 },
    { field: 'carModel', headerName: 'Car model', flex: 1 },
    { field: 'customer', headerName: 'Customer', flex: 1 },
    { field: 'service', headerName: 'Service', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'W1', headerName: 'W 1', flex: 1 },
    { field: 'W2', headerName: 'W 2', flex: 1 },
    { field: 'W3', headerName: 'W 3', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 1 },

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
            onClick={() => {
              handleUpdateAccess(params.row.id, event);
            }}
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
              sendAction('deleted_order', params.row.id);
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
          <PageHeader title="Orders" subtitle={'Orders Informations'} />

          <Box sx={{display: 'flex', gap: 1, flexDirection: 'column'}}>
            <TextField
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Order IDs separated by commas"
              sx={{width: 280}}
            />
            <Button onClick={handleSearch} variant='contained' sx={{textTransform: 'capitalize'}}>Generate Invoice</Button>
          </Box>

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
            onClick={() => nav(`/${props.branchID}/OrderCreateForm`)}
          >
            + Add Order
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

export default Orders;
