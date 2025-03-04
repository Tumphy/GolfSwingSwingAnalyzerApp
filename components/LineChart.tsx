import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText } from 'react-native-svg';
import Colors from '@/constants/Colors';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color: () => string;
    strokeWidth: number;
  }[];
}

interface LineChartProps {
  data: ChartData;
  width: number;
  height: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, width, height }) => {
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Find min and max values in the data
  const allValues = data.datasets.flatMap(dataset => dataset.data);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue;
  
  // Create a function to scale Y values to fit the chart height
  const scaleY = (value: number) => {
    return chartHeight - ((value - minValue) / valueRange) * chartHeight + padding.top;
  };
  
  // Create a function to position X values evenly across the chart width
  const scaleX = (index: number) => {
    return (index / (data.labels.length - 1)) * chartWidth + padding.left;
  };
  
  // Generate path for each dataset
  const generatePath = (dataset: { data: number[] }) => {
    return dataset.data.map((value, index) => {
      const x = scaleX(index);
      const y = scaleY(value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };
  
  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Y-axis */}
        <Line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke={Colors.lightGray}
          strokeWidth={1}
        />
        
        {/* X-axis */}
        <Line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke={Colors.lightGray}
          strokeWidth={1}
        />
        
        {/* X-axis labels */}
        {data.labels.map((label, index) => (
          <SvgText
            key={index}
            x={scaleX(index)}
            y={height - padding.bottom + 20}
            fontSize={10}
            fontFamily="Inter-Regular"
            fill={Colors.gray}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}
        
        {/* Y-axis labels */}
        {[minValue, (minValue + maxValue) / 2, maxValue].map((value, index) => (
          <SvgText
            key={index}
            x={padding.left - 10}
            y={scaleY(value) + 4}
            fontSize={10}
            fontFamily="Inter-Regular"
            fill={Colors.gray}
            textAnchor="end"
          >
            {Math.round(value)}
          </SvgText>
        ))}
        
        {/* Grid lines */}
        {[minValue, (minValue + maxValue) / 2, maxValue].map((value, index) => (
          <Line
            key={index}
            x1={padding.left}
            y1={scaleY(value)}
            x2={width - padding.right}
            y2={scaleY(value)}
            stroke={Colors.lightGray}
            strokeWidth={0.5}
            strokeDasharray="5,5"
          />
        ))}
        
        {/* Draw lines for each dataset */}
        {data.datasets.map((dataset, datasetIndex) => (
          <Path
            key={datasetIndex}
            d={generatePath(dataset)}
            fill="none"
            stroke={dataset.color()}
            strokeWidth={dataset.strokeWidth}
          />
        ))}
        
        {/* Draw points for each data point */}
        {data.datasets.map((dataset, datasetIndex) => (
          dataset.data.map((value, index) => (
            <Circle
              key={`${datasetIndex}-${index}`}
              cx={scaleX(index)}
              cy={scaleY(value)}
              r={4}
              fill={Colors.white}
              stroke={dataset.color()}
              strokeWidth={2}
            />
          ))
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LineChart;