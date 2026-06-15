import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  showProfile?: boolean;
  showLogo?: boolean;
  rightElement?: React.ReactNode;
  profileIcon?: React.ReactNode;
  onProfileClick?: () => void;
}

export default function TopBar({ 
  showProfile = true, 
  showLogo = true, 
  rightElement,
  profileIcon,
  onProfileClick
}: TopBarProps) {
  const router = useRouter();
  const { user } = useAuth();

  const initial = (user?.fullName || user?.name || '?').charAt(0).toUpperCase();

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      router.push('/profile');
    }
  };

  return (
    <View className="bg-background dark:bg-slate-900 w-full z-40 flex-row justify-between items-center px-6 pb-4 pt-2">
      {showLogo ? (
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center">
            <Text className="font-headline font-extrabold text-lg tracking-tighter text-primary uppercase">Park</Text>
            <Text className="font-headline font-extrabold text-lg tracking-tighter text-slate-400 uppercase">Addis</Text>
          </View>
        </View>
      ) : <View />}

      <View className="flex-row items-center gap-3">
        {rightElement}
        {showProfile && (
          <TouchableOpacity 
            onPress={handleProfileClick}
            className="active:opacity-80"
          >
            <View className="w-10 h-10 rounded-full items-center justify-center bg-primary">
              {profileIcon || (
                <Text className="text-white font-headline font-extrabold text-base">
                  {initial}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
