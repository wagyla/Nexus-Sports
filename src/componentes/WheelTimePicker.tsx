import { useRef } from "react";
import { View, Text, Animated, PanResponder, StyleSheet } from "react-native";

const ITEM_H = 50;
const VISIBLE = 5;
const PICKER_H = ITEM_H * VISIBLE;
const PAD = Math.floor(VISIBLE / 2) * ITEM_H; // 100 — espaço para centralizar o 1º item

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0")
);

// translateY quando item `i` está centralizado na janela
function toY(i: number) {
  return -i * ITEM_H + PAD;
}

// índice mais próximo dado o translateY atual
function toIndex(y: number, total: number) {
  return Math.max(0, Math.min(Math.round((PAD - y) / ITEM_H), total - 1));
}

// impede scroll além do primeiro / último item
function clampY(y: number, total: number) {
  return Math.max(-(total - 1) * ITEM_H + PAD, Math.min(PAD, y));
}

// ─── Coluna ───────────────────────────────────────────────────────────────────

type ColumnProps = {
  items: string[];
  initialIndex: number;
  width: number;
  onChange: (index: number) => void;
};

function WheelColumn({ items, initialIndex, width, onChange }: ColumnProps) {
  const translateY = useRef(new Animated.Value(toY(initialIndex))).current;
  const activeIdx = useRef(initialIndex);
  const startY = useRef(toY(initialIndex));

  const snap = (idx: number) => {
    const target = toY(idx);
    startY.current = target;

    Animated.spring(translateY, {
      toValue: target,
      useNativeDriver: false,
      tension: 90,
      friction: 14,
    }).start();

    if (idx !== activeIdx.current) {
      activeIdx.current = idx;
      onChange(idx);
    }
  };

  const pan = useRef(
    PanResponder.create({
      // captura o toque antes do ScrollView pai
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: () => {
        // interrompe qualquer spring em andamento e congela o valor atual
        translateY.stopAnimation((v) => {
          startY.current = v;
          translateY.setValue(v);
        });
      },

      onPanResponderMove: (_, { dy }) => {
        translateY.setValue(clampY(startY.current + dy, items.length));
      },

      onPanResponderRelease: (_, { dy, vy }) => {
        const released = clampY(startY.current + dy, items.length);
        // inercia: quanto mais rápido o flick, mais longe vai
        const withInertia = clampY(released + vy * ITEM_H * 4, items.length);
        snap(toIndex(withInertia, items.length));
      },

      onPanResponderTerminate: (_, { dy }) => {
        snap(toIndex(clampY(startY.current + dy, items.length), items.length));
      },
    })
  ).current;

  return (
    <View
      style={{ width, height: PICKER_H, overflow: "hidden" }}
      {...pan.panHandlers}
    >
      <Animated.View style={{ transform: [{ translateY }] }}>
        {items.map((label, i) => {
          // centerY: valor de translateY em que este item fica centralizado
          const centerY = toY(i);
          const inputRange = [
            centerY - 2 * ITEM_H,
            centerY - ITEM_H,
            centerY,
            centerY + ITEM_H,
            centerY + 2 * ITEM_H,
          ];

          const opacity = translateY.interpolate({
            inputRange,
            outputRange: [0.08, 0.28, 1, 0.28, 0.08],
            extrapolate: "clamp",
          });
          const scale = translateY.interpolate({
            inputRange,
            outputRange: [0.68, 0.85, 1.06, 0.85, 0.68],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={label}
              style={[s.item, { opacity, transform: [{ scale }] }]}
            >
              <Text style={s.itemText}>{label}</Text>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

type Props = {
  value: string; // "HH:MM"
  onChange: (time: string) => void;
};

export default function WheelTimePicker({ value, onChange }: Props) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  const initH = Math.min(parseInt(match?.[1] ?? "0", 10), 23);
  const initM = Math.min(Math.round(parseInt(match?.[2] ?? "0", 10) / 5), 11);

  const hRef = useRef(initH);
  const mRef = useRef(initM);

  return (
    <View style={s.wrapper}>
      {/* Linha de destaque do item central */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={s.highlight} />
      </View>

      <View style={s.row}>
        <WheelColumn
          items={HOURS}
          initialIndex={initH}
          width={72}
          onChange={(i) => {
            hRef.current = i;
            onChange(`${HOURS[i]}:${MINUTES[mRef.current]}`);
          }}
        />

        <Text style={s.colon}>:</Text>

        <WheelColumn
          items={MINUTES}
          initialIndex={initM}
          width={72}
          onChange={(i) => {
            mRef.current = i;
            onChange(`${HOURS[hRef.current]}:${MINUTES[i]}`);
          }}
        />
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  wrapper: {
    height: PICKER_H,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "200",
    letterSpacing: 2,
  },
  colon: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "200",
    marginHorizontal: 4,
    marginBottom: 2,
  },
  highlight: {
    position: "absolute",
    top: PAD,
    left: 20,
    right: 20,
    height: ITEM_H,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,255,209,0.45)",
    backgroundColor: "rgba(0,255,209,0.04)",
    borderRadius: 8,
  },
});
