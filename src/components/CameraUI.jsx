// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   Pressable,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import { CameraView, useCameraPermissions, CameraType } from "expo-camera";

// export default function CameraUI({ isCameraActive, setIsCameraActive, setPhotoPath }) {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);

//   if (!permission) return null;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text>Camera permission is required.</Text>
//         <Pressable onPress={requestPermission}>
//           <Text>Grant Permission</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         setPhotoPath(photo.uri);
//         setIsCameraActive(false);
//       } catch (error) {
//         Alert.alert("Error taking photo", error.message);
//       }
//     }
//   };

//   return (
//     <Modal visible={isCameraActive} animationType="slide">
//       <CameraView
//         ref={cameraRef}
//         // facing={CameraType.back}
//         style={StyleSheet.absoluteFill}
//       >
//         <View style={styles.controls}>
//           <Pressable onPress={takePicture} style={styles.button}>
//             <Text style={styles.text}>Snap</Text>
//           </Pressable>
//           <Pressable onPress={() => setIsCameraActive(false)} style={styles.button}>
//             <Text style={styles.text}>Close</Text>
//           </Pressable>
//         </View>
//       </CameraView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   controls: {
//     position: "absolute",
//     bottom: 40,
//     flexDirection: "row",
//     width: "100%",
//     justifyContent: "space-around",
//   },
//   button: {
//     backgroundColor: "rgba(0,0,0,0.6)",
//     padding: 15,
//     borderRadius: 10,
//   },
//   text: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });

// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   Pressable,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import {
//   CameraView,
//   useCameraPermissions,
//   CameraType,
// } from "expo-camera";

// export default function CameraUI({
//   isCameraActive,
//   setIsCameraActive,
//   setPhotoPath,
// }) {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);

//   // ✅ Request permission automatically
//   useEffect(() => {
//     if (!permission?.granted) {
//       requestPermission();
//     }
//   }, []);

//   if (!permission || !permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Waiting for camera permission...</Text>
//       </View>
//     );
//   }

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         setPhotoPath(photo.uri);
//         setIsCameraActive(false);
//       } catch (error) {
//         Alert.alert("Error taking photo", error.message);
//       }
//     }
//   };

//   return (
//     <Modal visible={isCameraActive} animationType="slide">
//       <CameraView
//         ref={cameraRef}
//         style={StyleSheet.absoluteFill}
//         facing="back" // or 'front' if needed
//       >
//         <View style={styles.controls}>
//           <Pressable onPress={takePicture} style={styles.button}>
//             <Text style={styles.text}>Snap</Text>
//           </Pressable>
//           <Pressable
//             onPress={() => setIsCameraActive(false)}
//             style={styles.button}
//           >
//             <Text style={styles.text}>Close</Text>
//           </Pressable>
//         </View>
//       </CameraView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   controls: {
//     position: "absolute",
//     bottom: 40,
//     flexDirection: "row",
//     width: "100%",
//     justifyContent: "space-around",
//   },
//   button: {
//     backgroundColor: "rgba(0,0,0,0.6)",
//     padding: 15,
//     borderRadius: 10,
//   },
//   text: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });

import React, { useEffect, useRef, useState } from "react";
import { View, Text, Modal, Pressable, Alert, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Aperture, Check, RotateCcw, SwitchCamera, X } from "lucide-react-native";

export default function CameraUI({
  isCameraActive,
  setIsCameraActive,
  setPhotoPath,
  setShowFolderModal,
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [type, setType] = useState("back");
  // console.log("LINE AT 197", photoUri);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    if (isCameraActive) {
      setPhotoTaken(false);
      setPhotoUri(null);
    }
  }, [isCameraActive]);

  if (!permission || !permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">
          Waiting for camera permission...
        </Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !photoTaken) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
        setPhotoTaken(true);
        // setShowFolderModal(true);
      } catch (error) {
        // console.log('LINE AT 230', error);
        
        Alert.alert("Error taking photo", error.message);
      }
    }
  };

  const handleOk = () => {
    setPhotoPath(photoUri);
    setIsCameraActive(false); // optional
    setShowFolderModal(true);
  };
  const flipCamera = () => {
    if (type === "front") {
      setType("back");
    } else {
      setType("front");
    }
  };
  return (
    <Modal visible={isCameraActive} animationType="slide">
      {photoTaken && photoUri ? (
        <View className="flex-1">
          <Image
            source={{ uri: photoUri }}
            className="w-full h-4/5 object-cover"
          />
          <View className="w-full h-1/5 flex-row justify-around items-center">
            <Pressable
              onPress={handleOk}
              className="bg-black/60 p-5 rounded-full"
            >
              <Check color="white" />
            </Pressable>
            <Pressable
              onPress={() => {
                setPhotoTaken(false);
                setPhotoUri(null);
              }}
              className="bg-black/60 p-5 rounded-full"
            >
                  <RotateCcw color="white" />

            </Pressable>
          </View>
        </View>
      ) : (
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={type}>
          <View className="absolute bottom-10 w-full flex-row justify-around px-4">
            <Pressable
              onPress={() => flipCamera()}
              className="bg-black/60 p-5 rounded-full"
            >
              <SwitchCamera color="white" />
            </Pressable>

            <Pressable
              onPress={takePicture}
              className="bg-black/60 p-5 rounded-full"
            >
              <Aperture color="white" />
            </Pressable>

            <Pressable
              onPress={() => setIsCameraActive(false)}
              className="bg-black/60 p-5 rounded-full"
            >
              <X color="white" />
            </Pressable>
          </View>
        </CameraView>
      )}
    </Modal>
  );
}
