/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, MenuItem, TextField } from '@mui/material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import APIService from '../../../APIService';
import { useNavigate, useParams } from 'react-router-dom';

const ServiceUpdateForm = (props) => {
  const { id } = useParams();

  // Saving Updated information in state.
  const [oldServicesService, setOldServicesService] = useState('');
  const [oldServicesPrice, setOldServicesPrice] = useState('');
  const [oldServiceType, setOldServiceType] = useState('');
  const [oldPercentage, setOldPercentage] = useState('');

  const [updatedService, setUpdatedService] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedServiceType, setUpdatedServiceType] = useState('');
  const [updatedPercentage, setUpdatedPercentage] = useState('');
  const [service, setService] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Getting old Service data from database to display in the input fields:
    fetch(`http://127.0.0.1:5000/api/service/get/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setService(data);
        setUpdatedService(data.service);
        setUpdatedPrice(data.price);
        setUpdatedServiceType(data.serviceType);
        setUpdatedPercentage(data.percentage);

        setOldServicesService(data.service);
        setOldServicesPrice(data.price);
        setOldServiceType(data.serviceType);
        setOldPercentage(data.percentage);
      })
      .catch((error) => console.log(error));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const branchName = localStorage.getItem('branchName');
  const auth = localStorage.getItem('token');
  // Handling Update API:
  const handleUpdate = () => {
    const serviceData = {
      updatedService: updatedService,
      updatedPrice: updatedPrice,
      updatedServiceType: updatedServiceType,
      updatedPercentage: updatedPercentage,
    };

    APIService.UpdateService(id, serviceData)
      .then((res) => {
        if (res.error) {
          alert(`error: ${res.error}`);
        } else {
          navigate(`/${props.branchID}/services`);
        }
      })
      .catch((error) => console.log(error));
  };

  function sendAction(action) {
    fetch('http://127.0.0.1:5000/notify_frontend_action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        updatedService: updatedService,
        updatedPrice: updatedPrice,
        updatedServiceType: updatedServiceType,
        updatedPercentage: updatedPercentage,

        oldServicesService: oldServicesService,
        oldServicesPrice: oldServicesPrice,
        oldServiceType: oldServiceType,
        oldPercentage: oldPercentage,

        auth: auth,
        branchName: branchName,
        serviceID: id,
      }),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        pt: 2,
        pb: 5,
      }}
      noValidate
      autoComplete="off"
    >
      <PageHeader
        title={'Update a Service'}
        subtitle={'Update a Service Details'}
      />

      <TextField
        name="service"
        label="Service"
        autoFocus
        value={updatedService}
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setUpdatedService(e.target.value)}
      />
      <TextField
        name="price"
        value={updatedPrice}
        label="Price"
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setUpdatedPrice(e.target.value)}
      />

      <TextField
        name="serviceType"
        value={updatedServiceType}
        select
        label="Service Type"
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setUpdatedServiceType(e.target.value)}
      >
        <MenuItem value={'Percentage %'}>Percentage %</MenuItem>
        <MenuItem value={'Fixed'}>Fixed</MenuItem>
      </TextField>

      <TextField
        name="percentage"
        label="Percentage"
        value={updatedPercentage}
        variant="filled"
        onChange={(e) => setUpdatedPercentage(e.target.value)}
      />

      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
          onClick={() => {
            handleUpdate();
            sendAction('updated_service');
          }}
        >
          Update Service
        </Button>
      </Box>
    </Box>
  );
};

export default ServiceUpdateForm;
