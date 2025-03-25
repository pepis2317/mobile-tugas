import { ActivityIndicator, FlatList, View } from "react-native";
import CartItem from "../../components/CartItem";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { CartItemResponse } from "../../models/CartItemResponse";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import GreenButton from "../../components/GreenButton";
type CartProps = NativeStackScreenProps<RootStackParamList, "Cart">
export default function Cart({ navigation }: CartProps) {
    const { user } = useAuth()
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([])
    const [loading, setLoading] = useState(true);
    const getCart = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-incomplete-cart?UserId=${user?.userId}`)
            setCartItems(response.data)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const CheckOut = async () => {
        try {
            const response = await axios.put(`${API_URL}/complete-cart/${user?.userId}`)
            setCartItems([])
            return response.data
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const removeItem = (id: string) => {
        setCartItems((prevItems) => prevItems.filter(cartItem => cartItem.item.itemId !== id));
    };
    const handleCheckoutClick = async () => {
        if (user?.userId) {
            const res = await CheckOut()
            if (res.error) {
                console.log(res.error)
            } else {
                navigation.goBack()
            }

        }
    }

    useEffect(() => {
        if (user?.userId) {
            getCart()
            setLoading(false)
        }
    }, [user?.userId])
    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 30 }} />
            ) : (
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.item.itemId}
                    numColumns={1}
                    renderItem={({ item, index }) => (
                        <CartItem key={index} cartItem={item} onDelete={(val) => removeItem(val)} />
                    )}
                    contentContainerStyle={{ paddingBottom: 300 }} // Adds spacing at the bottom
                    ListFooterComponent={
                        cartItems.length>0?<GreenButton title="Checkout items" onPress={handleCheckoutClick} />:<></>
                    }
                    ListFooterComponentStyle={{ marginTop: 20, alignItems: "center" }}
                />
            )}
        </View>
    )
}