/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import APIService from '../../../APIService';
import { useNavigate, useParams } from 'react-router-dom';
const initialSelectedWorkers = []; // Define the initial selected workers array outside of the component

const OrderUpdateForm = (props) => {
  const { id } = useParams();
  // Saving old order values in states.
  const [oldDate, setOldDate] = useState('');
  const [oldLicensePlate, setOldLicensePlate] = useState('');
  const [oldCarBrand, setOldCarBrand] = useState('');
  const [oldCarModel, setOldCarModel] = useState('');
  const [oldCustomer, setOldCustomer] = useState('');
  const [oldService, setOldService] = useState('');
  const [oldW1, setOldW1] = useState('');
  const [oldW2, setOldW2] = useState('');
  const [oldW3, setOldW3] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [oldNotes, setOldNotes] = useState('');

  const branchName = localStorage.getItem('branchName');
  const auth = localStorage.getItem('token');

  // Saving Updated information in state.
  const [updatedDate, setUpdatedDate] = useState('');
  const [updatedLicensePlate, setUpdatedLicensePlate] = useState('');
  const [updatedCarBrand, setUpdatedCarBrand] = useState('');
  const [updatedCarModel, setUpdatedCarModel] = useState('');
  const [updatedCustomer, setUpdatedCustomer] = useState('');
  const [updatedService, setUpdatedService] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedNotes, setUpdatedNotes] = useState('');
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [order, setOrder] = useState([]);
  const [workers, setWorkers] = useState([]);

  const branchID = props.branchID
  const navigate = useNavigate();

  useEffect(() => {
    // Getting old order data from database to display in the input fields:
    fetch(`http://127.0.0.1:5000/api/order/get/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setSelectedWorkers([data.W1, data.W2, data.W3]);
        setUpdatedDate(data.date);
        setUpdatedLicensePlate(data.licensePlate);
        setUpdatedCarBrand(data.carBrand);
        setUpdatedCarModel(data.carModel);
        setUpdatedCustomer(data.customer);
        setUpdatedService(data.service);
        setUpdatedPrice(data.price);
        setUpdatedNotes(data.notes);

        setOldDate(data.date);
        setOldLicensePlate(data.licensePlate);
        setOldCarBrand(data.carBrand);
        setOldCarModel(data.carModel);
        setOldCustomer(data.customer);
        setOldService(data.service);
        setOldPrice(data.price);
        setOldNotes(data.notes);
        setOldW1(data.W1);
        setOldW2(data.W2);
        setOldW3(data.W3);



        // Fetch workers data based on the worker IDs from the order data
        const workerIds = [data.W1, data.W2, data.W3];
        Promise.all(
          workerIds
            .map((workerId) =>
              fetch(`/api/worker/get/${workerId}/`).then((response) =>
                response.json(),
              ),
            )
            .then((workersData) => {
              setWorkers(workersData);
              setSelectedWorkers(workerIds);
            }),
        );
        const selectedWorkersCopy = [...selectedWorkers];
        initialSelectedWorkers.push(...selectedWorkersCopy);

      })
      .catch((error) => console.log(error));

    // Getting workers data from API :
    fetch('http://127.0.0.1:5000/api/workers/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data);

        // Update initialSelectedWorkers array with all worker IDs from the API

        const workerIds = data.map((worker) => worker.id);
        // Copy the array before spreading into initialSelectedWorkers
        const workerIdsCopy = [...workerIds];

        initialSelectedWorkers.push(...workerIdsCopy);
      })
      .catch((error) => console.log(error));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const filteredWorkers = workers.filter((row) => row.branchID == branchID);


  // Handling Update API:
  const handleUpdate = () => {
    const orderData = {
      updatedDate: updatedDate,
      updatedLicensePlate: updatedLicensePlate,
      updatedCarBrand: updatedCarBrand,
      updatedCarModel: updatedCarModel,
      updatedCustomer: updatedCustomer,
      updatedService: updatedService,
      updatedPrice: updatedPrice,
      W1: selectedWorkers[0],
      W2: selectedWorkers[1],
      W3: selectedWorkers[2],
      initialSelectedWorkers,
      updatedNotes: updatedNotes,
    };

    APIService.UpdateOrder(id, orderData)
      .then((res) => {
        if (res.error) {
          alert(`error: ${res.error}`);
        } else {
          navigate(`/${props.branchID}/orders`);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleWorkerChange = (index, workerId) => {
    const updatedWorkers = [...selectedWorkers];
    updatedWorkers[index] = workerId;
    setSelectedWorkers(updatedWorkers);
  };




  function sendAction(action) {
    fetch('http://127.0.0.1:5000/notify_frontend_action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        date: updatedDate,
        customer: updatedCustomer,
        service: updatedService,
        price: updatedPrice,
        branchName: branchName,
        licensePlate: updatedLicensePlate,
        carBrand: updatedCarBrand,
        carModel: updatedCarModel,
        W1: selectedWorkers[0],
        W2: selectedWorkers[1],
        W3: selectedWorkers[2],
        notes: updatedNotes,
        auth: auth,
        id: id,

        oldDate: oldDate,
        oldCustomer: oldCustomer,
        oldService: oldService,
        oldPrice: oldPrice,
        oldW1: oldW1,
        oldW2: oldW2,
        oldW3: oldW3,
        oldNotes: oldNotes,
        oldCarBrand: oldCarBrand,
        oldCarModel: oldCarModel,
        oldLicensePlate: oldLicensePlate,
      }),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }




  if (!order) {
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
        title={'Update an Order'}
        subtitle={'Update an Order Informaition'}
      />
      <Typography>Date</Typography>
      <TextField
        name="date"
        autoFocus
        type="date"
        value={updatedDate}
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setUpdatedDate(e.target.value)}
      />
      <TextField
        name="licensePlate"
        value={updatedLicensePlate}
        label="License plate"
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setUpdatedLicensePlate(e.target.value)}
      />

      <TextField
        name="caBrand"
        value={updatedCarBrand}
        label="Car brand"
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setUpdatedCarBrand(e.target.value)}
      />

      <TextField
        name="carModel"
        label="Car model"
        value={updatedCarModel}
        variant="filled"
        onChange={(e) => setUpdatedCarModel(e.target.value)}
      />

      <TextField
        name="customer"
        label="Customer"
        value={updatedCustomer}
        variant="filled"
        onChange={(e) => setUpdatedCustomer(e.target.value)}
      />

      <TextField
        name="service"
        label="Service"
        value={updatedService}
        variant="filled"
        onChange={(e) => setUpdatedService(e.target.value)}
      />

      <TextField
        name="price"
        label="Price"
        type="number"
        InputProps={{ inputMode: 'numeric' }}
        value={updatedPrice}
        variant="filled"
        onChange={(e) => setUpdatedPrice(e.target.value)}
      />
      {selectedWorkers.map((selectedWorkerId, index) => (
        <TextField
          key={index}
          select
          label={`Worker  ${index + 1}`}
          value={selectedWorkerId}
          onChange={(e) => handleWorkerChange(index, e.target.value)}
          variant="filled"
          fullWidth
        >
          <MenuItem value=''>---</MenuItem>
          {filteredWorkers.map((worker) => (
            <MenuItem key={worker.id} value={worker.id}>
              {`${worker.firstName} ${worker.lastName}`}
            </MenuItem>
          ))}
        </TextField>
      ))}

      <TextField
        name="notes"
        label="Notes"
        value={updatedNotes}
        variant="filled"
        onChange={(e) => setUpdatedNotes(e.target.value)}
      />

      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
          onClick={() => {
            handleUpdate();
            sendAction('updated_order');
          }}
        >
          Update Order
        </Button>
      </Box>
    </Box>
  );
};

export default OrderUpdateForm;
