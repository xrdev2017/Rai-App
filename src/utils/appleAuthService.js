import { appleAuth } from '@invertase/react-native-apple-authentication';

export const configureAppleSignIn = async () => {
  try {
    // Check if Apple Sign In is available on the device
    return appleAuth.isSupported;
  } catch (error) {
    console.log('Apple Sign In not supported:', error);
    return false;
  }
};

export const handleAppleLogin = async () => {
  try {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Get the credential tokens
    const { identityToken, authorizationCode, user, fullName } = appleAuthRequestResponse;

    if (!identityToken) {
      throw new Error('Apple Sign In failed - no identity token returned');
    }

    // Create user object with available data
    const userData = {
      identityToken,
      authorizationCode,
      user: user || '',
      email: appleAuthRequestResponse.email || '',
      fullName: fullName
        ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
        : '',
    };

    return {
      success: true,
      user: userData,
      idToken: identityToken,
    };
  } catch (error) {
    console.log('Apple Sign In error:', error);
    
    if (error.code === appleAuth.Error.CANCELED) {
      return {
        success: false,
        error: 'User canceled Apple Sign in',
      };
    } else {
      return {
        success: false,
        error: error.message || 'Apple Sign In failed',
      };
    }
  }
};