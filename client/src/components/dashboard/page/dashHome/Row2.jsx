import {
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Line from '../lineChart/Line';
import { useEffect, useState } from 'react';
import { DownloadOutlined } from '@mui/icons-material';
import { Transactions } from './data';

const Row2 = () => {
  const theme = useTheme();
  const [direction, setDirection] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [Orders, setOrders] = useState([]);

  useEffect(() => {
    const handleDirection = () => {
      if (window.innerWidth < 600) {
        setDirection('column');
      } else {
        setDirection('row');
      }
    };
    handleDirection();
    window.addEventListener('resize', handleDirection);
    return () => {
      window.removeEventListener('resize', handleDirection);
    };
  }, []);

  // Getting Order Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/orders/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        const reversedOrders = data.reverse();

        setOrders(reversedOrders);
        const orders = data;
        let sum = 0;
        orders.forEach((order) => {
          sum += order.price;
        });

        setTotalPrice(sum);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Stack direction={direction} gap={1.5} sx={{ mt: 3 }} flexWrap={'wrap'}>
      <Paper sx={{ maxWidth: 900, flexGrow: 1, minWidth: "400px" }}>
        <Stack
          direction={'row'}
          gap={1}
          flexWrap={'wrap'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box>
            <Typography
              variant="h6"
              color={theme.palette.secondary.main}
              mb={1}
              mt={2}
              ml={4}
            >
              Revenue Generated
            </Typography>
            <Typography variant="body2" ml={4}>
              ${totalPrice}
            </Typography>
          </Box>

          <Box>
            <IconButton sx={{ mr: 3 }}>
              <DownloadOutlined />
            </IconButton>
          </Box>
        </Stack>

        <Line isDashboard={true} />
      </Paper>

      <Box sx={{ minWidth: "250px", maxHeight: 360, flexGrow: 1, overflow: "auto" }}>
        <Paper>
          <Typography
            variant="h6"
            color={theme.palette.secondary.main}
            fontWeight={'bold'}
            p={1.2}
          >
            Recent Transations
          </Typography>
        </Paper>

        {Orders.map((item, i) => {
          return(
            <Paper
              key={i}
              sx={{
                mt: 0.4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box p={1.2}>
                <Typography variant="body1">{item.id}</Typography>
                <Typography variant="body2">{item.customer} </Typography>
              </Box>
              <Typography variant="body1">{item.date} </Typography>

              <Typography
                borderRadius={1.4}
                p={1}
                bgcolor={theme.palette.error.main}
                color={theme.palette.getContrastText(theme.palette.error.main)}
                variant="body2"
              >
                ${item.price}
              </Typography>
            </Paper>
          )
        })}

      </Box>
    </Stack>
  );
};

export default Row2;
