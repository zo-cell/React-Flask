import { Stack, Typography } from '@mui/material';

const NoAccess = () => {
  return (
    <Stack sx={{height: '100vh', justifyContent: 'center', alignItems: 'center', bgColor: 'red'}}>
      <Typography variant='h1'>Welcome</Typography>

      <Typography variant='h2' sx={{color: 'black'}}>Reviewing your account...</Typography>

      <Typography variant='h3'>
        We will contact you as soon as possible.
      </Typography>
    </Stack>
  );
}

export default NoAccess;
