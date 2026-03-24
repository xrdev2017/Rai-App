import { TouchableOpacity, View, Text } from "react-native";

const OptionSelector = ({ title, selectedValue, onSelect }) => {
  // console.log("Selected Value in OptionSelector:", selectedValue, title);

  return (
    <TouchableOpacity
      className="flex-row items-center gap-2"
      onPress={() => onSelect(title)}
    >
      <View
        className={`w-5 h-5 rounded-full ${
          selectedValue === title
            ? "border-surfaceAction border-4"
            : "border-gray-300 border-2"
        } justify-center items-center`}
      >
        <View
          className={`w-2.5 h-2.5 rounded-full ${
            selectedValue === title ? "bg-white" : "bg-zinc-200"
          }`}
        />
      </View>
      <Text className="font-Medium text-[16px] text-textPrimary dark:text-darkTextPrimary ">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OptionSelector;

// OptionSelector.js
// const OptionSelector = ({ title, selectedValue, onSelect }) => (
//   console.log("Selected Value in OptionSelector:", selectedValue, title),

//   <TouchableOpacity
//     className="flex-row items-center gap-2"
//     onPress={() => onSelect(title)}
//   >
//     <View
//       className={`w-5 h-5 rounded-full ${
//         selectedValue === title
//           ? "border-surfaceAction border-4"
//           : "border-gray-300 border-2"
//       } justify-center items-center`}
//     >
//       <View
//         className={`w-2.5 h-2.5 rounded-full ${
//           selectedValue === title ? "bg-white" : "bg-zinc-200"
//         }`}
//       />
//     </View>
//     <Text className="font-Medium text-[16px] text-textPrimary">{title}</Text>
//   </TouchableOpacity>
// );

// export default OptionSelector;
