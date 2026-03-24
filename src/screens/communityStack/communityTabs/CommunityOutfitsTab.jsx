// import { View, Text, Pressable, FlatList, Image } from "react-native";
// import React from "react";
// import { useNavigation } from "@react-navigation/native";
// import { responsiveWidth } from "react-native-responsive-dimensions";
// const products = [
//   {
//     id: 1,
//     name: "T-Shirt",
//     description: "Stylist t-shirt",
//     category: "category1",
//   },
//   {
//     id: 2,
//     name: "T-Shirt",
//     description: "Stylist t-shirt",
//     category: "category1",
//   },
//   {
//     id: 3,
//     name: "T-Shirt",
//     description: "Stylist t-shirt",
//     category: "category2",
//   },
//   {
//     id: 4,
//     name: "T-Shirt",
//     description: "Stylist t-shirt",
//     category: "category2",
//   },
// ];
// const CommunityOutfitsTab = () => {
//   const navigation = useNavigation();
//   const renderProductItem = ({ item, index }) => (
//     <View
//     //   onPress={() => navigation.navigate("AddItemEdit")}
//       className={`flex-1 max-w-[48%] `}
//     >
//       {/* Product Image Container */}

//       <View className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center  overflow-hidden relative">
//         <Image source={require("../../../../assets/images/outfit.png")} />
//       </View>

//       {/* Product Info */}
//       <View className="space-y-1">
//         <Text className="text-lg text-textPrimary font-SemiBold">
//           {item.name}
//         </Text>
//         <Text className="text-md text-textPrimary font-Medium">
//           {item.description}
//         </Text>
//       </View>
//     </View>
//   );
//   return (
//     <View className="flex-1"
//     style={{
//         paddingHorizontal: responsiveWidth(4)
//     }}
//     >
//       <FlatList
//         data={products}
//         renderItem={renderProductItem}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         columnWrapperStyle={{
//           justifyContent: "space-between",
//           gap: responsiveWidth(4),
//         }}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ rowGap: responsiveWidth(3) }}
//       />
//     </View>
//   );
// };

// export default CommunityOutfitsTab;

import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useGetSelectedUserOutfitQuery } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

const CommunityOutfitsTab = () => {
  const route = useRoute();
  const selectedUser = route?.params?.postData?.user;
  const {
    data: allOutfits,
    isLoading: outfitsLoading,
    isError: outfitsError,
  } = useGetSelectedUserOutfitQuery(selectedUser?._id);

  const renderOutfitItem = ({ item }) => (
    <View className="flex-1 max-w-[48%]">
      <View className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative">
        <Image source={{ uri: item?.image }} className="w-full h-full" />
      </View>
      <View className="space-y-1">
        <Text className="text-lg text-textPrimary font-SemiBold">
          {item?.title}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1" style={{ paddingHorizontal: responsiveWidth(4) }}>
      {outfitsLoading ? (
        <ActivityIndicator color="purple" size={20} />
      ) : outfitsError ? (
        <Text className="text-red-500 font-Medium">
          Internal Server or Internet Issue!
        </Text>
      ) : allOutfits?.success && allOutfits?.outfits?.length > 0 ? (
        <FlatList
          data={allOutfits?.outfits}
          renderItem={renderOutfitItem}
          keyExtractor={(item) => item?._id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: responsiveWidth(4),
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ rowGap: responsiveWidth(3) }}
        />
      ) : (
        <View className="flex-1 items-center justify-center gap-2">
          <Text className="font-Regular text-[14px] text-textPrimary text-center">
            No outfits created yet
          </Text>
        </View>
      )}
    </View>
  );
};

export default CommunityOutfitsTab;
