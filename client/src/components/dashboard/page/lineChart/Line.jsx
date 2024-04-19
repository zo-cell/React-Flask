/* eslint-disable react/prop-types */
import { Box, useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { useEffect, useState } from 'react';


const data = [
  {
    id: 'japan',
    color: 'hsl(185, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 39,
      },
      {
        x: 'helicopter',
        y: 201,
      },
      {
        x: 'boat',
        y: 130,
      },
      {
        x: 'train',
        y: 112,
      },
      {
        x: 'subway',
        y: 201,
      },
      {
        x: 'bus',
        y: 53,
      },
      {
        x: 'car',
        y: 242,
      },
      {
        x: 'moto',
        y: 155,
      },
      {
        x: 'bicycle',
        y: 129,
      },
      {
        x: 'horse',
        y: 296,
      },
      {
        x: 'skateboard',
        y: 160,
      },
      {
        x: 'others',
        y: 97,
      },
    ],
  },
  {
    id: 'france',
    color: 'hsl(115, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 147,
      },
      {
        x: 'helicopter',
        y: 226,
      },
      {
        x: 'boat',
        y: 2,
      },
      {
        x: 'train',
        y: 132,
      },
      {
        x: 'subway',
        y: 97,
      },
      {
        x: 'bus',
        y: 250,
      },
      {
        x: 'car',
        y: 54,
      },
      {
        x: 'moto',
        y: 218,
      },
      {
        x: 'bicycle',
        y: 245,
      },
      {
        x: 'horse',
        y: 256,
      },
      {
        x: 'skateboard',
        y: 36,
      },
      {
        x: 'others',
        y: 115,
      },
    ],
  },
  {
    id: 'us',
    color: 'hsl(223, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 32,
      },
      {
        x: 'helicopter',
        y: 239,
      },
      {
        x: 'boat',
        y: 62,
      },
      {
        x: 'train',
        y: 235,
      },
      {
        x: 'subway',
        y: 122,
      },
      {
        x: 'bus',
        y: 221,
      },
      {
        x: 'car',
        y: 196,
      },
      {
        x: 'moto',
        y: 238,
      },
      {
        x: 'bicycle',
        y: 201,
      },
      {
        x: 'horse',
        y: 23,
      },
      {
        x: 'skateboard',
        y: 186,
      },
      {
        x: 'others',
        y: 221,
      },
    ],
  },
  {
    id: 'germany',
    color: 'hsl(128, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 107,
      },
      {
        x: 'helicopter',
        y: 287,
      },
      {
        x: 'boat',
        y: 53,
      },
      {
        x: 'train',
        y: 70,
      },
      {
        x: 'subway',
        y: 238,
      },
      {
        x: 'bus',
        y: 252,
      },
      {
        x: 'car',
        y: 264,
      },
      {
        x: 'moto',
        y: 228,
      },
      {
        x: 'bicycle',
        y: 65,
      },
      {
        x: 'horse',
        y: 204,
      },
      {
        x: 'skateboard',
        y: 282,
      },
      {
        x: 'others',
        y: 188,
      },
    ],
  },
  {
    id: 'norway',
    color: 'hsl(99, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 114,
      },
      {
        x: 'helicopter',
        y: 177,
      },
      {
        x: 'boat',
        y: 105,
      },
      {
        x: 'train',
        y: 127,
      },
      {
        x: 'subway',
        y: 11,
      },
      {
        x: 'bus',
        y: 163,
      },
      {
        x: 'car',
        y: 287,
      },
      {
        x: 'moto',
        y: 8,
      },
      {
        x: 'bicycle',
        y: 183,
      },
      {
        x: 'horse',
        y: 254,
      },
      {
        x: 'skateboard',
        y: 142,
      },
      {
        x: 'others',
        y: 232,
      },
    ],
  },
];

const Line = ({ isDashboard = false }) => {
  const theme = useTheme();

  const [tickRotation, setTickRotation] = useState(0);
  const [mb, setMb] = useState(50);






  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setTickRotation(60);
        setMb(60);
      } else {
        setTickRotation(0);
        setMb(50);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // Format the data from the branch names and orders data





  return (
    <Box sx={{ height: isDashboard ? '280px' : '85.8vh' }}>
      <ResponsiveLine
        data={data}
        margin={{
          top: isDashboard ? 20 : 50,
          right: 110,
          bottom: mb,
          left: 60,
        }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false,
        }}
        curve="catmullRom"
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: tickRotation,
          legend: isDashboard ? null : 'transportation',
          legendOffset: 36,
          legendPosition: 'middle',
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? null : 'count',
          legendOffset: -40,
          legendPosition: 'middle',
          truncateTickAt: 0,
        }}
        theme={{
          text: {
            fontSize: 11,
            fill: theme.palette.text.primary,
            outlineWidth: 0,
            outlineColor: 'transparent',
          },
          axis: {
            domain: {
              line: {
                stroke: '#777777',
                strokeWidth: 1,
              },
            },
            legend: {
              text: {
                fontSize: 12,
                fill: theme.palette.text.primary,
                outlineWidth: 0,
                outlineColor: 'transparent',
              },
            },
            ticks: {
              line: {
                stroke: '#777777',
                strokeWidth: 1,
              },
              text: {
                fontSize: 11,
                fill: theme.palette.text.primary,
                outlineWidth: 0,
                outlineColor: 'transparent',
              },
            },
          },
          grid: {
            line: {
              stroke: isDashboard ? '' : theme.palette.text.disabled,
              strokeWidth: 1,
            },
          },
          legends: {
            title: {
              text: {
                fontSize: 11,
                fill: theme.palette.text.primary,
                outlineWidth: 0,
                outlineColor: 'transparent',
              },
            },
            text: {
              fontSize: 11,
              fill: theme.palette.text.primary,
              outlineWidth: 0,
              outlineColor: 'transparent',
            },
            ticks: {
              line: {},
              text: {
                fontSize: 10,
                fill: theme.palette.text.primary,
                outlineWidth: 0,
                outlineColor: 'transparent',
              },
            },
          },
          annotations: {
            text: {
              fontSize: 13,
              fill: theme.palette.text.primary,
              outlineWidth: 2,
              outlineColor: '#ffffff',
              outlineOpacity: 1,
            },
            link: {
              stroke: '#000000',
              strokeWidth: 1,
              outlineWidth: 2,
              outlineColor: '#ffffff',
              outlineOpacity: 1,
            },
            outline: {
              stroke: '#000000',
              strokeWidth: 2,
              outlineWidth: 2,
              outlineColor: '#ffffff',
              outlineOpacity: 1,
            },
            symbol: {
              fill: '#000000',
              outlineWidth: 2,
              outlineColor: '#ffffff',
              outlineOpacity: 1,
            },
          },
          tooltip: {
            container: {
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              fontSize: 12,
            },
            basic: {},
            chip: {},
            table: {},
            tableCell: {},
            tableCellValue: {},
          },
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={3}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
};

export default Line;

