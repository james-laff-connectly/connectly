import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

export default function Chart({ scores }) {  
  return (
    <ResponsiveBar
      theme={{
        fontSize: 16,
        fontFamily: 'Verdana',
        textColor: '#050505'
      }}  
      data={scores}
      keys={[
        'detractors',
        'passives',
        'promoters'
      ]}
      indexBy="metric"
      margin={{ top: 50, right: 140, bottom: 50, left: 80 }}
      padding={0.3}
      layout="horizontal"
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={['#fc8d59', '#ffffbf', '#91bfdb']}
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
      axisBottom={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0
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
          translateY: -100,
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
      isFocusable={true}
      ariaLabel="Customer Review Metrics"
      barAriaLabel={function(e){return e.id + ': ' + e.formattedValue + ' in metric: ' + e.indexValue;}}
    />
  );
}