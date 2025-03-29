import { ActivityIndicator, FlatList, RefreshControl, View, StyleSheet, Text } from "react-native";
import CartItem from "../../components/CartItem";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { CartItemResponse } from "../../models/CartItemResponse";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import GreenButton from "../../components/GreenButton";
type CartProps = NativeStackScreenProps<RootStackParamList, "Cart">
export default function Cart({ navigation }: CartProps) {
    const { user } = useAuth()
    const [cartItems, setCartItems] = useState<CartItemResponse[]>([])
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false)
    const [grandTotal, setGrandTotal] = useState(0)
    const getCart = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-incomplete-cart?UserId=${user?.userId}`)
            setCartItems(response.data)
            setLoading(false)
            setRefreshing(false)
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
                navigation.navigate("Orders")
            }

        }
    }
    const onRefresh = useCallback(() => {
        setLoading(true)
        setRefreshing(true)
        getCart()
    }, [])

    useEffect(() => {
        if (user?.userId) {
            getCart()

        }
    }, [user?.userId])
    useEffect(()=>{
        let total = 0
        cartItems.map((item)=>{
            total += item.item.hargaPerItem * item.quantity
        })
        setGrandTotal(total)
    },[cartItems])
    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="small" color="#636C7C" style={{marginTop:32}}/>
            ) : (
                <>
                {cartItems.length==0?
                <View style={{justifyContent:'center', alignItems:'center', padding:20}}>
                    <Text style={{ color: 'white', fontWeight:'bold', fontSize:16}}>Your cart is empty.</Text>
                    <Text style={{ color: 'white',}}>Go spend your money or smth idk</Text>
                </View>
                
                :<FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.item.itemId}
                    numColumns={1}
                    renderItem={({ item, index }) => (
                        <CartItem key={index} cartItem={item} onDelete={(val) => removeItem(val)} onButtonPress={onRefresh} />
                    )}
                    contentContainerStyle={{ paddingBottom: 300 }} // Adds spacing at the bottom

                    ListFooterComponentStyle={{ marginTop: 20, alignItems: "center" }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />}
                </>
                
                
            )}
            {cartItems.length > 0 ?
                <View style={styles.bottomCheckout}>
                    <Text style={{ color: 'white', fontWeight:'bold'}}>Grand Total</Text>
                    <Text style={{ color: 'white', marginBottom:10}}>${grandTotal}</Text>
                    <GreenButton title="Checkout items" onPress={handleCheckoutClick} />
                </View> :
                <></>}
            
        </View>
    )
}
const styles = StyleSheet.create({
    bottomCheckout:{
        position:'absolute',
        backgroundColor:'#31363F',
        bottom:50,
        width:"100%",
        padding:15
    }
})