import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { TextInput, View, StyleSheet, Text, ScrollView } from "react-native";
import TextInputComponent from "../../components/TextInputComponent";
import GreenButton from "../../components/GreenButton";

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
export default function Login({ navigation }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { onLogin } = useAuth();
    
    const login = async () => {
        console.log(email, password)
        const result = await onLogin!(email, password);
        if (result.error) {
            alert(result.msg);
        }
    };
    
    return (
        <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>
            <View style={styles.formContainer}>
                <TextInputComponent autoCapitalize="none" placeholder="Email" onChangeText={setEmail} />
                <TextInputComponent autoCapitalize="none" secureTextEntry={true} placeholder="Password" onChangeText={setPassword} />
                <GreenButton onPress={login} style={{ width: "100%" }} title="Log in" />
                <Text style={{ color: 'white', textDecorationLine: 'underline' }} onPress={() => navigation.navigate("Register")}>New to our app? Register here</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',  
        marginTop: -150,
        gap: 10,
    },
    textInput: {
        width: "100%",
    },
});
