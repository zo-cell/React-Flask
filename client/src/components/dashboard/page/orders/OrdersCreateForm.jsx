/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import APIService from '../../../APIService';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const OrderCreateForm = (props) => {
  //Setting States for the form inputs and select options.
  const branchID = props.branchID;

  const [date, setDate] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [customer, setCustomer] = useState('');
  const [service, setService] = useState('');
  const [price, setPrice] = useState();

  const [notes, setNotes] = useState('');

  const [worker1_id, setWorker1Id] = useState('');
  const [worker2_id, setWorker2Id] = useState('');
  const [worker3_id, setWorker3Id] = useState('');

  const [firstName1, setFirstName1] = useState('');
  const [lastName1, setLastName1] = useState('');

  const [firstName2, setFirstName2] = useState('');
  const [lastName2, setLastName2] = useState('');

  const [firstName3, setFirstName3] = useState('');
  const [lastName3, setLastName3] = useState('');

  const [serviceType, setServiceType] = useState('Percentage');
  // eslint-disable-next-line no-unused-vars
  const [isPercentage, setIsPercentage] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [fixedCommission, setFixedCommission] = useState('');

  const [Rows, setRows] = useState([]);
  const [lastId, setLastId] = useState(null);

  const branchName = localStorage.getItem('branchName');
  const auth = localStorage.getItem('token');
  const LocalAccess = localStorage.getItem('encryptedData');
  const [Access, setAccess] = useState('');

  useEffect(() => {
    if (LocalAccess) {
      const bytes = CryptoJS.AES.decrypt(LocalAccess, 'SeCrEt@@@19');
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      setAccess(decryptedData);
    }
  }, [LocalAccess]);
  console.log(Access);

  // Getting workers data from API :
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = () => {
      fetch('http://127.0.0.1:5000/api/workers/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((data) => {
          setWorkers(data);

          console.log(`this is members: ${JSON.stringify(workers)}`);
        })
        .catch((error) => console.log(error));
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filteredWorkers = workers.filter((row) => row.branchID == branchID);

  // Handling Worker Selection :
  const selectWorkerHandler1 = (event) => {
    const selectedWorkerId = event.target.value;
    const selectedWorker = workers.find(
      (worker) => worker.id === selectedWorkerId,
    );

    if (selectedWorker) {
      const worker1_ID = selectedWorker.id;
      const worker1_firstName = selectedWorker.firstName;
      const worker1_lastName = selectedWorker.lastName;

      console.log(worker1_firstName);
      setWorker1Id(worker1_ID);
      setFirstName1(worker1_firstName);
      setLastName1(worker1_lastName);
    }
  };
  const selectWorkerHandler2 = (event) => {
    const selectedWorkerId = event.target.value;
    const selectedWorker = workers.find(
      (worker) => worker.id === selectedWorkerId,
    );

    if (selectedWorker) {
      const worker2_ID = selectedWorker.id;
      const worker2_firstName = selectedWorker.firstName;
      const worker2_lastName = selectedWorker.lastName;

      console.log(worker2_firstName);
      setWorker2Id(worker2_ID);
      setFirstName2(worker2_firstName);
      setLastName2(worker2_lastName);
    }
  };
  const selectWorkerHandler3 = (event) => {
    const selectedWorkerId = event.target.value;
    const selectedWorker = workers.find(
      (worker) => worker.id === selectedWorkerId,
    );

    if (selectedWorker) {
      const worker3_ID = selectedWorker.id;
      const worker3_firstName = selectedWorker.firstName;
      const worker3_lastName = selectedWorker.lastName;

      console.log(worker3_firstName);
      setWorker3Id(worker3_ID);
      setFirstName3(worker3_firstName);
      setLastName3(worker3_lastName);
    }
  };

  // Handling New Order Creation API :
  const handleSubmit = () => {
    //

    APIService.InsertOrder({
      date,
      licensePlate,
      carBrand,
      carModel,
      customer,
      service,
      fixedCommission,
      price,
      W1: worker1_id,
      W2: worker2_id,
      W3: worker3_id,
      notes,
      firstName1,
      lastName1,
      firstName2,
      lastName2,
      firstName3,
      lastName3,
      branchID,
    })
      .then((res) => {
        if (res.message) {
          alert(`error: ${res.message}`);
        } else {
          navigate(`/${props.branchID}/orders`);
        }
      })
      .catch((error) => console.log(error));
    console.log('Success');
  };

  // Getting Order Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/orders/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (Rows.length > 0) {
      const maxId = Math.max(...Rows.map((row) => row.id));
      setLastId(maxId + 1);
    }
  }, [Rows]);

  console.log(lastId);

  function sendAction(action) {
    fetch('http://127.0.0.1:5000/notify_frontend_action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        date: date,
        customer: customer,
        service: service,
        licensePlate: licensePlate,
        carBrand: carBrand,
        carModel: carModel,
        notes: notes,
        price: price,
        branchName: branchName,
        Access: Access,
        auth: auth,
        id: lastId,
        W1: worker1_id,
        W2: worker2_id,
        W3: worker3_id,
      }),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }

  // Handling ServiceType:
  useEffect(() => {
    if (serviceType === 'Percentage') {
      setIsPercentage(true);
      setIsFixed(false);
    } else {
      setIsPercentage(false);
      setIsFixed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType]);

  const [csvFile, setCSVFile] = useState(null);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCSVFile(file);
  };

  const uploadCSV = () => {
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('branchID', branchID);

    fetch('http://127.0.0.1:5000/api/AddOrders', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      navigate(`/${props.branchID}/orders`);
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

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
      autoComplete="on"
    >
      <PageHeader title={'Add Order'} subtitle={'Add a New Order Details'} />
      <Typography>Date</Typography>
      <TextField
        name="date"
        type="date"
        autoFocus
        value={date}
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setDate(e.target.value)}
        // autoComplete
      />
      <TextField
        name="licensePlate"
        value={licensePlate}
        label="License plate"
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setLicensePlate(e.target.value)}
        // autoComplete
      />

      <TextField
        name="carBrand"
        value={carBrand}
        label="Car brand"
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setCarBrand(e.target.value)}
        // autoComplete
      />

      <TextField
        name="carModel"
        label="Car Model"
        value={carModel}
        variant="filled"
        onChange={(e) => setCarModel(e.target.value)}
        // autoComplete
      />

      <TextField
        name="customer"
        label="Customer"
        value={customer}
        variant="filled"
        onChange={(e) => setCustomer(e.target.value)}
        // autoComplete
      />

      <Stack direction={'row'} gap={2}>
        <TextField
          name="service"
          label="Service"
          value={service}
          variant="filled"
          onChange={(e) => setService(e.target.value)}
          sx={{ flexGrow: 0.5 }}
        />

        <TextField
          name="serviceType"
          label="Service Type"
          select
          value={serviceType}
          variant="filled"
          onChange={(e) => setServiceType(e.target.value)}
          sx={{ flexGrow: 0.5 }}
        >
          <MenuItem value={'Percentage'}>Percentage</MenuItem>
          <MenuItem value={'Fixed'}>Fixed</MenuItem>
        </TextField>
      </Stack>

      {isFixed && (
        <Stack>
          <em style={{ color: 'red' }}>
            Set Fixed Worker Commission For This Service
          </em>
          <TextField
            name="fixedCommission"
            label="Set Fixed Commission"
            type="number"
            InputProps={{ inputMode: 'numeric' }}
            value={fixedCommission}
            variant="filled"
            onChange={(e) => setFixedCommission(e.target.value)}
            // autoComplete
          />
        </Stack>
      )}

      <TextField
        name="price"
        label="Price"
        type="number"
        InputProps={{ inputMode: 'numeric' }}
        value={price}
        variant="filled"
        onChange={(e) => setPrice(e.target.value)}
        // autoComplete
      />

      <TextField
        variant="filled"
        select
        label="Worker 1"
        value={worker1_id}
        // defaultValue={'---'}
        onChange={selectWorkerHandler1}
      >
        <MenuItem value=''>
          <em>---</em>
        </MenuItem>
        {filteredWorkers.map((worker) => (
          <MenuItem key={worker.id} value={worker.id}>
            {`${worker.id} ${worker.firstName} ${worker.lastName}`}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        variant="filled"
        select
        label="Worker 2"
        value={worker2_id}
        // defaultValue={'---'}
        onChange={selectWorkerHandler2}
      >
        <MenuItem value=''>
          <em>---</em>
        </MenuItem>
        {filteredWorkers.map((worker) => (
          <MenuItem key={worker.id} value={worker.id}>
            {`${worker.id} ${worker.firstName} ${worker.lastName}`}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        variant="filled"
        select
        label="Worker 3"
        value={worker3_id}
        // defaultValue={'---'}
        onChange={selectWorkerHandler3}
      >
        <MenuItem value=''>
          <em>---</em>
        </MenuItem>
        {filteredWorkers.map((worker) => (
          <MenuItem key={worker.id} value={worker.id}>
            {`${worker.id} ${worker.firstName} ${worker.lastName}`}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        name="notes"
        label="Notes"
        value={notes}
        variant="filled"
        onChange={(e) => setNotes(e.target.value)}
      />

      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
          onClick={() => {
            handleSubmit();
            sendAction('new_order');
          }}
        >
          Add Order
        </Button>
      </Box>

      {/* CSV upload */}
      <Box sx={{mt: 5, borderTop: '1px solid #c0c0c0', pt: 3}}>
      <input
        id="file-input"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-input">
        <Button
          variant="contained"
          color="primary"
          component="span"
        >
          Upload CSV File
        </Button>
      </label>
      <Typography variant="body1">
        {csvFile && `Selected file: ${csvFile.name}`}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={uploadCSV}
        disabled={!csvFile}
      >
        Upload
      </Button>
      </Box>
    </Box>
  );
};

export default OrderCreateForm;
