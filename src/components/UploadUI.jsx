import React, { useState } from "react";
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../utils/ThemeContext";

export default function UploadUI({ visible, onClose, onImagePicked }) {
  const [image, setImage] = useState(null);
  const { isDarkMode } = useTheme();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      if (onImagePicked) onImagePicked(uri);
    }
  };


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDarkMode ? "#1A1820" : "#fff",
              borderColor: isDarkMode ? "#3D3843" : "transparent",
            },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text
              style={[
                styles.closeText,
                { color: isDarkMode ? "#F5F4F7" : "#111827" },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>

          <Button title="Pick an image from camera roll" onPress={pickImage} />

          {image && (
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    borderWidth: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 2,
  },
  closeText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 12,
  },
});
