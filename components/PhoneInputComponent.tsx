import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import PhoneInput, { ICountry, isValidPhoneNumber } from "react-native-international-phone-number";



export default function PhoneInputComponent({ defaultVal, onPhoneChange }: { defaultVal: string, onPhoneChange: (text: string) => void }) {
    const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
    const [inputValue, setInputValue] = useState("")
    const [defaultValue, setDefaultValue] = useState("");
    function handleInputValue(phoneNumber: string) {
        let phoneString = phoneNumber;

        if (phoneNumber === "") {
            onPhoneChange("");
        } else {
            phoneString = selectedCountry?.callingCode + phoneNumber;
            phoneString = phoneString.replace(/\s/g, '');
            onPhoneChange(phoneString.trim());
        }
        setInputValue(phoneNumber);
    }
    useEffect(() => {
        if (defaultVal) {
          setDefaultValue(defaultVal);
        }
      }, [defaultVal]);
    function handleSelectedCountry(country: ICountry) {
        setSelectedCountry(country);
    }

    return (
        <View>
            <PhoneInput
                theme={"dark"}
                phoneInputStyles={{
                    container: {
                        backgroundColor:'transparent',
                        borderWidth: 1,
                        borderColor: "#636C7C",
                        borderRadius: 5,
                        overflow:'hidden'
                        
                    },
                    flagContainer: {
                        backgroundColor: '#3D4149',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        justifyContent: 'center',
                    },
                    input:{
                        color:'white'
                    }
                }}
                modalStyles={{
                    modal: {
                        backgroundColor: '#31363F' ,
                        borderWidth: 0,
                    },
                    searchInput: {
                        backgroundColor: '#222831',
                        borderWidth: 0

                    },
                    countryButton: {
                        backgroundColor:'#3D4149',
                        borderWidth: 0
                    }
                }}
                value={inputValue}
                onChangePhoneNumber={handleInputValue}
                selectedCountry={selectedCountry}
                defaultCountry="ID"
                defaultValue={defaultValue}
                onChangeSelectedCountry={handleSelectedCountry}
                keyboardType="number-pad"
            />
            {selectedCountry != null && isValidPhoneNumber(inputValue, selectedCountry) ? <></> : <Text style={styles.darkText}>Please input valid phone number.</Text>}
        </View>
    );
}
const styles = StyleSheet.create({
    darkText: {
        color: 'white'
    },
    lightText: {
        color: 'black'
    },
    darkPhone: {

    }

})