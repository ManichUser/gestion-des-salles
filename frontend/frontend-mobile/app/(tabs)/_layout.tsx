import { HapticTab } from '@/app-example/components/HapticTab';
import { IconSymbol } from '@/app-example/components/ui/IconSymbol.ios';
import TabBarBackground from '@/app-example/components/ui/TabBarBackground';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
   
        headerShown: false,
     
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="HomePage"
        options={{
          title: 'Acceuil',
          tabBarIcon:()=><Ionicons name='home-sharp' color={'#0959e4'}  />
        }}
      />
            <Tabs.Screen
        name="Salle"
        options={{
          title: 'Salles de classe',
          tabBarIcon:()=><Ionicons name='school-sharp' color={'#0959e4'}  />
        }}
      />
    </Tabs>
  );
}
