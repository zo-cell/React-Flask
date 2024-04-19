/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, TextField, MenuItem } from '@mui/material';
import PageHeader from '../PageHeader';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WorkersJopUpdating = (props) => {
  const { id } = useParams();

  // Saving Updated information in state.
  const [updatedCheck, setUpdatedCheck] = useState('');
  const [updatedSubMission, setUpdatedSubMission] = useState('');
  const [updatedImage1, setUpdatedImage1] = useState('');
  const [updatedImage2, setUpdatedImage2] = useState('');
  const [updatedImage3, setUpdatedImage3] = useState('');
  const [workerID, setWorkerID] = useState('');

  const [customer, setCustomer] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Getting old order data from database to display in the input fields:
    fetch(`http://127.0.0.1:5000/api/job/get/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
        setUpdatedCheck(data.check);
        setUpdatedSubMission(data.subMission);
        setUpdatedImage1(data.image1);
        setUpdatedImage2(data.image2);
        setUpdatedImage3(data.image3);
        setWorkerID(data.worker_id);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handling Update API:

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('updatedCheck', updatedCheck);
    formData.append('updatedSubMission', updatedSubMission);
    formData.append('updatedImage1', updatedImage1);
    formData.append('updatedImage2', updatedImage2);
    formData.append('updatedImage3', updatedImage3);


    fetch(`http://127.0.0.1:5000/api/jobs/update/${id}/`, {
      method: 'PUT',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to upload');
        } else {
          navigate(`/${props.branchID}/WorkersCheck`)

          return res.json();
        }

      })

      .catch((error) => {
        console.error('Error ystaaa:', error);
      });

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


  const branchName = localStorage.getItem('branchName');

  function sendAction(action) {
    fetch('http://127.0.0.1:5000/notify_frontend_action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        updatedCheck: updatedCheck,
        updatedSubMission: updatedSubMission,
        workerID: workerID,
        jobID: id,
        branchName: branchName,
      }),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }


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
        title={'Update Your Job Status'}
        subtitle={'Updating Job Details'}
      />

      <TextField
        name="Check"
        autoFocus
        select
        label="Check"
        value={updatedCheck}
        variant="filled"
        sx={{ flexGrow: 0.5 }}
        onChange={(e) => setUpdatedCheck(e.target.value)}
      >
        <MenuItem value="Yes">Yes</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </TextField>

      <TextField
        name="subMission"
        label="Sub Mission"
        value={updatedSubMission}
        variant="filled"
        onChange={(e) => setUpdatedSubMission(e.target.value)}
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
          onClick={() => {
            sendAction('job_check');
            handleUpdate();
          }}
        >
          Update Status
        </Button>
      </Box>
    </Box>
  );
};

export default WorkersJopUpdating;
