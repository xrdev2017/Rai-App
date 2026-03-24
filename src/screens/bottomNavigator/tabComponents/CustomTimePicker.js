// import { MoveRight } from "lucide-react-native";
// import React, { useState, useRef, useEffect } from "react";
// import { useFormContext, Controller } from "react-hook-form";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Dimensions,
//   Pressable,
// } from "react-native";

// const { width } = Dimensions.get("window");

// const CustomTimePicker = ({
//   visible,
//   onCancel,
//   onConfirm,
//   initialHour = "1",
//   initialMinute = "00",
//   initialPeriod = "AM",
// }) => {
//   const { control, setValue, watch } = useFormContext();
//   const [localHour, setLocalHour] = useState(initialHour);
//   const [localMinute, setLocalMinute] = useState(initialMinute);
//   const [localPeriod, setLocalPeriod] = useState(initialPeriod);

//   const hourRef = useRef(null);
//   const minuteRef = useRef(null);

//   // Watch the form value to keep in sync
//   const plannerTime = watch("plannerTime");

//   // Parse the initial time from form value if it exists
//   useEffect(() => {
//     if (plannerTime && typeof plannerTime === "string") {
//       const timeParts = plannerTime.split(" ");
//       if (timeParts.length === 2) {
//         const [time, period] = timeParts;
//         const [hour, minute] = time.split(":");
//         setLocalHour(hour || initialHour);
//         setLocalMinute(minute || initialMinute);
//         setLocalPeriod(period || initialPeriod);
//       }
//     }
//   }, [plannerTime, initialHour, initialMinute, initialPeriod]);

//   // Initialize when modal becomes visible
//   useEffect(() => {
//     if (visible) {
//       setLocalHour(initialHour);
//       setLocalMinute(initialMinute);
//       setLocalPeriod(initialPeriod);

//       const formattedTime = formatTime(
//         initialHour,
//         initialMinute,
//         initialPeriod
//       );
//       setValue("plannerTime", formattedTime);
//     }
//   }, [visible, initialHour, initialMinute, initialPeriod, setValue]);

//   const formatTime = (hour, minute, period) => {
//     return `${hour.padStart(1, "")}:${minute.padStart(2, "0")} ${period}`;
//   };

//   const handleHourChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "");
//     if (
//       numericText === "" ||
//       (parseInt(numericText) >= 1 && parseInt(numericText) <= 12)
//     ) {
//       setLocalHour(numericText);
//       const formattedTime = formatTime(numericText, localMinute, localPeriod);
//       setValue("plannerTime", formattedTime);
//     }
//   };

//   const handleMinuteChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "");
//     if (
//       numericText === "" ||
//       (parseInt(numericText) >= 0 && parseInt(numericText) <= 59)
//     ) {
//       setLocalMinute(numericText);
//       const formattedTime = formatTime(localHour, numericText, localPeriod);
//       setValue("plannerTime", formattedTime);
//     }
//   };

//   const handlePeriodChange = (selectedPeriod) => {
//     setLocalPeriod(selectedPeriod);
//     const formattedTime = formatTime(localHour, localMinute, selectedPeriod);
//     setValue("plannerTime", formattedTime);
//   };

//   const handleConfirm = () => {
//     const formattedTime = formatTime(localHour, localMinute, localPeriod);
//     setValue("plannerTime", formattedTime);
//     onConfirm();
//   };

//   console.log("LINE AT 1067", plannerTime);

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onCancel}
//     >
//       <Pressable
//         activeOpacity={1}
//         className="flex-1 bg-black/50 justify-center items-center px-5"
//         onPress={onCancel} // click outside
//       >
//         <Pressable
//           className="bg-white rounded-2xl p-6"
//           style={{ width: width * 0.85, maxWidth: 350 }}
//           onPress={() => {}} // prevent modal close when tapping inside
//         >
//           {/* Header */}
//           <Text className="text-lg font-Medium text-zinc-500 mb-6 text-left">
//             ENTER TIME
//           </Text>

