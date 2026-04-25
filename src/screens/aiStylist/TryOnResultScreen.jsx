import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share as RNShare,
  StatusBar,
  Platform,
  Pressable,
  Alert,
  BackHandler,
  Modal,
  TextInput
} from "react-native"
import * as FileSystem from 'expo-file-system/legacy'
import * as MediaLibrary from 'expo-media-library'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation, useRoute, useFocusEffect, CommonActions } from "@react-navigation/native"
import { ArrowLeft, Share2, RefreshCw, Shirt, Download } from "lucide-react-native"
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg"
import {
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions"
import { useDispatch, useSelector } from "react-redux"
import { useVirtualTryOnMutation } from "../../redux/slices/addItem/addItemSlice"
import { useCreateLookbookMutation } from "../../redux/slices/createLookbook/createLookbookSlice"
import { setLastVtoResult, clearVtoResult } from "../../redux/reducers/aiStylistReducer"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../utils/ThemeContext"

const TryOnResultScreen = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const route = useRoute()
  const { isDarkMode } = useTheme()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { lastVtoResult } = useSelector((state) => state.aiStylist)
  const [virtualTryOn, { isLoading: isApiLoading }] = useVirtualTryOnMutation()
  const [createLookbook, { isLoading: isCreatingLookbook }] = useCreateLookbookMutation()
  const { t } = useTranslation()
  
  const { originalImage, resultImage, outfitImageUrl, outfitId } = lastVtoResult || {}

  const [activeTab, setActiveTab] = useState("tryon") // "original" or "tryon"
  const [isSaving, setIsSaving] = useState(false)
  const [displayResultImage, setDisplayResultImage] = useState(resultImage)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentOutfitUrl, setCurrentOutfitUrl] = useState(outfitImageUrl)
  const [persistedOriginalImage, setPersistedOriginalImage] = useState(originalImage)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [showLookbookModal, setShowLookbookModal] = useState(false)
  const [lookbookTitle, setLookbookTitle] = useState("")
 
  useEffect(() => {
    // Sync local state if Redux state changes (e.g. initial result)
    if (resultImage) {
      setDisplayResultImage(resultImage);
    }
    if (originalImage) setPersistedOriginalImage(originalImage);
    
    // Check if we need to auto-refresh based on navigation intent
    if (route.params?.refresh && user) {
      console.log("🔄 Navigation intent detected: Triggering auto-refresh");
      // Reset the refresh parameter immediately to prevent loops
      navigation.setParams({ refresh: false });
      
      // Sync local outfit state and trigger refresh
      if (outfitImageUrl) {
        setCurrentOutfitUrl(outfitImageUrl);
        handleRefresh(outfitImageUrl);
      }
    }
  }, [route.params?.refresh, lastVtoResult, user]);

  const handleShare = async () => {
    try {
      const imageToShare = activeTab === "original" ? persistedOriginalImage : displayResultImage
      await RNShare.share({
        url: imageToShare,
        message: "Check out my new AI-generated look!"
      })
    } catch (error) {
      console.log("Error sharing:", error.message)
    }
  }

  const handleRefresh = async (overrideUrl = null) => {
    if (isRefreshing || isApiLoading) return

    // Ensure overrideUrl is a string, not an event object from onPress
    const finalUrl = typeof overrideUrl === "string" ? overrideUrl : null;
    const targetUrl = finalUrl || currentOutfitUrl;
    const finalOriginalImage = persistedOriginalImage || originalImage;

    try {
      setIsRefreshing(true)
      const formData = new FormData()
      
      if (!targetUrl) {
        Alert.alert("Error", "Outfit reference is missing. Cannot refresh.")
        setIsRefreshing(false)
        return
      }

      if (!finalOriginalImage) {
        console.log("⚠️ Missing Original Image for Refresh!");
        Alert.alert("Error", "Original image is missing. Please try again from start.")
        setIsRefreshing(false)
        return
      }

      // Re-use original image
      const userImageFile = {
        uri: finalOriginalImage,
        name: "user_image.jpg",
        type: "image/jpeg"
      }
      formData.append("user_image", userImageFile)
      formData.append("outfit_image_url", targetUrl)

      console.log("🚀 Refresh VTO Params:", {
        userId: user?._id || user?.id,
        user_image: userImageFile,
        outfit_image_url: targetUrl
      })

      const response = await virtualTryOn({
        formData,
        userId: user?._id || user?.id
      }).unwrap()

      console.log("✅ Refresh VTO Response:", response)

      if (response?.data?.tryOnImage) {
        const updatedResult = {
          originalImage: finalOriginalImage,
          resultImage: response.data.tryOnImage,
          outfitImageUrl: targetUrl,
          outfitId: response?.data?._id || response?.data?.id || response?.data?.outfitId || null
        }
        dispatch(setLastVtoResult(updatedResult))
        setDisplayResultImage(response.data.tryOnImage)
        setActiveTab("tryon")
      } else {
        Alert.alert("Error", "Failed to refresh image. Please try again.")
      }
    } catch (error) {
      console.error("Refresh Error:", error)
      Alert.alert("Error", "Failed to refresh. Please check your connection.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleBack = () => {
    dispatch(clearVtoResult());
    // Use reset to completely wipe the stack and ensure a fresh start on BottomNavigator
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { 
            name: "BottomNavigator",
            params: { 
              screen: "AIStylist",
              params: { activeTab: "virtualTryOn" }
            }
          },
        ],
      })
    );
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleSaveLook = () => {
    setShowLookbookModal(true);
  }

  const handleCreateLookbook = async () => {
    if (!lookbookTitle.trim()) {
      Alert.alert('Error', 'Please enter a name for the Lookbook');
      return;
    }
    try {
      setIsSaving(true);
      const lookbookData = {
        name: lookbookTitle,
      };
      if (outfitId) {
        lookbookData.outfits = outfitId;
      }
      await createLookbook(lookbookData).unwrap();
      setShowLookbookModal(false);
      setLookbookTitle("");
      
      Alert.alert('Success', 'Lookbook created successfully!');
    } catch (err) {
      console.error('Create Lookbook Error:', err);
      Alert.alert('Error', err?.data?.error || err?.data?.message || 'Failed to add to Lookbook. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#000" : "#fff" }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      

      {/* Top Section with Image and Header Overlay */}
      <View style={styles.imageSection}>
        {/* Original Image */}
        <Image
          source={{ uri: persistedOriginalImage }}
          style={[styles.fullImage, { opacity: activeTab === "original" ? 1 : 0, position: 'absolute' }]}
          resizeMode="cover"
        />

        {/* Try-On Result Image */}
        <Image
          source={{ uri: displayResultImage }}
          style={[styles.fullImage, { opacity: activeTab === "tryon" ? 1 : 0 }]}
          resizeMode="cover"
          onLoadStart={() => setIsImageLoading(true)}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
          onLoadEnd={() => setIsImageLoading(false)}
        />

        {/* Image Loader - Targeted only to image section when image itself is downloading */}
        {isImageLoading && activeTab === "tryon" && !isRefreshing && !isApiLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#8E54FE" />
          </View>
        )}
        
        {/* Smooth SVG Gradient Vignette at top */}
        <View style={[styles.vignetteTop, { height: insets.top + 100 }]}>
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="black" stopOpacity="0.5" />
                <Stop offset="1" stopColor="black" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
          </Svg>
        </View>

        {/* Header Content Overlay */}
        <View style={[styles.headerOverlay, { paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0) }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.headerIcon}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setActiveTab("original")}
                style={[
                  styles.toggleButton,
                  activeTab === "original" && styles.toggleButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.toggleText,
                    activeTab === "original" && styles.toggleTextActive
                  ]}
                >
                  Original
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("tryon")}
                style={[
                  styles.toggleButton,
                  activeTab === "tryon" && styles.toggleButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.toggleText,
                    activeTab === "tryon" && styles.toggleTextActive
                  ]}
                >
                  Try-On
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleShare} style={styles.headerIcon}>
              <Share2 size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Control Bar - Straight below image, no rounded corners */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        <View style={styles.bottomContent}>
          <View style={styles.iconButtonsContainer}>
            <TouchableOpacity 
              style={[styles.controlIcon, { backgroundColor: isDarkMode ? "#2D2D2D" : "#F7F7F9" }]}
              onPress={() => navigation.navigate("SelectAIItems", { originScreen: "TryOnResult" })}
              disabled={isRefreshing || isApiLoading}
            >
              <Shirt size={18} color={isDarkMode ? "white" : "#05001D"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlIcon, { backgroundColor: isDarkMode ? "#2D2D2D" : "#F7F7F9" }]}
              onPress={() => handleRefresh()}
              disabled={isRefreshing || isApiLoading}
            >
              <RefreshCw size={18} color={isRefreshing || isApiLoading ? "#A0A0A0" : (isDarkMode ? "white" : "#05001D")} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, { opacity: (isSaving || isRefreshing || isApiLoading) ? 0.7 : 1 }]}
            onPress={handleSaveLook}
            disabled={isSaving || isRefreshing || isApiLoading}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Download size={18} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Save Look</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* API Call Loader - Full Screen during network requests */}
      {(isRefreshing || isApiLoading) && (
        <View style={styles.fullScreenOverlay}>
          <ActivityIndicator size="large" color="#8E54FE" />
        </View>
      )}

      {/* Save to Lookbook Modal */}
      <Modal visible={showLookbookModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? "#2D2633" : "white" }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? "#F5F4F7" : "#08002B" }]}>
              {t("createLookbook.nameFolder", "Name your Lookbook")}
            </Text>
            
            <TextInput
              style={[
                styles.modalInput, 
                { 
                  backgroundColor: isDarkMode ? "#3D3843" : "#F8F8F8",
                  color: isDarkMode ? "#F5F4F7" : "#08002B",
                  borderColor: isDarkMode ? "#5C526D" : "#E5E5E5"
                }
              ]}
              placeholder={t("createLookbook.titlePlaceholder", "Lookbook Title")}
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "#C5BFD1"}
              value={lookbookTitle}
              onChangeText={setLookbookTitle}
              autoCapitalize="none"
            />

            <Pressable
              onPress={handleCreateLookbook}
              disabled={isSaving || isCreatingLookbook}
              style={[
                styles.modalButton, 
                (isSaving || isCreatingLookbook) ? { backgroundColor: "#A0A0A0" } : { backgroundColor: "#8E54FE" }
              ]}
            >
              {isSaving || isCreatingLookbook ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.modalButtonText}>
                  {t("createLookbook.save", "Save")}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                setShowLookbookModal(false);
                setLookbookTitle("");
              }}
              style={styles.modalCancelButton}
            >
              <Text style={styles.modalCancelText}>
                {t("createLookbook.cancel", "Cancel")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000'
  },
  imageSection: {
    flex: 1,
    position: "relative"
  },
  fullImage: {
    width: "100%",
    height: "100%"
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 999,
    elevation: 999, // Critical for Android bottom bar coverage
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#8E54FE',
    fontWeight: '600'
  },
  vignetteTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(5)
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 25,
    padding: 3,
    minWidth: 160
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  toggleButtonActive: {
    backgroundColor: "white"
  },
  toggleText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "600"
  },
  toggleTextActive: {
    color: "#000"
  },
  bottomBar: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: responsiveWidth(5),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  bottomContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  iconButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  controlIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#8E54FE",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 20,
    gap: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: "500"
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },
  modalCancelButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  modalCancelText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600"
  }
})

export default TryOnResultScreen
