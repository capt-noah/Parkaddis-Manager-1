import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

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
            <View className="w-10 h-10 rounded-full overflow-hidden items-center justify-center bg-slate-100 dark:bg-slate-800">
              {profileIcon || (
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
