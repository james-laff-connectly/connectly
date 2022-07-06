import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const data = [
  {
    'metric': 'Overall',
    'hot dog': 179,
    'hot dogColor': 'hsl(106, 70%, 50%)',
    'burger': 67,
    'burgerColor': 'hsl(270, 70%, 50%)',
    'sandwich': 160,
    'sandwichColor': 'hsl(272, 70%, 50%)',
    'kebab': 109,
    'kebabColor': 'hsl(172, 70%, 50%)',
    'fries': 114,
    'friesColor': 'hsl(197, 70%, 50%)',
    'donut': 33,
    'donutColor': 'hsl(182, 70%, 50%)'
  },
  // {
  //   'country': 'AE',
  //   'hot dog': 49,
  //   'hot dogColor': 'hsl(249, 70%, 50%)',
  //   'burger': 117,
  //   'burgerColor': 'hsl(211, 70%, 50%)',
  //   'sandwich': 146,
  //   'sandwichColor': 'hsl(345, 70%, 50%)',
  //   'kebab': 182,
  //   'kebabColor': 'hsl(64, 70%, 50%)',
  //   'fries': 193,
  //   'friesColor': 'hsl(210, 70%, 50%)',
  //   'donut': 60,
  //   'donutColor': 'hsl(272, 70%, 50%)'
  // },
  // {
  //   'country': 'AF',
  //   'hot dog': 61,
  //   'hot dogColor': 'hsl(11, 70%, 50%)',
  //   'burger': 115,
  //   'burgerColor': 'hsl(247, 70%, 50%)',
  //   'sandwich': 4,
  //   'sandwichColor': 'hsl(101, 70%, 50%)',
  //   'kebab': 177,
  //   'kebabColor': 'hsl(288, 70%, 50%)',
  //   'fries': 150,
  //   'friesColor': 'hsl(62, 70%, 50%)',
  //   'donut': 112,
  //   'donutColor': 'hsl(265, 70%, 50%)'
  // },
  // {
  //   'country': 'AG',
  //   'hot dog': 64,
  //   'hot dogColor': 'hsl(315, 70%, 50%)',
  //   'burger': 6,
  //   'burgerColor': 'hsl(318, 70%, 50%)',
  //   'sandwich': 113,
  //   'sandwichColor': 'hsl(340, 70%, 50%)',
  //   'kebab': 146,
  //   'kebabColor': 'hsl(190, 70%, 50%)',
  //   'fries': 12,
  //   'friesColor': 'hsl(81, 70%, 50%)',
  //   'donut': 99,
  //   'donutColor': 'hsl(6, 70%, 50%)'
  // },
  // {
  //   'country': 'AI',
  //   'hot dog': 197,
  //   'hot dogColor': 'hsl(275, 70%, 50%)',
  //   'burger': 93,
  //   'burgerColor': 'hsl(124, 70%, 50%)',
  //   'sandwich': 72,
  //   'sandwichColor': 'hsl(23, 70%, 50%)',
  //   'kebab': 10,
  //   'kebabColor': 'hsl(5, 70%, 50%)',
  //   'fries': 96,
  //   'friesColor': 'hsl(24, 70%, 50%)',
  //   'donut': 189,
  //   'donutColor': 'hsl(265, 70%, 50%)'
  // },
  // {
  //   'country': 'AL',
  //   'hot dog': 166,
  //   'hot dogColor': 'hsl(204, 70%, 50%)',
  //   'burger': 49,
  //   'burgerColor': 'hsl(109, 70%, 50%)',
  //   'sandwich': 154,
  //   'sandwichColor': 'hsl(158, 70%, 50%)',
  //   'kebab': 158,
  //   'kebabColor': 'hsl(280, 70%, 50%)',
  //   'fries': 50,
  //   'friesColor': 'hsl(87, 70%, 50%)',
  //   'donut': 159,
  //   'donutColor': 'hsl(60, 70%, 50%)'
  // },
  // {
  //   'country': 'AM',
  //   'hot dog': 114,
  //   'hot dogColor': 'hsl(57, 70%, 50%)',
  //   'burger': 9,
  //   'burgerColor': 'hsl(33, 70%, 50%)',
  //   'sandwich': 66,
  //   'sandwichColor': 'hsl(329, 70%, 50%)',
  //   'kebab': 116,
  //   'kebabColor': 'hsl(167, 70%, 50%)',
  //   'fries': 81,
  //   'friesColor': 'hsl(174, 70%, 50%)',
  //   'donut': 194,
  //   'donutColor': 'hsl(177, 70%, 50%)'
  // }
];

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export default function Chart() {
  return (
    <ResponsiveBar
      data={data}
      keys={[
        'detractors',
        'passives',
        'promoters',
        'kebab',
        'fries',
        'donut'
      ]}
      indexBy="metric"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      layout="horizontal"
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      borderColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            1.6
          ]
        ]
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'score',
        legendPosition: 'middle',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'metric',
        legendPosition: 'middle',
        legendOffset: -40
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            1.6
          ]
        ]
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
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={function(e){return e.id + ': ' + e.formattedValue + ' in metric: ' + e.indexValue;}}
    />
  );
}