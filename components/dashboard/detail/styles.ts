// components/dashboard/detail/styles.ts
import { StyleSheet } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

export const useDashboardStyles = () => {
  const { colors } = useTheme();
  const dashboard = (colors as any).  dashboarddetail;

  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dashboard.screenBg },

    headerCard: {
      margin: 16, padding: 16, borderRadius: 18,
      shadowColor: dashboard.header.shadow,
      shadowOpacity: 0.15, shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 }, elevation: 4
    },
    headerTitle: { color: dashboard.header.title, fontSize: 20, fontWeight: "800" },
    headerSub: { color: dashboard.header.sub, fontSize: 12, marginTop: 2 },

    helper: { color: dashboard.helper.text, fontSize: 12, paddingHorizontal: 16, marginBottom: 6 },
    listContent: { paddingHorizontal: 16, paddingBottom: 96 },

    card: {
      flexDirection: "row", alignItems: "center", gap: 12,
      backgroundColor: dashboard.itemCard.bg,
      borderRadius: 14, padding: 12,
      borderWidth: 1, borderColor: dashboard.itemCard.border,
      marginBottom: 10
    },
    cardTitle: { fontWeight: "700", color: dashboard.itemCard.title },
    cardMeta: { fontSize: 12, color: dashboard.itemCard.meta, marginTop: 2 },

    editBtn: {
      flexDirection: "row", gap: 6,
      paddingHorizontal: 10, paddingVertical: 6,
      borderRadius: 10, backgroundColor: dashboard.itemCard.editBg,
      alignItems: "center"
    },
    editText: { color: dashboard.itemCard.editText, fontWeight: "700", fontSize: 12 },

    deleteBtn: {
      flexDirection: "row", gap: 6,
      paddingHorizontal: 10, paddingVertical: 6,
      borderRadius: 10, backgroundColor: dashboard.itemCard.deleteBg,
      alignItems: "center"
    },
    deleteText: { color: dashboard.itemCard.deleteText, fontWeight: "700", fontSize: 12 },

    fab: {
      position: "absolute", right: 20, bottom: 24,
      width: 56, height: 56, borderRadius: 28,
      backgroundColor: dashboard.fab.bg,
      alignItems: "center", justifyContent: "center",
      shadowColor: dashboard.fab.shadow,
      shadowOpacity: 0.25, shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 }, elevation: 6
    },

    overlay: {
      flex: 1, backgroundColor: dashboard.modal.overlayBg,
      alignItems: "center", justifyContent: "center", padding: 16
    },
    sheet: {
      width: "100%", maxWidth: 520,
      backgroundColor: dashboard.modal.sheetBg,
      borderRadius: 24, padding: 18
    },
    sheetTitle: { fontSize: 18, fontWeight: "800", color: dashboard.modal.sheetTitle, marginBottom: 10 },
    label: { fontSize: 13, color: dashboard.modal.label, marginBottom: 6 },
    input: {
      borderWidth: 1, borderColor: dashboard.modal.inputBorder,
      borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
      backgroundColor: dashboard.modal.inputBg, color: dashboard.modal.inputText
    },
    pickBtn: {
      backgroundColor: dashboard.modal.pickBg,
      borderRadius: 12, paddingVertical: 12,
      alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8
    },
    pickText: { color: dashboard.modal.pickText, fontWeight: "700" },
    actions: { flexDirection: "row", gap: 12, marginTop: 16 },
    action: { flex: 1, borderRadius: 14, alignItems: "center", paddingVertical: 12 },
    cancel: { backgroundColor: dashboard.modal.cancelBg },
    primary: { backgroundColor: dashboard.modal.primaryBg },
    disabled: { backgroundColor: dashboard.modal.disabledBg },
  });
};
