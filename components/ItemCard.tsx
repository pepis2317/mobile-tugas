import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ItemResponse } from "../models/ItemResponse";
import { ImageIcon } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
type NavigationType = NativeStackNavigationProp<RootStackParamList>;
export default function ItemCard({ item}: {item: ItemResponse }) {
    const navigation = useNavigation<NavigationType>();
    return (
        <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate("ItemDetail", {item: item} )}>
            {item.thumbnail ? <Image src={item.thumbnail} style={styles.thumbnail} /> : <View style={styles.thumbnail}><ImageIcon size={50} color={"#636C7C"} /></View>}
            <View style={styles.info}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }} numberOfLines={2} ellipsizeMode="tail">{item.itemName == "G" ? "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt, illum?" : item.itemName} </Text>

                <Text style={{ color: "white", fontSize: 10 }}>{item.quantity} available</Text>
                <Text style={{ color: "white" }}>${item.hargaPerItem}</Text>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    item: {
        alignItems: "center",
        width: "47%",
        margin: 5,
        overflow: 'hidden',
    },
    thumbnail: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#31363F',
        overflow: 'hidden',
        height: 200,
        borderRadius:5,
    },
    info: {
        marginTop:5,
        width: "100%",
        gap: 2
    }
});
