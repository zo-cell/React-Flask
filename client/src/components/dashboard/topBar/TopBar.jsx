import {
  DarkModeOutlined,
  LightModeOutlined,
  NotificationsOutlined,
  Person2Outlined,
  SettingsOutlined,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  alpha,
  styled,
  useTheme,
} from '@mui/material';
// import { useState } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import SearchIcon from '@mui/icons-material/Search';
import { ColorModeContext } from '../../../Theme';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from '../../APIService';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CryptoJS from 'crypto-js';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// eslint-disable-next-line react/prop-types
const TopBar = ({ open, handleDrawerOpen }) => {
  const [data, setData] = useState([]);
  const [workers, setWorkers] = useState([]);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const nav = useNavigate();
  const loggedInWorker = localStorage.getItem('ID');
  const user = localStorage.getItem('token');
  const [anchorUS, setAnchorUS] = useState(null);
  const openUS = Boolean(anchorUS);

  const [anchorBR, setAnchorBR] = useState(null);
  const openBR = Boolean(anchorBR);

  const [openDrawer, setOpenDrawer] = useState(false);
  const handleClick = (event) => {
    setAnchorUS(event.currentTarget);
  };
  const handleClick2 = (event) => {
    setAnchorBR(event.currentTarget);
  };
  const handleCloseUS = () => {
    setAnchorUS(null);
  };
  const handleCloseUS2 = () => {
    setAnchorBR(null);
  };

  const handleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const [emailState, setEmailState] = useState();
  const [status, setStatus] = useState();
  const email = localStorage.getItem('ec.');
  const LocalAccess = localStorage.getItem('encryptedData');
  const [Access, setAccess] = useState([]);

  useEffect(() => {
    if(LocalAccess){
      const bytes = CryptoJS.AES.decrypt(LocalAccess, 'SeCrEt@@@19');
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      setAccess(decryptedData);
    }
  }, [LocalAccess]);
  console.log(Access);

  useEffect(() => {
    if (email) {
      const bytes = CryptoJS.AES.decrypt(email, 'SeCrEt@@@19');
      const decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
      setEmailState(decryptedEmail);
      console.log(emailState)
    }
  }, [email]); // Add email to the dependency array

  useEffect(() => {
    if (data && emailState) {
      const loggedEmail = data.find((item) => item.email === emailState);
      if (loggedEmail) {
        const loggedEmailStatus = loggedEmail.status;
        setStatus(loggedEmailStatus);
        console.log(emailState);
        console.log(status);
      }
    }
  }, [data, emailState, status]); // Add emailState to the dependency array

  useEffect(() => {
    if (workers && emailState) {
      const loggedEmail = workers.find((item) => item.email === emailState);
      if (loggedEmail) {
        const loggedEmailStatus = loggedEmail.status;
        setStatus(loggedEmailStatus);
        console.log(emailState);
        console.log(status);
      }
    }
  }, [workers, emailState]);

  const signOut = () => {
    APIService.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('tokens');
    localStorage.removeItem('ec.');
    localStorage.removeItem('encryptedData');
    nav('/login');

    if (loggedInWorker) {
      APIService.WorkerLogin({ emailState })
        .then((res) => {
          if (res.message) {
            alert(`Error: ${res.message}`);
          } else {
            localStorage.removeItem('ID');
            console.log('logged out !!!...');
          }
        })
        .catch((error) => alert('Failed to log in', error));
    } else {
      APIService.login({ emailState })
        .then((res) => {
          if (res.message) {
            alert(`Error: ${res.message}`);
          } else {
            console.log('logged out !!!...');
          }
        })
        .catch((error) => alert('Failed to log in', error));
    }
  };

  function HiUser() {
    return (
      <Box sx={{ color: '#fff' }}>
        <Typography
          sx={{ fontSize: 14, fontWeight: '600', textTransform: 'capitalize' }}
        >
          Hi,
        </Typography>
        <Typography
          sx={{ fontSize: 14, fontWeight: '600', textTransform: 'capitalize' }}
        >
          {user}
        </Typography>
      </Box>
    );
  }

  // Getting Branches data from API:
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState('');
  const [nameToShow, setNameToShow] = useState('');
  const [location, setLocation] = useState('');
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/branches/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  // Handling New Branch Creation API :
  const handleSubmit = () => {
    APIService.InsertBranch({
      name: name,
      location: location,
    })
      .then((res) => {
        if (res.message) {
          alert(`error: ${res.message}`);
        } else {
          // navigate('/orders');
          window.location.reload();
        }
      })
      .catch((error) => console.log(error));
    console.log('Success');
  };

  const localBranchName = localStorage.getItem('branchName');
  useEffect(() => {
    setNameToShow(localBranchName);
  }, [localBranchName]);

  //Members Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.log(error));
    // console.log(editedData)
  }, []);

  // getting Workers Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/workers/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction={'row'}>
          {Access === "Admin" && (
            <IconButton
              sx={{
                textTransform: 'capitalize',
                height: '55px',
                color: 'white',
                fontSize: '25px',
              }}
              onClick={handleDrawer}
            >
              +
            </IconButton>
          )}
          <Drawer anchor="top" open={openDrawer} onClose={handleDrawer}>
            <DrawerHeader>
              <IconButton></IconButton>
            </DrawerHeader>
            <TextField
              label="Branch Name"
              variant="filled"
              sx={{ mt: 2, mb: 1 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Location"
              variant="filled"
              sx={{ mb: 3 }}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Stack justifyContent={'center'} alignItems={'center'}>
              <Button
                variant="contained"
                sx={{ mb: 3, width: '30%', textTransform: 'capitalize' }}
                onClick={handleSubmit}
              >
                Add New Branch
              </Button>
            </Stack>
          </Drawer>
          {loggedInWorker ? (
            <Button sx={{ color: 'white', textTransform: 'capitalize', mr: 2 }}>
              {nameToShow}
            </Button>
          ) : (
            <Button
              id="demo-positioned-button1"
              aria-controls={openBR ? 'demo-positioned-menu1' : undefined}
              aria-haspopup="true"
              aria-expanded={openBR ? 'true' : undefined}
              onClick={handleClick2}
              sx={{ color: 'white', textTransform: 'capitalize', mr: 2 }}
            >
              {nameToShow}
              {openBR ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Button>
          )}

          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorBR}
            open={openBR}
            onClose={handleCloseUS2}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{ mt: 7 }}
          >
            {/* <MenuItem onClick={handleCloseUS}>Profile</MenuItem> */}
            {branches.map((branch) => (
              <MenuItem
                key={branch.id}
                onClick={() => {
                  handleCloseUS2();
                  localStorage.setItem('branchName', branch.name);
                  localStorage.setItem('branchID', branch.id);

                  nav(`/${branch.id}`);
                }}
              >
                {branch.name}
              </MenuItem>
            ))}
            {/* <MenuItem onClick={handleCloseUS}>My account</MenuItem>
            <MenuItem onClick={signOut}>Logout</MenuItem> */}
          </Menu>

          <IconButton
            color="inherit"
            onClick={() => {
              localStorage.setItem(
                'mode',
                theme.palette.mode === 'dark' ? 'light' : 'dark',
              );
              colorMode.toggleColorMode();
            }}
          >
            {theme.palette.mode === 'light' ? (
              <LightModeOutlined sx={{ color: theme.palette.warning.light }} />
            ) : (
              <DarkModeOutlined sx={{ color: theme.palette.info.main }} />
            )}
          </IconButton>

          <IconButton color="inherit">
            <NotificationsOutlined />
          </IconButton>

          <IconButton color="inherit">
            <SettingsOutlined />
          </IconButton>

          {status === 'Logged In' ? (
            <div>
              <Button
                id="demo-positioned-button"
                aria-controls={openUS ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openUS ? 'true' : undefined}
                onClick={handleClick}
              >
                <HiUser />
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorUS}
                open={openUS}
                onClose={handleCloseUS}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{ mt: 7 }}
              >
                {/* <MenuItem onClick={handleCloseUS}>Profile</MenuItem> */}
                <MenuItem onClick={handleCloseUS}>My account</MenuItem>
                <MenuItem onClick={signOut}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <IconButton color="inherit" onClick={() => nav('/login')}>
              <Person2Outlined />
            </IconButton>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
