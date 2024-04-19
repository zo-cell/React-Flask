/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Stack, TextField, useTheme } from '@mui/material';
import PageHeader from './PageHeader';

import { DownloadOutlined } from '@mui/icons-material';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

const SalaryReports = (props) => {
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
  const [name, setName] = useState('');
  const [totalSalary, setTotalSalary] = useState(0);
  const [allWorkers, setAllWorkers] = useState([]);
  const branchID = props.branchID;

  // Get Service data from API:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/Services/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        // console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);
  // Getting Order Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/orders/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setAllRows(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  // getting Workers Data:
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/workers/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllWorkers(data);
        console.log(allWorkers);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleWorkerIdChange = (workerId) => {
    // Check if the workerId is already selected
    if (selectedWorkerIds.includes(workerId)) {
      // If already selected, remove it
      setSelectedWorkerIds(selectedWorkerIds.filter((id) => id !== workerId));
    } else {
      // If not selected, add it
      setSelectedWorkerIds([...selectedWorkerIds, workerId]);
    }
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };

  const handleSearch = () => {
    // Reset state variables before performing a new search
    setSelectedWorkerIds([]);
    setStartDate(null);
    setEndDate(null);
    setRows([]);
    setAllRows([]);
    setName('');
    setTotalSalary(0);
    setServices([]);
    setAllWorkers([]);
    window.location.reload();
    // Perform the search logic here
    // This is where you would fetch the data based on the search criteria
  };

  const handleSelect = (date) => {
    if (selectedWorkerIds.length > 0) {
      let filtered = allRows.filter((item) => {
        let orderDate = new Date(item['date']);
        const isDateInRange =
          orderDate >= date.selection.startDate &&
          orderDate <= date.selection.endDate;
        return isDateInRange;
      });
      setStartDate(date.selection.startDate);
      setEndDate(date.selection.endDate);
      // Fetch worker data and calculate salary
      Promise.all(
        selectedWorkerIds.map((workerId) => {
          return fetch(`http://127.0.0.1:5000/api/worker/get/${workerId}/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
            .then((res) => res.json())
            .then((data) => {
              const worker = data;
              if (worker) {
                const firstName = worker.firstName;
                const lastName = worker.lastName;
                const workerName = firstName + ' ' + lastName;
                setName(workerName);
                const filteredByWorkerIds = filtered.filter((order) => {
                  return (
                    order.W1 === workerId ||
                    order.W2 === workerId ||
                    order.W3 === workerId
                  );
                });
                // Create a new array to store the values of non-empty W1, W2, and W3 from the filtered orders
                const workerIdsArray = filteredByWorkerIds.map((order) => {
                  const nonEmptyWorkerIds = [
                    order.W1,
                    order.W2,
                    order.W3,
                  ].filter((id) => id !== '');
                  return nonEmptyWorkerIds;
                });

                console.log(workerIdsArray);
                // const uniqueWorkerIds = new Set(workerIdsArray.flat());
                // const numWorkers = uniqueWorkerIds.size;
                // console.log(numWorkers);
                // console.log(uniqueWorkerIds);
                const lengths = workerIdsArray.map((arr) => arr.length);
                console.log(lengths);

                const updatedRows = filteredByWorkerIds.map((item, i) => {
                  const service = services.find(
                    (service) => service.service === item.service,
                  );
                  // Find the workerIdsArray element that includes the worker IDs of the current item
                  // const workerIds = workerIdsArray.find((arr) =>
                  //   [item.W1, item.W2, item.W3].every((id) => arr.includes(id)),
                  // );

                  // Calculate the number of workers for the current item
                  const numWorkers = lengths[i];

                  console.log(numWorkers);

                  let basicSalary;

                  if (service && service.serviceType === 'Percentage %') {
                    basicSalary = item.price * (service.percentage / 100);
                  } else if (service && service.serviceType === 'Fixed') {
                    basicSalary = service.percentage;
                  } else {
                    basicSalary = 0;
                  }
                  const salaryPerWorker =
                    numWorkers > 0 ? basicSalary / numWorkers : 0;
                  const roundedSalary = Math.round(salaryPerWorker);
                  const updatedItem = { ...item, salary: roundedSalary };

                  return updatedItem; // Default salary if service type is not Percentage
                });
                const BranchFilterRows = updatedRows.filter((row) => row.branchID == branchID);

                setRows(BranchFilterRows);

                const totalSalary = updatedRows.reduce((total, row) => {
                  return total + row.salary;
                }, 0);
                const roundedSalary = Math.round(totalSalary);

                setTotalSalary(
                  (prevTotalSalary) => prevTotalSalary + roundedSalary,
                );
              }
            })
            .catch((error) => console.log(error));
        }),
      );
    } else {
      let filtered = allRows.filter((item) => {
        let orderDate = new Date(item['date']);
        const isDateInRange =
          orderDate >= date.selection.startDate &&
          orderDate <= date.selection.endDate;
        return isDateInRange;
      });
      setStartDate(date.selection.startDate);
      setEndDate(date.selection.endDate);

      // Calculate salary based on service type percentage
      const updatedRows = filtered.map((item) => {
        const service = services.find(
          (service) => service.service === item.service,
        );

        let basicSalary;

        if (service && service.serviceType === 'Percentage %') {
          basicSalary = item.price * (service.percentage / 100);
        } else if (service && service.serviceType === 'Fixed') {
          basicSalary = service.percentage;
        } else {
          basicSalary = 0;
        }
        const roundedSalary = Math.round(basicSalary);
        const updatedItem = { ...item, salary: roundedSalary };

        return updatedItem; // Default salary if service type is not Percentage
      });

      const BranchFilterRows = updatedRows.filter((row) => row.branchID == branchID);

      setRows(BranchFilterRows);
      const totalSalary = updatedRows.reduce((total, row) => {
        return total + row.salary;
      }, 0);
      const roundedSalary = Math.round(totalSalary);

      setTotalSalary((prevTotalSalary) => prevTotalSalary + roundedSalary);
    }
  };
  //

  const columns = [
    { field: 'id', headerName: 'ID', width: 55 },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
    },
    { field: 'salary', headerName: 'salary', flex: 1 },
    { field: 'licensePlate', headerName: 'License plate', flex: 1 },
    { field: 'carBrand', headerName: 'Car brand', flex: 1 },
    { field: 'carModel', headerName: 'Car model', flex: 1 },
    { field: 'customer', headerName: 'Customer', flex: 1 },
    { field: 'service', headerName: 'Service', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'W1', headerName: 'W 1', flex: 1 },
    { field: 'W2', headerName: 'W 2', flex: 1 },
    { field: 'W3', headerName: 'W 3', flex: 1 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
  ];

  const data = rows.map((row) => ({
    id: row.id,
    date: row.date,
    service: row.service,
    salary: row.salary,
    licensePlate: row.licensePlate,
    carBrand: row.carBrand,
    carModel: row.carModel,
    customer: row.customer,
    price: row.price,
    W1: row.W1,
    W2: row.W2,
    W3: row.W3,
    notes: row.notes,
  }));

  const body = {
    data,
    startDate,
    endDate,
  };

  // Generating the report:
  const handleDownloadPDF = async () => {
    const data = rows.map((row) => ({
      id: row.id,
      date: row.date,
      service: row.service,
      salary: row.salary,
      licensePlate: row.licensePlate,
      carBrand: row.carBrand,
      carModel: row.carModel,
      customer: row.carModel,
      price: row.price,
      W1: row.W1,
      W2: row.W2,
      W3: row.W3,
      notes: 'Notes',
    }));

    const body = {
      data: data,
      startDate: startDate,
      endDate: endDate,
      name: name,
      totalSalary: totalSalary,
    };

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/reports/download/pdf',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        response.responseType = 'blob';
        a.href = url;
        a.download = 'salary_report.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download PDF report');
      }
    } catch (error) {
      console.error('Error downloading PDF report:', error);
    }
  };

  const handleDownloadExcel = () => {
    fetch('http://127.0.0.1:5000/api/reports/download/excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'salary_report.xlsx';
        a.click();
      });
  };

  const filterRows = (rows) => {
    return rows.filter((row) => row.branchID == branchID);
  };

  useEffect

  return (
    <div style={{ height: 550 }}>
      <PageHeader
        title="Salary Reports"
        subtitle="Extract your salary reports information"
      />
      <Stack
        direction={'row'}
        gap={2}
        justifyContent={'space-between'}
        sx={{ mb: 3 }}
        className='bigStack'
      >
        <Stack gap={2} flex={1} direction={'row'}>
          <Stack direction={'column'} gap={2} component={'form'}>
            <TextField
              name="id"
              label="ID"
              sx={{ width: '100%', mr: 3 }}
              variant="filled"
              onChange={(e) => handleWorkerIdChange(e.target.value)}

              // onChange={(e) => handleFilterChange('workerId', e.target.value)}
            />

            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
            />
          </Stack>

          <Stack gap={2} flex={1} sx={{}}>
            <TextField
              name="name"
              label="Name"
              value={name}
              aria-readonly
              sx={{ width: '100%' }}
              variant="filled"
            />

            <TextField
              name="salaryTotal"
              label="Salary Total"
              value={totalSalary}
              type="number"
              aria-readonly
              sx={{ width: '100%' }}
              variant="filled"
            />

            <Button variant="contained" onClick={handleSearch}>
              Clear
            </Button>
          </Stack>
        </Stack>

        {/* <Box sx={{ position: 'relative', width: '30%', flexGrow: 1 }}>
            <Stack direction={'row'} gap={2}></Stack>
          </Box> */}

        <Stack gap={2} textAlign={'right'}>
          <Button
            sx={{ p: '6px 8px', textTransform: 'capitalize', height: '55px' }}
            variant="contained"
            color="primary"
            onClick={handleDownloadPDF}
          >
            <DownloadOutlined />
            Download PDF Reports
          </Button>

          <Button
            sx={{ p: '6px 8px', textTransform: 'capitalize', height: '55px' }}
            variant="contained"
            color="primary"
            onClick={handleDownloadExcel}
          >
            <DownloadOutlined />
            Download EXCEL Reports
          </Button>
        </Stack>
      </Stack>

      <DataGrid
        checkboxSelection
        rows={filterRows(rows)}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        sx={{ maxWidth: '99%' }}
      />
    </div>
  );
};

export default SalaryReports;
