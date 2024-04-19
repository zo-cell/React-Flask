import { Stack, useTheme } from '@mui/material';
import Card from './Card';
import { Email, PersonAdd, PointOfSale, Traffic } from '@mui/icons-material';
import { data1, data2, data3, data4 } from './data';
import { useEffect, useState } from 'react';


const Row1 = () => {
  const theme = useTheme();
  const [Orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [mails, setMails] = useState([]);

  // Getting Order Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/orders/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => console.log(error));
  }, []);

   // Getting Order Data:
   useEffect(() => {
    fetch('http://127.0.0.1:5000/api/customers/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/mail/get/1/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setMails(data.count);

      })
      .catch((error) => console.log(error));
      console.log(mails);
  }, []);
  return (
    <Stack
      mt={3}
      direction={'row'}
      flexWrap={'wrap'}
      gap={2}
      justifyContent={{ xs: 'center', sm: 'space-between' }}

    >
      <Card
        icon={
          <Email
            sx={{ fontSize: '23px', color: theme.palette.secondary.main }}
          />
        }
        title={mails}
        subtitle={'Emails Sent'}
        increase={'+14%'}
        data={data1}
        scheme={"nivo"}
      />
      <Card
        icon={
          <PointOfSale
            sx={{ fontSize: '23px', color: theme.palette.secondary.main }}
          />
        }
        title={Orders.length}
        subtitle={'Sales Optained'}
        increase={'+21%'}
        data={data2}
        scheme={"category10"}
      />
      <Card
        icon={
          <PersonAdd
            sx={{ fontSize: '23px', color: theme.palette.secondary.main }}
          />
        }
        title={customers.length}
        subtitle={'New Clients'}
        increase={'+5%'}
        data={data3}
        scheme={"accent"}
      />
      <Card
        icon={
          <Traffic
            sx={{ fontSize: '23px', color: theme.palette.secondary.main }}
          />
        }
        title={'1,325,134'}
        subtitle={'Traffic Received'}
        increase={'+34%'}
        data={data4}
        scheme={"dark2"}
      />
    </Stack>
  );
};

export default Row1;
