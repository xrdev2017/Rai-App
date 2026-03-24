import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useTransition } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, FolderClosed, FolderPlus, Plus } from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import CameraUI from "../../components/CameraUI";
import UploadUI from "../../components/UploadUI";

import * as ImagePicker from "expo-image-picker";
import { useFormContext } from "react-hook-form";
import { useGetAllWishlistQuery } from "../../redux/slices/wishlist/wishlistSlice";
import { useTranslation } from "react-i18next";

const WishlistScreen = () => {
  const navigation = useNavigation();
  const { setValue } = useFormContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const openCamera = () => {
    setIsCameraActive(true);
    setAlertVisible(false);
  };
  const [alertVisible, setAlertVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentOnChange, setCurrentOnChange] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);

  const [showFolderModal, setShowFolderModal] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleImagePicked = (uri) => {
    // console.log("LINE AT 40", uri);

    setPickedImage(uri);
    closeModal();
  };

  // console.log("LINE AT 46", selectedImages);

  const handleGalleryOpen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // quality: 1,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      setSelectedImages(uris);
      setShowFolderModal(true);
      setValue("galleryPhoto", uris);
    }
  };

  const AddOptions = ({ visible, onClose }) => {
    const menuItems = [
      {
        id: 1,
        label: t("addOptions.clickPhoto"),
        func: openCamera,
      },
      {
        id: 2,
        label: t("addOptions.uploadGallery"),
        func: handleGalleryOpen,
      },
      // {
      //   id: 3,
      //   label: t("addOptions.createFolder"),
      //   path: "CreateNewWishlist",
      // },
    ];

    if (!visible) return null;
    const navigation = useNavigation();
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable className="flex-1 bg-black/50" onPress={onClose}>
          <View
            className="absolute rounded-xl border border-gray-100 bg-white dark:bg-darkBorderTertiary shadow-md min-w-[160px]"
            style={{ bottom: responsiveHeight(10), right: responsiveWidth(6) }}
          >
            {menuItems.map((item, index) => (
              <Pressable
                key={item.id}
                className={` px-5 py-3`}
                // onPress={() => {
                //   onClose();

                //   navigation.navigate(item.path);

                //   item.func();
                // }}
                onPress={() => {
                  onClose();
                  if (item.func) item.func();
                  if (item.path) navigation.navigate(item.path);
                }}
              >
                <Text className="text-[15px] text-center text-gray-800 dark:text-darkTextPrimary font-Medium">
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    );
  };

  const SelectFolderModal = ({ showFolderModal }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
      <Modal visible={showFolderModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            className="bg-white dark:bg-darkSurfacePrimary"
            style={{
              padding: 20,
              borderRadius: 20,
              width: "80%",
              gap: responsiveHeight(2),
            }}
          >
            <Pressable
              onPress={() => {
                setShowFolderModal(false);
                navigation.navigate("AddExistingWishlist");
              }}
              className="bg-surfaceSecondary p-2 rounded-xl flex-row items-center justify-center gap-2"
            >
              <FolderPlus color="#000" />
              <Text className="text-textPrimary font-SemiBold">
                {t("selectFolder.addExistingWishlist")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setShowFolderModal(false);
                navigation.navigate("CreateNewWishlist");
              }}
              className="bg-surfaceAction p-2 rounded-xl flex-row items-center justify-center gap-2"
            >
              <FolderClosed color="#f4f4f4" />
              <Text className="text-textPrimaryInverted font-SemiBold">
                {t("selectFolder.createNewWishlist")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowFolderModal(false)}
              style={{ marginTop: 20 }}
            >
              <Text className="text-center text-red-500 font-SemiBold">
                {t("selectFolder.cancel")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    if (photoPath) {
      setValue("photoFieldName", photoPath);
    }
  }, [photoPath]);

  const renderWishlistItem = (item) => (
    <View key={item._id} className="mb-8">
      <View className="flex-row flex-wrap mb-3">
        {item?.images?.length > 0 ? (
          <>
            {item?.images?.map((image, index) => (
              <View
                key={index}
                className="w-[48%] aspect-square bg-gray-300 rounded-lg mr-[2%] mb-[2%] overflow-hidden"
              >
                <Image
                  source={{
                    uri: image,
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </>
        ) : (
          <Image
            source={{
              uri: `https://via.placeholder.com/150x150/CCCCCC/FFFFFF?`,
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      </View>
      <Text className="text-base font-medium text-black dark:text-darkTextPrimary ml-1">{item.name}</Text>
    </View>
  );

  const {
    data: allWishlist,
    isLoading: allWishlistLoading,
    isError: allWishlistError,
  } = useGetAllWishlistQuery();

  const { t } = useTranslation();

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-darkSurfacePrimary/90 relative"
      style={{
        padding: responsiveWidth(5),
        gap: responsiveHeight(2),
      }}
    >
      <View className="flex-row items-center">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} strokeWidth={2} color={"#5700FE"} />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
          {t("wishlist.title")}
        </Text>
        <View
          style={{
            width: responsiveWidth(10),
          }}
        />
      </View>
      {allWishlistLoading ? (
        <ActivityIndicator color="purple" size={20} />
      ) : allWishlistError ? (
        <Text className="text-red-500 font-Medium">
          Failed to load wishlist
        </Text>
      ) : allWishlist && allWishlist.length > 0 ? (
        <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
          {allWishlist?.map(renderWishlistItem)}
        </ScrollView>
      ) : (
        <View className="justify-center items-center gap-2  h-3/4">
          <Image source={require("../../../assets/images/wishlist.webp")} />
          <Text className="text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
            Upload your fashion crush. Make it happen.
          </Text>
          <Text className="text-center text-base font-Medium text-textPrimary dark:text-darkTextPrimary">
            Upload photos by camera or from your gallery.
          </Text>
        </View>
      )}

      <Pressable
        onPress={() => setShowDropdown(true)}
        className="bg-surfaceAction p-4 rounded-full self-start absolute"
        style={{
          right: responsiveWidth(4),
          bottom: responsiveHeight(8),
        }}
      >
        <Plus color="white" />
      </Pressable>

      <AddOptions
        visible={showDropdown}
        onClose={() => setShowDropdown(false)}
        //   position={dropdownPosition}
      />
      <CameraUI
        isCameraActive={isCameraActive}
        setIsCameraActive={setIsCameraActive}
        setPhotoPath={setPhotoPath}
        setShowFolderModal={setShowFolderModal}
      />
      <UploadUI
        visible={modalVisible}
        onClose={closeModal}
        onImagePicked={handleImagePicked}
      />
      <SelectFolderModal showFolderModal={showFolderModal} />
    </SafeAreaView>
  );
};

export default WishlistScreen;
