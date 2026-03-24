import React from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

const CustomSwitch = ({ 
  value, 
  onValueChange, 
  trackColor = { false: '#E5E5E5', true: '#34C759' }, 
  thumbColor = '#FFFFFF', 
  disabled = false,
  size = 'default', // 'small', 'default', 'large'
  style,
  trackStyle,
  thumbStyle,
}) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  // Size configurations
  const sizeConfig = {
    small: { width: 36, height: 20, thumbSize: 16, padding: 2 },
    default: { width: 44, height: 24, thumbSize: 20, padding: 2 },
    large: { width: 52, height: 28, thumbSize: 24, padding: 2 },
  };

  const config = sizeConfig[size] || sizeConfig.default;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const trackColorInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [trackColor.false, trackColor.true],
  });

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [config.padding, config.width - config.thumbSize - config.padding],
  });

  const thumbScale = animatedValue.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [1, 1.1, 1.1, 1],
  });

  const trackOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.switchContainer,
        disabled && styles.switchDisabled,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.switchTrack,
          {
            width: config.width,
            height: config.height,
            borderRadius: config.height / 2,
            backgroundColor: trackColorInterpolated,
            opacity: trackOpacity,
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.switchThumb,
            {
              width: config.thumbSize,
              height: config.thumbSize,
              borderRadius: config.thumbSize / 2,
              backgroundColor: thumbColor,
              transform: [
                { translateX: thumbPosition },
                { scale: thumbScale },
              ],
            },
            thumbStyle,
          ]}
        >
          {/* Optional inner highlight */}
          <View style={[
            styles.thumbInner,
            {
              borderRadius: config.thumbSize / 2,
            }
          ]} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchDisabled: {
    opacity: 0.5,
  },
  switchTrack: {
    justifyContent: 'center',
    position: 'relative',
  },
  switchThumb: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  thumbInner: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export default CustomSwitch;