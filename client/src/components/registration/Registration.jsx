/* eslint-disable react/prop-types */
import { LockOutlined } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from '../APIService';
import { useForm } from 'react-hook-form';
// import { Theme } from '@fullcalendar/core/internal';
import CryptoJS from 'crypto-js';
import PageHeader from '../dashboard/page/PageHeader';

const data = [
  {
    value: 'Admin',
    label: 'Admin',
  },
  {
    value: 'Manager',
    label: 'Manager',
  },
  {
    value: 'Accountant',
    label: 'Accountant',
  },
];

const Registration = (props) => {

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState(null);
  const [email, setEmail] = useState('');
  const [birthdate, setBirthDate] = useState(null);
  const [phone, setPhoneNumber] = useState('');
  const [access, setAccess] = useState('Admin');
  const [password, setPassword] = useState('');
  const branchID = props.branchID
  const navigate = useNavigate();




  const signUp = () => {
    APIService.InsertUser({
      firstname,
      lastname,
      email,
      birthdate,
      phone,
      access,
      password,
      branchID
    })
      .then((res) => {
        if (res.message) {
          alert(`error: ${res.message}`);
        } else {
          handleClick();
          navigate(`/${props.branchID}/team`);
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


  const encryptedDataa = localStorage.getItem('encryptedData');
  const bytes = CryptoJS.AES.decrypt(encryptedDataa, 'SeCrEt@@@19');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  return (
    <Container component="main" maxWidth="xl" sx={{}}>
      <PageHeader title={'Create new member'} subtitle={'Create a new member account for your team.'} />
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
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
              <Typography>Birth Date</Typography>
              <TextField
                helperText={
                  // eslint-disable-next-line no-extra-boolean-cast
                  Boolean(errors.birthdate)
                    ? 'This field is Required & min 3 character'
                    : null
                }
                error={Boolean(errors.birthdate)}
                {...register('birthdate', { required: true, minLength: 3 })}
                autoComplete="given-name"
                name="birthdate"
                value={birthdate}
                required
                type="date"
                fullWidth
                variant="filled"
                id="birthdate"
                onChange={(e) => setBirthDate(e.target.value)}
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
            {decryptedData === "Admin" ? (<Grid item xs={12} sm={12}>
              <TextField
                name="access"
                variant="filled"
                select
                // value={access}
                label="access"
                defaultValue="Admin"
                onChange={(e) => setAccess(e.target.value)}
                sx={{ width: '100%' }}
              >
                {data.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>) : null}


            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
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

export default Registration;
