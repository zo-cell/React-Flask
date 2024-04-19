import { Paper, Stack, Typography, useTheme } from '@mui/material';
import Pie from '../pieChart/Pie';
import Bar from '../barChart/Bar';
import Geo from '../geographyChart/Geo';
import { useEffect, useState } from 'react';


const Row3 = () => {
  const theme = useTheme();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/orders/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {

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
    <Stack direction={'row'} flexWrap={'wrap'} sx={{ mt: 3 }} gap={2}>
      <Paper sx={{ width: '28%', minWidth: '300px', flexGrow: 1 }}>
        <Typography
          color={theme.palette.secondary.main}
          sx={{ padding: '30px 30px 0 30px' }}
          variant="h6"
          fontWeight="600"
        >
          Campaign
        </Typography>
        <Pie isDashboard={true} />
        <Typography variant="h6" align="center" sx={{ mt: '15px' }}>
          ${totalPrice} revenue generated
        </Typography>
        <Typography variant="body2" px={0.7} pb={3} align="center">
          Includes extra misc expenditures and costs
        </Typography>
      </Paper>

      <Paper sx={{ width: '33%', minWidth: '400px', flexGrow: 1 }}>
        <Typography
          color={theme.palette.secondary.main}
          variant="h6"
          fontWeight="600"
          sx={{ padding: '30px 30px 0 30px' }}
        >
          Sales Quantity
        </Typography>

        <Bar isDashboard={true} />
      </Paper>

      <Paper sx={{ width: '33%', minWidth: '400px', flexGrow: 1 }}>
        <Geo isDashboard={true}/>
      </Paper>
    </Stack>
  );
};

export default Row3;
