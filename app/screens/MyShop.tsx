import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { RootStackParamList } from "../../App";
import { useCallback, useEffect, useState } from "react";
import { ShopResponse } from "../../models/ShopResponse";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import SearchBar from "../../components/SearchBar";
import StarRating from "../../components/StarRating";
import ItemCard from "../../components/ItemCard";
import ChatWithUser from "../../components/ChatWithUser";
import { UserResponse } from "../../models/UserResponse";
import { ItemResponse } from "../../models/ItemResponse";
import GreenButton from "../../components/GreenButton";
import MyItemCard from "../../components/MyItemCard";
import TextInputComponent from "../../components/TextInputComponent";
import { useFocusEffect } from "@react-navigation/native";

type MyShopProps = NativeStackScreenProps<RootStackParamList, "MyShop">
export default function MyShop({ navigation }: MyShopProps) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [shop, setShop] = useState<ShopResponse | null>()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [address, setAddress] = useState("")
    const [itemData, setItemData] = useState<ItemResponse[]>([])
    const [changed, setChanged] = useState(false)
    const getShop = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-shop-by-owner/${user?.userId}`)
            if (!response.data) {
                setShop(null)
                setLoading(false)
                setRefreshing(false)
            } else {
                setShop(response.data);
            }

        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const updateShop = async () => {
        try {
            const response = await axios.put(`${API_URL}/edit-shop/${shop?.shopId}`, {
                shopName: name,
                description: description,
                address: address
            })
            return response.data

        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const handleShopUpdate = async () => {

        const result = await updateShop()
        if (result.error) {
            console.log(result.msg)
        } else {
            onRefresh()
        }
    }
    const getItems = async () => {
        try {
            if (shop != null) {
                const response = await axios.get(`${API_URL}/items/get-query?SearchTerm=${searchTerm}&ShopId=${shop.shopId}`)

                setItemData(response.data)

                setLoading(false)
                setRefreshing(false)
            }
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    useFocusEffect(
        useCallback(() => {
            setLoading(true)
            setRefreshing(true)
            getShop()
            getItems()
        }, [])
    );

    const onRefresh = useCallback(() => {
        setLoading(true)
        setRefreshing(true)
        getShop()
        getItems()
    }, [])
    useEffect(() => {
        if (user?.userId) {
            getShop()
        }

    }, [user?.userId])
    useEffect(() => {
        if (shop?.shopId) {
            getItems();
            setName(shop.shopName);
            setDescription(shop.description);
            setAddress(shop.address);
        }
    }, [shop]);

    useEffect(() => {
        if (!shop) return;
        const hasChanged =
            shop.shopName !== name ||
            shop.address !== address ||
            shop.description !== description;

        setChanged(hasChanged);
    }, [name, description, address]);

    const handleSearch = async () => {
        setLoading(true)
        await getItems()
        setLoading(false)
    }
    if (loading) {
        return (
            <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 32 }} />
        )
    }
    if (shop == null) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>You don't have a shop</Text>
                <Text style={{ color: "white", marginBottom: 16 }}>Create your shop here vro</Text>
                <GreenButton title={"Create Shop"} onPress={() => navigation.navigate("CreateShop")} />
            </View>
        )
    }
    return (

        <View>
            <View style={{ padding: 5, paddingLeft: 10, paddingRight: 10 }}>
                <SearchBar onChangeText={setSearchTerm} placeholder="Search in shop..." onSubmitEditing={() => handleSearch()} returnKeyType="search" />
            </View>
            {loading ? <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 32 }} /> :
                <FlatList
                    ListHeaderComponent={
                        <View style={{ padding: 5 }}>
                            <View style={{ padding: 5, gap: 10, }}>
                                <View style={{ gap: 5 }}>
                                    <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Shop Name</Text>
                                    <TextInputComponent placeholder="Shop Name" onChangeText={setName} value={name} />
                                    <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Shop Description</Text>
                                    <TextInputComponent placeholder="Shop Description" onChangeText={setDescription} value={description} />
                                    <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>Shop Address</Text>
                                    <TextInputComponent placeholder="Shop Address" onChangeText={setAddress} value={address} />

                                    <StarRating stars={shop.rating} />
                                </View>
                                {changed ? <GreenButton title={"Save Shop Changes"} onPress={handleShopUpdate} /> : <></>}


                                <GreenButton title={"Add New Item"} onPress={() => navigation.navigate("CreateItem", { shop: shop })} />
                            </View>

                        </View>
                    }
                    data={itemData}
                    keyExtractor={(item) => item.itemId}
                    numColumns={2}
                    renderItem={({ item, index }) => <MyItemCard key={index} item={item} />}
                    contentContainerStyle={{ paddingBottom: 300 }} // Adds spacing at the bottom
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            }

        </View>
    )
}