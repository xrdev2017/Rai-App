import React from "react";
import { View, Modal, Pressable, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "../utils/ThemeContext";

const DatePicker = ({ calendarVisible, setCalendarVisible, onClose }) => {
  const { setValue } = useFormContext();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  return (
    <Modal visible={calendarVisible} animationType="slide" transparent>
      {/* Outer pressable (background) */}
      <Pressable
        activeOpacity={1}
        className="flex-1 justify-center bg-black/60 p-5"
        onPress={onClose}
      >
        {/* Prevent closing when tapping inside content */}
        <Pressable
          className="bg-white dark:bg-darkSurfaceSecondary rounded-lg p-4 overflow-hidden"
          onPress={() => {}}
        >
          <Calendar
            onDayPress={(day) => {
              // console.log(day.dateString);
              setValue("plannerDate", day.dateString);
              setCalendarVisible();
            }}
            // theme={"DARK"}
            // minDate={moment().format('YYYY-MM-DD')}
            theme={{
              // Base colors
              backgroundColor: isDarkMode ? "#121212" : "#fff",
              calendarBackground: isDarkMode ? "#1e1e1e" : "#fff",

              // Text colors
              textSectionTitleColor: isDarkMode ? "#a0a0a0" : "#b6c1cd",
              dayTextColor: isDarkMode ? "#e0e0e0" : "#2d4150",
              monthTextColor: isDarkMode ? "#ffffff" : undefined,
              textDisabledColor: isDarkMode ? "#555555" : "#dd99ee",

              // Today styling
              todayTextColor: isDarkMode ? "#4da6ff" : "#00adf5",
              todayBackgroundColor: isDarkMode
                ? "rgba(77, 166, 255, 0.1)"
                : undefined,

              // Selected day styling
              selectedDayBackgroundColor: isDarkMode ? "#4da6ff" : "#00adf5",
              selectedDayTextColor: "#ffffff",

              // Additional improvements for dark mode
              arrowColor: isDarkMode ? "#4da6ff" : "#00adf5",
              dotColor: isDarkMode ? "#4da6ff" : "#00adf5",

              // Disabled styling
              disabledArrowColor: isDarkMode ? "#444444" : "#dd99ee",

              // Week styling
              textSectionTitleDisabledColor: isDarkMode ? "#444444" : undefined,

              // Day name styling
              textDayHeaderFontSize: 14,
              textDayHeaderFontWeight: "600",
              textDayHeaderColor: isDarkMode ? "#888888" : "#999999",
            }}
          />

          {/* <Pressable
            onPress={setCalendarVisible}
            className="bg-surfaceAction mt-4 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-Medium">
              {t("calendar.button")}
            </Text>
          </Pressable> */}
          
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DatePicker;
