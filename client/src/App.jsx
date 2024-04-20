/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

// import Header1 from './components/layout/1-header/Header1';
// import Header2 from './components/layout/1-header/Header2';
// import Header3 from './components/layout/1-header/Header3';
// import { useState } from 'react'
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './Theme';
// import Hero from './components/home/2-hero/hero';
// import Main from './components/home/3-main/main';
// import Footer from './components/layout/4-footer/footer';
import Scroll from './components/scroll/Scroll';

import { Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Registration from './components/registration/Registration';
import Dashboard from './components/dashboard/dashboard';
import Team from './components/dashboard/page/team/Team';
// import Contacts from './components/dashboard/page/contacts/Contacts';
// import SideBar from './components/dashboard/sideBar/SideBar';
import DashHome from './components/dashboard/page/dashHome/DashHome';
import Invoices from './components/dashboard/page/orders/Orders';
import Calendar from './components/dashboard/page/calendar/Calendar';

import BarChart from './components/dashboard/page/barChart/BarChart';
import PieChart from './components/dashboard/page/pieChart/PieChart';
import LineChart from './components/dashboard/page/lineChart/LineChart';
import GeographyChart from './components/dashboard/page/geographyChart/GeographyChart';
// import ProductForm from './components/dashboard/page/productForm/ProductForm';
// import Sections from './components/home/3-main/Sections';

// import Deal from './components/home/3-main/Deal';
// import Panners1 from './components/home/3-main/Panners1';
// import Electronics from './components/home/3-main/Electronics';
// import Panners2 from './components/home/3-main/Panners2';
// import MenFashion from './components/home/3-main/MenFashion';
// import Panner3 from './components/home/3-main/Panner3';
// import WomenFashion from './components/home/3-main/WomenFashion';
// import BrandesPanners from './components/home/3-main/BrandesPanners';
// import MovingPanner from './components/home/movingPanner/MovingPanner';
// import Fashion from './components/Pages/fashion/Fashion';
import TeamUpdateForm from './components/dashboard/page/team/TeamUpdateForm';
import Workers from './components/dashboard/page/workers/Workers';
import WorkersRegistration from './components/dashboard/page/workers/WorkersRegistration';
import WorkersUpdateForm from './components/dashboard/page/workers/WorkersUpdateForm';
import Orders from './components/dashboard/page/orders/Orders';
import OrderCreateForm from './components/dashboard/page/orders/OrdersCreateForm';
import OrderUpdateForm from './components/dashboard/page/orders/OrderUpdateForm';
import Jobs from './components/dashboard/page/jobs/Jobs';
import SalaryReports from './components/dashboard/page/SalaryReports';
import Service from './components/dashboard/page/service/Service';
import ServiceUpdateForm from './components/dashboard/page/service/ServiceUpdateForm';
import Customers from './components/dashboard/page/customers/Customers';
import CustomersCreateForm from './components/dashboard/page/customers/CustomersCreateForm';
import CustomerUpdateForm from './components/dashboard/page/customers/CustomerUpdateForm';
import WorkersJopUpdating from './components/dashboard/page/jobs/WorkersJopUpdating';
import CryptoJS from 'crypto-js';
import WorkersCheck from './components/dashboard/page/jobs/WorkersCheck';
import JobUpdateForm from './components/dashboard/page/jobs/JobUpdateForm';
import { useNavigate, useLocation } from 'react-router-dom';
import NoAccess from './components/dashboard/page/NoAccess';

const MyComponent = () => {
  const [data, setData] = useState();
  const [workers, setWorkers] = useState();
  const [editedData, setEditedData] = useState(null);

  // const [newData, setNewData] = useState();

  //Members Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.log(error));
    // console.log(editedData)
  }, []);

  //Workers Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/workers/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data);
      })
      .catch((error) => console.log(error));
    // console.log(editedData)
  }, []);

  const editUser = (data) => {
    setEditedData(data);
  };

  const updatedData = (updateRes) => {
    const new_user = data.map((my_user) => {
      if (my_user.id === updateRes.id) {
        return updateRes;
      } else {
        return my_user;
      }
    });
    setData(new_user);
  };

  // const openForm = () => {
  //   setEditedData({ username: '', email: '', password: '' });
  // };

  const InsertedData = (insertRes) => {
    setData([...data, insertRes]);
  };

  const DeletedUser = (delRes) => {
    let filtredData = data.filter((item) => item.id !== delRes.id);
    setData(filtredData);
  };

  const NewUser = (res) => {
    setData([...data, res]);
    console.log(data);
  };

  const [passedEmail, setPassedEmail] = useState('');
  const [Access, setAccess] = useState('');
  const [image, setImage] = useState('');
  const PassingEmail = async (Email) => {
    await setPassedEmail(Email);
  };
  const PassingImage = async (Image) => {
    await setImage(Image);
  };
  console.log(`This is PAssed EMail: ${passedEmail}`);
  const PassingAccess = async (Access) => {
    await setAccess(Access);
    const encryptedAccess = CryptoJS.AES.encrypt(
      Access,
      'SeCrEt@@@19',
    ).toString();
    localStorage.setItem('tokens', encryptedAccess);
  };
  useEffect(() => {
    const encryptedAccess = localStorage.getItem('tokens');
    if (encryptedAccess) {
      const bytes = CryptoJS.AES.decrypt(encryptedAccess, 'SeCrEt@@@19');
      const decryptedAccess = bytes.toString(CryptoJS.enc.Utf8);
      setAccess(decryptedAccess);
    }
  }, []);
  console.log(`This is PAssed Access: ${Access}`);

  const loggedID = localStorage.getItem('ID');
  const token = localStorage.getItem('token');

  const [theme, colorMode] = useMode();

  // Getting Branches data from API:
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/branches/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  const location = useLocation();

  // Check if the current location matches the branch ID 1
  const isNotBranch1 = location.pathname === `/`;
  const isBranch1 = location.pathname === `/1`;
  const navigate = useNavigate();

  const branchName = branches.filter((branch) => branch.id === 1);
  const localBranchName = localStorage.getItem('branchName');

  useEffect(() => {
    if (isBranch1) {
      if (branchName.length > 0) {
        localStorage.setItem('branchName', branchName[0].name);
        localStorage.setItem('branchID', branchName[0].id);
      } else {
        console.log('not found');
      }
    }
  }, [branchName]);

  // redirecting Workers to their main page:

  const [emailState, setEmailState] = useState();
  const [status, setStatus] = useState();
  const email = localStorage.getItem('ec.');

  useEffect(() => {
    if (email) {
      const bytes = CryptoJS.AES.decrypt(email, 'SeCrEt@@@19');
      const decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
      setEmailState(decryptedEmail);
      console.log(emailState);
      if (data && !loggedID) {
        const isEmailInData =
          data.filter((item) => item.email === decryptedEmail).length > 0; // true or false

        if (!isEmailInData) {
          navigate('/login');
        } else {
          const loggedEmail = data.filter(
            (item) => item.email === emailState,
          )[0];
          if (loggedEmail) {
            const loggedEmailStatus = loggedEmail.status;
          }
        }

        console.log(status);
      }
    } else {
      navigate('/login');
    }
  }, [data]);

  console.log(Access);
  useEffect(() => {
    if (email) {
      const bytes = CryptoJS.AES.decrypt(email, 'SeCrEt@@@19');
      const decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
      setEmailState(decryptedEmail);
      console.log(emailState);
      if (workers && loggedID) {
        const isEmailInData =
          workers.filter((item) => item.email === decryptedEmail).length > 0;

        if (!isEmailInData) {
          navigate('/login');
        } else {
          const loggedEmail = workers.filter(
            (item) => item.email === emailState,
          )[0];
          if (loggedEmail) {
            const loggedEmailStatus = loggedEmail.status;
            setStatus(loggedEmailStatus);
          }
        }

        console.log(status);
      }
    } else {
      navigate('/login');
    }
  }, [workers]);



  useEffect(() => {
    if (isNotBranch1) {
      // navigate('/1');
      if (!token) {
        navigate('/login');
      } else {
        navigate('/1');
      }
    }
    if (localBranchName) {
      return;
    } else {
      if (branchName.length > 0) {
        localStorage.setItem('branchName', branchName[0].name);
        localStorage.setItem('branchID', branchName[0].id);
      } else {
        console.log('not found');
      }
    }
  }, [branchName]);

  return (
    <div>
      <div>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <Box sx={{ bgcolor: theme.palette.bg.main }}>
              <Routes>
                {/* <Route path='/' element={<Home />} /> */}

                {/* <Route path='Fashion' element={<Fashion />} /> */}
                {branches.map((branch) => (
                  <>
                    {!token ? (
                      <Route
                        path="login"
                        element={
                          <Login
                            user={editedData}
                            branchID={branch.id}
                            PassingEmail={PassingEmail}
                            PassingAccess={PassingAccess}
                            PassingImage={PassingImage}
                          />
                        }
                      />
                    ) : (
                      <>
                        <Route
                          path="login"
                          element={
                            <Login
                              user={editedData}
                              branchID={branch.id}
                              PassingEmail={PassingEmail}
                              PassingAccess={PassingAccess}
                              PassingImage={PassingImage}
                            />
                          }
                        />
                        <Route
                          key={branch.id}
                          path={`/${branch.id}`}
                          element={
                            Access === 'Admin' ||
                            Access === 'Manager' ||
                            Access === 'Accountant' ||
                            Access === 'Worker' ? (
                              <Dashboard branchID={branch.id} status={status} image={image} />
                            ) : (
                              <NoAccess />
                            )
                          }
                        >
                          {Access === 'Worker' && (
                            <>
                              <Route
                                path="WorkersCheck"
                                element={<WorkersCheck branchID={branch.id} />}
                              />
                              <Route
                                path="WorkerUpdatingForm/:id"
                                element={
                                  <WorkersJopUpdating branchID={branch.id} />
                                }
                              />
                            </>
                          )}

                          <Route
                            index
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <DashHome branch={branch} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="team"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <Team branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="TeamUpdateForm/:id"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <TeamUpdateForm
                                  dataa={data}
                                  branchID={branch.id}
                                />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="registration"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <Registration
                                  user={editedData}
                                  NewUser={NewUser}
                                  branchID={branch.id}
                                />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="orders"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <Orders branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="OrderCreateForm"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <OrderCreateForm branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="OrdersUpdateForm/:id"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <OrderUpdateForm branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="Jobs"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <Jobs branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="JobUpdateForm/:id"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <JobUpdateForm branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="services"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <Service branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="ServiceUpdateForm/:id"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <ServiceUpdateForm branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="salary"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <SalaryReports branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="customers"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <Customers branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="CustomersCreateForm"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <CustomersCreateForm branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="CustomersUpdateForm/:id"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <CustomerUpdateForm branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="Workers"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <Workers branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="WorkersRegistration"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <WorkersRegistration branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="WorkersUpdateForm/:id"
                            element={
                              Access === 'Admin' || Access === 'Manager' ? (
                                <WorkersUpdateForm branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="calendar"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <Calendar branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          {/* <Route
                            path="faq"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <FAQPage branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          /> */}
                          <Route
                            path="bar"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <BarChart branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="pie"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <PieChart branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="line"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <LineChart branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                          <Route
                            path="geography"
                            element={
                              Access === 'Admin' ||
                              Access === 'Manager' ||
                              Access === 'Accountant' ? (
                                <GeographyChart branchID={branch.id} />
                              ) : (
                                <NoAccess />
                              )
                            }
                          />
                        </Route>
                      </>
                    )}
                  </>
                ))}

                {/* <Route path="/*" element={<NotFoundPage />} /> */}
              </Routes>
            </Box>
            <Scroll />
          </ThemeProvider>
        </ColorModeContext.Provider>

        {/* Dashboard issues */}

        {/* <h1>Data from Flask API:</h1> */}
        {/* <button onClick={openForm}>Insert New User</button> */}
        {/* <UserList data={data} editUser={editUser} DeletedUser={DeletedUser} /> */}

        {/* {editedData ? (
          <Form
            user={editedData}
            updatedData={updatedData}
            InsertedData={InsertedData}
          />
        ) : null} */}
      </div>
    </div>
  );
};

export default MyComponent;
