/* eslint-disable react/prop-types */
import { LockOutlined } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import PageHeader from '../PageHeader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import APIService from '../../../APIService';

const WorkersRegistration = (props) => {
  //  State for handling the data:
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const branchID = props.branchID;

  const navigate = useNavigate();
  const theme = useTheme();

  // Handling API:
  const signUp = () => {
    APIService.InsertWorker({
      firstname,
      lastname,
      email,
      phone,
      password,
      branchID,
    })
      .then((res) => {
        if (res.message) {
          alert(`error: ${res.message}`);
        } else {
          // props.NewUser(res);
          // localStorage.setItem('token', res.firstName);
          // localStorage.setItem('LoggedIn', true);
          handleClick();
          navigate(`/${props.branchID}/Workers`);
        }
      })
      .catch((error) => console.log(error));
    console.log('doneeeeeee');
  };

  // validation:
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const regEmail =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // success message functions:
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    // navigate('/');
  };

  return (
    <Container component="main" maxWidth="xl" sx={{}}>
      <PageHeader
        title={'Create new worker'}
        subtitle={'Create a new worker account for your team.'}
      />
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: theme.palette.error.dark }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                helperText={
                  // eslint-disable-next-line no-extra-boolean-cast
                  Boolean(errors.firstname)
                    ? 'This field is Required & min 3 character'
                    : null
                }
                error={Boolean(errors.firstname)}
                {...register('firstname', { required: true, minLength: 3 })}
                autoComplete="given-name"
                name="firstname"
                value={firstname}
                required
                fullWidth
                variant="filled"
                id="firstname"
                label="First Name"
                autoFocus
                onChange={(e) => setFirstname(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                helperText={
                  // eslint-disable-next-line no-extra-boolean-cast
                  Boolean(errors.lastname)
                    ? 'This field is Required & min 3 character'
                    : null
                }
                error={Boolean(errors.lastname)}
                {...register('lastname', { required: true, minLength: 3 })}
                autoComplete="given-name"
                name="lastname"
                value={lastname}
                required
                variant="filled"
                fullWidth
                id="lastname"
                label="Last Name"
                onChange={(e) => setLastname(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                helperText={
                  // eslint-disable-next-line no-extra-boolean-cast
                  Boolean(errors.email)
                    ? 'Please enter a valid email address.'
                    : null
                }
                error={Boolean(errors.email)}
                {...register('email', { required: true, pattern: regEmail })}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                variant="filled"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                helperText={
                  // eslint-disable-next-line no-extra-boolean-cast
                  Boolean(errors.phone)
                    ? 'This field is Required & min 3 character'
                    : null
                }
                error={Boolean(errors.phone)}
                {...register('phone', { required: true, minLength: 3 })}
                autoComplete="given-name"
                name="phone"
                value={phone}
                required
                variant="filled"
                fullWidth
                id="phone"
                label="Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                helperText={
                  // eslint-disable-next-line no-extra-boolean-cast
                  Boolean(errors.password)
                    ? 'This field is Required & min 6 character'
                    : null
                }
                error={Boolean(errors.password)}
                {...register('password', { required: true, minLength: 6 })}
                required
                fullWidth
                name="password"
                variant="filled"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit(signUp)}
          >
            Sign Up
          </Button>

          {/* snackbar success message */}
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: '100%' }}
            >
              Account created successfully
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Container>
  );
};

export default WorkersRegistration;
