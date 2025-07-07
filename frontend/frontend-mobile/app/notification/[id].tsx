import { useLocalSearchParams } from "expo-router";
import { View,Text } from "react-native";


export default function NotificationScreen(){
    const {id,title}=useLocalSearchParams()
    return (
        <View>
            <Text>{title}</Text>
            <Text>{id}</Text>
        </View>
    )
}