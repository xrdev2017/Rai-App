import { useNavigation } from "@react-navigation/native";
import {
  Upload,
  CheckCircle2,
  ArrowLeft,
  SquarePen,
  Trash2,
  Eye,
  X,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  StatusBar,
  Alert,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBottomSheet from "../components/CustomBottomSheet";
import {
  categories,
  seasons,
  styles,
  stylesList,
} from "../../assets/data/data";
import OptionSelector from "../components/OptionSelector";
import ColorPalette from "../components/ColorPallete";
const options = ["Male", "Female", "Other"];
import * as ImagePicker from "expo-image-picker";
import { useFormContext } from "react-hook-form";
import {
  useDeleteOutfitMutation,
  useUpdateCreateOutfitMutation,
} from "../redux/slices/createOutfit/outfiltSlice";
import { useGetAllStyleQuery } from "../redux/slices/addItem/addItemSlice";

const DeleteAccountModal = ({ visible, onCancel, onConfirm, loading }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-8"
        activeOpacity={1}
        onPress={onCancel}
      >
        <Pressable
          className="bg-white  dark:bg-darkSurfacePrimary rounded-3xl p-6 w-full max-w-sm"
          activeOpacity={1}
          onPress={() => {}}
        >
          <Text className="text-base font-Medium text-textPrimary dark:text-darkTextPrimary text-center mb-8 leading-6">
            Are you sure, you want to delete?
          </Text>

          <View className="gap-3">
            <Pressable
              className="bg-red-500 rounded-2xl py-4 items-center"
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-SemiBold">
                {loading ? "Deleting" : "Yes, delete it"}
              </Text>
            </Pressable>

            <Pressable
              className="bg-gray-200 rounded-2xl py-4 items-center"
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text className="text-black text-lg font-SemiBold">Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const ViewImageModal = ({
  isImageViewVisible,
  setIsImageViewVisible,
  image,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isImageViewVisible}
      onRequestClose={() => setIsImageViewVisible(false)}
    >
      <View className="flex-1 bg-black/90 justify-center items-center">
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          className="w-[90%] h-[70%] rounded-2xl"
        />
        <Pressable
          onPress={() => setIsImageViewVisible(false)}
          className="mt-6 p-4 rounded-2xl bg-red-300/50"
        >
          <X color="red" />
        </Pressable>
      </View>
    </Modal>
  );
};

const CreateOutfitEditScreen = () => {
  const navigation = useNavigation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getValues, setValue, watch } = useFormContext();
  const { updateOutfit } = getValues();

  // console.log("LINE AT 510", updateOutfit);

  // Initialize form fields with existing data
  const [title, setTitle] = useState(updateOutfit?.title || "");
  const [image, setImage] = useState(updateOutfit?.image || null);
  // const [selectedColors, setSelectedColors] = useState(
  //   updateOutfit?.colors[0] || []
  // );

  // Watch form values
  const season = watch("season");
  const outfitStyle = watch("outfitStyle");

  // Initialize form values with existing data
  useEffect(() => {
    if (updateOutfit) {
      setValue("season", updateOutfit.season?.[0] || "");
      setValue("outfitStyle", updateOutfit.style?.[0] || "");
      // setSelectedColors(updateOutfit.colors || []);
    }
  }, [updateOutfit, setValue]);

  // API hooks
  const {
    data: allStyles,
    isError: allStylesError,
    isLoading: allStylesLoading,
  } = useGetAllStyleQuery();

  const [updateCreateOutfit, { isLoading: updateCreateOutfitLoading }] =
    useUpdateCreateOutfitMutation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  const [deleteOutfit, { isLoading: deleteOutfitLoading }] =
    useDeleteOutfitMutation();

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      // Call delete API here if available
      await deleteOutfit(updateOutfit._id).unwrap();
      Alert.alert("Success", "Outfit deleted successfully");
      navigation.navigate("BottomNavigator", {
        screen: "Wardrobe",
        params: { tab: "Outfit" },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to delete outfit");
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
    }
  };

  const handleSeasonSelect = (selectedSeason) => {
    setValue("season", selectedSeason);
  };

  const handleStyleSelect = (selectedStyle) => {
    setValue("outfitStyle", selectedStyle);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Create FormData object
      const formData = new FormData();

      // Add all fields to FormData
      formData.append("title", title);

      if (season) formData.append("season", season);
      // if (outfitStyle) formData.append("style", outfitStyle);

      // Only append image if it's a new image (starts with file://)
      if (image && image.startsWith("file://")) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        });
      } else if (image) {
        // If it's a URL (existing image), just send the URL
        formData.append("image", image);
      }

      // Call the update API with FormData and pass the id separately
      const result = await updateCreateOutfit({
        id: updateOutfit._id,
        data: formData,
      }).unwrap();

      navigation.navigate("BottomNavigator", {
        screen: "Wardrobe",
        params: { tab: "Outfit" },
      });
    } catch (error) {
      // Alert.alert("Error", "Failed to update outfit");
      // console.log("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-darkSurfacePrimary/90">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            paddingHorizontal: responsiveWidth(5),
            
          }}
        >
          {/* Header */}
          <View
            className="flex-row items-center"
            style={{
              paddingVertical: responsiveHeight(3),
            }}
          >
            <Pressable
              onPress={handleGoBack}
              activeOpacity={0.7}
              className="w-10 h-10 justify-center items-center -ml-2"
            >
              <ArrowLeft color="#81739A" />
            </Pressable>
            <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
              Edit Outfit
            </Text>
            <View
              style={{
                width: responsiveWidth(10),
              }}
            />
          </View>

          {/* Photo Upload */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="mb-10 relative">
              <View
                className="w-full bg-surfaceSecondary dark:bg-darkSurfaceSecondary rounded-xl items-center justify-center"
                style={{
                  gap: responsiveHeight(3),
                  paddingVertical: responsiveHeight(5),
                }}
              >
                {image ? (
                  <View
                    className="items-center justify-center"
                    style={{
                      gap: responsiveHeight(3),
                    }}
                  >
                    <Image source={require("../../assets/images/tick3.png")} />
                    <Text className="text-lg font-Medium dark:text-darkTextPrimary">
                      Photo is successfully uploaded
                    </Text>

                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() => setImage(null)}
                        className="p-4 rounded-2xl bg-red-300/50"
                      >
                        <Trash2 color="red" />
                      </Pressable>

                      <Pressable
                        onPress={() => setIsImageViewVisible(true)}
                        className="p-4 rounded-2xl bg-green-300/50"
                      >
                        <Eye color="green" />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Image source={require("../../assets/images/shirt.png")} />
                )}
              </View>
              <Pressable
                onPress={pickImage}
                className="items-center bg-surfaceAction rounded-md p-3 justify-center gap-2 absolute right-5 bottom-5 z-20"
              >
                <SquarePen color="#fff" />
              </Pressable>
            </View>

            <View
              style={{
                gap: responsiveHeight(2),
                paddingBottom: responsiveHeight(1),
              }}
            >
              <View>
                <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
                  Title
                </Text>
                <TextInput
                  className="border border-borderTertiary focus:border-borderAction rounded-2xl px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary font-Medium bg-white dark:bg-gray-600"
                  placeholder="Enter Title"
                  placeholderTextColor="#A0A0A0"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View>
                <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
                  Season
                </Text>
                <View className="flex-row gap-4 flex-wrap">
                  {seasons.map((opt) => (
                    <OptionSelector
                      key={opt}
                      title={opt}
                      selectedValue={season}
                      onSelect={handleSeasonSelect}
                    />
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
                  Style
                </Text>
                <View className="flex-row gap-4 flex-wrap">
                  {allStyles?.styles.map((opt) => (
                    <OptionSelector
                      key={opt._id}
                      title={opt?.name}
                      selectedValue={outfitStyle}
                      onSelect={handleStyleSelect}
                    />
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row gap-2 items-center justify-between py-2">
            <Pressable
              className="w-1/2 bg-surfaceAction py-4 rounded-xl flex-row items-center justify-center"
              onPress={handleSave}
              disabled={updateCreateOutfitLoading}
            >
              <Text className="text-white font-SemiBold text-[16px]">
                {updateCreateOutfitLoading ? "Saving..." : "Save"}
                {/* Save */}
              </Text>
            </Pressable>

            <Pressable
              className="w-1/2 bg-red-500 py-4 rounded-xl flex-row items-center justify-center"
              onPress={() => setShowDeleteModal(true)}
              disabled={isLoading}
            >
              <Text className="text-white font-SemiBold text-[16px]">
                Delete
              </Text>
            </Pressable>
          </View>

          <DeleteAccountModal
            visible={showDeleteModal}
            onCancel={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            loading={deleteOutfitLoading}
          />

          <ViewImageModal
            isImageViewVisible={isImageViewVisible}
            setIsImageViewVisible={setIsImageViewVisible}
            image={image}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CreateOutfitEditScreen;
