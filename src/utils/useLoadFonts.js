import { useFonts } from 'expo-font';
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_500Medium_Italic,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';

export default function useLoadFonts() {
  const [fontsLoaded] = useFonts({
    'Urbanist-Regular': Urbanist_400Regular,
    'Urbanist-Medium': Urbanist_500Medium,
    'Urbanist-MediumItalic': Urbanist_500Medium_Italic,
    'Urbanist-SemiBold': Urbanist_600SemiBold,
    'Urbanist-Bold': Urbanist_700Bold,
  });

  return fontsLoaded;
}
