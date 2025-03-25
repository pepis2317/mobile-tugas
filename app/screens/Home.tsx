import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"
import { API_URL, useAuth } from "../context/AuthContext"
import { Button, View, Text, ScrollView, FlatList, StyleSheet, ActivityIndicator } from "react-native"
import axios from "axios"
import { useEffect, useState } from "react"
import { ItemResponse } from "../../models/ItemResponse"
import ItemCard from "../../components/ItemCard"
import SearchBar from "../../components/SearchBar"
import NavBar from "../../components/NavBar"

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">
export default function Home({ navigation }: HomeProps) {
    const { authState, onLogout } = useAuth()
    const [serachTerm, setSearchTerm] = useState("")
    const [itemData, setItemData] = useState<ItemResponse[]>([])
    const [loading, setLoading] = useState(true)
    const getItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/items/get-query?SearchTerm=${serachTerm}`)
            setItemData(response.data)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    useEffect(() => { 
        getItems()
        setLoading(false)
     }, [])
    const handleSearch = async () => {
        setLoading(true)
        await getItems()
        setLoading(false)
    }
    // useEffect(() => { console.log(itemData) }, [itemData])
    return (
        <View style={{ flex: 1, marginTop: 35 }}>
            <View style={{ padding: 5 }}>
                <SearchBar onChangeText={setSearchTerm} placeholder="Search..." onSubmitEditing={() => handleSearch()} returnKeyType="search" />
            </View>
            {loading ? <ActivityIndicator size="small" color="#636C7C" style={{marginTop:30}} />:

                <FlatList
                    data={itemData}
                    keyExtractor={(item) => item.itemId}
                    numColumns={2}
                    renderItem={({ item, index }) => <ItemCard key={index} item={item} />}
                    contentContainerStyle={{ paddingBottom: 200 }} // Adds spacing at the bottom
                />
            }

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
    },
    item: {
        width: "49%",
        marginBottom: 10,
        alignItems: "center",
    },
});
