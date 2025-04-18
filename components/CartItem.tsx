import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { CartItemResponse } from "../models/CartItemResponse";
import { ImageIcon, Minus, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import GreenButton from "./GreenButton";
import axios from "axios";
import { API_URL } from "../app/context/AuthContext";

export default function CartItem({ cartItem, onDelete, onButtonPress }: { cartItem: CartItemResponse, onDelete:(itemId:string)=>void, onButtonPress:()=>void }) {
    const [defaultValue, setDefaultValue] = useState(cartItem.quantity);
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [hasChanged, setHasChanged] = useState(false);

    const handleSubtract = () => {
        if (quantity > 0) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };
    const editQuantity = async ()=>{
        try {
            const response = await axios.put(`${API_URL}/edit-cart-item`,{
                cartItemId: cartItem.cartItemId,
                quantity: quantity
            })
            return response.data
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const deleteCartItem = async ()=>{
        try {
            const response = await axios.delete(`${API_URL}/delete-cart-item/${cartItem.cartItemId}`);
            return response.data;
        }catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const handleAdd = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    // useEffect to correctly update hasChanged
    useEffect(() => {
        setHasChanged(quantity !== defaultValue);
    }, [quantity, defaultValue]);
    const handleEditPress = async () => {
        await editQuantity()
        setDefaultValue(quantity)
        setHasChanged(false)
        onButtonPress()
    }
    const handleDeletePress = async ()=>{
        await deleteCartItem()
        onDelete(cartItem.item.itemId)
        onButtonPress()
    }
    return (
        <View style={{ padding: 15,         borderStyle: 'solid',
            borderColor: '#31363F',
            borderBottomWidth: 1,}}>
            <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                {cartItem.item.thumbnail ? <Image src={cartItem.item.thumbnail} style={styles.thumbnail} /> : <View style={styles.thumbnail}><ImageIcon size={50} color={"#636C7C"} /></View>}
                <View>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }} numberOfLines={2} ellipsizeMode="tail">{cartItem.item.itemName}</Text>
                    <Text style={{ color: 'white', fontSize:12 }}>${cartItem.item.hargaPerItem}</Text>
                    <Text style={{ color: 'white', fontSize:12 }}>Total Price: ${cartItem.item.hargaPerItem * quantity}</Text>
                </View>
            </View>
            <View style={styles.quantity}>
                <TouchableOpacity style={styles.quantityButton} onPress={() => handleSubtract()}>
                    <Minus size={20} color={"white"} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    {quantity}
                </Text>
                <TouchableOpacity style={styles.quantityButton} onPress={() => handleAdd()}>
                    <Plus size={20} color={"white"} />
                </TouchableOpacity>
            </View>
            {hasChanged ? 
            <View style={{marginTop:10}}>
                {quantity == 0 ?
                    <TouchableOpacity style={styles.redButton} onPress={()=>handleDeletePress()}>
                        <Text style={{ color: 'white' }}>Remove from cart</Text>
                    </TouchableOpacity>
                    :
                    <GreenButton title="Edit Quantity" onPress={() => handleEditPress()} />
                }
            </View> : <></>}


        </View>
    )
}
const styles = StyleSheet.create({
    redButton: {
        padding: 15,
        backgroundColor: "#f56565",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    quantity: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: '#636C7C',
        marginTop:10,
        borderWidth: 1,

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
