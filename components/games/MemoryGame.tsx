import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const GRID_SIZE = 4;
const CARD_SIZE = (width - 80) / GRID_SIZE;

const EMOJIS = ['🚀', '🎨', '🧩', '🧪', '🧬', '🧠', '💻', '🎮'];
const ALL_CARDS = [...EMOJIS, ...EMOJIS];

export default function MemoryGame({ onFinish }: { onFinish: (score: number) => void }) {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    shuffle();
  }, []);

  const shuffle = () => {
    const shuffled = ALL_CARDS.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  const handleClick = (index: number) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setDisabled(true);
      
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setSolved([...solved, first, second]);
        setFlipped([]);
        setDisabled(false);
        
        if (solved.length + 2 === cards.length) {
          setTimeout(() => {
            onFinish(Math.max(100 - moves * 2, 10));
            Alert.alert('Победа!', `Вы нашли все пары за ${moves + 1} ходов!`);
          }, 500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Ходы</Text>
          <Text style={styles.statValue}>{moves}</Text>
        </View>
        <TouchableOpacity onPress={shuffle} style={styles.resetBtn}>
          <Feather name="refresh-cw" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {cards.map((emoji, index) => {
          const isFlipped = flipped.includes(index) || solved.includes(index);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleClick(index)}
              style={[
                styles.card,
                isFlipped && styles.cardFlipped,
                solved.includes(index) && styles.cardSolved
              ]}
              disabled={isFlipped}
            >
              <Text style={styles.emoji}>
                {isFlipped ? emoji : '?'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.foreground,
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: RADIUS.lg,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    ...SHADOWS.sm,
  },
  cardFlipped: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  cardSolved: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
    opacity: 0.6,
  },
  emoji: {
    fontSize: 32,
  }
});
