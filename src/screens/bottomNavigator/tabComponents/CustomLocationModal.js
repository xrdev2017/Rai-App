
// import { X, Search, ChevronsUp, MapPin } from "lucide-react-native";
// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Dimensions,
//   ScrollView,
// } from "react-native";

// const { width, height } = Dimensions.get("window");

// // Location Bottom Sheet Modal
// const LocationBottomSheet = ({
//   visible,
//   onCancel,
//   onLocationSelect,
//   selectedLocations = [],
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredLocations, setFilteredLocations] = useState([]);
//   const [selectedItems, setSelectedItems] = useState(selectedLocations);

//   const searchRef = useRef(null);

//   // Mock location data - replace with your actual locations
//   const locations = [
//     "New York",
//     "Los Angeles",
//     "Chicago",
//     "Houston",
//     "Phoenix",
//     "Philadelphia",
//     "San Antonio",
//     "San Diego",
//     "Dallas",
//     "San Jose",
//     "Austin",
//     "Jacksonville",
//     "Fort Worth",
//     "Columbus",
//     "Charlotte",
//     "Seattle",
//     "Denver",
//     "Boston",
//     "Nashville",
//     "Baltimore",
//   ];

//   useEffect(() => {
//     if (visible) {
//       setFilteredLocations(locations);
//       setTimeout(() => {
//         searchRef.current?.focus();
//       }, 300);
//     }
//   }, [visible]);

//   const handleSearch = (text) => {
//     setSearchQuery(text);

//     if (text.length > 0) {
//       const filtered = locations.filter((location) =>
//         location.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredLocations(filtered);
//     } else {
//       setFilteredLocations(locations);
//     }
//   };

//   const toggleLocationSelection = (location) => {
//     setSelectedItems((prev) => {
//       if (prev.includes(location)) {
//         return prev.filter((item) => item !== location);
//       } else {
//         return [...prev, location];
//       }
//     });
//   };

//   const handleApply = () => {
//     onLocationSelect(selectedItems);
//   };

//   const handleReset = () => {
//     setSelectedItems([]);
//     setSearchQuery("");
//     setFilteredLocations(locations);
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//     setFilteredLocations(locations);
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={onCancel}
//     >
//       <View className="flex-1 ">
//         <View className="flex-1 bg-white ">
//           {/* Header */}
//           <View className="flex-row items-center justify-between p-4 pt-6 border-b border-gray-100">
//             <TouchableOpacity onPress={onCancel} className="p-2">
//               <X size={24} color="#000" />
//             </TouchableOpacity>
//             <Text className="text-xl font-SemiBold text-textPrimary">
//               Location
//             </Text>
//             <TouchableOpacity onPress={handleReset}>
//               <Text className="text-base font-Medium text-textPrimary">
//                 Reset
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Search Bar */}
//           <View className="p-4">
//             <View className="flex-row items-center border border-borderAction rounded-xl px-4 py-1 bg-white">
//               <Search size={20} color="#8b5cf6" />
//               <TextInput
//                 ref={searchRef}
//                 className="flex-1 ml-3 text-base font-Medium text-black"
//                 value={searchQuery}
//                 onChangeText={handleSearch}
//                 placeholder=""
//                 placeholderTextColor="#9ca3af"
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity onPress={clearSearch} className="p-1">
//                   <X size={16} color="#6b7280" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           {/* Location List */}
//           <ScrollView className=" px-4">
//             {filteredLocations.map((location, index) => (
//               <TouchableOpacity
//                 key={location}
//                 className={`flex-row items-center justify-between py-4 ${
//                   index !== filteredLocations.length - 1
//                     ? "border-b border-gray-100"
//                     : ""
//                 }`}
//                 onPress={() => toggleLocationSelection(location)}
//                 activeOpacity={0.7}
//               >
//                 <Text className="text-base font-normal text-black flex-1">
//                   {location}
//                 </Text>

//                 {/* Checkbox */}
//                 <View
//                   className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
//                     selectedItems.includes(location)
//                       ? "bg-purple-500 border-purple-500"
//                       : "border-gray-300 bg-white"
//                   }`}
//                 >
//                   {selectedItems.includes(location) && (
//                     <View className="w-2 h-2 bg-white rounded-full" />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             ))}

//             {filteredLocations.length === 0 && (
//               <View className="flex-1 justify-center items-center py-20">
//                 <MapPin size={48} color="#d1d5db" />
//                 <Text className="text-gray-500 text-center mt-4">
//                   No locations found for "{searchQuery}"
//                 </Text>
//               </View>
//             )}
//           </ScrollView>

//           {/* Apply Button */}
//           <View className="p-4 pt-2">
//             <TouchableOpacity
//               className="bg-surfaceAction rounded-2xl py-4 items-center"
//               onPress={handleApply}
//               activeOpacity={0.8}
//             >
//               <Text className="text-white text-lg font-SemiBold">
//                 Apply{" "}
//                 {selectedItems.length > 0 ? `(${selectedItems.length})` : ""}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // Main Location Selector Component
// const CustomLocationModal = () => {
//   const [showLocationModal, setShowLocationModal] = useState(false);
//   const [selectedLocations, setSelectedLocations] = useState([]);

//   const handleLocationSelect = (locations) => {
//     setSelectedLocations(locations);
//     setShowLocationModal(false);
//   };

