import { KeyboardArrowUp } from "@mui/icons-material";
import { Fab, Zoom, useScrollTrigger } from "@mui/material";


const Scroll = () => {
  return (
    <Zoom in={useScrollTrigger()}>
      <Fab onClick={() => {
        scrollTo(0,0);
      }} sx={{position: "fixed", bottom: 33, right: 33}} size="small" color="primary" aria-label="add" variant="circular">
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
}

export default Scroll;
