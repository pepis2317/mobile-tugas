import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { API_URL, useAuth, User } from "../context/AuthContext";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker"
import axios from "axios";
import PhoneInputComponent from "../../components/PhoneInputComponent";
import TextInputComponent from "../../components/TextInputComponent";
import GreenButton from "../../components/GreenButton";
import { Picker } from "@react-native-picker/picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Pencil } from "lucide-react-native";
type ProfileProps = NativeStackScreenProps<RootStackParamList, "Profile">
export default function Profile({ navigation }: ProfileProps) {
    const { user, onUserUpdate, onLogout } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [userName, setUserName] = useState("")
    const [selectedImage, setSelectedImage] = useState("");
    const [birthDate, setBirthDate] = useState("")
    const [gender, setGender] = useState("")
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const onChange = (event: any, selectedDate: any) => {
        setShow(false);
        if (selectedDate) {
            setBirthDate(selectedDate.toISOString().split('T')[0]);
        }
    };
    useEffect(() => {
        if (user) {
            setEmail(user.userEmail ? user.userEmail : "")
            setUserName(user.userName ? user.userName : "")
            setPassword(user.userPassword ? user.userPassword : "")
            setPhone(user.userPhoneNumber ? user.userPhoneNumber : "")
            setSelectedImage(user.userProfile ? user.userProfile : "")
            setGender(user.gender ? user.gender : "")
            setBirthDate(user.birthDate ? user.birthDate : "")
            setAddress(user.userAddress ? user.userAddress : "")

        }
    }, [user])
    const updateUser = async (user: User) => {
        try {
            const filteredData = Object.fromEntries(
                Object.entries(user).filter(([_, value]) => value !== null && value !== undefined)
            );
            const response = await axios.put(`${API_URL}/update-user/${user.userId}`, filteredData, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            return response.data
        } catch (e) {
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            aspect: [1, 1]
        })
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    }
    const uploadPfp = async (formData: FormData) => {
        try {
            const response = await axios.post(`${API_URL}/upload-pfp`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });

            return response.data;
        } catch (e) {
            return {
                error: true,
                msg: (e as any).response?.data?.detail || "An error occurred"
            };
        }
    }
    const handleUpload = async () => {
        if (user?.userId) {
            let newUser: User = {
                userEmail: email,
                userPassword: password,
                userProfile: selectedImage,
                userPhoneNumber: phone,
                userAddress: address,
                userId: user.userId,
                userName: userName,
                birthDate: birthDate,
                gender: gender,
                userBalance: user.userBalance,

            }
            setLoading(true)
            const res = await updateUser(newUser)
            if (res.error) {
                setErrMessage(res.msg)
                setLoading(false)
            } else {
                await onUserUpdate!(newUser)
                if (selectedImage && user?.userId) {
                    let filename = selectedImage.split("/").pop();
                    let match = /\.(\w+)$/.exec(filename || "");
                    let type = match ? `image/${match[1]}` : `image`;
                    let formData = new FormData();
                    formData.append("UserId", user.userId);
                    formData.append("file", {
                        uri: selectedImage,
                        name: filename,
                        type: type
                    } as any);
                    await uploadPfp(formData)
                }
                navigation.goBack()
            }
        }
    }
    return (
        <ScrollView >
            {user ?
                <View style={styles.formContainer}>
                    <TouchableOpacity onPress={pickImageAsync}>
                        <Image source={selectedImage ? { uri: selectedImage } : require('../../assets/default.jpg')} style={styles.pfp} />
                        <View style={styles.pencil}>
                            <Pencil size={20} color={"white"} />
                        </View>
                    </TouchableOpacity>
                    {/* <GreenButton onPress={pickImageAsync} title="Change Profile Picture" /> */}
                    <TextInputComponent autoCapitalize="none" placeholder="User Name" onChangeText={setUserName} value={userName} />
                    <TextInputComponent autoCapitalize="none" placeholder="Email" onChangeText={setEmail} value={email} />
                    <TextInputComponent autoCapitalize="none" placeholder="Password" onChangeText={setPassword} secureTextEntry={true} value={password} />
                    <PhoneInputComponent onPhoneChange={setPhone} defaultVal={phone} />
                    <TextInputComponent autoCapitalize="none" placeholder="Address" onChangeText={setAddress} defaultValue={address} />
                    <View style={styles.datePickerContainer}>
                        {show && (
                            <RNDateTimePicker
                                value={new Date()}
                                mode="date"
                                display="default"
                                onChange={onChange}
                            />
                        )}

                        <Text style={{ color: 'white', marginLeft: 5 }}>{birthDate}</Text>
                        <GreenButton title="Select birth date" onPress={() => setShow(true)} />
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker style={{ color: 'white' }} selectedValue={gender} onValueChange={(val) => val == "none" ? setGender("") : setGender(val)}>
                            <Picker.Item label="Select gender" value="none" />
                            <Picker.Item label="M" value="M" />
                            <Picker.Item label="F" value="F" />
                        </Picker>
                    </View>

                    <GreenButton style={{ width: "100%" }} title={loading ? "Loading" : "Save Changes"} onPress={loading ? () => { } : handleUpload} />
                    <TouchableOpacity onPress={() => onLogout!()} style={{ width: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: "#31363F", padding: 10, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>
                            Log out
                        </Text>
                    </TouchableOpacity>
                </View>
                : <></>}
            {errMessage ?
                <View style={styles.errorContainer}>
                    {errMessage.split("; ").map((error, index) => (
                        <Text key={index} style={{ color: 'white' }}>{error}</Text>
                    ))}
                </View>
                : <></>}
        </ScrollView>

    )
}
const styles = StyleSheet.create({
    pencil: {
        backgroundColor: '#31363F',
        width: 35,
        height: 35,
        borderRadius: 100,
        position: 'absolute',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        top: 0
    },
    errorContainer: {
        padding: 15,
        borderStyle: "dashed",
        borderColor: '#FB2C36',
        borderWidth: 1,
        borderRadius: 5

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
    formContainer: {
        marginBottom: 300,
        padding: 10,
        gap: 10,
        alignItems: 'center'
    },
    pfp: {
        borderRadius: 100,
        width: 100,
        height: 100
    }
})