/* eslint-disable react/prop-types */
import { Box, useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';


const data = [
  {
    country: 'AD',
    'hot dog': 18,
    'hot dogColor': 'hsl(356, 70%, 50%)',
    burger: 65,
    burgerColor: 'hsl(16, 70%, 50%)',
    sandwich: 172,
    sandwichColor: 'hsl(155, 70%, 50%)',
    kebab: 95,
    kebabColor: 'hsl(309, 70%, 50%)',
    fries: 99,
    friesColor: 'hsl(342, 70%, 50%)',
    donut: 181,
    donutColor: 'hsl(69, 70%, 50%)',
  },
  {
    country: 'AE',
    'hot dog': 57,
    'hot dogColor': 'hsl(358, 70%, 50%)',
    burger: 149,
    burgerColor: 'hsl(254, 70%, 50%)',
    sandwich: 86,
    sandwichColor: 'hsl(93, 70%, 50%)',
    kebab: 50,
    kebabColor: 'hsl(351, 70%, 50%)',
    fries: 134,
    friesColor: 'hsl(302, 70%, 50%)',
    donut: 189,
    donutColor: 'hsl(240, 70%, 50%)',
  },
  {
    country: 'AF',
    'hot dog': 129,
    'hot dogColor': 'hsl(319, 70%, 50%)',
    burger: 141,
    burgerColor: 'hsl(181, 70%, 50%)',
    sandwich: 108,
    sandwichColor: 'hsl(252, 70%, 50%)',
    kebab: 148,
    kebabColor: 'hsl(337, 70%, 50%)',
    fries: 48,
    friesColor: 'hsl(270, 70%, 50%)',
    donut: 192,
    donutColor: 'hsl(73, 70%, 50%)',
  },
  {
    country: 'AG',
    'hot dog': 62,
    'hot dogColor': 'hsl(0, 70%, 50%)',
    burger: 55,
    burgerColor: 'hsl(346, 70%, 50%)',
    sandwich: 85,
    sandwichColor: 'hsl(342, 70%, 50%)',
    kebab: 0,
    kebabColor: 'hsl(193, 70%, 50%)',
    fries: 71,
    friesColor: 'hsl(53, 70%, 50%)',
    donut: 96,
    donutColor: 'hsl(2, 70%, 50%)',
  },
  {
    country: 'AI',
    'hot dog': 175,
    'hot dogColor': 'hsl(249, 70%, 50%)',
    burger: 75,
    burgerColor: 'hsl(136, 70%, 50%)',
    sandwich: 146,
    sandwichColor: 'hsl(53, 70%, 50%)',
    kebab: 87,
    kebabColor: 'hsl(315, 70%, 50%)',
    fries: 37,
    friesColor: 'hsl(85, 70%, 50%)',
    donut: 93,
    donutColor: 'hsl(327, 70%, 50%)',
  },
  {
    country: 'AL',
    'hot dog': 20,
    'hot dogColor': 'hsl(4, 70%, 50%)',
    burger: 181,
    burgerColor: 'hsl(130, 70%, 50%)',
    sandwich: 59,
    sandwichColor: 'hsl(198, 70%, 50%)',
    kebab: 111,
    kebabColor: 'hsl(71, 70%, 50%)',
    fries: 50,
    friesColor: 'hsl(160, 70%, 50%)',
    donut: 106,
    donutColor: 'hsl(178, 70%, 50%)',
  },
  {
    country: 'AM',
    'hot dog': 115,
    'hot dogColor': 'hsl(197, 70%, 50%)',
    burger: 158,
    burgerColor: 'hsl(50, 70%, 50%)',
    sandwich: 181,
    sandwichColor: 'hsl(265, 70%, 50%)',
    kebab: 71,
    kebabColor: 'hsl(15, 70%, 50%)',
    fries: 88,
    friesColor: 'hsl(19, 70%, 50%)',
    donut: 7,
    donutColor: 'hsl(150, 70%, 50%)',
  },
];
const Bar = ({ isDashboard = false }) => {
  const theme = useTheme();
  return (
    <Box sx={{ height: isDashboard ? '320px' : '85.8vh' }}>
      <ResponsiveBar
        data={data}
        keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
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
              stroke: theme.palette.text.disabled,
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
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#38bcb2',
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#eed312',
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: 'fries',
            },
            id: 'dots',
          },
          {
            match: {
              id: 'sandwich',
            },
            id: 'lines',
          },
        ]}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? null : 'country',
          legendPosition: 'middle',
          legendOffset: 35,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? null : 'food',
          legendPosition: 'middle',
          legendOffset: -50,
          truncateTickAt: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue
        }
      />
    </Box>
  );
};

export default Bar;
