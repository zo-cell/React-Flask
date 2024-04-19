import { Box } from "@mui/material";
import Line from "./Line";
import PageHeader from "../PageHeader";






const LineChart = () => {

  return (
  <Box>
    <PageHeader title="Line Chart" subtitle={'Analytic Line Chart'} isChart={true}/>
    <Line />
  </Box>
  );
};

export default LineChart;
