/* eslint-disable react/prop-types */
import { Box, Button, TextField, Typography } from '@mui/material';
import PageHeader from '../PageHeader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomersCreateForm = (props) => {
  //Setting States for the form inputs and select options.
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [service, setService] = useState('');
  const [price, setPrice] = useState();
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const branchID = props.branchID;

  const navigate = useNavigate();

  // Handling New Order Creation API :
  const handleSubmit = () => {
    //
    const formData = new FormData();
    formData.append('date', date.toString());
    formData.append('name', name);
    formData.append('licensePlate', licensePlate);
    formData.append('carBrand', carBrand);
    formData.append('carModel', carModel);
    formData.append('service', service);
    formData.append('price', price);
    formData.append('image1', image1);
    formData.append('image2', image2);
    formData.append('image3', image3);
    formData.append('branchID', branchID);

    fetch('http://127.0.0.1:5000/api/AddCustomers', {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to upload');
        } else {
          navigate(`/${props.branchID}/customers`);
          return res.json();
        }
      })

      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleInputChange = (event) => {
    const file = event.target.files;
    setImage1(file[0]);
  };

  const handleInputChange2 = (event) => {
    const file = event.target.files;
    setImage2(file[0]);
  };

  const handleInputChange3 = (event) => {
    const file = event.target.files;
    setImage3(file[0]);
  };

  const [csvFile, setCSVFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCSVFile(file);
  };

  const uploadCSV = () => {
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('branchID', branchID);

    fetch('http://127.0.0.1:5000/api/AddCustomers', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        navigate(`/${props.branchID}/customers`);
        console.log(data);
      })
      .catch((error) => {
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
      <PageHeader
        title={'Add Customer'}
        subtitle={'Add a New Cusomer Information'}
      />
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
        name="name"
        label="Customer Name"
        value={name}
        variant="filled"
        onChange={(e) => setName(e.target.value)}
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
        name="service"
        label="Service"
        value={service}
        variant="filled"
        onChange={(e) => setService(e.target.value)}
        sx={{ flexGrow: 0.5 }}
      />

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

      <input
        hidden
        id="image1"
        name="image1"
        type="file"
        label="Image 1"
        onChange={handleInputChange}
      />
      <TextField placeholder="image 1" variant="filled" value={image1} />
      <label
        htmlFor="image1"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Button
          variant="contained"
          component="span"
          sx={{ fontWeight: 600, width: '100%', textTransform: 'capitalize' }}
        >
          Upload Image
        </Button>
      </label>

      <input
        hidden
        id="image2"
        name="image2"
        type="file"
        label="Image 2"
        onChange={handleInputChange2}
      />
      <TextField placeholder="image 2" variant="filled" value={image2} />
      <label
        htmlFor="image2"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Button
          variant="contained"
          component="span"
          sx={{ fontWeight: 600, width: '100%', textTransform: 'capitalize' }}
        >
          Upload Image
        </Button>
      </label>

      <input
        hidden
        id="image3"
        name="image3"
        type="file"
        label="Image 3"
        onChange={handleInputChange3}
      />
      <TextField placeholder="image 3" variant="filled" value={image3} />
      <label
        htmlFor="image3"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Button
          variant="contained"
          component="span"
          sx={{ fontWeight: 600, width: '100%', textTransform: 'capitalize' }}
        >
          Upload Image
        </Button>
      </label>

      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
          onClick={handleSubmit}
        >
          Add Customer
        </Button>
      </Box>

      {/* CSV upload */}
      <Box sx={{ mt: 5, borderTop: '1px solid #c0c0c0', pt: 3 }}>
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input">
          <Button variant="contained" color="primary" component="span">
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

export default CustomersCreateForm;