//   return (
//     <View className="w-full">
//       {/* Location Label */}
//       <Text className="text-[16px] font-SemiBold text-textPrimary mb-2">
//         Location
//       </Text>

//       {/* Clickable Location Button */}
//       <TouchableOpacity
//         className="w-full bg-surfaceActionTertiary rounded-2xl py-3 px-6 flex-row items-center justify-center"
//         onPress={() => setShowLocationModal(true)}
//         activeOpacity={0.8}
//       >
//         <Text className="text-white text-lg font-Medium text-center">
//           {selectedLocations.length > 0
//             ? `${selectedLocations.length} Location${selectedLocations.length > 1 ? "s" : ""} Selected`
//             : "---Select Country---"}
//         </Text>
//         <ChevronsUp size={20} color="white" />
//       </TouchableOpacity>

//       {/* Show selected locations */}
//       {selectedLocations.length > 0 && (
//         <View className="mt-3">
//           <Text className="text-sm font-medium text-gray-600 mb-2">
//             Selected Locations:
//           </Text>
//           <View className="flex-row flex-wrap">
//             {selectedLocations.map((location, index) => (
//               <View
//                 key={location}
//                 className="bg-purple-100 rounded-full px-3 py-1 mr-2 mb-2"
//               >
//                 <Text className="text-purple-700 text-sm">{location}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Location Bottom Sheet Modal */}
//       <LocationBottomSheet
//         visible={showLocationModal}
//         onCancel={() => setShowLocationModal(false)}
//         onLocationSelect={handleLocationSelect}
//         selectedLocations={selectedLocations}
//       />
//     </View>
//   );
// };

// export default CustomLocationModal;


import { X, Search, ChevronsUp, MapPin } from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Location Bottom Sheet Modal
const LocationBottomSheet = ({
  visible,
  onCancel,
  onLocationSelect,
  selectedLocation = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedItem, setSelectedItem] = useState(selectedLocation);

  const searchRef = useRef(null);

  const locations = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
    "Fort Worth", "Columbus", "Charlotte", "Seattle", "Denver", "Boston",
    "Nashville", "Baltimore",
  ];

  useEffect(() => {
    if (visible) {
      setFilteredLocations(locations);
      setSelectedItem(selectedLocation);
      setTimeout(() => searchRef.current?.focus(), 300);
    }
  }, [visible]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    setFilteredLocations(
      text
        ? locations.filter((location) =>
            location.toLowerCase().includes(text.toLowerCase())
          )
        : locations
    );
  };

  const handleSelect = (location) => {
    setSelectedItem(location);
    onLocationSelect(location);
  };

  const handleReset = () => {
    setSelectedItem("");
    setSearchQuery("");
    setFilteredLocations(locations);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredLocations(locations);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1">
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 pt-6 border-b border-gray-100">
            <TouchableOpacity onPress={onCancel} className="p-2">
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-xl font-SemiBold text-textPrimary">
              Location
            </Text>
            <TouchableOpacity onPress={handleReset}>
              <Text className="text-base font-Medium text-textPrimary">
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="p-4">
            <View className="flex-row items-center border border-borderAction rounded-xl px-4 py-1 bg-white">
              <Search size={20} color="#8b5cf6" />
              <TextInput
                ref={searchRef}
                className="flex-1 ml-3 text-base font-Medium text-black"
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder=""
                placeholderTextColor="#9ca3af"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} className="p-1">
                  <X size={16} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Location List */}
          <ScrollView className="px-4">
            {filteredLocations.map((location, index) => (
              <TouchableOpacity
                key={location}
                className={`flex-row items-center justify-between py-4 ${
                  index !== filteredLocations.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
                onPress={() => handleSelect(location)}
                activeOpacity={0.7}
              >
                <Text className="text-base font-normal text-black flex-1">
                  {location}
                </Text>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    selectedItem === location
                      ? "bg-purple-500 border-purple-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selectedItem === location && (
                    <View className="w-2 h-2 bg-white rounded-full" />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {filteredLocations.length === 0 && (
              <View className="flex-1 justify-center items-center py-20">
                <MapPin size={48} color="#d1d5db" />
                <Text className="text-gray-500 text-center mt-4">
                  No locations found for "{searchQuery}"
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Main Location Selector Component (Single Select)
const CustomLocationModal = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <View className="w-full">
      {/* Location Label */}
      <Text className="text-[16px] font-SemiBold text-textPrimary mb-2">
        Location
      </Text>

      {/* Location Button */}
      <TouchableOpacity
        className="w-full bg-surfaceActionTertiary rounded-2xl py-3 px-6 flex-row items-center justify-center"
        onPress={() => setShowLocationModal(true)}
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-Medium text-center">
          {selectedLocation || "---Select Country---"}
        </Text>
        <ChevronsUp size={20} color="white" />
      </TouchableOpacity>

      {/* Selected Location */}


      {/* Location Bottom Sheet Modal */}
      <LocationBottomSheet
        visible={showLocationModal}
        onCancel={() => setShowLocationModal(false)}
        onLocationSelect={(loc) => {
          setSelectedLocation(loc);
          setShowLocationModal(false);
        }}
        selectedLocation={selectedLocation}
      />
    </View>
  );
};

export default CustomLocationModal;
