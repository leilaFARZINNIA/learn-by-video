// app/admin/components/Toolbar.tsx
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./styles";
import { Counts, Status } from "./types";

export default function Toolbar({
  status, setStatus, counts, q, setQ, onRefresh,
}: {
  status: Status;
  setStatus: (s: Status) => void;
  counts: Counts;
  q: string;
  setQ: (v: string) => void;
  onRefresh: () => void;
}) {
  const { colors } = useTheme();
  const admin = (colors as any).admin;

  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
      <Segmented value={status} onChange={setStatus} counts={counts} />
      <SearchBox value={q} onChange={setQ} />
      <Pressable
        onPress={onRefresh}
        style={({ pressed, hovered }) => ([
          styles.ghostBtn,
          {
            borderColor: admin.border,
            backgroundColor: hovered && Platform.OS === "web" ? admin.soft : "transparent",
            opacity: pressed ? 0.9 : 1,
          },
        ])}
      >
        <Text style={{ color: admin.text, fontWeight: "800" }}>Refresh</Text>
      </Pressable>
    </View>
  );
}

function Segmented({
  value, onChange, counts,
}: {
  value: Status; onChange: (s: Status) => void; counts: Counts;
}) {
  const { colors } = useTheme();
  const admin = (colors as any).admin;

  const options: Status[] = ["new", "open", "done"];
  return (
    <View style={[styles.segmentWrap, { borderColor: admin.border, backgroundColor: admin.soft }]}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={({ pressed, hovered }) => ([
              styles.segment,
              active && { backgroundColor: admin.cardBg, borderColor: admin.border },
              hovered && !active && Platform.OS === "web" ? { backgroundColor: "#00000008" } : null,
              pressed ? { opacity: 0.9 } : null,
            ])}
          >
            <Text style={{ fontWeight: "900", color: active ? admin.text : admin.textMuted }}>
              {opt.toUpperCase()} ({(counts as any)[opt] ?? 0})
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { colors } = useTheme();
  const admin = (colors as any).admin;

  const input: any = { flex: 1, color: admin.text, paddingVertical: 8 };
  return (
    <View style={[styles.searchWrap, { borderColor: admin.border, backgroundColor: admin.cardBg }]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search title, name, email…"
        placeholderTextColor={admin.textMuted}
        style={Platform.OS === "web" ? [{ ...input, outlineStyle: "none" as any }] : [input]}
      />
    </View>
  );
}
