/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Stack, TextField } from '@mui/material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import APIService from '../../../APIService';
import { useNavigate, useParams } from 'react-router-dom';

const WorkersUpdateForm = (props) => {
  const { id } = useParams();
  //Saving  the team details in state.
  const [firstNameToUpdate, setFirstNameToUpdate] = useState('');
  const [lastNameToUpdate, setLastNameToUpdate] = useState('');
  const [emailToUpdate, setEmailToUpdate] = useState('');
  const [phoneToUpdate, setPhoneToUpdate] = useState('');

  // Saving Updated information in state.
  const [updatedFirstName, setUpdatedFirstName] = useState('');
  const [updatedLastName, setUpdatedLastName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const navigate = useNavigate();

  // Getting old data from database to display in the input fields:
  useEffect(() => {
    const fetchData = () => {
      fetch('http://127.0.0.1:5000/api/workers/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((data) => {
          setMembers(data);

          console.log(`this is members: ${JSON.stringify(members)}`);
        })
        .catch((error) => console.log(error));
    };

    fetchData();

  }, []);

  // Handling Update API:
  const handleUpdate = () => {
    const userData = {
      updatedFirstName: firstNameToUpdate,
      updatedLastName: lastNameToUpdate,
      updatedEmail: emailToUpdate,
      updatedPhone: phoneToUpdate,
    };

    if (updatedFirstName !== '') {
      userData.updatedFirstName = updatedFirstName;
    }
    if (updatedLastName !== '') {
      userData.updatedLastName = updatedLastName;
    }
    if (updatedEmail !== '') {
      userData.updatedEmail = updatedEmail;
    }
    if (updatedPhone !== '') {
      userData.updatedPhone = updatedPhone;
    }

    APIService.UpdateWorker(id, userData)
      .then((res) => {
        if (res.error) {
          alert(`error: ${res.error}`);
        } else {
          navigate(`/${props.branchID}/Workers`);
        }
      })
      .catch((error) => console.log(error));
  };

  const [members, setMembers] = useState([]);

  // Handeling updating proccess:
  const [FNchangable, setFNChangable] = useState(false);
  const [LNchangable, setLNChangable] = useState(false);
  const [Echangable, setEChangable] = useState(false);
  const [PNchangable, setPNChangable] = useState(false);
  useEffect(() => {
    members.map((item) =>
      FNchangable || LNchangable || Echangable || PNchangable
        ? null
        : (item.id == id && setFirstNameToUpdate(item.firstName),
          item.id == id && setLastNameToUpdate(item.lastName),
          item.id == id && setEmailToUpdate(item.email),
          item.id == id && setPhoneToUpdate(item.phone)),
    );
  }, [members]);

  const handleFNInputChange = (e) => {
    setFNChangable(true);
    setUpdatedFirstName(e.target.value);
  };
  const handleLNInputChange = (e) => {
    setLNChangable(true);
    setUpdatedLastName(e.target.value);
  };
  const handleEInputChange = (e) => {
    setEChangable(true);
    setUpdatedEmail(e.target.value);
  };
  const handlePNInputChange = (e) => {
    setPNChangable(true);
    setUpdatedPhone(e.target.value);
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
      autoComplete="off"
    >
      <PageHeader
        title={'Update a Worker'}
        subtitle={'Update a Worker Informaition'}
      />

      <Stack direction={'row'} spacing={2}>
        <TextField
          name="firstName"
          autoFocus
          value={FNchangable ? updatedFirstName : firstNameToUpdate}
          label="First Name"
          variant="filled"
          sx={{ flexGrow: 0.5 }}
          onChange={handleFNInputChange}
        />
        <TextField
          name="lastname"
          value={LNchangable ? updatedLastName : lastNameToUpdate}
          label="Last Name"
          variant="filled"
          sx={{ flexGrow: 0.5 }}
          onChange={handleLNInputChange}
        />
      </Stack>

      <TextField
        name="email"
        type="email"
        value={Echangable ? updatedEmail : emailToUpdate}
        label="Email"
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={handleEInputChange}
      />

      <TextField
        name="phone"
        label="Phone"
        value={PNchangable ? updatedPhone : phoneToUpdate}
        variant="filled"
        onChange={handlePNInputChange}
      />

      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
          onClick={handleUpdate}
        >
          Update Worker
        </Button>
      </Box>
    </Box>
  );
};

export default WorkersUpdateForm;
