import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  PanResponder, 
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BottomSheet({ isOpen, onClose, title, subtitle, children }: BottomSheetProps) {
  const { isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(isOpen);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Interpolate opacity from translateY for smooth fading during drags and transitions
  const backdropOpacity = translateY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Track if sheet is open to prevent redundant calls
  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      onClose();
    });
  }, [onClose]);

  // Handle drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  if (!modalVisible) return null;

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end">
        {/* Animated Background Backdrop with Blur */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View 
            style={{ opacity: backdropOpacity }}
            className="absolute inset-0"
          >
            <BlurView 
              intensity={isDark ? 30 : 40} 
              tint={isDark ? "dark" : "light"} 
              className="absolute inset-0" 
            />
            <View className="absolute inset-0 bg-slate-900/30 dark:bg-black/50" />
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* The Sheet */}
        <Animated.View
          style={{ 
            transform: [{ translateY }],
            maxHeight: SCREEN_HEIGHT * 0.9,
          }}
          className="bg-white/95 dark:bg-slate-900/95 rounded-t-[48px] shadow-2xl border-t border-white/20 dark:border-slate-800"
        >
          {/* Header/Handle Bar */}
          <View {...panResponder.panHandlers} className="items-center py-4">
            <View className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </View>

          <View className="px-8 pb-12">
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1 pr-4">
                <Text className="text-2xl font-headline font-bold text-slate-900 dark:text-white leading-tight">
                  {title}
                </Text>
                {subtitle && (
                  <Text className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                    {subtitle}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={handleClose}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center"
              >
                <X size={20} color={isDark ? "#94A3B8" : "#475569"} />
              </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View className="w-full">
              {children}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