//           {/* Time Section */}
//           <View className="flex-row items-start justify-center mb-10">
//             {/* Hour Input */}
//             <View className="">
//               <Controller
//                 name="plannerTime"
//                 control={control}
//                 render={({ field }) => (
//                   <TextInput
//                     ref={hourRef}
//                     className="w-28 h-28 focus:bg-white bg-zinc-200 rounded-xl focus:text-surfaceAction text-4xl font-light text-center border-2 border-white focus:border-surfaceAction"
//                     value={localHour}
//                     onChangeText={handleHourChange}
//                     keyboardType="numeric"
//                     maxLength={2}
//                     selectTextOnFocus
//                     onSubmitEditing={() => minuteRef.current?.focus()}
//                   />
//                 )}
//               />
//               <Text className="text-md text-zinc-500 font-Regular">Hour</Text>
//             </View>

//             {/* Colon */}
//             <View className="px-4 pt-12 justify-center items-center">
//               <View className="w-1.5 h-1.5 bg-zinc-900 rounded-full my-0.5" />
//               <View className="w-1.5 h-1.5 bg-zinc-900 rounded-full my-0.5" />
//             </View>

//             {/* Minute Input */}
//             <View className="">
//               <Controller
//                 name="plannerTime"
//                 control={control}
//                 render={({ field }) => (
//                   <TextInput
//                     ref={minuteRef}
//                     className="w-28 h-28 focus:bg-white bg-zinc-200 rounded-xl focus:text-surfaceAction text-4xl font-light text-center border-2 border-white focus:border-surfaceAction"
//                     value={localMinute}
//                     onChangeText={handleMinuteChange}
//                     keyboardType="numeric"
//                     maxLength={2}
//                     selectTextOnFocus
//                   />
//                 )}
//               />
//               <Text className="text-md text-zinc-500 font-Regular">Minute</Text>
//             </View>

//             {/* AM/PM */}
//             <View className="ml-3 border border-gray-400 rounded-md">
//               {["AM", "PM"].map((item) => (
//                 <TouchableOpacity
//                   key={item}
//                   className={`p-4 min-w-[50px] items-center rounded-md ${
//                     localPeriod === item ? "bg-surfaceAction" : "bg-white"
//                   }`}
//                   onPress={() => handlePeriodChange(item)}
//                 >
//                   <Text
//                     className={`text-base font-Medium ${
//                       localPeriod === item ? "text-white" : "text-zinc-500"
//                     }`}
//                   >
//                     {item}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Action Buttons */}
//           <View className="flex-row justify-end items-center">
//             {/* Cancel Button */}
//             <TouchableOpacity
//               onPress={onCancel}
//               activeOpacity={0.7}
//               className="flex-row items-center py-3 px-4"
//             >
//               <Text className="text-lg text-textPrimary font-medium mr-2">
//                 Cancel
//               </Text>
//               <MoveRight color="#000" />
//             </TouchableOpacity>

//             {/* Confirm Button */}
//             <TouchableOpacity
//               onPress={handleConfirm}
//               activeOpacity={0.8}
//               className="bg-surfaceAction flex-row items-center py-3 px-6 rounded-2xl"
//             >
//               <Text className="text-lg text-white font-semibold mr-2">OK</Text>
//               <MoveRight color="white" />
//             </TouchableOpacity>
//           </View>
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// export default CustomTimePicker;

import { MoveRight } from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

