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
  BackHandler
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
import { setLastVtoResult, clearVtoResult } from "../../redux/reducers/aiStylistReducer"
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
  
  const { originalImage, resultImage, outfitImageUrl } = lastVtoResult || {}

  const [activeTab, setActiveTab] = useState("tryon") // "original" or "tryon"
  const [isSaving, setIsSaving] = useState(false)
  const [displayResultImage, setDisplayResultImage] = useState(resultImage)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentOutfitUrl, setCurrentOutfitUrl] = useState(outfitImageUrl)
  const [persistedOriginalImage, setPersistedOriginalImage] = useState(originalImage)
  const [isImageLoading, setIsImageLoading] = useState(false)
 
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
          outfitImageUrl: targetUrl
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

  const handleSaveLook = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant gallery permissions to save the look.')
      return
    }

    try {
      setIsSaving(true)
      const imageUri = displayResultImage // Always save the try-on result
      
      if (!imageUri) {
        throw new Error('Result image path is missing')
      }
      const filename = imageUri.split('/').pop()
      const fileUri = `${FileSystem.documentDirectory}${filename}`
      
      const downloadRes = await FileSystem.downloadAsync(imageUri, fileUri)
      
      if (downloadRes.status === 200) {
        // Save to gallery
        await MediaLibrary.saveToLibraryAsync(downloadRes.uri)
        Alert.alert('Success', 'Look saved to gallery!')
      } else {
        throw new Error('Download failed')
      }
    } catch (error) {
      console.error('Save Error:', error)
      Alert.alert('Error', 'Failed to save look. Please try again.')
    } finally {
      setIsSaving(false)
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
  }
})

export default TryOnResultScreen
