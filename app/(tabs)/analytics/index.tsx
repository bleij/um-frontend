import {View, Text, ScrollView, Image, TouchableOpacity} from "react-native";
import {MotiView} from "moti";

export default function AnalyticsScreen() {
    return (
        <ScrollView
            style={{flex: 1, backgroundColor: "#FFFFFF"}}
            contentContainerStyle={{padding: 20, paddingBottom: 120}}
        >

            {/* DROPDOWN + BUTTON */}
            <View style={{flexDirection: "row", justifyContent: "flex-end", marginBottom: 20}}>
                <TouchableOpacity
                    style={{
                        borderWidth: 2,
                        borderColor: "#000",
                        paddingVertical: 8,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text style={{fontSize: 16, marginRight: 8}}>выберите</Text>
                    <Text style={{fontSize: 20}}>⌄</Text>
                </TouchableOpacity>
            </View>

            {/* PROFILE CARD */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#D3D3D3",
                    borderRadius: 20,
                    padding: 16,
                    marginBottom: 25,
                }}
            >
                {/* AVATAR */}
                <View
                    style={{
                        width: 110,
                        height: 110,
                        borderRadius: 80,
                        backgroundColor: "#3430B5",
                        marginRight: 20,
                    }}
                />

                {/* INFO */}
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 20, fontWeight: "600", marginBottom: 6}}>
                        Олжас
                    </Text>

                    <Text style={{fontSize: 14, opacity: 0.6, marginBottom: 10}}>
                        10 лет
                    </Text>

                    {/* PERIOD DROPDOWN */}
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor: "#000",
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                            borderRadius: 10,
                            alignSelf: "flex-start",
                        }}
                    >
                        <Text style={{fontSize: 14, opacity: 0.7}}>Период</Text>
                    </View>

                    {/* REFRESH ICON */}
                    <View style={{marginTop: 12}}>
                        <Text style={{fontSize: 22}}>⟳</Text>
                    </View>
                </View>
            </View>

            {/* CHART BLOCK */}
            <View
                style={{
                    backgroundColor: "#F2F2F2",
                    padding: 20,
                    borderRadius: 20,
                    marginBottom: 30,
                    height: 240,
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                {/* SIMPLE BAR CHART MOCK */}
                <View style={{flexDirection: "row", alignItems: "flex-end", gap: 20}}>
                    <View style={{width: 30, height: 60, backgroundColor: "#3430B5", borderRadius: 6}}/>
                    <View style={{width: 30, height: 100, backgroundColor: "#3430B5", borderRadius: 6}}/>
                    <View style={{width: 30, height: 150, backgroundColor: "#3430B5", borderRadius: 6}}/>
                    <View style={{width: 30, height: 190, backgroundColor: "#3430B5", borderRadius: 6}}/>
                </View>
            </View>

            {/* TEXT BLOCK */}
            <View
                style={{
                    flexDirection: "row",
                    gap: 20,
                    marginBottom: 40,
                }}
            >
                <View
                    style={{
                        width: "40%",
                        height: 140,
                        backgroundColor: "#D9D9D9",
                        borderRadius: 20,
                    }}
                />

                <View style={{flex: 1, justifyContent: "space-between"}}>
                    {[1, 2, 3, 4].map((_, i) => (
                        <View
                            key={i}
                            style={{
                                width: "100%",
                                height: 14,
                                backgroundColor: "#D3D3D3",
                                borderRadius: 6,
                            }}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}