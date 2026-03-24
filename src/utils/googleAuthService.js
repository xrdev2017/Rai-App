import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// Configure Google Sign-In (call this once in App.js or entry point)
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '919857176237-9m67nfpjaebcaogd5ofmu6ul5bq6vs43.apps.googleusercontent.com', // from Google Cloud console
  });
};

// Handle Google Login
export const handleGoogleLogin = async () => {
  try {
    // Ensure play services are available (Android only)
    await GoogleSignin.hasPlayServices();

    // Start Google sign in process
    const userInfo = await GoogleSignin.signIn();

    // userInfo contains details like email, name, photo, and tokens
    console.log("✅ Google User Info:", userInfo);

    // Send token to your backend for verification (important for auth)
    return {
      success: true,
      user: userInfo?.data?.user,
      // idToken: userInfo.idToken,
    };
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("🚫 User cancelled the login flow");
      return { success: false, error: "Cancelled" };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("⚠️ Sign-in in progress already");
      return { success: false, error: "In progress" };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log("❌ Play Services not available");
      return { success: false, error: "Play services not available" };
    } else {
      console.error("🔥 Google Signin Error:", error);
      return { success: false, error: error.message };
    }
  }
};
