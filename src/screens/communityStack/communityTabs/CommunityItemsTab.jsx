import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useGetSelectedUserItemQuery } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

const CommunityItemsTab = () => {
  const route = useRoute();
  const selectedUser = route?.params?.postData?.user;

  const {
    data: allItem,
    isLoading: allItemLoading,
    isError: allItemError,
  } = useGetSelectedUserItemQuery(selectedUser?._id);

  // console.log("LINE AT 37", allItem, selectedUser);

  const renderProductItem = ({ item, index }) => (
    <View
      //   onPress={() => navigation.navigate("AddItemEdit")}
      className={`flex-1 max-w-[48%] `}
    >
      {/* Product Image Container */}

      <View className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center  overflow-hidden relative">
        <Image source={{ uri: item?.image }} />
      </View>

      {/* Product Info */}
      <View className="space-y-1">
        <Text className="text-lg text-textPrimary font-SemiBold">
          {item?.title}
        </Text>
        <Text className="text-md text-textPrimary font-Medium">
          {item?.brand}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      className="flex-1"
      style={{
        paddingHorizontal: responsiveWidth(4),
      }}
    >
      {allItemLoading ? (
        <ActivityIndicator color="purple" size={20} />
      ) : allItemError ? (
        <Text className="text-red-500 font-Medium">
          Internal Server or Internet Issue!
        </Text>
      ) : allItem?.success && allItem?.items?.length > 0 ? (
        <FlatList
          data={allItem?.items}
          renderItem={renderProductItem}
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
            No items in your wardrobe yet so let’s go
          </Text>
        </View>
      )}
    </View>
  );
};

export default CommunityItemsTab;
