import { ScrollView, Text, Image, View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageIcon, Minus, Plus } from "lucide-react-native";
import { MessageCircle } from 'lucide-react-native';
import React, { useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import { ShopResponse } from "../../models/ShopResponse";
import GreenButton from "../../components/GreenButton";
import TextInputComponent from "../../components/TextInputComponent";
type EditItemProps = NativeStackScreenProps<RootStackParamList, "EditItem">
const screenWidth = Dimensions.get("window").width;
export default function EditItem({ navigation, route }: EditItemProps) {
    const { user } = useAuth()
    const { item } = route.params
    const [images, setImages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(item.itemName)
    const [quantity, setQuantity] = useState(item.quantity.toString())
    const [price, setPrice] = useState(item.hargaPerItem.toString())
    const [description, setDescription] = useState(item.itemDesc)


    const getImages = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-images-for-item?ItemId=${item.itemId}`)
            const imageUrls = response.data.map((image: any) => image.image);
            setImages(imageUrls);
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    useEffect(() => {
        getImages()
    }, [user?.userId])
    return (
        <ScrollView>
            {images.length > 0 ? <Carousel images={images} /> : <View style={styles.imageContainer}><ImageIcon size={50} color={"#636C7C"} /></View>}
            <View style={{ padding: 15, marginBottom: 300, paddingTop: 10 }}>
                <View style={styles.info}>
                    <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Name</Text>
                    <TextInputComponent placeholder="item Name" onChangeText={setName} value={name} />
                    <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Quantity</Text>
                    <TextInputComponent placeholder="item Quantity" onChangeText={setQuantity} inputMode="numeric" value={quantity} />
                    <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Price</Text>
                    <TextInputComponent placeholder="item Price" onChangeText={setPrice} inputMode="numeric" value={price} />
                    <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Description</Text>
                    <TextInputComponent placeholder="item Description" onChangeText={setDescription} value={description} />
                    <GreenButton title="Edit Product" />
                    <TouchableOpacity style={styles.redButton}>
                        <Text style={{ color: 'white' }}>Remove from cart</Text>
                    </TouchableOpacity>

                    {/* <Text style={{ color: "white", fontWeight: 'bold', fontSize: 24 }} numberOfLines={2} ellipsizeMode="tail">{item.itemName}</Text> */}
                    {/* <Text style={{ color: "white" }}>{item.quantity} available</Text>
                    <View style={styles.priceContainer}>
                        <Text style={{ color: "white", fontSize: 16 }}>${item.hargaPerItem}</Text>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Description</Text>
                        <Text style={{ color: "white" }}>{item.itemDesc}</Text>
                    </View> */}

                </View>

            </View>

        </ScrollView>
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

    priceContainer: {
        padding: 5,
        borderStyle: 'dashed',
        borderColor: '#636C7C',
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    quantity: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: '#636C7C',

        marginBottom: 20,
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
    shopInfo: {
        borderStyle: 'solid',
        borderColor: '#636C7C',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    contact: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5CCFA3',
        padding: 10,
        borderRadius: 5
    },
    imageContainer: {
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#31363F',
        overflow: 'hidden',
        height: screenWidth,
        borderRadius: 5,
    },
    info: {
        width: "100%",

        gap: 2
    },
    pfp: {
        borderRadius: 100,
        width: 50,
        height: 50
    },
});
