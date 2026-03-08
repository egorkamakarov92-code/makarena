import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface MiniChartProps {
  data: number[];
  width?: number;
  height?: number;
}

export function MiniChart({ data, width = 320, height = 50 }: MiniChartProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data) * 0.998;
  const max = Math.max(...data) * 1.002;
  const range = max - min || 1;
  const isUp = data[data.length - 1] >= data[0];
  const color = isUp ? Colors.green : Colors.red;

  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((val - min) / range) * height,
  }));

  // Build line path
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    linePath += ` L ${points[i].x} ${points[i].y}`;
  }

  // Build fill path
  const fillPath = linePath + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <View style={{ width, height, marginVertical: 8 }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop
              offset="0"
              stopColor={color}
              stopOpacity={0.3}
            />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={fillPath} fill="url(#fillGrad)" />
        <Path d={linePath} stroke={color} strokeWidth={2} fill="none" />
      </Svg>
    </View>
  );
}
