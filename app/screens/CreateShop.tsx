
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { RootStackParamList } from "../../App";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import GreenButton from "../../components/GreenButton";

type CreateShopProps = NativeStackScreenProps<RootStackParamList, "CreateShop">;

export default function CreateShop({ navigation }: CreateShopProps) {
    const { user } = useAuth();
    const [shopName, setShopName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateShop = async () => {
        if (!shopName || !description || !address) {
            Alert.alert("Error", "All fields are required!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/create-shop`, {
                shopName,
                ownerId: user?.userId,
                description,
                address,
            });

            if (response.status === 200) {
                Alert.alert("Success", "Shop created successfully!", [
                    { text: "OK", onPress: () => navigation.replace("MyShop") },
                ]);
            }
        } catch (e) {
            console.error("Error creating shop:", e);
            Alert.alert("Error", "Failed to create shop. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#1f2937", justifyContent: "center" }}>
            <Text style={{ color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Create Your Shop</Text>
            <TextInput placeholder="Shop Name" placeholderTextColor="#ccc" style={styles.input} value={shopName} onChangeText={setShopName} />
            <TextInput placeholder="Description" placeholderTextColor="#ccc" style={styles.input} value={description} onChangeText={setDescription} />
            <TextInput placeholder="Address" placeholderTextColor="#ccc" style={styles.input} value={address} onChangeText={setAddress} />
            {loading ? <ActivityIndicator size="large" color="#34d399" style={{ marginTop: 20 }} /> : <GreenButton title="Create Shop" onPress={handleCreateShop} />}
        </View>
    );
}

const styles = {
    input: {
        backgroundColor: "#374151",
        color: "white",
        fontSize: 16,
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
};

