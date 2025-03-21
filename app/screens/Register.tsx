import { useEffect, useState } from "react";
import { Button, TextInput, View, StyleSheet , Text} from "react-native";
import PhoneInputComponent from "../../components/PhoneInputComponent";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import TextInputComponent from "../../components/TextInputComponent";
import RNDateTimePicker from "@react-native-community/datetimepicker";

type RegisterProps = NativeStackScreenProps<RootStackParamList, "Register">;
export default function Register({ navigation }: RegisterProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [userName, setUserName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [gender, setGender] = useState("")
    const [show, setShow] = useState(false);
    const { onRegister } = useAuth()
    const onChange = (event:any, selectedDate:any) => {
        setShow(false); // Hide the picker after selecting
        if (selectedDate) {
          setBirthDate(selectedDate.toISOString().split('T')[0]);
        }
      };
    const register = async () => {
        const result = await onRegister!(userName, email, password, phone, address, birthDate, gender)
        if (result.error) {
            alert(result.msg)
        } else {
            navigation.goBack()
        }
    }
    return (
        <View>
            <View style={styles.formContainer}>
                <TextInputComponent autoCapitalize="none" placeholder="User Name" onChangeText={setUserName} />
                <TextInputComponent autoCapitalize="none" placeholder="Email" onChangeText={setEmail} />
                <PhoneInputComponent defaultValue="" onPhoneChange={setPhone} />
                <TextInputComponent autoCapitalize="none" secureTextEntry={true} placeholder="Password" onChangeText={setPassword} />
                <TextInputComponent autoCapitalize="none" secureTextEntry={true} placeholder="Confirm Password" onChangeText={setConfirm} />
                <TextInputComponent autoCapitalize="none" secureTextEntry={true} placeholder="Address" onChangeText={setAddress} />
                <Button title="Select birth date" onPress={() => setShow(true)} />
                {show && (
                    <RNDateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}
                <Text style={{color:'white'}}>Selected Date: {birthDate}</Text>
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