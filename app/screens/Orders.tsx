import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, FlatList, View } from "react-native";
import { RootStackParamList } from "../../App";
import { useEffect, useState } from "react";
import { OrderResponse } from "../../models/OrderResponse";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import OrderItem from "../../components/OrderItem";
type OrdersProps = NativeStackScreenProps<RootStackParamList, "Orders">
export default function Orders({ navigation }: OrdersProps) {
    const {user} = useAuth()
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const getOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/buyer/find-unconfirmed-order/${user?.userId}`)
            setOrders(response.data)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    useEffect(()=>{
        if(user?.userId){
            getOrders()
        }
    },[user?.userId])
    return (
        <View>
            {loading ? <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 30 }} /> :
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.orderId}
                    numColumns={1}
                    renderItem={({ item, index }) => <OrderItem key={index} orderItem={item} />}
                    contentContainerStyle={{ paddingBottom: 200 }} // Adds spacing at the bottom
                />
            }
        </View>
    )
}