// import { MapPin, Search, X, Clock, Navigation, ChevronsUp } from "lucide-react-native";
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

// const { width } = Dimensions.get("window");

// // Location Search Modal Component
// const LocationSearchModal = ({
//   visible,
//   onCancel,
//   onLocationSelect,
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [recentSearches, setRecentSearches] = useState([
//     {
//       id: 1,
//       name: "Times Square",
//       address: "Times Square, New York, NY, USA",
//       type: "recent"
//     },
//     {
//       id: 2,
//       name: "Central Park",
//       address: "Central Park, New York, NY, USA",
//       type: "recent"
//     },
//   ]);

//   const searchRef = useRef(null);

//   // Mock location suggestions
//   const mockSuggestions = [
//     {
//       id: 1,
//       name: "New York",
//       address: "New York, NY, USA",
//       type: "city"
//     },
//     {
//       id: 2,
//       name: "New York University",
//       address: "4 Washington Square N, New York, NY 10003, USA",
//       type: "university"
//     },
//     {
//       id: 3,
//       name: "New York Public Library",
//       address: "5th Ave & 42nd St, New York, NY 10018, USA",
//       type: "library"
//     },
//     {
//       id: 4,
//       name: "Newark",
//       address: "Newark, NJ, USA",
//       type: "city"
//     },
//   ];

//   useEffect(() => {
//     if (visible) {
//       setTimeout(() => {
//         searchRef.current?.focus();
//       }, 300);
//     }
//   }, [visible]);

//   const handleSearch = (text) => {
//     setSearchQuery(text);
    
//     if (text.length > 0) {
//       const filtered = mockSuggestions.filter(item =>
//         item.name.toLowerCase().includes(text.toLowerCase()) ||
//         item.address.toLowerCase().includes(text.toLowerCase())
//       );
//       setSuggestions(filtered);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleLocationSelect = (location) => {
//     const isAlreadyRecent = recentSearches.some(item => item.id === location.id);
//     if (!isAlreadyRecent) {
//       setRecentSearches(prev => [
//         { ...location, type: "recent" },
//         ...prev.slice(0, 4)
//       ]);
//     }
    
//     onLocationSelect(location);
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//     setSuggestions([]);
//   };

//   const LocationItem = ({ item }) => (
//     <TouchableOpacity
//       className="flex-row items-center py-4 px-4 border-b border-gray-100"
//       onPress={() => handleLocationSelect(item)}
//       activeOpacity={0.7}
//     >
//       <View className="mr-4">
//         {item.type === "recent" ? (
//           <Clock size={20} color="#8b5cf6" />
//         ) : (
//           <MapPin size={20} color="#6b7280" />
//         )}
//       </View>
//       <View className="flex-1">
//         <Text className="text-base font-medium text-gray-800" numberOfLines={1}>
//           {item.name}
//         </Text>
//         <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
//           {item.address}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={onCancel}
//     >
//       <View className="flex-1 bg-white">
//         {/* Header */}
//         <View className="flex-row items-center justify-between p-4 pt-12 border-b border-gray-200 bg-white">
//           <TouchableOpacity onPress={onCancel} className="p-2">
//             <X size={24} color="#6b7280" />
//           </TouchableOpacity>
//           <Text className="text-lg font-semibold text-gray-800">
//             Select Location
//           </Text>
//           <View className="w-10" />
//         </View>

//         {/* Search Bar */}
//         <View className="p-4 bg-white border-b border-gray-100">
//           <View className="flex-row items-center bg-gray-50 rounded-full px-4 py-3">
//             <Search size={20} color="#6b7280" />
//             <TextInput
//               ref={searchRef}
//               className="flex-1 ml-3 text-base text-gray-800"
//               value={searchQuery}
//               onChangeText={handleSearch}
//               placeholder="Search for location..."
//               placeholderTextColor="#9ca3af"
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity onPress={clearSearch} className="p-1">
//                 <X size={16} color="#6b7280" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Current Location Option */}
//         <TouchableOpacity
//           className="flex-row items-center py-4 px-4 bg-purple-50 border-b border-purple-100"
//           onPress={() => handleLocationSelect({
//             id: 'current',
//             name: 'Current Location',
//             address: 'Use my current location',
//             type: 'current'
//           })}
//           activeOpacity={0.7}
//         >
//           <View className="mr-4">
//             <Navigation size={20} color="#8b5cf6" />
//           </View>
//           <View className="flex-1">
//             <Text className="text-base font-medium text-purple-700">
//               Use Current Location
//             </Text>
//             <Text className="text-sm text-purple-500 mt-1">
//               Enable location services to get your current position
//             </Text>
//           </View>
//         </TouchableOpacity>

//         {/* Results */}
//         <ScrollView className="flex-1 bg-white">
//           {searchQuery.length > 0 ? (
//             suggestions.length > 0 ? (
//               <View>
//                 <Text className="text-sm font-medium text-gray-500 px-4 py-3 bg-gray-50">
//                   SEARCH RESULTS
//                 </Text>
//                 {suggestions.map((item) => (
//                   <LocationItem key={item.id} item={item} />
//                 ))}
//               </View>
//             ) : (
//               <View className="flex-1 justify-center items-center py-20">
//                 <MapPin size={48} color="#d1d5db" />
//                 <Text className="text-gray-500 text-center mt-4">
//                   No locations found for "{searchQuery}"
//                 </Text>
//               </View>
//             )
//           ) : (
//             recentSearches.length > 0 && (
//               <View>
//                 <Text className="text-sm font-medium text-gray-500 px-4 py-3 bg-gray-50">
//                   RECENT SEARCHES
//                 </Text>
//                 {recentSearches.map((item) => (
//                   <LocationItem key={item.id} item={item} />
//                 ))}
//               </View>
//             )
//           )}
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// };

// // Main Location Selector Component
// const CustomLocationModal = () => {
//   const [showLocationModal, setShowLocationModal] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const handleLocationSelect = (location) => {
//     setSelectedLocation(location);
//     setShowLocationModal(false);
//   };

//   return (
//     <View className="w-full">
//       {/* Location Label */}
//       <Text className="text-base font-medium text-gray-700 mb-3">
//         Location
//       </Text>

//       {/* Clickable Location Button */}
//       <TouchableOpacity
//         className="w-full bg-purple-500 rounded-full py-4 px-6 flex-row items-center justify-center"
//         onPress={() => setShowLocationModal(true)}
//         activeOpacity={0.8}
//       >
//         <Text className="text-white text-base font-medium flex-1 text-center">
//           {selectedLocation ? selectedLocation.name : "---Select Location---"}
//         </Text>
//         <ChevronsUp size={20} color="white" />
//       </TouchableOpacity>

//       {/* Show selected location details */}
//       {selectedLocation && (
//         <View className="mt-2 p-3 bg-gray-50 rounded-lg">
//           <Text className="text-sm text-gray-600">
//             {selectedLocation.address}
//           </Text>
//         </View>
//       )}

//       {/* Location Search Modal */}
//       <LocationSearchModal
//         visible={showLocationModal}
//         onCancel={() => setShowLocationModal(false)}
//         onLocationSelect={handleLocationSelect}
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
import { responsiveWidth } from "react-native-responsive-dimensions";

const { width, height } = Dimensions.get("window");

// Location Bottom Sheet Modal
const BottomSheet = ({
  visible,
  onCancel,
  onLocationSelect,
  selectedLocations = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedItems, setSelectedItems] = useState(selectedLocations);
  
  const searchRef = useRef(null);

  // Mock location data - replace with your actual locations
  const locations = [
    "New York",
    "Los Angeles", 
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
    "Seattle",
    "Denver",
    "Boston",
    "Nashville",
    "Baltimore"
  ];

  useEffect(() => {
    if (visible) {
      setFilteredLocations(locations);
      setTimeout(() => {
        searchRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    
    if (text.length > 0) {
      const filtered = locations.filter(location =>
        location.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  };

  const toggleLocationSelection = (location) => {
    setSelectedItems(prev => {
      if (prev.includes(location)) {
        return prev.filter(item => item !== location);
      } else {
        return [...prev, location];
      }
    });
  };

  const handleApply = () => {
    onLocationSelect(selectedItems);
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
      <View className="flex-1 bg-black/50 justify-end">
        <View 
          className="bg-white rounded-t-3xl"
          style={{ maxHeight: height * 0.85 }}
        >
          {/* Header */}
          <View className="flex-row items-center  p-4 pt-6 border-b border-gray-100">
            <TouchableOpacity onPress={onCancel} className="p-2">
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-center text-xl font-SemiBold text-textPrimary"
            style={{
                paddingLeft: responsiveWidth(28)
            }}
            >
             Style Name
            </Text>
            {/* <TouchableOpacity onPress={handleReset}>
              <Text className="text-base font-Medium text-textPrimary">
                Reset
              </Text>
            </TouchableOpacity> */}
          </View>

          {/* Search Bar */}
          <View className="p-4">
            <View className="flex-row items-center border border-borderAction rounded-xl px-4 py-1 bg-white">
              {/* <Search size={20} color="#8b5cf6" /> */}
              <TextInput
                ref={searchRef}
                className="flex-1 px-2 text-base font-Medium text-black"
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
          

          {/* Apply Button */}
          <View className="p-4 pt-2">
            <TouchableOpacity
              className="bg-surfaceAction rounded-2xl py-4 items-center"
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-SemiBold">
                Save 
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Main Location Selector Component
const CustomBottomSheetCreateItem = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const handleLocationSelect = (locations) => {
    setSelectedLocations(locations);
    setShowLocationModal(false);
  };

  return (
    <View className="w-full">
      {/* Location Label */}
      <Text className="text-[16px] font-SemiBold text-textPrimary mb-2">
        Location
      </Text>

      {/* Clickable Location Button */}
      <TouchableOpacity
        className="w-full bg-surfaceActionTertiary rounded-2xl py-3 px-6 flex-row items-center justify-center"
        onPress={() => setShowLocationModal(true)}
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-Medium text-center">
         Create
        </Text>
        <ChevronsUp size={20} color="white" />
      </TouchableOpacity>

      {/* Show selected locations */}
      {selectedLocations.length > 0 && (
        <View className="mt-3">
          <Text className="text-sm font-medium text-gray-600 mb-2">
            Selected Locations:
          </Text>
          <View className="flex-row flex-wrap">
            {selectedLocations.map((location, index) => (
              <View 
                key={location} 
                className="bg-purple-100 rounded-full px-3 py-1 mr-2 mb-2"
              >
                <Text className="text-purple-700 text-sm">
                  {location}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Location Bottom Sheet Modal */}
      <BottomSheet
        visible={showLocationModal}
        onCancel={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
        selectedLocations={selectedLocations}
      />
    </View>
  );
};

export default CustomBottomSheetCreateItem;