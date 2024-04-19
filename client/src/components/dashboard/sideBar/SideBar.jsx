import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import {
  AttachMoney,
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  ElectricalServices,
  Engineering,
  HelpOutlineOutlined,
  HomeOutlined,
  MapOutlined,
  PeopleOutline,
  PersonAdd,
  PieChartOutlineOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WorkHistoryOutlined,
} from '@mui/icons-material';
import { Avatar, Tooltip, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

// eslint-disable-next-line react/prop-types
const SideBar = ({ open, handleDrawerClose, branchID, image }) => {
  const Array1 = [
    { text: 'Dashboard', icon: <HomeOutlined />, path: '' },
    { text: 'Manage Team', icon: <PeopleOutline />, path: 'team' },
    { text: 'Manage Workers', icon: <Engineering />, path: 'Workers' },
    { text: 'Manage Orders', icon: <ReceiptOutlined />, path: 'orders' },
    { text: 'Manage Jobs', icon: <WorkHistoryOutlined />, path: 'Jobs' },
  ];

  const Array2 = [
    { text: 'Salary Reports', icon: <AttachMoney />, path: 'salary' },
    { text: 'Manage Services', icon: <ElectricalServices />, path: 'services' },

    {
      text: 'Customer Information',
      icon: <ContactsOutlined />,
      path: 'customers',
    },
    { text: 'Calendar', icon: <CalendarTodayOutlined />, path: 'calendar' },
  ];

  const Array3 = [
    { text: 'Bar Chart', icon: <BarChartOutlined />, path: 'bar' },
    { text: 'Pie Chart', icon: <PieChartOutlineOutlined />, path: 'pie' },
    { text: 'Line Chart', icon: <TimelineOutlined />, path: 'line' },
    { text: 'Geography Chart', icon: <MapOutlined />, path: 'geography' },
  ];

  // console.log(image)

  const img = localStorage.getItem('avatar');
  const avatar = img;

  const theme = useTheme();
  const nav = useNavigate();
  let location = useLocation();
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{ position: 'fixed', zIndex: 10 }}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Divider />
      <Avatar
        sx={{
          mx: 'auto',
          my: 1,
          border: '2px solid grey',
          height: open ? 88 : 44,
          width: open ? 88 : 44,
          transition: '0.25s',
        }}
        alt="shady samy"
        src="https://img6.arthub.ai/64a00797-3e59.webp"
      />
      <Typography
        align="center"
        sx={{ fontSize: open ? 17 : 0, transition: '0.25s' }}
      >
        Shady Samy
      </Typography>
      <Typography
        align="center"
        sx={{
          fontSize: open ? 15 : 0,
          transition: '0.25s',
          color: theme.palette.info.main,
        }}
      >
        Admin
      </Typography>

      <Divider />

      <List>
        {Array1.map((item, i) => (
          <ListItem key={i} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={open ? null : item.text} placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor:
                    location.pathname === '/dashboard/' + item.path ||
                    location.pathname === '/dashboard' + item.path
                      ? theme.palette.mode === 'dark'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300]
                      : null,
                }}
                onClick={() => nav(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {Array2.map((item, i) => (
          <ListItem key={i} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={open ? null : item.text} placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor:
                    location.pathname === '/dashboard/' + item.path
                      ? theme.palette.mode === 'dark'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300]
                      : null,
                }}
                onClick={() => nav(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {Array3.map((item, i) => (
          <ListItem key={i} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={open ? null : item.text} placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor:
                    location.pathname === '/dashboard/' + item.path
                      ? theme.palette.mode === 'dark'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[300]
                      : null,
                }}
                onClick={() => nav(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
