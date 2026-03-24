import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Controller, useFormContext } from "react-hook-form";

const ColorPalette = ({ name, rules = {} }) => {
  const { control, setValue, getValues } = useFormContext();

  const colorData = [
    [
      { hex: "#3B82F6", name: "Blue-500" },
      { hex: "#10B981", name: "Emerald-500" },
      { hex: "#F59E0B", name: "Amber-500" },
      { hex: "#EF4444", name: "Red-500" },
    ],
    [
      { hex: "#8B5CF6", name: "Violet-500" },
      { hex: "#4F46E5", name: "Indigo-600" },
      { hex: "#06B6D4", name: "Cyan-500" },
      { hex: "#F97316", name: "Orange-500" },
    ],
    [
      { hex: "#059669", name: "Green-600" },
      { hex: "#EC4899", name: "Pink-500" },
      { hex: "#84CC16", name: "Lime-500" },
      { hex: "#A855F7", name: "Purple-500" },
    ],
    [
      { hex: "#DC2626", name: "Red-600" },
      { hex: "#6366F1", name: "Indigo-500" },
      { hex: "#14B8A6", name: "Teal-500" },
      { hex: "#22C55E", name: "Green-500" },
    ],
    [
      { hex: "#0EA5E9", name: "Sky-500" },
      { hex: "#D946EF", name: "Fuchsia-500" },
      { hex: "#64748B", name: "Slate-500" },
      { hex: "#F43F5E", name: "Rose-500" },
    ],
  ];

  const handleColorSelect = (selectedColor, currentColors = []) => {
    const colorsArray = Array.isArray(currentColors) ? currentColors : [];

    if (colorsArray.includes(selectedColor)) {
      // Remove color if already selected
      const updatedColors = colorsArray.filter(
        (color) => color !== selectedColor
      );
      setValue(name, updatedColors, { shouldValidate: true });
    } else {
      // Add color if not selected
      const updatedColors = [...colorsArray, selectedColor];
      setValue(name, updatedColors, { shouldValidate: true });
    }
  };

  const renderColorItem = (item, currentColors) => {
    const isSelected =
      Array.isArray(currentColors) && currentColors.includes(item.hex);

    return (
      <Pressable
        key={item.hex}
        onPress={() => handleColorSelect(item.hex, currentColors)}
        className={`flex-row items-center px-4 py-3 rounded-full border min-w-[100px] ${
          isSelected
            ? "border-surfaceAction bg-surfaceAction/10"
            : "border-gray-200 bg-white"
        }`}
      >
        <View
          className="w-5 h-5 rounded-full mr-2 border border-gray-300"
          style={{ backgroundColor: item.hex }}
        />
        <Text
          className={`text-md font-Medium ${
            isSelected ? "text-surfaceAction" : "text-textPrimary"
          }`}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      // rules={rules}
      render={({ field: { value }, fieldState: { error } }) => (
        <View>
          <Text className="text-lg font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-5">
            Colors
          </Text>

          <View className="flex-col gap-3">
            {colorData.map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row gap-3 flex-wrap">
                {row.map((item) => renderColorItem(item, value))}
              </View>
            ))}
          </View>

          {/* {error && (
            <Text className="text-red-500 text-sm mt-2">
              {error.message}
            </Text>
          )} */}

          {/* Show selected colors */}
          {/* {value && value.length > 0 && (
            <View className="mt-4">
              <Text className="text-sm text-textSecondary font-Medium">
                Selected: {value.join(", ")}
              </Text>
            </View>
          )} */}
        </View>
      )}
    />
  );
};

export default ColorPalette;
