import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, TextInput, View, StyleSheet ,Text } from "react-native";
import TextInputComponent from "../../components/TextInputComponent";


type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
export default function Login({ navigation }: LoginProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { onLogin } = useAuth()
    const login = async () => {
        const result = await onLogin!(email, password)
        if (result.error) {
            alert(result.msg)
        }
    }
    return (
        <View>
            <Text>asshol</Text>
            <View style={styles.formContainer}>
                <TextInputComponent autoCapitalize="none" placeholder="Email" onChangeText={setEmail}/>
                <TextInputComponent autoCapitalize="none" secureTextEntry={true} placeholder="Password" onChangeText={setPassword}/>
                <Button onPress={login} title="Log in" />
                <Button onPress={() => { navigation.navigate("Register") }} title="Register" />
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    formContainer: {
        padding: 10,
        gap: 10
    },
    textInput: {
        backgroundColor: "white",
        height: 50,
        padding: 10,
        borderRadius: 5
    }
})