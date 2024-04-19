/* eslint-disable react/prop-types */
import { Box, Typography, useTheme, Stack } from "@mui/material";
import CryptoJS from 'crypto-js';


const PageHeader = ({title, subtitle, isChart = false}) => {
  const theme = useTheme();
  const encryptedDataa = localStorage.getItem('encryptedData');
  const bytes = CryptoJS.AES.decrypt(encryptedDataa, 'SeCrEt@@@19');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  const loggedID = localStorage.getItem('ID');

  return (
    <>
      { decryptedData === 'Worker' ? (
      <Stack justifyContent={'center'} alignItems={'center'} sx={{mb: 3}}>
        <Typography variant="h5" sx={{color: theme.palette.info.light, fontWeight: "bold"}}>{title}</Typography>
        <Typography variant="body1">{subtitle}</Typography>
      </Stack>) : (<Box sx={{ mb: isChart ? 0 : 3 }}>
        <Typography variant="h5" sx={{color: theme.palette.info.light, fontWeight: "bold"}}>{title}</Typography>
        <Typography variant="body1">{subtitle}</Typography>
      </Box>) }
    </>

  );
}

export default PageHeader;
