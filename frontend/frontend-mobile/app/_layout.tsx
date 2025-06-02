import { Stack } from 'expo-router';


import 'react-native-reanimated';

export default function RootLayout() {

  return (
          <Stack initialRouteName='LoginScreen'>
            <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
            <Stack.Screen name="LoginScreen" options={{headerShown:false}}/>
            <Stack.Screen name="Inscription" options={{headerShown:false}}/>
            <Stack.Screen name="+not-found" />
          </Stack>

  );
}
