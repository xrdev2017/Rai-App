import { View, Text, Pressable, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { Edit } from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import AddButton from "./AddButton";
import { StyleSelectionModal, itemsRef } from "./Item2Tab";
import { useFormContext } from "react-hook-form";
import { useCreateDressMeMutation } from "../../../redux/slices/dressMe/dressMeSlice";
import { useTranslation } from "react-i18next";

const Item3Tab = ({ id }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const {
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useFormContext();

  const [createDressMe, { isLoading }] = useCreateDressMeMutation();

  const handleCreateDressMe = async (data) => {
    try {
      const selectedItemsData = {};

      // Define the categories for 3-item outfits
      const categories = ["It3T", "It3B", "It3F"];

      // Get items for each category
      categories.forEach((category) => {
        const selectedItemsKey = `selectedItems${category}`;
        const selectedItems = getValues()[selectedItemsKey] || [];
        selectedItemsData[category] = selectedItems
          .map((entry) => entry?.item || entry)
          .filter(Boolean);
      });

      // Convert to groupsData format
      const categoryToGroupMap = {
        It3T: "Tops",
        It3B: "Bottoms",
        It3F: "Footwear",
      };

      const groupsData = [];

      Object.entries(selectedItemsData).forEach(([category, items]) => {
        const groupTitle = categoryToGroupMap[category];

        if (groupTitle && items && items.length > 0) {
          let group = groupsData.find((g) => g.title === groupTitle);

          if (!group) {
            group = { title: groupTitle, itemIds: [] };
            groupsData.push(group);
          }

          group.itemIds = [...group.itemIds, ...items.map((item) => item._id)];
        }
      });

      // Check if we have at least one group with items
      const dressMeData = {
        groupsData: groupsData,
        title: data?.dressName,
        styles: data?.filterStyles,
        type: "3-items",
      };

      // console.log("Creating 3-item DressMe with data:", dressMeData);
      if (groupsData.length === 0) {
        // Alert.alert(
        //   "Error",
        //   "Please select at least one item to create an outfit."
        // );
        return;
      }

      const response = await createDressMe(dressMeData).unwrap();

      // Reset form values for 3-item categories
      reset({
        selectedItemsIt3T: null,
        selectedItemsIt3B: null,
        selectedItemsIt3F: null,
        dressName: "",
        filterStyles: [],
      });

      setModalVisible(false);
      // console.log("3-item DressMe created successfully:", response);
      navigation.navigate("OutfitCreated", response);
    } catch (error) {
      // console.log("Error creating 3-item DressMe:", error);
      // Alert.alert("Error", "Failed to create outfit. Please try again.");
      const errorMessage = error?.data?.error || "Creating Wishlist Failed!";
      setError("root", {
        type: "dressMe",
        message: errorMessage,
      });
    }
  };

  // Get selected items for all 3-item categories
  const getSelectedItems = (categoryId) => {
    const selectedItemsKey = `selectedItems${categoryId}`;
    const selectedItems = getValues()[selectedItemsKey] || [];

    return Array.isArray(selectedItems)
      ? selectedItems.map((entry) => entry?.item || entry).filter(Boolean)
      : [];
  };

  // Update the ref with current items
  const topsItems = getSelectedItems("It3T");
  const bottomsItems = getSelectedItems("It3B");
  const footwearItems = getSelectedItems("It3F");

  itemsRef.current.It3T = topsItems;
  itemsRef.current.It3B = bottomsItems;
  itemsRef.current.It3F = footwearItems;

  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-between">
      <ScrollView
        contentContainerStyle={{
          paddingTop: responsiveHeight(4),
          gap: responsiveHeight(6),
          paddingBottom: responsiveHeight(2),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tops Section */}
        {id === "It3T" || itemsRef?.current?.It3T.length > 0 ? (
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-textPrimary dark:text-darkTextPrimary text-lg font-SemiBold">
                Add Tops
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("AddItem", {
                    title: `${t("dressMe.tops")}`,
                    id: "It3T",
                    tab: "3 Items",
                  });
                }}
                className="bg-surfaceAction p-2 rounded-md"
              >
                <Edit size={18} color={"white"} />
              </Pressable>
            </View>
            <View className="flex-row flex-wrap justify-start gap-2">
              {itemsRef?.current?.It3T.map((item, index) => (
                <View
                  key={index}
                  className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative"
                  style={{
                    width: responsiveWidth(20),
                  }}
                >
                  <Image
                    source={{ uri: item?.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <Text
                    className="text-xs mt-1 text-textPrimary dark:text-darkTextPrimary"
                    numberOfLines={1}
                  >
                    {item?.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <AddButton
              title={t("dressMe.tops")}
              path="AddItem"
              id="It3T"
              tab="3 Items"
            />
          </View>
        )}

        {/* Bottoms Section */}
        {id === "It3B" || itemsRef?.current?.It3B.length > 0 ? (
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-textPrimary dark:text-darkTextPrimary text-lg font-SemiBold">
                Add Bottoms
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("AddItem", {
                    title: `${t("dressMe.bottoms")}`,
                    id: "It3B",
                    tab: "3 Items",
                  });
                }}
                className="bg-surfaceAction p-2 rounded-md"
              >
                <Edit size={18} color={"white"} />
              </Pressable>
            </View>
            <View className="flex-row flex-wrap justify-start gap-2">
              {itemsRef?.current?.It3B.map((item, index) => (
                <View
                  key={index}
                  className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative"
                  style={{
                    width: responsiveWidth(20),
                  }}
                >
                  <Image
                    source={{ uri: item?.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <Text
                    className="text-xs mt-1 text-textPrimary dark:text-darkTextPrimary"
                    numberOfLines={1}
                  >
                    {item?.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <AddButton
              title={t("dressMe.bottoms")}
              path="AddItem"
              id="It3B"
              tab="3 Items"
            />
          </View>
        )}

        {/* Footwear Section */}
        {id === "It3F" || itemsRef?.current?.It3F.length > 0 ? (
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-textPrimary dark:text-darkTextPrimary text-lg font-SemiBold">
                Add Footwear
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("AddItem", {
                    title: `${t("dressMe.footwear")}`,
                    id: "It3F",
                    tab: "3 Items",
                  });
                }}
                className="bg-surfaceAction p-2 rounded-md"
              >
                <Edit size={18} color={"white"} />
              </Pressable>
            </View>

            <View className="flex-row flex-wrap justify-start gap-2">
              {itemsRef?.current?.It3F.map((item, index) => (
                <View
                  key={index}
                  className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative"
                  style={{
                    width: responsiveWidth(20),
                  }}
                >
                  <Image
                    source={{ uri: item?.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <Text
                    className="text-xs mt-1 text-textPrimary dark:text-darkTextPrimary"
                    numberOfLines={1}
                  >
                    {item?.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <AddButton
              title={t("dressMe.footwear")}
              path="AddItem"
              id="It3F"
              tab="3 Items"
            />
          </View>
        )}
      </ScrollView>

      <Pressable
        onPress={() => setModalVisible(true)}
        className={`py-4 rounded-xl items-center mb-3 bg-surfaceAction`}
      >
        <Text className={`text-lg font-SemiBold text-white`}>
          {t("dressMe.generate")}
        </Text>
      </Pressable>

      <StyleSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleCreateDressMe}
        isLoading={isLoading}
        errors={errors}
      />
    </View>
  );
};

export default Item3Tab;
