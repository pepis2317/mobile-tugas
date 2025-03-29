import { View, Text, Image, StyleSheet } from "react-native";
import { OrderResponse } from "../models/OrderResponse";
import { CircleCheck, ImageIcon } from "lucide-react-native";
import GreenButton from "./GreenButton";
import axios from "axios";
import { API_URL } from "../app/context/AuthContext";
import { useState } from "react";

export default function OrderItem({ orderItem }: { orderItem: OrderResponse }) {
    const [confirmed, setConfirmed] = useState(false);
    const confirmArrival = async () => {
        try {
            const response = await axios.put(`${API_URL}/buyer/confirm-order/${orderItem.orderId}`)
            return response.data
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const handleConfirmPress = async () => {
        const res = await confirmArrival()
        if (res.error) {
            console.log(res.msg)
        } else {
            setConfirmed(true)
        }
    }
    return (
        <View style={{ padding: 15, borderStyle: 'solid', borderColor: '#31363F', borderBottomWidth: 1, }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                {orderItem.item.thumbnail ? <Image src={orderItem.item.thumbnail} style={styles.thumbnail} /> : <View style={styles.thumbnail}><ImageIcon size={50} color={"#636C7C"} /></View>}
                <View>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{orderItem.item.itemName}</Text>
                    <Text style={{ color: 'white', fontSize: 10 }}>{orderItem.orderDate}</Text>
                    <Text style={{ color: '#5CCFA3', fontSize: 16, fontWeight: 'bold' }}>{orderItem.orderDetails}</Text>
                </View>
            </View>
            {orderItem.orderDetails == "Arrived" ?
                <View style={{marginTop:10}}>
                    {confirmed ?
                        <View style={styles.greyButton}>
                            <CircleCheck size={20} color={"#5CCFA3"}/>
                        </View>
                        :
                        <GreenButton title={"Confirm Arrival"} onPress={() => handleConfirmPress()} />
                    }

                </View>

                : <></>}



        </View>
    )
}
const styles = StyleSheet.create({
    greyButton: {
        padding: 15,
        backgroundColor: "#31363F",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    quantity: {
        flexDirection: 'row',
        backgroundColor: '#31363F',
        width: "100%",
        padding: 10,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    quantityButton: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        height: 32,
        backgroundColor: "#5CCFA3"
    },
    item: {
        alignItems: "center",
        width: "47%",
        margin: 5,
        overflow: 'hidden',
    },
    thumbnail: {
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#31363F',
        overflow: 'hidden',

        height: 90,
        borderRadius: 5,
    },
    info: {
        marginTop: 5,
        width: "100%",
        gap: 2
    }
});
