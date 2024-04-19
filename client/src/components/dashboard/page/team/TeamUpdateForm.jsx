/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import PageHeader from '../PageHeader';
import { useNavigate, useParams } from 'react-router-dom';
import APIService from '../../../APIService';
import CryptoJS from 'crypto-js';

const data2 = [
  {
    value: 'Admin',
    label: 'Admin',
  },
  {
    value: 'Manager',
    label: 'Manager',
  },
  {
    value: 'Accountant',
    label: 'Accountant',
  },
];

const TeamUpdateForm = (props) => {
  const { id } = useParams();
  //Saving  the team details in state.
  const [firstNameToUpdate, setFirstNameToUpdate] = useState('');
  const [lastNameToUpdate, setLastNameToUpdate] = useState('');
  const [emailToUpdate, setEmailToUpdate] = useState('');
  const [ageToUpdate, setAgeToUpdate] = useState('');
  const [phoneToUpdate, setPhoneToUpdate] = useState('');
  const [accessToUpdate, setAccessToUpdate] = useState('Admin');
  const [branchToUpdate, setBranchToUpdate] = useState('');

  // Saving Updated information in state.
  const [updatedFirstName, setUpdatedFirstName] = useState('');
  const [updatedLastName, setUpdatedLastName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedAge, setUpdatedAge] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updatedAccess, setUpdatedAccess] = useState('');
  const [updatedBranch, setUpdatedBranch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/member/get/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {

        setUpdatedFirstName(data.firstName);
        setUpdatedLastName(data.lastName);
        setUpdatedEmail(data.email);
        setUpdatedAge(data.age);
        setUpdatedPhone(data.phone);
        setUpdatedAccess(data.access);
        setUpdatedBranch(data.branchID);

        setFirstNameToUpdate(data.firstName);
        setLastNameToUpdate(data.lastName);
        setEmailToUpdate(data.email);
        setAgeToUpdate(data.age);
        setPhoneToUpdate(data.phone);
        setAccessToUpdate(data.access);
        setBranchToUpdate(data.branchID);
      })
      .catch((error) => console.log(error));
  }, []);
  // Create A new Product API:
  const handleUpdate = () => {
    const userData = {
      updatedFirstName: updatedFirstName,
      updatedLastName: updatedLastName,
      updatedEmail: updatedEmail,
      updatedAge: updatedAge,
      updatedPhone: updatedPhone,
      updatedAccess: updatedAccess,
      updatedBranch: updatedBranch,
    };

    // if (updatedFirstName !== '') {
    //   userData.updatedFirstName = updatedFirstName;
    // }
    // if (updatedLastName !== '') {
    //   userData.updatedLastName = updatedLastName;
    // }
    // if (updatedEmail !== '') {
    //   userData.updatedEmail = updatedEmail;
    // }
    // if (updatedAge !== '') {
    //   userData.updatedAge = updatedAge;
    // }
    // if (updatedPhone !== '') {
    //   userData.updatedPhone = updatedPhone;
    // }
    // if (updatedAccess !== '') {
    //   userData.updatedAccess = updatedAccess;
    // }
    // if (updatedBranch !== '') {
    //   userData.updatedBranch = updatedBranch;
    // }

    console.log(userData);

    APIService.UpdateMember(id, userData)
      .then((res) => {
        if (res.error) {
          alert(`error: ${res.error}`);
        } else {
          navigate(`/${props.branchID}/team`);
        }
      })
      .catch((error) => console.log(error));
  };

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://127.0.0.1:5000/api/get', {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/branches/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  // const [FNchangable, setFNChangable] = useState(false);
  // const [LNchangable, setLNChangable] = useState(false);
  // const [Echangable, setEChangable] = useState(false);
  // const [AGchangable, setAGChangable] = useState(false);
  // const [PNchangable, setPNChangable] = useState(false);
  // const [ACchangable, setACChangable] = useState(false);
  // const [BNchangable, setBNChangable] = useState(false);
  // useEffect(() => {
  //   members.map((item) =>
  //     FNchangable ||
  //     LNchangable ||
  //     Echangable ||
  //     AGchangable ||
  //     PNchangable ||
  //     ACchangable ||
  //     BNchangable
  //       ? null
  //       : (item.id == id && setFirstNameToUpdate(item.firstName),
  //         item.id == id && setLastNameToUpdate(item.lastName),
  //         item.id == id && setEmailToUpdate(item.email),
  //         item.id == id && setAgeToUpdate(item.age),
  //         item.id == id && setPhoneToUpdate(item.phone),
  //         item.id == id && setAccessToUpdate(item.access),
  //         item.id == id && setBranchToUpdate(item.branchID)
  //       ),
  //   );
  //   console.log(branchToUpdate);
  // }, [members]);

  // const handleFNInputChange = (e) => {
  //   setFNChangable(true);
  //   setUpdatedFirstName(e.target.value);
  // };
  // const handleLNInputChange = (e) => {
  //   setLNChangable(true);
  //   setUpdatedLastName(e.target.value);
  // };
  // const handleEInputChange = (e) => {
  //   setEChangable(true);
  //   setUpdatedEmail(e.target.value);
  // };
  // const handlePNInputChange = (e) => {
  //   setPNChangable(true);
  //   setUpdatedPhone(e.target.value);
  // };
  // const handleAGInputChange = (e) => {
  //   setAGChangable(true);
  //   setUpdatedAge(e.target.value);
  // };
  // const handleACInputChange = (e) => {
  //   setACChangable(true);
  //   setUpdatedAccess(e.target.value);
  // };

  // const handleBNInputChange = (e) => {
  //   setBNChangable(true);
  //   setUpdatedBranch(e.target.value);
  // };

  const encryptedDataa = localStorage.getItem('encryptedData');
  const bytes = CryptoJS.AES.decrypt(encryptedDataa, 'SeCrEt@@@19');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  const branchName = localStorage.getItem('branchName');
  const auth = localStorage.getItem('token');

  function sendAction(action) {




    fetch('http://127.0.0.1:5000/notify_frontend_action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        updatedFirstName: updatedFirstName,
        updatedLastName: updatedLastName,
        updatedEmail: updatedEmail,
        updatedAge: updatedAge,
        updatedPhone: updatedPhone,
        updatedAccess: updatedAccess,
        updatedBranch: updatedBranch,

        firstNameToUpdate: firstNameToUpdate,
        lastNameToUpdate: lastNameToUpdate,
        emailToUpdate: emailToUpdate,
        ageToUpdate: ageToUpdate,
        phoneToUpdate: phoneToUpdate,
        accessToUpdate: accessToUpdate,
        branchToUpdate: branchToUpdate,

        auth: auth,
        branchName: branchName,
        memberID: id,
      }),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
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
        title={'Update a Member'}
        subtitle={'Update a Member Informaition'}
      />

      <Stack direction={'row'} spacing={2}>
        <TextField
          name="firstName"
          autoFocus
          value={updatedFirstName}
          label="First Name"
          variant="filled"
          sx={{ flexGrow: 0.5 }}
          onChange={(e) => setUpdatedFirstName(e.target.value)}
        />
        <TextField
          name="lastname"
          value={updatedLastName}
          label="Last Name"
          variant="filled"
          sx={{ flexGrow: 0.5 }}
          onChange={(e) => setUpdatedLastName(e.target.value)}
        />
      </Stack>

      <TextField
        name="email"
        type="email"
        value={updatedEmail}
        label="Email"
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setUpdatedEmail(e.target.value)}
      />

      <TextField
        name="age"
        label="Age"
        value={updatedAge}
        variant="filled"
        onChange={(e) => setUpdatedAge(e.target.value)}
      />
      <TextField
        name="phone"
        label="Phone"
        value={updatedPhone}
        variant="filled"
        onChange={(e) => setUpdatedPhone(e.target.value)}
      />

      {decryptedData === 'Admin' ? (
        <TextField
          name="branch"
          label="Branch"
          select
          value={updatedBranch}
          defaultValue={updatedBranch}
          variant="filled"
          onChange={(e) => setUpdatedBranch(e.target.value)}
        >
          {branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.name}
            </MenuItem>
          ))}
        </TextField>
      ) : null}

      {decryptedData === 'Admin' ? (
        <TextField
          name="access"
          variant="filled"
          select
          label="Access"
          value={updatedAccess}
          defaultValue={updatedAccess}
          onChange={(e) => setUpdatedAccess(e.target.value)}
        >
          {data2.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      ) : null}

      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
          onClick={() => {
            sendAction('updated_member')
            handleUpdate();
          }}
        >
          Update Member
        </Button>
      </Box>
    </Box>
  );
};

export default TeamUpdateForm;
