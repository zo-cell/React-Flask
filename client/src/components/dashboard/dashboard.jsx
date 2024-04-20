/* eslint-disable react/prop-types */
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
import TopBar from './topBar/TopBar';
import SideBar from './sideBar/SideBar';
import { Outlet } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { useEffect } from 'react';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function Dashboard(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const encryptedDataa = localStorage.getItem('encryptedData');
  const bytes = CryptoJS.AES.decrypt(encryptedDataa, 'SeCrEt@@@19');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);


  return (
    <Box sx={{ display: 'flex', bgcolor: theme.palette.background.paper }}>
      {/* <CssBaseline /> */}
      <TopBar open={open} handleDrawerOpen={handleDrawerOpen} />

      {decryptedData !== 'Worker' && (
        // eslint-disable-next-line react/prop-types
        <SideBar open={open} handleDrawerClose={handleDrawerClose} branchID={props.pranchID} image={props.image} access={props.access} />
      )}

      {decryptedData === 'Worker' ? (
        <Box sx={{ flexGrow: 1, p: 2, pl: 2 }}>
          <DrawerHeader sx={{ mt: '-5px' }} />
          <Outlet />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, p: 2, pl: 10 }}>
          <DrawerHeader sx={{ mt: '-5px' }} />
          <Outlet />
        </Box>
      )}
    </Box>
  );
}
