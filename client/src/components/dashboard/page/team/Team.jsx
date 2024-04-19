/* eslint-disable react/prop-types */
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
} from '@mui/icons-material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import './team.css';
import { useNavigate } from 'react-router-dom';
import APIService from '../../../APIService';
import CryptoJS from 'crypto-js';

const Team = (props) => {
  // Setting States and Navigation:
  const theme = useTheme();
  const [Rows, setRows] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const branchID = props.branchID;
  const nav = useNavigate();

  const encryptedDataa = localStorage.getItem('encryptedData');
  const bytes = CryptoJS.AES.decrypt(encryptedDataa, 'SeCrEt@@@19');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  const [firstNameToUpdate, setFirstNameToUpdate] = useState('');
  const [lastNameToUpdate, setLastNameToUpdate] = useState('');
  const [emailToUpdate, setEmailToUpdate] = useState('');
  const [ageToUpdate, setAgeToUpdate] = useState('');
  const [phoneToUpdate, setPhoneToUpdate] = useState('');
  const [accessToUpdate, setAccessToUpdate] = useState('');
  const [branchToUpdate, setBranchToUpdate] = useState('');

  // Getting Member Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/get', {
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
  const handleUpdateAccess = (userId, event) => {
    setSelectedUserId(userId);
  };

  // Handling Deleting Member API :
  const handleDeleteAccess = (memberID) => {
    APIService.DeleteUser(memberID);
    let filtredData = Rows.filter((item) => item.id !== memberID);
    setRows(filtredData);
    // window.location.reload();
  };

  // Passing the selected user id to the update form page:
  useEffect(() => {
    if (selectedUserId !== null) {
      nav(`/${props.branchID}/TeamUpdateForm/${selectedUserId}`);
    }
  }, [nav, selectedUserId]);
  const branchName = localStorage.getItem('branchName');
  const auth = localStorage.getItem('token');
  function sendAction(action, id) {
    fetch(`http://127.0.0.1:5000/api/member/get/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {

        setFirstNameToUpdate(data.firstName);
        setLastNameToUpdate(data.lastName);
        setEmailToUpdate(data.email);
        setAgeToUpdate(data.age);
        setPhoneToUpdate(data.phone);
        setAccessToUpdate(data.access);
        setBranchToUpdate(data.branch);
      })
      .catch((error) => console.log(error));



    fetch('http://127.0.0.1:5000/notify_frontend_action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,

        firstNameToUpdate: firstNameToUpdate,
        lastNameToUpdate: lastNameToUpdate,
        emailToUpdate: emailToUpdate,
        ageToUpdate: ageToUpdate,
        phoneToUpdate: phoneToUpdate,
        accessToUpdate: accessToUpdate,
        branchToUpdate: branchToUpdate,

        auth: auth,
        branchName: branchName,
        memberID: id,
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
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'age', headerName: 'Age', flex: 1 },
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
                backgroundColor:
                  access === 'Admin'
                    ? theme.palette.primary.main
                    : access === 'Manager'
                    ? theme.palette.secondary.dark
                    : '#3da58a',
                display: 'flex',
                justifyContent: 'space-evenly',
                position: 'relative',
              }}
            >
              {access === 'Admin' && (
                <AdminPanelSettingsOutlined
                  sx={{ color: '#fff' }}
                  fontSize="small"
                />
              )}
              {access === 'Manager' && (
                <SecurityOutlined sx={{ color: '#fff' }} fontSize="small" />
              )}
              {access === 'Accountant' && (
                <LockOpenOutlined sx={{ color: '#fff' }} fontSize="small" />
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
              sendAction('deleted_member', params.row.id)
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
          <PageHeader title={'TEAM'} subtitle={'Managing the Team Members'} />
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
            onClick={() => nav(`/${props.branchID}/registration`)}
          >
            + Add Member
          </Button>
        </Stack>

        <DataGrid rows={filterRows(Rows)} columns={columns} rowHeight={60} />

      </div>
    </div>
  );
};

export default Team;
