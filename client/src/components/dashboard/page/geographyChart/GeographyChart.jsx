import { Box } from "@mui/material";
import Geo from "./Geo";
import PageHeader from "../PageHeader";



const GeographyChart = () => {
  return (
  <Box>
    <PageHeader title="Geography" subtitle={'Simple Geography Chart'} />
    <Geo />
  </Box>
  );
}

export default GeographyChart;
