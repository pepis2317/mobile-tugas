import { TextInput, View, StyleSheet, TextInputProps } from "react-native";

export default function TextInputComponent(props: TextInputProps) {
    return (
        <TextInput style={styles.darkTextInput} placeholderTextColor={"#C4C4C4"} {...props}/>
    )
}
const styles = StyleSheet.create({
    formContainer: {
        width:'100%',
        padding: 10,
        gap: 10
    },
    darkTextInput: {
        width:'100%',
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