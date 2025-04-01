import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import TextInputComponent from "../../components/TextInputComponent";
import { useEffect, useState } from "react";
import GreenButton from "../../components/GreenButton";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type CreateShopProps = NativeStackScreenProps<RootStackParamList, "CreateShop">
export default function CreateShop({ navigation }: CreateShopProps) {
    const { user } = useAuth()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [address, setAddress] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const getShop = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-shop-by-owner/${user?.userId}`)
            if (response.data) {
                navigation.navigate("MyShop")
            }

        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const createShop = async () => {
        try {
            const response = await axios.post(`${API_URL}/create-shop`, {
                shopName: name,
                ownerId: user?.userId,
                description: description,
                address: address
            })
            return response.data

        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const handleCreateClick = async () => {
        if (name == "" || description == "" || address == "") {
            setErrMessage("All forms must be filled")
            return
        }
        if (user?.userId) {
            setLoading(true)
            const result = await createShop()
            if (result.error) {
                setErrMessage(result.msg)
                setLoading(false)
                return
            } else {
                navigation.navigate("MyShop")
            }
        }
    }
    useEffect(() => {
        if (user?.userId) {
            getShop()
        }
    }, [])
    return (
        <ScrollView style={{ padding: 5 }}>
            <View style={{ gap: 5 }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Shop Name</Text>
                <TextInputComponent placeholder="Shop Name" onChangeText={setName} value={name} />
                <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Shop Description</Text>
                <TextInputComponent placeholder="Shop Description" onChangeText={setDescription} value={description} />
                <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Shop Address</Text>
                <TextInputComponent placeholder="Shop Address" onChangeText={setAddress} value={address} />
                {loading ? <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 32 }} /> : <GreenButton title={"Create Shop"} onPress={handleCreateClick} />}

            </View>
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
    errorContainer: {
        padding: 15,
        borderStyle: "dashed",
        borderColor: '#FB2C36',
        borderWidth: 1,
        borderRadius: 5

    },
})