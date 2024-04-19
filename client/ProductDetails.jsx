import { AddShoppingCartOutlined } from '@mui/icons-material';
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
// import { useGetproductByNameQuery } from './src/Redux/product';
import { useState } from 'react';

function setLargImage(src) {
  document.getElementById('largImage').src = src;
}

// eslint-disable-next-line react/prop-types
const ProductDetails = ({title, price, description, mainImage, smallImages}) => {
  // const { data, error, isLoading } = useGetproductByNameQuery(
  //   'products/?populate=*',
  // );

  const [alignment, setAlignment] = useState(0);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  // if (isLoading) {
  //   return <Typography variant="h6">Loading.....</Typography>;
  // }

  // if (error) {
  //   return <Typography variant="h6">{error.message}</Typography>;
  // }


  return (

    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >

      <Box sx={{ display: 'flex' }}>
        <img
          width={300}
          src={mainImage}
          alt="img"
          id="largImage"
        />
      </Box>

      <Box
        sx={{
          textAlign: { xs: 'center', sm: 'left' },
          pt: { xs: 1, sm: 5, md: 0 },
        }}
      >
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Typography variant="h5">{title}</Typography>


        <Typography my={0.4} fontSize={'22px'} color={'crimson'}>
          {price}$
        </Typography>
        <Typography variant="body1">
          {description}
        </Typography>

        <Stack
          sx={{ justifyContent: { xs: 'center', sm: 'left' } }}
          direction={'row'}
          gap={1}
          my={2}
        >
            {/* eslint-disable-next-line react/prop-types */}
          {smallImages.map((item, i) => {
            return (

              <ToggleButtonGroup
                key={i}
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
                sx={{
                  '.Mui-selected': {
                    border: '1px solid royalblue !important',
                    borderRadius: '5px !important',
                    opacity: 1,
                    backgroundColor: 'initial',
                  }
                }}
              >
                <ToggleButton  value={i} aria-label="left aligned" sx={{width: "110px", height: "110px",p: 0, opacity: .5, ":hover": {border: "2px solid royalblue"}}}>
                  <img
                    style={{ borderRadius: 3, cursor: 'pointer' }}
                    height={"100%"}
                    width={"100%"}
                    src={item}
                    alt="image"
                    id="smallImage"
                    onClick={() => setLargImage(item)}
                  />
                </ToggleButton>



              </ToggleButtonGroup>
            );
          })}
        </Stack>

        <Button
          sx={{ textTransform: 'capitalize', mb: { xs: 1, sm: 7, md: 0 } }}
          variant="contained"
        >
          <AddShoppingCartOutlined sx={{ mr: 1 }} fontSize="small" />
          Buy now
        </Button>
      </Box>
    </Box>
  );

};
export default ProductDetails;
