import { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, RefreshControl } from "react-native";

import { ItemResponse } from "../../models/ItemResponse";
import { API_URL } from "../context/AuthContext";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import ItemCard from "../../components/ItemCard";
import StarRating from "../../components/StarRating";
import { UserResponse } from "../../models/UserResponse";
import ChatWithUser from "../../components/ChatWithUser";
type ShopProps = NativeStackScreenProps<RootStackParamList, "Shop">
export default function Shop({ route }: ShopProps) {
    const { shop } = route.params
    const [searchTerm, setSearchTerm] = useState("")
    const [itemData, setItemData] = useState<ItemResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [owner, setOwner] = useState<UserResponse>()
    const getItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/items/get-query?SearchTerm=${searchTerm}&ShopId=${shop.shopId}`)
            setItemData(response.data)
            setLoading(false)
            setRefreshing(false)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const getOwner = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-user-by-id?UserId=${shop.ownerId}`)
            setOwner(response.data)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const onRefresh = useCallback(() => {
        setLoading(true)
        setRefreshing(true)
        getItems()
    }, [])
    useEffect(() => {
        getItems()
        getOwner()
    }, [])
    const handleSearch = async () => {
        setLoading(true)
        await getItems()
        setLoading(false)
    }

    return (
        <View>
            <View style={{ padding: 5, paddingLeft: 10, paddingRight: 10 }}>
                <SearchBar onChangeText={setSearchTerm} placeholder="Search in shop..." onSubmitEditing={() => handleSearch()} returnKeyType="search" />
            </View>
            {loading ? <ActivityIndicator size="small" color="#636C7C" style={{marginTop:32}}/> :

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
                                <Text style={{ color: "white" }}>Contact the owner:</Text>
                                {owner ? <ChatWithUser user={owner} /> : <></>}


                            </View>

                        </View>
                    }
                    data={itemData}
                    keyExtractor={(item) => item.itemId}
                    numColumns={2}
                    renderItem={({ item, index }) => <ItemCard key={index} item={item} />}
                    contentContainerStyle={{ paddingBottom: 300 }} // Adds spacing at the bottom
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            }

        </View>
    )
}