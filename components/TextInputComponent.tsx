import { TextInput, View, StyleSheet, TextInputProps } from "react-native";

export default function TextInputComponent(props: TextInputProps) {
    return (
        <View>
            <TextInput style={styles.lighTextInput} placeholderTextColor={"#C4C4C4"} {...props}/>
        </View>
    )
}
const styles = StyleSheet.create({
    formContainer: {
        padding: 10,
        gap: 10
    },
    darkTextInput: {
        borderStyle: 'solid',
        borderColor: '#636C7C',
        borderWidth: 1,
        color:'white',
        height: 50,
        padding: 10,
        borderRadius: 5
    },
    lighTextInput: {
        backgroundColor:'white',
        color:"black",
        height: 50,
        padding: 10,
        borderRadius: 5
    }
})