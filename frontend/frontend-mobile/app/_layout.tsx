import { Stack } from 'expo-router';


import 'react-native-reanimated';

export default function RootLayout() {

  return (
          <Stack initialRouteName='Login'>
            <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
            <Stack.Screen name="Login" options={{headerShown:false}}/>
            <Stack.Screen name="reservation/[id]" options={{headerShown:false}}/>
            <Stack.Screen name="notification/[id]" options={{headerShown:false}}/>
            <Stack.Screen name="Inscription" options={{headerShown:false}}/>
            <Stack.Screen name="+not-found" />
          </Stack>

  );
}
