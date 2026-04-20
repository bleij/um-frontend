import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Modal, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SHADOWS, RADIUS, SPACING } from "../../../constants/theme";
import MemoryGame from "../../../components/games/MemoryGame";
import Game2048 from "../../../components/games/Game2048";
import Minesweeper from "../../../components/games/Minesweeper";
import Sudoku from "../../../components/games/Sudoku";

const { width } = Dimensions.get("window");

const GAMES = [
    { id: 'memory', title: 'Пары', icon: 'brain', color: '#6C5CE7', desc: 'Тренируй зрительную память', points: '+20 IQ' },
    { id: 'sudoku', title: 'Судоку', icon: 'grid', color: '#3B82F6', desc: 'Математическая логика', points: '+50 IQ' },
    { id: 'minesweeper', title: 'Сапер', icon: 'target', color: '#EF4444', desc: 'Стратегическое мышление', points: '+40 IQ' },
    { id: '2048', title: '2048', icon: 'hash', color: '#F59E0B', desc: 'Складывай числа', points: '+30 IQ' },
];

export default function GamesLobby() {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [score, setScore] = useState(1240);

    const handleFinishGame = (points: number) => {
        setScore((s: number) => s + points);
        setTimeout(() => setSelectedGame(null), 2000);
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LinearGradient
                colors={['#6C5CE7', '#8B7FE8']}
                style={{ paddingBottom: 32, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
            >
                <SafeAreaView edges={["top"]}>
                    <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <View>
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Игровой Центр</Text>
                                <Text style={{ color: 'white', fontSize: 24, fontWeight: '900' }}>Развивайся играя</Text>
                            </View>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
                                <Text style={{ color: 'white', fontWeight: '900' }}>{score} IQ</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Daily Challenge Card */}
                <TouchableOpacity style={{ marginBottom: 32 }}>
                    <LinearGradient
                        colors={['#1F2937', '#111827']}
                        style={{ padding: 24, borderRadius: 32, ...SHADOWS.md }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ backgroundColor: '#F59E0B', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 12 }}>
                                    <Text style={{ color: 'white', fontSize: 10, fontWeight: '900' }}>ЧЕЛЛЕНДЖ ДНЯ</Text>
                                </View>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: '900', marginBottom: 4 }}>Турнир по Саперу</Text>
                                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Приз: 500 монет + редкий бейдж</Text>
                            </View>
                            <View style={{ width: 60, height: 60, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Feather name="award" size={32} color="#F59E0B" />
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={{ fontSize: 18, fontWeight: '900', color: COLORS.foreground, marginBottom: 20 }}>Тренажеры когнитивных навыков</Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
                    {GAMES.map((game) => (
                        <TouchableOpacity
                            key={game.id}
                            onPress={() => !game.locked && setSelectedGame(game.id)}
                            style={{ 
                                width: (width - 64) / 2, 
                                backgroundColor: 'white', 
                                padding: 20, 
                                borderRadius: 32, 
                                ...SHADOWS.sm,
                                opacity: game.locked ? 0.7 : 1
                            }}
                        >
                            <View style={{ width: 48, height: 48, backgroundColor: game.color + '10', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <Feather name={game.icon as any} size={24} color={game.color} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: '900', color: COLORS.foreground, marginBottom: 4 }}>{game.title}</Text>
                            <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginBottom: 12 }}>{game.desc}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: game.color }}>{game.points}</Text>
                                {game.locked && <Feather name="lock" size={12} color={COLORS.mutedForeground} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Leaderboard Preview */}
                <View style={{ marginTop: 40, backgroundColor: 'white', padding: 24, borderRadius: 32, ...SHADOWS.sm }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '900', color: COLORS.foreground }}>Зал славы</Text>
                        <TouchableOpacity>
                            <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Весь рейтинг</Text>
                        </TouchableOpacity>
                    </View>
                    {[
                        { name: 'Алина Каримова', score: 25400, rank: 1, avatar: '👧' },
                        { name: 'Игорь Смирнов', score: 21200, rank: 2, avatar: '👦' },
                        { name: 'Мария Пак', score: 18900, rank: 3, avatar: '👩' },
                    ].map((user) => (
                        <View key={user.rank} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ width: 24, fontWeight: '900', color: COLORS.mutedForeground }}>{user.rank}</Text>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.muted, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                <Text style={{ fontSize: 20 }}>{user.avatar}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: '700', color: COLORS.foreground }}>{user.name}</Text>
                                <Text style={{ fontSize: 11, color: COLORS.mutedForeground }}>{user.score} IQ</Text>
                            </View>
                            {user.rank === 1 && <Feather name="star" size={16} color="#F59E0B" />}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Game Modal */}
            <Modal visible={!!selectedGame} animationType="slide">
                <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.background }}>
                    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                        <View style={{ paddingTop: Platform.OS === 'android' ? 20 : 0 }}>
                            <View style={{ padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setSelectedGame(null)}>
                                <Feather name="chevron-left" size={32} color={COLORS.foreground} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 20, fontWeight: '900' }}>
                                {GAMES.find(g => g.id === selectedGame)?.title}
                            </Text>
                            <View style={{ width: 32 }} />
                            </View>
                        </View>
                        
                        {selectedGame === 'memory' && <MemoryGame onFinish={handleFinishGame} />}
                        {selectedGame === '2048' && <Game2048 onFinish={handleFinishGame} />}
                        {selectedGame === 'minesweeper' && <Minesweeper onFinish={handleFinishGame} />}
                        {selectedGame === 'sudoku' && <Sudoku onFinish={handleFinishGame} />}
                    </SafeAreaView>
                </GestureHandlerRootView>
            </Modal>
        </View>
    );
}
