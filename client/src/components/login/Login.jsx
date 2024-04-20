/* eslint-disable react/prop-types */
import { LockOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import APIService from '../APIService';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { Dialog, DialogTitle } from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';

const GOOGLE_CLIENT_ID =
  '986300498034-gdgohhka0scfv04q82uoogb6qrso3fuk.apps.googleusercontent.com';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Wemail, setWEmail] = useState('');
  const [Wpassword, setWPassword] = useState('');
  // const [access, setAccess] = useState('');
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();



  const PassingEmail = (email) => {
    props.PassingEmail(email);

  };

  const PassingAccess = (access) => {
    props.PassingAccess(access);

  };

  const PassingImage = (image) => {
    props.PassingImage(image);


  };

  // getting Workers Data:
  useEffect(() => {
    fetch('https://react-flask-1.onrender.com/api/workers/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data);
      })
      .catch((error) => console.log(error));
  }, []);

  // Google sign in:

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({ clientId: GOOGLE_CLIENT_ID });
    });
  }, []);

  // Call Google People API to get user's information
  // Updated code to fetch only phoneNumber and birthday fields
// const fetchGoogleUserInfo = (response) => {
//   const accessToken = response.accessToken;
//   const userinfo = response.profileObj;
//   fetch(
//     'https://www.googleapis.com/auth/user.birthday.read',
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       const birthday = data && data;
//       // const phoneNumber = data.phoneNumbers && data.phoneNumbers.length > 0 ? data.phoneNumbers[0]?.value : null;
//       console.log('Extracted Birthday:', birthday);
//       // console.log('Extracted Phone Number:', phoneNumber);
//       // Now you can send birthday and phone number to your backend
//       fetch('http://127.0.0.1:5000/google_login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           access_token: accessToken,
//           user_info: userinfo,
//           birthday: birthday,
//           // phone_number: phoneNumber,
//         }),
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then((data) => {
//           const jwtToken = data.access_token;
//           localStorage.setItem('jwtToken', jwtToken);
//           // Redirect to home page or perform any other actions
//           navigate('/1');
//         })
//         .catch((error) => console.error('Error:', error));
//     })
//     .catch((error) => console.error('Error fetching user info:', error));
// };

function sendAction(action, fn, ln, email, access) {
  fetch('https://react-flask-1.onrender.com/notify_frontend_action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: action,
      fn: fn,
      ln: ln,
      email: email,
      access: access,
    }),
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
}

  const responseGoogle = (response) => {
    // fetchGoogleUserInfo(response);

    console.log(response);
    const accessToken = response.accessToken;
    const userinfo = response.profileObj;
    const fn = userinfo.givenName;
    const ln = userinfo.familyName;
    const email = userinfo.email;
    const image = userinfo.imageUrl
    localStorage.setItem('avatar', image);
    console.log(image);
    PassingEmail(email);
    PassingImage(image);
    fetch('https://react-flask-1.onrender.com/google_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        user_info: userinfo,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const encryptedData = CryptoJS.AES.encrypt(
          res.access,
          'SeCrEt@@@19',
        ).toString();
        localStorage.setItem('encryptedData', encryptedData);
        console.log(res);
        return res.json();
      })
      .then((data) => {
        const jwtToken = accessToken;
        localStorage.setItem('jwtToken', jwtToken);
        console.log(data)
        if(data.status === "Not Existed"){

          sendAction('new_user', fn, ln, email, data.access)
        }else{
          console.log('user already exists')
        }
        // const access = data.user_info.access;
        const access = data.access;
        PassingAccess(access);
        localStorage.setItem('ln', ln)
        console.log(`Hey Man This is Your Access: ${access}`)
        localStorage.setItem('token', userinfo.givenName);

        const encryptedDataaa = CryptoJS.AES.encrypt(
          email,
          'SeCrEt@@@19',
        ).toString();
        localStorage.setItem('ec.', encryptedDataaa);
        navigate(`/${props.branchID}`);
        // Redirect to home page or perform any other actions
        navigate('/1');
      })
      .catch((error) => console.error('Error:', error));
  };

  // Handling Administrative login:
  const signIn = () => {
    if (email.length === 0) {
      alert('Please enter a username');
    } else if (password.length === 0) {
      alert('Please enter a password.');
    } else if (password.length < 6) {
      alert('Your password must be at least 8 characters long.');
    } else {
      APIService.login({ email, password })
        .then((res) => {
          if (res.message) {
            alert(`Error: ${res.message}`);
          } else {
            PassingAccess(res.access);
            const encryptedData = CryptoJS.AES.encrypt(
              res.access,
              'SeCrEt@@@19',
            ).toString();
            localStorage.setItem('encryptedData', encryptedData);
            localStorage.setItem('token', res.firstName);
            localStorage.setItem('ln', res.lastName);
            PassingEmail(res.email);

            const encryptedDataaa = CryptoJS.AES.encrypt(
              res.email,
              'SeCrEt@@@19',
            ).toString();
            localStorage.setItem('ec.', encryptedDataaa);
            navigate(`/${props.branchID}`);
          }
        })
        .catch((error) => alert('Failed to log in', error));
    }
  };

  const [branches, setBranches] = useState([]);
  useEffect(() => {
    fetch('https://react-flask-1.onrender.com/api/branches/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  const branchesWithNames = branches.map((branch) => ({
    branchID: branch.id,
    branchName: branch.name,
  }));

  const workerWithSameEmail = workers.find((worker) => worker.email === Wemail);
  const branch = branchesWithNames.find(
    (branch) => branch.branchID === workerWithSameEmail?.branchID,
  );
  const workerWithSameEmailAndBranchNames = {
    ...workerWithSameEmail,
    branchID: branch?.branchID,
    branchName: branch?.branchName,
  };

  const workersWithSameEmail = workers.filter(
    (worker) => worker.email === Wemail,
  );

  const workersWithSameEmailAndBranchNames = workersWithSameEmail.map(
    (worker) => {
      const branch = branchesWithNames.find(
        (branch) => branch.branchID === worker.branchID,
      );
      return {
        ...worker,
        branchID: branch.branchID,
        branchName: branch.branchName,
      };
    },
  );

  //Handling Workers login:
  const WorkerSignIn = (BiD, Bname) => {
    if (Wemail.length === 0) {
      alert('Please enter an Email');
    } else if (Wpassword.length === 0) {
      alert('Please enter a password.');
    } else if (Wpassword.length < 6) {
      alert('Your password must be at least 8 characters long.');
    } else {
      APIService.WorkerLogin({ Wemail, Wpassword })
        .then((res) => {
          if (res.message) {
            alert(`Error: ${res.message}`);
          } else {
            PassingAccess(res.access);
            const encryptedData = CryptoJS.AES.encrypt(
              res.access,
              'SeCrEt@@@19',
            ).toString();
            localStorage.setItem('encryptedData', encryptedData);

            localStorage.setItem('ID', res.id);
            localStorage.setItem('token', res.firstName);
            localStorage.setItem('branchID', BiD);
            localStorage.setItem('branchName', Bname);
            PassingEmail(Wemail);
            const encryptedDataaa = CryptoJS.AES.encrypt(
              res.email,
              'SeCrEt@@@19',
            ).toString();
            localStorage.setItem('ec.', encryptedDataaa);

            navigate(`/${BiD}/WorkersCheck`);
          }
        })
        .catch((error) => alert('Failed to log in', error));
    }
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ height: '100vh', display: 'flex' }}
    >
      {/* Administrative login Form */}
      <Stack direction={'row'}>
        <Box
          sx={{
            pr: 3,
            pl: 3,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid  #c0c0c0',
          }}
        >
          <Box sx={{
            mt: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',}}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in as Administrative
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={signIn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{mt: 3, width: '80%', display :'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 1, pt: 2, borderTop: '1px solid #c0c0c0'}}>
              <Typography>Or</Typography>
              <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                // scope="https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read"
                cookiePolicy={'single_host_origin'}
              />
            </Box>
          </Box>
        </Box>

        {/* Workers Login Form */}
        <Box
          sx={{
            pr: 3,
            pl: 3,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #c0c0c0',
          }}
        >
          <Box sx={{display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', mb: 11}}>
            <Avatar sx={{ m: 1, bgcolor: theme.palette.error.dark }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in as Worker
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                type="email"
                value={Wemail}
                onChange={(e) => setWEmail(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={Wpassword}
                onChange={(e) => setWPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {workersWithSameEmail.length > 1 ? (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  // onClick={WorkerSignIn}
                  onClick={handleOpen}
                >
                  Sign In
                </Button>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() =>
                    WorkerSignIn(
                      workerWithSameEmailAndBranchNames.branchID,
                      workerWithSameEmailAndBranchNames.branchName,
                    )
                  }
                  // onClick={handleOpen}
                >
                  Sign In
                </Button>
              )}

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Choose a branch</DialogTitle>
                {workersWithSameEmailAndBranchNames.map((worker) => (
                  <Button
                    sx={{ mb: 1, textTransform: 'capitalize' }}
                    key={worker.id}
                    onClick={() =>
                      WorkerSignIn(worker.branchID, worker.branchName)
                    }
                  >
                    {worker.branchName}
                  </Button>
                ))}
              </Dialog>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>

        </Box>
      </Stack>
    </Container>
  );
};

export default Login;
