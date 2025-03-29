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

type MyShopProps = NativeStackScreenProps<RootStackParamList, "MyShop">
export default function MyShop({ navigation }: MyShopProps) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [shop, setShop] = useState<ShopResponse | null>()
    const [owner, setOwner] = useState<UserResponse>()
    const [itemData, setItemData] = useState<ItemResponse[]>([])
    const getShop = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-shop-by-owner/${user?.userId}`)
            if (!response.data) {
                setShop(null)// Ensure state reflects the absence of a shop
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
            getItems()
        }

    }, [shop])
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
            <View>
                <Text>Nigga bitch ass</Text>
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
                                    <Text style={{ color: "white", fontSize: 20, fontWeight: 'bold' }}>{shop.shopName}</Text>
                                    <Text style={{ color: "white" }}>{shop.description}</Text>
                                    <Text style={{ color: "white" }}>{shop.address}</Text>
                                    <StarRating stars={shop.rating} />
                                </View>
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