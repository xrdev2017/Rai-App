import React from "react";
import { View } from "react-native";
import Svg, { G, Path, Circle, Text as SvgText } from "react-native-svg";

const PieChart = ({
  numSlices = 17, // number of colored slices
  totalSlices = 100, // total for calculating percentage
  radius = 60,
  centerText = "17",
  fontSize = 14,
  centerRadiusRatio = 0.4,
  colors = [
    "#6366f1", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6",
    "#f97316", "#06b6d4", "#84cc16", "#ec4899", "#14b8a6",
    "#f472b6", "#a855f7", "#22c55e", "#3b82f6", "#eab308",
    "#dc2626", "#059669"
  ],
}) => {
  const createSlicePath = (startAngle, sliceAngle) => {
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(startAngle + sliceAngle);
    const y2 = radius + radius * Math.sin(startAngle + sliceAngle);
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const totalAngle = 2 * Math.PI;
  const sliceAngle = totalAngle / totalSlices;

  let startAngle = -Math.PI / 2;

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={radius * 2} height={radius * 2}>
        <G>
          {/* Colored slices */}
          {Array.from({ length: numSlices }).map((_, index) => {
            const path = createSlicePath(startAngle, sliceAngle);
            const fillColor = colors[index % colors.length];
            startAngle += sliceAngle;
            return <Path key={index} d={path} fill={fillColor} stroke="#fff" strokeWidth={1} />;
          })}

          {/* Remaining white/gray slices */}
          {Array.from({ length: totalSlices - numSlices }).map((_, index) => {
            const path = createSlicePath(startAngle, sliceAngle);
            startAngle += sliceAngle;
            return <Path key={numSlices + index} d={path} fill="#e5e7eb" stroke="#fff" strokeWidth={1} />;
          })}

          {/* Center circle */}
          <Circle
            cx={radius}
            cy={radius}
            r={radius * centerRadiusRatio}
            fill="#fff"
            stroke="#e5e7eb"
            strokeWidth={1}
          />

          {/* Center text */}
          <SvgText
            x={radius}
            y={radius}
            fill="#374151"
            fontSize={fontSize}
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {Math.round((numSlices / totalSlices) * 100)}%
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

export default PieChart;
