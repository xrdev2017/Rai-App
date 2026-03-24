import { TouchableOpacity, View, Text } from "react-native";

const MultiOptionSelector = ({ title, selectedValues, onSelect }) => {
  const isSelected = selectedValues.includes(title);

  return (
    <TouchableOpacity
      className={`py-2 px-5 rounded-full mb-2 ${
        isSelected ? "bg-surfaceAction" : "bg-gray-100"
      }`}
      onPress={() => onSelect(title)}
    >
      <Text
        className={`text-base font-Medium ${
          isSelected ? "text-white" : "text-textPrimary"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default MultiOptionSelector;
