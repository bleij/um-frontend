import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { COLORS, SHADOWS, RADIUS } from '../../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const GRID_SIZE = 4;
const CELL_MARGIN = 10;
const CELL_SIZE = (width - 60 - (GRID_SIZE + 1) * CELL_MARGIN) / GRID_SIZE;

const TILE_COLORS: Record<number, string> = {
    2: '#EEE4DA',
    4: '#EDE0C8',
    8: '#F2B179',
    16: '#F59563',
    32: '#F67C5F',
    64: '#F65E3B',
    128: '#EDCF72',
    256: '#EDCC61',
    512: '#EDC850',
    1024: '#EDC53F',
    2048: '#EDC22E',
};

const TEXT_COLORS: Record<string | number, string> = {
    2: '#776E65',
    4: '#776E65',
    default: 'white',
};

export default function Game2048({ onFinish }: { onFinish: (score: number) => void }) {
    const [grid, setGrid] = useState<number[][]>(Array(4).fill(0).map(() => Array(4).fill(0)));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        let newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
        newGrid = addRandomTile(newGrid);
        newGrid = addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
    };

    const addRandomTile = (currentGrid: number[][]) => {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length === 0) return currentGrid;
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const newGrid = currentGrid.map(row => [...row]);
        newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
        return newGrid;
    };

    const transpose = (m: number[][]) => m[0].map((_, i) => m.map(r => r[i]));
    const reverse = (m: number[][]) => m.map(row => [...row].reverse());

    const move = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return;

        let tempGrid = grid.map(row => [...row]);
        let moved = false;
        let newScore = score;

        // Transform grid so move is always "Left"
        if (direction === 'up' || direction === 'down') tempGrid = transpose(tempGrid);
        if (direction === 'right' || direction === 'down') tempGrid = reverse(tempGrid);

        // Process Left
        for (let r = 0; r < 4; r++) {
            let row = tempGrid[r].filter(val => val !== 0);
            let newRow = [];
            for (let i = 0; i < row.length; i++) {
                if (i < row.length - 1 && row[i] === row[i + 1]) {
                    newRow.push(row[i] * 2);
                    newScore += row[i] * 2;
                    i++;
                    moved = true;
                } else {
                    newRow.push(row[i]);
                }
            }
            while (newRow.length < 4) newRow.push(0);
            if (JSON.stringify(tempGrid[r]) !== JSON.stringify(newRow)) moved = true;
            tempGrid[r] = newRow;
        }

        // Transform back
        if (direction === 'right' || direction === 'down') tempGrid = reverse(tempGrid);
        if (direction === 'up' || direction === 'down') tempGrid = transpose(tempGrid);

        if (moved) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const gridWithNewTile = addRandomTile(tempGrid);
            setGrid(gridWithNewTile);
            setScore(newScore);
            checkGameOver(gridWithNewTile);
        }
    };

    const checkGameOver = (currentGrid: number[][]) => {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentGrid[r][c] === 0) return;
            }
        }
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (c < 3 && currentGrid[r][c] === currentGrid[r][c + 1]) return;
                if (r < 3 && currentGrid[r][c] === currentGrid[r + 1][c]) return;
            }
        }
        setGameOver(true);
        onFinish(score);
    };

    const swipeGesture = React.useMemo(() => Gesture.Pan()
        .onEnd((e) => {
            const { translationX, translationY } = e;
            const absX = Math.abs(translationX);
            const absY = Math.abs(translationY);

            if (Math.max(absX, absY) < 30) return;

            if (absX > absY) {
                if (translationX > 0) runOnJS(move)('right');
                else runOnJS(move)('left');
            } else {
                // translationY < 0 is Swipe UP (finger moving up)
                // translationY > 0 is Swipe DOWN (finger moving down)
                if (translationY < 0) runOnJS(move)('up');
                else runOnJS(move)('down');
            }
        }), [move]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>SCORE</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                </View>
                <TouchableOpacity onPress={initGame} style={styles.resetBtn}>
                    <Text style={styles.resetBtnText}>NEW GAME</Text>
                </TouchableOpacity>
            </View>

            <GestureDetector gesture={swipeGesture}>
                <View style={styles.board}>
                    {grid.map((row, r) => (
                        <View key={r} style={styles.row}>
                            {row.map((cell, c) => (
                                <View key={c} style={[styles.cell, { backgroundColor: cell ? TILE_COLORS[cell] || '#3C3A32' : '#CDC1B4' }]}>
                                    {cell !== 0 && (
                                        <Text style={[styles.cellText, { color: TEXT_COLORS[cell] || TEXT_COLORS.default, fontSize: cell > 100 ? 24 : 32 }]}>
                                            {cell}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    ))}
                    {gameOver && (
                        <View style={styles.overlay}>
                            <Text style={styles.gameOverText}>Game Over!</Text>
                            <TouchableOpacity onPress={initGame} style={styles.overlayBtn}>
                                <Text style={styles.overlayBtnText}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </GestureDetector>
            
            <Text style={styles.hint}>Swipe to move tiles</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    scoreContainer: {
        backgroundColor: '#BBADA0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    scoreLabel: {
        color: '#EEE4DA',
        fontWeight: 'bold',
        fontSize: 10,
    },
    scoreValue: {
        color: 'white',
        fontSize: 20,
        fontWeight: '900',
    },
    resetBtn: {
        backgroundColor: '#8F7A66',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: RADIUS.md,
    },
    resetBtnText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 14,
    },
    board: {
        backgroundColor: '#BBADA0',
        padding: CELL_MARGIN,
        borderRadius: RADIUS.lg,
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        margin: CELL_MARGIN / 2,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellText: {
        fontWeight: '900',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(238, 228, 218, 0.73)',
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    gameOverText: {
        fontSize: 40,
        fontWeight: '900',
        color: '#776E65',
        marginBottom: 20,
    },
    overlayBtn: {
        backgroundColor: '#8F7A66',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: RADIUS.md,
    },
    overlayBtnText: {
        color: 'white',
        fontWeight: '900',
    },
    hint: {
        marginTop: 20,
        color: COLORS.mutedForeground,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        opacity: 0.5,
    },
});
