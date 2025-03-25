import { useEffect, useState } from "react";
import { Button, TextInput, View, StyleSheet, Text, ScrollView } from "react-native";
import PhoneInputComponent from "../../components/PhoneInputComponent";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import TextInputComponent from "../../components/TextInputComponent";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import GreenButton from "../../components/GreenButton";

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
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState("")
    const { onRegister } = useAuth()
    const onChange = (event: any, selectedDate: any) => {
        setShow(false); // Hide the picker after selecting
        if (selectedDate) {
            setBirthDate(selectedDate.toISOString().split('T')[0]);
        }
    };
    const register = async () => {
        if (email == "" || password == "" || confirm == "" || userName == "" || phone == "" || address == "" || birthDate == "" || gender == "") {
            setErrMessage("All fields must be filled")
            return
        }
        if (password != confirm) {
            setErrMessage("Password doesn't match with confirmed password")
            return
        }

        const result = await onRegister!(userName, email, password, phone, address, birthDate, gender)
        setLoading(true)
        if (result.error) {
            setLoading(false)
            setErrMessage(result.msg)
        } else {
            navigation.goBack()
        }
    }
    return (
        <ScrollView>
            <View style={styles.formContainer}>
                <TextInputComponent autoCapitalize="none" placeholder="User Name" onChangeText={setUserName} />
                <TextInputComponent autoCapitalize="none" placeholder="Email" onChangeText={setEmail} />
                <PhoneInputComponent defaultVal={""} onPhoneChange={setPhone} />
                <TextInputComponent autoCapitalize="none" secureTextEntry={true} placeholder="Password" onChangeText={setPassword} />
                <TextInputComponent autoCapitalize="none" secureTextEntry={true} placeholder="Confirm Password" onChangeText={setConfirm} />
                <TextInputComponent autoCapitalize="none" placeholder="Address" onChangeText={setAddress} />
                <View style={styles.datePickerContainer}>

                    {show && (
                        <RNDateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={onChange}
                        />
                    )}

                    <Text style={{ color: 'white', marginLeft: 5 }}>{birthDate == "" ? "Select birth date" : birthDate}</Text>
                    <GreenButton title="Select birth date" onPress={() => setShow(true)} />
                </View>
                <View style={styles.pickerContainer}>
                    <Picker style={{ color: 'white' }} selectedValue={gender} onValueChange={(val) => val == "none" ? setGender("") : setGender(val)}>
                        <Picker.Item label="Select gender" value="none" />
                        <Picker.Item label="M" value="M" />
                        <Picker.Item label="F" value="F" />
                    </Picker>
                </View>

                <GreenButton title={loading ? "Loading" : "Register"} onPress={loading ? () => { } : register} />
                {errMessage ?
                    <View style={styles.errorContainer}>
                        {errMessage.split("; ").map((error, index) => (
                            <Text key={index} style={{color:'white'}}>{error}</Text>
                        ))}
                    </View>
                    : <></>}

            </View>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    errorContainer: {
        padding: 15,
        borderStyle:"dashed",
        borderColor: '#FB2C36',
        borderWidth: 1,
        borderRadius:5
        
    },
    formContainer: {
        padding: 15,
        gap: 5
    },
    datePickerContainer: {
        borderStyle: 'solid',
        borderColor: '#636C7C',
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: "space-between",
        flexDirection: 'row'
    },
    pickerContainer: {
        borderStyle: 'solid',
        borderColor: '#636C7C',
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
    },
    textInput: {
        backgroundColor: "white",
        height: 50,
        padding: 10,
        borderRadius: 5
    }
})