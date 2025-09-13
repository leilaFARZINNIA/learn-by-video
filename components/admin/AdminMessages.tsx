// app/admin/AdminMessages.tsx
import { deleteContact, getContact, getStats, listContacts, updateContactStatus } from "@/api/admin/api";
import Center from "@/components/admin/Center";
import EmptyState from "@/components/admin/EmptyState";
import MessageDetail from "@/components/admin/MessageDetail";
import MessageItem from "@/components/admin/MessageItem";
import Toolbar from "@/components/admin/Toolbar";
import { useTheme } from "@/context/ThemeContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

import React from "react";
import { ActivityIndicator, Alert, FlatList, Platform, Text, View } from "react-native";
import { styles } from "./styles";
import { Counts, Item, Status } from "./types";

// Local type for full detail (includes description)
type FullItem = Item & { description: string };

const fmtRelative = (ms: number) => {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

export default function AdminMessages() {
  const isAdmin = useIsAdmin();
  const { colors } = useTheme();
  const admin = (colors as any).admin;

  const [status, setStatus] = React.useState<Status>("new");
  const [items, setItems] = React.useState<Item[]>([]);
  const [next, setNext] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [counts, setCounts] = React.useState<Counts>({ new: 0, open: 0, done: 0 });
  const [q, setQ] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  // Detail modal state
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [detail, setDetail] = React.useState<FullItem | null>(null);

  // Cross-platform confirm (Web: window.confirm | Native: Alert.alert)
  async function confirmAsync(
    title: string,
    message: string,
    confirmText = "Delete",
    cancelText = "Cancel"
  ): Promise<boolean> {
    if (Platform.OS === "web") {
      const ok = (globalThis as any)?.confirm?.(`${title}\n\n${message}`) ?? false;
      return !!ok;
    }
    return await new Promise((resolve) => {
      Alert.alert(
        title,
        message,
        [
          { text: cancelText, style: "cancel", onPress: () => resolve(false) },
          { text: confirmText, style: "destructive" as any, onPress: () => resolve(true) },
        ],
        { cancelable: true }
      );
    });
  }

  const loadPage = React.useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const page = await listContacts({ status, pageSize: 20 });
      setItems(page.items);
      setNext(page.nextPageToken ?? null);
      const st = await getStats();
      setCounts(st.byStatus);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [status]);

  React.useEffect(() => {
    if (isAdmin === true) loadPage();
  }, [isAdmin, status, loadPage]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPage();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!next) return;
    try {
      const page = await listContacts({ status, pageSize: 20, cursor: next });
      setItems((p) => [...p, ...page.items]);
      setNext(page.nextPageToken ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load more");
    }
  };

  const mark = async (id: string, s: Status) => {
    try {
      await updateContactStatus({ id, status: s });
      setItems((p) => p.map((x) => (x.id === id ? { ...x, status: s } : x)));
      setCounts((c) => {
        const prev = items.find((x) => x.id === id)?.status;
        if (!prev || prev === s) return c;
        return { ...c, [prev]: Math.max(0, (c as any)[prev] - 1), [s]: ((c as any)[s] ?? 0) + 1 } as Counts;
      });
      // sync modal if open
      setDetail((d) => (d && d.id === id ? { ...d, status: s } : d));
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to update");
    }
  };

  const openDetail = async (id: string) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const d = await getContact({ id });
      setDetail(d as FullItem);
    } catch (e: any) {
      setDetailOpen(false);
      Alert.alert("Error", e?.message ?? "Failed to open");
    } finally {
      setDetailLoading(false);
    }
  };

  const remove = async (id: string) => {
    const ok = await confirmAsync(
      "Delete message",
      "This action cannot be undone. Continue?",
      "Delete",
      "Cancel"
    );
    if (!ok) return;

    try {
      await deleteContact({ id });
      setItems((p) => p.filter((x) => x.id !== id));
      // close modal if it was showing this item
      setDetail((d) => (d && d.id === id ? null : d));
      setDetailOpen((dOpen) => (detail?.id === id ? false : dOpen));
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to delete");
    }
  };

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(qq) ||
        it.name.toLowerCase().includes(qq) ||
        it.email.toLowerCase().includes(qq)
    );
  }, [items, q]);

  if (isAdmin === null) return <Center><ActivityIndicator /></Center>;
  if (isAdmin === false) return <Center><Text style={{ color: admin.text }}>دسترسی ندارید.</Text></Center>;

  return (
    <View style={{ alignItems: "center", padding: 18 }}>
      <View style={[styles.card, styles.shadow, { backgroundColor: admin.cardBg, borderColor: admin.border }]}>
        <Text style={[styles.h1, { color: admin.text }]}>Messages</Text>
        <Text style={{ color: admin.textMuted, marginBottom: 14 }}>
          Review and manage contact form submissions.
        </Text>

        <Toolbar
          status={status}
          setStatus={setStatus}
          counts={counts}
          q={q}
          setQ={setQ}
          onRefresh={onRefresh}
        />

        {error && (
          <View style={[styles.notice, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
            <Text style={{ color: "#991B1B" }}>{error}</Text>
          </View>
        )}

        {loading ? (
          <View style={{ paddingVertical: 24 }}><ActivityIndicator /></View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(it) => it.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={loadMore}
            onEndReachedThreshold={0.6}
            ListEmptyComponent={<EmptyState hasQuery={!!q.trim()} onClear={() => setQ("")} />}
            renderItem={({ item }) => (
              <MessageItem
                item={item}
                onOpen={() => openDetail(item.id)}
                onMarkOpen={() => mark(item.id, "open")}
                onMarkDone={() => mark(item.id, "done")}
                onDelete={() => remove(item.id)}
                fmtRelative={fmtRelative}
              />
            )}
          />
        )}
      </View>

      {/* Message detail modal */}
      <MessageDetail
        visible={detailOpen}
        loading={detailLoading}
        item={detail}
        onClose={() => setDetailOpen(false)}
        onMarkOpen={() => detail && mark(detail.id, "open")}
        onMarkDone={() => detail && mark(detail.id, "done")}
        onDelete={() => detail && remove(detail.id)}
        fmtRelative={fmtRelative}
      />
    </View>
  );
}