const CustomTimePicker = ({
  visible,
  onCancel,
  onConfirm,
  initialHour = "1",
  initialMinute = "00",
  initialPeriod = "AM",
  isLoading,
}) => {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext();
  const [localHour, setLocalHour] = useState(initialHour);
  const [localMinute, setLocalMinute] = useState(initialMinute);
  const [localPeriod, setLocalPeriod] = useState(initialPeriod);

  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  const plannerTime = watch("plannerTime");

  useEffect(() => {
    if (plannerTime && typeof plannerTime === "string") {
      const timeParts = plannerTime.split(" ");
      if (timeParts.length === 2) {
        const [time, period] = timeParts;
        const [hour, minute] = time.split(":");
        setLocalHour(hour || initialHour);
        setLocalMinute(minute || initialMinute);
        setLocalPeriod(period || initialPeriod);
      }
    }
  }, [plannerTime, initialHour, initialMinute, initialPeriod]);

  useEffect(() => {
    if (visible) {
      setLocalHour(initialHour);
      setLocalMinute(initialMinute);
      setLocalPeriod(initialPeriod);

      const formattedTime = formatTime(
        initialHour,
        initialMinute,
        initialPeriod
      );
      setValue("plannerTime", formattedTime);
    }
  }, [visible, initialHour, initialMinute, initialPeriod, setValue]);

  const formatTime = (hour, minute, period) =>
    `${hour.padStart(1, "")}:${minute.padStart(2, "0")} ${period}`;

  const handleHourChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (
      numericText === "" ||
      (parseInt(numericText) >= 1 && parseInt(numericText) <= 12)
    ) {
      setLocalHour(numericText);
      setValue(
        "plannerTime",
        formatTime(numericText, localMinute, localPeriod)
      );
    }
  };

  const handleMinuteChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (
      numericText === "" ||
      (parseInt(numericText) >= 0 && parseInt(numericText) <= 59)
    ) {
      setLocalMinute(numericText);
      setValue("plannerTime", formatTime(localHour, numericText, localPeriod));
    }
  };

  const handlePeriodChange = (selectedPeriod) => {
    setLocalPeriod(selectedPeriod);
    setValue("plannerTime", formatTime(localHour, localMinute, selectedPeriod));
  };

  const handleConfirm = () => {
    setValue("plannerTime", formatTime(localHour, localMinute, localPeriod));
    onConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        activeOpacity={1}
        className="flex-1 bg-black/50 justify-center items-center px-5"
        onPress={onCancel}
      >
        <Pressable
          className="bg-white  dark:bg-darkSurfacePrimary  rounded-2xl p-6"
          style={{ width: width * 0.85, maxWidth: 350 }}
          onPress={() => {}}
        >
          {/* Header */}
          <Text className="text-lg font-Medium text-zinc-500 mb-6 text-left">
            {t("timePicker.enterTime")}
          </Text>

          {/* Time Section */}
          <View className="flex-row items-start justify-center mb-10">
            {/* Hour */}
            <View>
              <Controller
                name="plannerTime"
                control={control}
                render={() => (
                  <TextInput
                    ref={hourRef}
                    className="w-28 h-28 focus:bg-white bg-zinc-200 rounded-xl focus:text-surfaceAction text-4xl font-light text-center border-2 border-white focus:border-surfaceAction"
                    value={localHour}
                    onChangeText={handleHourChange}
                    keyboardType="numeric"
                    maxLength={2}
                    selectTextOnFocus
                    onSubmitEditing={() => minuteRef.current?.focus()}
                  />
                )}
              />
              <Text className="text-md text-zinc-500 font-Regular">
                {t("timePicker.hour")}
              </Text>
            </View>

            {/* Colon */}
            <View className="px-4 pt-12 justify-center items-center">
              <View className="w-1.5 h-1.5 bg-zinc-900 rounded-full my-0.5" />
              <View className="w-1.5 h-1.5 bg-zinc-900 rounded-full my-0.5" />
            </View>

            {/* Minute */}
            <View>
              <Controller
                name="plannerTime"
                control={control}
                render={() => (
                  <TextInput
                    ref={minuteRef}
                    className="w-28 h-28 focus:bg-white bg-zinc-200 rounded-xl focus:text-surfaceAction text-4xl font-light text-center border-2 border-white focus:border-surfaceAction"
                    value={localMinute}
                    onChangeText={handleMinuteChange}
                    keyboardType="numeric"
                    maxLength={2}
                    selectTextOnFocus
                  />
                )}
              />
              <Text className="text-md text-zinc-500 font-Regular">
                {t("timePicker.minute")}
              </Text>
            </View>

            {/* AM/PM */}
            <View className="ml-3 border border-gray-400 rounded-md">
              {["AM", "PM"].map((item) => (
                <TouchableOpacity
                  key={item}
                  className={`p-4 min-w-[50px] items-center rounded-md ${
                    localPeriod === item ? "bg-surfaceAction" : "bg-white"
                  }`}
                  onPress={() => handlePeriodChange(item)}
                >
                  <Text
                    className={`text-base font-Medium ${
                      localPeriod === item ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-end items-center">
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.7}
              className="flex-row items-center py-3 px-4"
            >
              <Text className="text-lg text-textPrimary dark:text-darkTextPrimary font-medium mr-2">
                {t("timePicker.cancel")}
              </Text>
              <MoveRight color="#5700FE" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isLoading}
              onPress={handleConfirm}
              activeOpacity={0.8}
              className={`${isLoading ? "bg-gray-300" : "bg-surfaceAction"}  flex-row items-center py-3 px-6 rounded-2xl`}
            >
              <Text className="text-lg text-white font-semibold mr-2">
                {t("timePicker.ok")}
              </Text>
              <MoveRight color="white" />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CustomTimePicker;
