// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useColorScheme } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const systemColorScheme = useColorScheme(); // 'light' or 'dark'
//   const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

//   // Load saved preference on mount
//   useEffect(() => {
//     const loadThemePreference = async () => {
//       try {
//         const savedTheme = await AsyncStorage.getItem('themePreference');
//         if (savedTheme) {
//           setIsDarkMode(savedTheme === 'dark');
//         } else {
//           // Use system preference
//           setIsDarkMode(systemColorScheme === 'dark');
//         }
//       } catch (error) {
//         console.error('Error loading theme:', error);
//       }
//     };

//     loadThemePreference();
//   }, []);

//   // Listen for system theme changes (when no manual override is set)
//   useEffect(() => {
//     const checkSystemTheme = async () => {
//       try {
//         const savedTheme = await AsyncStorage.getItem('themePreference');
//         if (!savedTheme) {
//           // Only update if user hasn't manually set a preference
//           setIsDarkMode(systemColorScheme === 'dark');
//         }
//       } catch (error) {
//         console.error('Error checking system theme:', error);
//       }
//     };

//     checkSystemTheme();
//   }, [systemColorScheme]);

//   const toggleDarkMode = async (value) => {
//     const newValue = typeof value === 'boolean' ? value : !isDarkMode;
//     setIsDarkMode(newValue);
//     try {
//       await AsyncStorage.setItem('themePreference', newValue ? 'dark' : 'light');
//     } catch (error) {
//       console.error('Error saving theme:', error);
//     }
//   };

//   const value = {
//     isDarkMode,
//     toggleDarkMode,
//   };

//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within ThemeProvider');
//   }
//   return context;
// };




import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'light' or 'dark'
  const [isDarkMode, setIsDarkMode] = useState(null); // Start with null
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserPreference, setHasUserPreference] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        console.log('Saved Theme:', savedTheme);
        console.log('System Color Scheme:', systemColorScheme);

        if (savedTheme) {
          setIsDarkMode(savedTheme === 'dark');
          setHasUserPreference(true);
          console.log('Using saved preference:', savedTheme === 'dark');
        } else {
          // Use system preference
          setIsDarkMode(systemColorScheme === 'dark');
          setHasUserPreference(false);
          console.log('Using system preference:', systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        // Fallback to system scheme
        setIsDarkMode(systemColorScheme === 'dark');
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  const toggleDarkMode = async (value) => {
    const newValue = typeof value === 'boolean' ? value : !isDarkMode;
    console.log('Toggling dark mode to:', newValue);
    
    setIsDarkMode(newValue);
    setHasUserPreference(true);
    
    try {
      await AsyncStorage.setItem('themePreference', newValue ? 'dark' : 'light');
      console.log('Theme preference saved:', newValue ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Reset to system preference
  const resetToSystemTheme = async () => {
    try {
      await AsyncStorage.removeItem('themePreference');
      setIsDarkMode(systemColorScheme === 'dark');
      setHasUserPreference(false);
      console.log('Reset to system theme:', systemColorScheme === 'dark');
    } catch (error) {
      console.error('Error resetting theme:', error);
    }
  };

  const value = {
    isDarkMode: isDarkMode ?? false,
    toggleDarkMode,
    resetToSystemTheme,
    isLoading,
    hasUserPreference,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};