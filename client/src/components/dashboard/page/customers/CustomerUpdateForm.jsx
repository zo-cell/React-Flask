/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, TextField, Typography } from '@mui/material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CustomerUpdateForm = (props) => {
  const { id } = useParams();

  // Saving Updated information in state.
  const [updatedDate, setUpdatedDate] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedLicensePlate, setUpdatedLicensePlate] = useState('');
  const [updatedCarBrand, setUpdatedCarBrand] = useState('');
  const [updatedCarModel, setUpdatedCarModel] = useState('');
  const [updatedService, setUpdatedService] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedImage1, setUpdatedImage1] = useState('');
  const [updatedImage2, setUpdatedImage2] = useState('');
  const [updatedImage3, setUpdatedImage3] = useState('');

  const [customer, setCustomer] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Getting old order data from database to display in the input fields:
    fetch(`http://127.0.0.1:5000/api/customer/get/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
        setUpdatedDate(data.date);
        setUpdatedName(data.name);
        setUpdatedLicensePlate(data.licensePlate);
        setUpdatedCarBrand(data.carBrand);
        setUpdatedCarModel(data.carModel);
        setUpdatedService(data.service);
        setUpdatedPrice(data.price);
        setUpdatedImage1(data.image1);
        setUpdatedImage2(data.image2);
        setUpdatedImage3(data.image3);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handling Update API:

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('updatedDate', updatedDate.toString());
    formData.append('updatedName', updatedName);
    formData.append('updatedLicensePlate', updatedLicensePlate);
    formData.append('updatedCarBrand', updatedCarBrand);
    formData.append('updatedCarModel', updatedCarModel);
    formData.append('updatedService', updatedService);
    formData.append('updatedPrice', updatedPrice);
    formData.append('updatedImage1', updatedImage1);
    formData.append('updatedImage2', updatedImage2);
    formData.append('updatedImage3', updatedImage3);


    fetch(`http://127.0.0.1:5000/api/customers/update/${id}/`, {
      method: 'PUT',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to upload');
        } else {
          navigate(`/${props.branchID}/customers`)
          return res.json();
        }

      })

      .catch((error) => {
        console.error('Error ystaaa:', error);
      });
      console.log(updatedImage1)
      console.log(updatedImage2)
      console.log(updatedImage3)
  };

  const handleInputChange = (event) => {
    const file = event.target.files;
    setUpdatedImage1(file[0]);
  };

  const handleInputChange2 = (event) => {
    const file = event.target.files;
    setUpdatedImage2(file[0]);
  };

  const handleInputChange3 = (event) => {
    const file = event.target.files;
    setUpdatedImage3(file[0]);
  };

  if (!customer) {
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
        title={'Update a Customer'}
        subtitle={'Update a Customer Informaition'}
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
        name="name"
        label="Customer Name"
        value={updatedName}
        variant="filled"
        onChange={(e) => setUpdatedName(e.target.value)}
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
      <input
        hidden
        id="image1"
        name="image1"
        type="file"
        label="Image 1"
        onChange={handleInputChange}
      />
      <TextField placeholder="image 1" variant="filled" value={updatedImage1} />
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
      <TextField placeholder="image 2" variant="filled" value={updatedImage2} />
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
      <TextField placeholder="image 3" variant="filled" value={updatedImage3} />
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
          onClick={handleUpdate}
        >
          Update Customer
        </Button>
      </Box>
    </Box>
  );
};

export default CustomerUpdateForm;
