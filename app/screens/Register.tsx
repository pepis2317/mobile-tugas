import { useEffect, useState } from "react";
import { Button, TextInput, View, StyleSheet } from "react-native";
import PhoneInputComponent from "../../components/PhoneInputComponent";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import TextInputComponent from "../../components/TextInputComponent";

type RegisterProps = NativeStackScreenProps<RootStackParamList, "Register">;
export default function Register({ navigation }: RegisterProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [phone, setPhone] = useState("")
    const { onRegister } = useAuth()
    // const register = async () => {
    //     const result = await onRegister!(userName, email, password, phone)
    //     if (result.error) {
    //         alert(result.msg)
    //     } else {
    //         navigation.goBack()
    //     }
    // }
    return (
        <View>
            <View style={styles.formContainer}>
                <TextInputComponent autoCapitalize="none" placeholder="User Name" onChangeText={setUserName} />
                <TextInputComponent autoCapitalize="none" placeholder="Email" onChangeText={setEmail} />
                <PhoneInputComponent defaultValue="" onPhoneChange={setPhone} />
                <TextInputComponent autoCapitalize="none" secureTextEntry={true} placeholder="Password" onChangeText={setPassword} />
                {/* <Button title="Register" onPress={register} /> */}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    formContainer: {
        padding: 15,
        gap: 5
    },
    textInput: {
        backgroundColor: "white",
        height: 50,
        padding: 10,
        borderRadius: 5
    }
})