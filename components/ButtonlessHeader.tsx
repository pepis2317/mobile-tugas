import { Container } from "lucide-react-native";
import { View, Text, StyleSheet } from "react-native";

export default function ButtonlessHeader({ title }: { title: string }) {
    return (
        <View style={ styles.container}>
            <Text style={{color:'white', fontWeight:'bold'}}>{title}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#222831",
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})