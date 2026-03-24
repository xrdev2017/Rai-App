import { View, Image, FlatList } from "react-native";

const ItemImageGrid = ({ item }) => {
  // console.log(item);
  const data = item?.items.length > 0 ? item?.items : item?.outfits;
  return (
    <FlatList
      data={data} // array of items inside item
      keyExtractor={(subItem) => subItem._id}
      numColumns={2} // change to 3 if you want 3 columns
      columnWrapperStyle={{ gap: 8 }}
      contentContainerStyle={{ gap: 8 }}
      renderItem={({ item: subItem }) => (
        <View className="bg-surfaceSecondary rounded-lg aspect-square flex-1 items-center justify-center overflow-hidden relative">
          <Image
            source={
              subItem?.image
                ? { uri: subItem.image }
                : require("../../assets/images/lookbook.png")
            }
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </View>
      )}
    />
  );
};

export default ItemImageGrid;
