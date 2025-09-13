// app/admin/styles.ts
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: { width: "100%", maxWidth: 920, borderWidth: 1, borderRadius: 20, padding: 18 },
  shadow: Platform.select({
    ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
    android: { elevation: 3 },
    default: { boxShadow: "0 10px 24px rgba(2,6,23,0.08)" } as any,
  }),
  shadowSm: Platform.select({
    ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    android: { elevation: 1 },
    default: { boxShadow: "0 6px 12px rgba(2,6,23,0.06)" } as any,
  }),
  h1: { fontSize: 22, fontWeight: "900", marginBottom: 4, letterSpacing: 0.2 },

  segmentWrap: { flexDirection: "row", borderWidth: 1, borderRadius: 12, padding: 4, gap: 4 },
  segment: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },

  searchWrap: { flex: 1, minWidth: 220, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, height: 38, justifyContent: "center" },

  itemCard: { borderWidth: 1, borderRadius: 14, padding: 14, marginVertical: 6 },

  btnSm: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 10, alignSelf: "flex-start" },

  ghostBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 10, alignSelf: "flex-start" },

  notice: { borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 8 },
});
