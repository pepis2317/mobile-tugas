import { ScrollView, Text, Image, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
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
type ItemDetailProps = NativeStackScreenProps<RootStackParamList, "ItemDetail">
const screenWidth = Dimensions.get("window").width;
export default function ItemDetail({ navigation, route }: ItemDetailProps) {
    const { user } = useAuth()
    const { item } = route.params
    const [images, setImages] = useState<string[]>([])
    const [shopData, setShopData] = useState<ShopResponse>()
    const [ownerPfp, setOwnerPfp] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [inCart, setInCart] = useState(false)
    const checkInCart = async () => {
        try {
            const response = await axios.get(`${API_URL}/check-cart/${user?.userId}/${item.itemId}`)
            setInCart(response.data)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
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
    const getOwner = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-user-by-id?UserId=${shopData?.ownerId}`)
            setOwnerPfp(response.data.userProfile)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const getShopData = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-shop/${item.shopId}`)
            setShopData(response.data)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const addToCart = async () => {
        try {
            const response = await axios.post(`${API_URL}/post-cart-item`, {
                userId: user?.userId,
                itemId: item.itemId,
                quantity: quantity
            })
            return response.data
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const handleAddPress = async () => {
        if (user?.userId) {
            const response = await addToCart()
            if (response.error) {
                console.log(response)
            } else {
                navigation.goBack()
            }
        }

    }
    useEffect(() => {
        getImages()
        getShopData()
        if (user?.userId) {
            checkInCart()
        }
    }, [user?.userId])
    useEffect(() => {
        if (shopData?.ownerId) {
            getOwner()
        }

    }, [shopData])
    return (
        <ScrollView>
            {images.length > 0 ? <Carousel images={images} /> : <View style={styles.imageContainer}><ImageIcon size={50} color={"#636C7C"} /></View>}
            <View style={{ padding: 10, gap: 10, marginBottom: 300 }}>
                <View style={styles.info}>
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 24 }} numberOfLines={2} ellipsizeMode="tail">{item.itemName}</Text>
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 20 }}>${item.hargaPerItem}</Text>
                    <Text style={{ color: "white" }}>{item.quantity} available</Text>
                    <Text style={{ color: "white" }}>{item.itemDesc}</Text>
                </View>
                {shopData ?
                    <TouchableOpacity style={styles.shopInfo} onPress={() => navigation.navigate("Shop", { shop: shopData })}>
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                            <Image source={ownerPfp != "" ? { uri: ownerPfp } : require('../../assets/default.jpg')} style={styles.pfp} />
                            <View>
                                <Text style={{ color: "white", fontWeight: 'bold', fontSize: 16 }} numberOfLines={2} ellipsizeMode="tail">{shopData.shopName}</Text>
                                <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode="tail">Located in {shopData.address}</Text>
                            </View>
                        </View>
                        <View style={{ gap: 5, flexDirection: "row" }}>
                            <TouchableOpacity style={styles.contact}>
                                <MessageCircle color={"white"} size={24} />
                            </TouchableOpacity>
                        </View>

                    </TouchableOpacity> : <></>}
                {inCart ? <GreenButton title="View in cart"/> :
                    <View>
                        <View style={styles.quantity}>
                            <TouchableOpacity style={styles.quantityButton} onPress={() => quantity > 1 ? setQuantity(quantity - 1) : setQuantity(quantity)}>
                                <Minus size={20} color={"white"} />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                                {quantity}
                            </Text>
                            <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
                                <Plus size={20} color={"white"} />
                            </TouchableOpacity>
                        </View>

                        <GreenButton title={"Add to cart"} onPress={() => handleAddPress()} />
                    </View>
                }


            </View>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
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
    shopInfo: {
        borderStyle: 'solid',
        borderColor: '#636C7C',
        borderWidth: 1,
        borderRadius: 5,
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
