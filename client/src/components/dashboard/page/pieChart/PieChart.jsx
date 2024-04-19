import { Box } from "@mui/material";
import Pie from "./Pie";
import PageHeader from "../PageHeader";


const PieChart = () => {
  return (
  <Box>
    <PageHeader title="Pie Chart" subtitle={'Simple Pie Chart'} isChart={true}/>
    <Pie />
  </Box>
  );
};

export default PieChart;
