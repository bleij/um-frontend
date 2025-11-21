import {View, Text, ScrollView, TouchableOpacity, Image} from "react-native";
import {MotiView} from "moti";

export default function HomeScreen() {
    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 60,
                paddingBottom: 120,
            }}
        >

            {/* greeting */}
            <MotiView
                from={{opacity: 0, translateY: -10}}
                animate={{opacity: 1, translateY: 0}}
                transition={{duration: 400}}
                style={{marginBottom: 20}}
            >
                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: "700",
                        color: "#000",
                    }}
                >
                    Приветствую, Джангир
                </Text>
            </MotiView>

            {/* main card */}
            <MotiView
                from={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 400, delay: 100}}
                style={{
                    backgroundColor: "#8D88D9",
                    height: 160,
                    borderRadius: 20,
                    marginBottom: 40,
                }}
            />

            {/* section header */}
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "700",
                    marginBottom: 16,
                }}
            >
                Активности
            </Text>

            {/* activity item #1 */}
            <MotiView
                from={{opacity: 0, translateY: 20}}
                animate={{opacity: 1, translateY: 0}}
                transition={{duration: 350, delay: 150}}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >
                <View
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: 999,
                        backgroundColor: "#3F3C9F",
                        opacity: 0.9,
                        marginRight: 16,
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        height: 70,
                        borderWidth: 2,
                        borderColor: "#3F3C9F",
                        borderRadius: 16,
                    }}
                />
            </MotiView>

            {/* activity item #2 */}
            <MotiView
                from={{opacity: 0, translateY: 20}}
                animate={{opacity: 1, translateY: 0}}
                transition={{duration: 350, delay: 220}}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >
                <View
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: 999,
                        backgroundColor: "#3F3C9F",
                        opacity: 0.9,
                        marginRight: 16,
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        height: 70,
                        borderWidth: 2,
                        borderColor: "#3F3C9F",
                        borderRadius: 16,
                    }}
                />
            </MotiView>

        </ScrollView>
    );
}