import { Star, StarHalf } from "lucide-react-native";
import { View, StyleSheet } from "react-native";

export default function StarRating({stars}: {stars:number}) {
    return (
        <View style={styles.container}>
            {/* Empty Stars */}
            <View style={styles.starContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`empty-${index}`} color="#111" fill="#111" strokeWidth={0} size={20} />
                ))}
            </View>

            {/* Filled Stars */}
            <View style={[styles.starContainer, styles.ratingOverlay]}>
                {Array.from({ length: stars }).map((_, index) => (
                    <Star key={index} color="yellow" fill="gold" strokeWidth={0} size={20} />
                ))}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: "relative",
        justifyContent: "center",

    },
    starContainer: {
        flexDirection: "row",
    },
    ratingOverlay: {
        position: 'absolute',
        zIndex: 1,
    },
});