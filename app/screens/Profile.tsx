import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { API_URL, useAuth, User } from "../context/AuthContext";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker"
import axios from "axios";
import PhoneInputComponent from "../../components/PhoneInputComponent";

export default function Profile() {
    const { user, onUserUpdate } = useAuth()
    const [email, setEmail] = useState<string | null>("")
    const [password, setPassword] = useState<string | null>("")
    const [phone, setPhone] = useState<string | null>("")
    const [userName, setUserName] = useState<string | null>("")
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    useEffect(() => {
        if (user) {
            setEmail(user.userEmail)
            setPhone(user.userPhoneNumber)
            setUserName(user.userName)
            console.log(user.userPhoneNumber)
            setSelectedImage(user.userProfile)
        }
    }, [user])
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
        if (!selectedImage) {
            alert("Please select an image first")
            return;
        }
        if (!user?.userId) {
            alert("Unable to get user id")
            return
        }

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

        const response = await uploadPfp(formData)
        let newUser: User = {
            userEmail: user.userEmail,
            userProfile: selectedImage,
            userPhoneNumber: user.userPhoneNumber,
            userAddress: user.userAddress,
            userId: user.userId,
            userName: user.userName,
            birthDate: user.birthDate,
            gender: user.gender,
            userBalance: user.userBalance
        }
        await onUserUpdate!(newUser)
        console.log(response)
    }
    return (
        <View>
            {user ?
                <View style={styles.formContainer}>
                    <Image source={selectedImage ? { uri: selectedImage } : require('../../assets/default.jpg')} style={styles.pfp} />
                    <Button onPress={pickImageAsync} title="upload pfp" />
                    <TextInput style={styles.textInput} autoCapitalize="none" placeholder="User Name" onChangeText={setUserName} defaultValue={userName?userName:""} />
                    <TextInput style={styles.textInput} autoCapitalize="none" placeholder="Email" onChangeText={setEmail} defaultValue={email?email:""} />
                    <TextInput style={styles.textInput} autoCapitalize="none" placeholder="Password" onChangeText={setPassword} secureTextEntry={true} />
                    <PhoneInputComponent onPhoneChange={setPhone} defaultValue= "+6281322334455" />
                    <Button title="save changes" onPress={() => handleUpload()} />
                </View>
                : <></>}
        </View>
    )
}
const styles = StyleSheet.create({
    formContainer: {
        padding: 10,
        gap: 10,
        alignItems: 'center'
    },
    textInput: {
        width: "100%",
        backgroundColor: "white",
        height: 50,
        padding: 10,
        borderRadius: 5
    },
    pfp: {
        borderRadius: 100,
        width: 100,
        height: 100
    }
})