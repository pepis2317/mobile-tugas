import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"
import { useAuth } from "../context/AuthContext"
import { Button, View, Text } from "react-native"

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">
export default function Home({ navigation }: HomeProps){
    const {authState, onLogout} = useAuth()
    return(
    <View>
        <Text>asshol</Text>
        <Button onPress={onLogout}title="logout" />
        <Button onPress={()=>navigation.navigate("Profile")} title="go to profile page"/>
    </View>
    )
}