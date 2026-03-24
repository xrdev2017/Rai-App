// import React, { useRef } from "react";
// import { View, Text, TextInput } from "react-native";

// const CustomDatePicker = ({ value = "", onChange }) => {
//   // Parse the string "DD/MM/YYYY" into parts
//   const [day = "", month = "", year = ""] = value.split("/");

//   const dayRef = useRef(null);
//   const monthRef = useRef(null);
//   const yearRef = useRef(null);

//   const updateDate = (d, m, y) => {
//     onChange?.(`${d}/${m}/${y}`);
//   };

//   const handleDayChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "");
//     if (numericText === "" || (parseInt(numericText) >= 1 && parseInt(numericText) <= 31)) {
//       if (numericText.length === 2) monthRef.current?.focus();
//       updateDate(numericText, month, year);
//     }
//   };

//   const handleMonthChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "");
//     if (numericText === "" || (parseInt(numericText) >= 1 && parseInt(numericText) <= 12)) {
//       if (numericText.length === 2) yearRef.current?.focus();
//       updateDate(day, numericText, year);
//     }
//   };

//   const handleYearChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "");
//     if (numericText === "" || numericText.length <= 4) {
//       updateDate(day, month, numericText);
//     }
//   };

//   return (
//     <View className="w-full mb-2">
//       <Text className="text-[16px] font-Medium text-textPrimary mb-2">
//         Date Of Birth
//       </Text>

//       <View className="flex-row items-center gap-3">
//         {/* Day */}
//         <View className="flex-1">
//           <TextInput
//             ref={dayRef}
//             className="w-full h-12 px-4 bg-white border border-zinc-200 rounded-xl font-Regular text-base focus:border-borderAction"
//             value={day}
//             onChangeText={handleDayChange}
//             keyboardType="numeric"
//             maxLength={2}
//             selectTextOnFocus
//             onSubmitEditing={() => monthRef.current?.focus()}
//           />
//           <Text className="text-md text-textPrimary mt-1">DD</Text>
//         </View>

//         {/* Month */}
//         <View className="flex-1">
//           <TextInput
//             ref={monthRef}
//             className="w-full h-12 px-4 bg-white border border-zinc-200 rounded-xl font-Regular text-base focus:border-borderAction"
//             value={month}
//             onChangeText={handleMonthChange}
//             keyboardType="numeric"
//             maxLength={2}
//             selectTextOnFocus
//             onSubmitEditing={() => yearRef.current?.focus()}
//           />
//           <Text className="text-md text-textPrimary mt-1">MM</Text>
//         </View>

//         {/* Year */}
//         <View className="flex-1">
//           <TextInput
//             ref={yearRef}
//             className="w-full h-12 px-4 bg-white border border-zinc-200 rounded-xl font-Regular text-base focus:border-borderAction"
//             value={year}
//             onChangeText={handleYearChange}
//             keyboardType="numeric"
//             maxLength={4}
//             selectTextOnFocus
//           />
//           <Text className="text-md text-textPrimary mt-1">YYYY</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default CustomDatePicker;


import React, { useRef } from "react";
import { View, Text, TextInput } from "react-native";
import i18n from "../../../utils/languageSetup"; // adjust path

const CustomDatePicker = ({ value = "", onChange }) => {
  // Parse the string "DD/MM/YYYY" into parts
  const [day = "", month = "", year = ""] = value.split("/");

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const updateDate = (d, m, y) => {
    onChange?.(`${d}/${m}/${y}`);
  };

  const handleDayChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText === "" || (parseInt(numericText) >= 1 && parseInt(numericText) <= 31)) {
      if (numericText.length === 2) monthRef.current?.focus();
      updateDate(numericText, month, year);
    }
  };

  const handleMonthChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText === "" || (parseInt(numericText) >= 1 && parseInt(numericText) <= 12)) {
      if (numericText.length === 2) yearRef.current?.focus();
      updateDate(day, numericText, year);
    }
  };

  const handleYearChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText === "" || numericText.length <= 4) {
      updateDate(day, month, numericText);
    }
  };

  return (
    <View className="w-full mb-2">
      <Text className="text-[16px] font-Medium text-textPrimary mb-2">
        {i18n.t("accountPrivacyEdit.dateOfBirth")}
      </Text>

      <View className="flex-row items-center gap-3">
        {/* Day */}
        <View className="flex-1">
          <TextInput
            ref={dayRef}
            className="w-full h-12 px-4 bg-white border border-zinc-200 rounded-xl font-Regular text-base focus:border-borderAction"
            value={day}
            onChangeText={handleDayChange}
            keyboardType="numeric"
            maxLength={2}
            selectTextOnFocus
            onSubmitEditing={() => monthRef.current?.focus()}
          />
          <Text className="text-md text-textPrimary mt-1">
            {i18n.t("accountPrivacyEdit.day")}
          </Text>
        </View>

        {/* Month */}
        <View className="flex-1">
          <TextInput
            ref={monthRef}
            className="w-full h-12 px-4 bg-white border border-zinc-200 rounded-xl font-Regular text-base focus:border-borderAction"
            value={month}
            onChangeText={handleMonthChange}
            keyboardType="numeric"
            maxLength={2}
            selectTextOnFocus
            onSubmitEditing={() => yearRef.current?.focus()}
          />
          <Text className="text-md text-textPrimary mt-1">
            {i18n.t("accountPrivacyEdit.month")}
          </Text>
        </View>

        {/* Year */}
        <View className="flex-1">
          <TextInput
            ref={yearRef}
            className="w-full h-12 px-4 bg-white border border-zinc-200 rounded-xl font-Regular text-base focus:border-borderAction"
            value={year}
            onChangeText={handleYearChange}
            keyboardType="numeric"
            maxLength={4}
            selectTextOnFocus
          />
          <Text className="text-md text-textPrimary mt-1">
            {i18n.t("accountPrivacyEdit.year")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CustomDatePicker;
