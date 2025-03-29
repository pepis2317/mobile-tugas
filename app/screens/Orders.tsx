import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, FlatList, RefreshControl, View , Text} from "react-native";
import { RootStackParamList } from "../../App";
import { useCallback, useEffect, useState } from "react";
import { OrderResponse } from "../../models/OrderResponse";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import OrderItem from "../../components/OrderItem";
type OrdersProps = NativeStackScreenProps<RootStackParamList, "Orders">
export default function Orders({ navigation }: OrdersProps) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const getOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/buyer/find-unconfirmed-order/${user?.userId}`)
            setOrders(response.data)
            setLoading(false)
            setRefreshing(false)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const onRefresh = useCallback(() => {
        setLoading(true)
        setRefreshing(true)
        getOrders()
    }, [])
    useEffect(() => {
        if (user?.userId) {
            getOrders()
        }
    }, [user?.userId])
    return (
        <View>
            {loading ? <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 32 }} /> :
                <>
                    {orders.length == 0 ?
                     <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>You have no orders.</Text>
                        <Text style={{ color: 'white', }}>Go spend your money or smth idk</Text>
                    </View> : <FlatList
                        data={orders}
                        keyExtractor={(item) => item.orderId}
                        numColumns={1}
                        renderItem={({ item, index }) => <OrderItem key={index} orderItem={item} />}
                        contentContainerStyle={{ paddingBottom: 200 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />}

                </>

            }
        </View>
    )
}