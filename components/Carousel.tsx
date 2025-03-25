import React, { useEffect, useRef, useState } from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView, View, Image, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel"
const screenWidth = Dimensions.get("window").width;

export default function Carousel({ images = [] }: { images?: string[] }) {
    const [index, setIndex] = useState<number>(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const handleScroll = (event:any) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        if (newIndex !== index) {
            setIndex(newIndex); // Update the state
        }
    };
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    ref={scrollViewRef}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    style={{
                        width: '100%',
                        height: screenWidth,
                    }}
                >
                    {images.map((image, index) => (
                        <View
                            key={index}
                            style={{
                                width: screenWidth,
                                height: screenWidth,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                src={image}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    resizeMode: 'cover',
                                }} />
                        </View>
                    ))}
                </ScrollView>
                <View style={{ position:'absolute', bottom:0}}>
                    <AnimatedDotsCarousel
                        length={images.length}
                        scrollableDotsConfig={{
                            setIndex,
                            onNewIndex: (newIndex) => {
                                scrollViewRef?.current?.scrollTo?.({
                                    x: newIndex * screenWidth,
                                    animated: true,
                                });
                            },
                            containerBackgroundColor: 'rgba(230,230,230, 0.5)',
                            container: {
                                alignItems: 'center',
                                borderRadius: 15,
                                height: 30,
                                justifyContent: 'center',
                                paddingHorizontal: 15,
                            }
                        }}
                        currentIndex={index}
                        maxIndicators={4}
                        interpolateOpacityAndColor={true}
                        activeIndicatorConfig={{
                            color: 'white',
                            margin: 3,
                            opacity: 1,
                            size: 8,
                        }}
                        inactiveIndicatorConfig={{
                            color: 'white',
                            margin: 3,
                            opacity: 0.5,
                            size: 8,
                        }}
                        decreasingDots={[
                            {
                                config: { color: 'white', margin: 3, opacity: 0.5, size: 6 },
                                quantity: 1,
                            },
                            {
                                config: { color: 'white', margin: 3, opacity: 0.5, size: 4 },
                                quantity: 1,
                            },
                        ]}
                    />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#31363F',
    },
});