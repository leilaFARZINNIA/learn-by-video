// components/Drawer/MenuContent.tsx
import type { HistoryItem } from '@/api/history';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../auth/auth-context';
import { useTheme } from '../../context/ThemeContext';
import styles from './styles';

type MenuItem = { icon: React.JSX.Element; label: string; route: string };

type MenuContentProps = {
  expanded: boolean;

  selectedMenu: number | null;
  setSelectedMenu: (idx: number) => void;
  onMenuPress: (idx: number) => void;
  items: MenuItem[];

  // History props (real backend-driven)
  history?: HistoryItem[];
  historyLoading?: boolean;
  selectedHistoryMediaId?: string | null;
  setSelectedHistoryMediaId?: (id: string | null) => void;
  onDeleteHistory?: (mediaId: string) => void;
  onTapHistory?: (item: HistoryItem) => void;
};

export default function MenuContent({
  expanded,
  selectedMenu,
  setSelectedMenu,
  onMenuPress,
  items,

  history = [],
  historyLoading = false,
  selectedHistoryMediaId = null,
  setSelectedHistoryMediaId,
  onDeleteHistory,
  onTapHistory,
}: MenuContentProps) {
  const { colors } = useTheme();
  const menu = (colors as any).menu;
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin(); // true | false | null

  // Build visible menu based on auth/admin state
  let filteredItems = items;

  if (user) {
    filteredItems = items.filter((i) => i.route !== '/login');

    if (isAdmin === true) {
      filteredItems = filteredItems.map((i) =>
        i.route === '/dashboard'
          ? {
              ...i,
              label: 'Admin dashboard',
              route: '/admin',
              icon: <FontAwesome5 name="shield-alt" size={24} />,
            }
          : i
      );
    }

    filteredItems.push({
      icon: <FontAwesome5 name="sign-out-alt" size={24} />,
      label: 'Logout',
      route: '/logout',
    });
  } else {
    filteredItems = items.filter((i) => i.route !== '/dashboard');
  }

  const iconNameByKind = (kind?: string) =>
    kind === 'video' ? 'play-circle' : kind === 'podcast' ? 'headphones' : 'file-alt';

  return (
    <>
      {/* Menu list */}
      {filteredItems.map((item, idx) => (
        <TouchableOpacity
          key={`${item.label}-${idx}`}
          style={[
            styles.row,
            selectedMenu === idx && expanded ? { backgroundColor: menu.menuActiveBg } : null,
          ]}
          activeOpacity={0.85}
          onPress={() => {
            if (item.route === '/logout') {
              logout();
              return;
            }
            setSelectedMenu(idx);
            onMenuPress(idx);
          }}
        >
          {React.cloneElement(item.icon, { color: menu.menuIcon })}
          {expanded && (
            <Text style={[styles.label, { color: menu.menuLabel }]}>{item.label}</Text>
          )}
        </TouchableOpacity>
      ))}

      {/* Divider */}
      {expanded && <View style={[styles.divider, { backgroundColor: menu.dividerMenu }]} />}

      {/* History */}
      {expanded && user && (
        <>
          <Text style={[styles.sectionTitle, { color: menu.sectionTitle }]}>History</Text>

          <ScrollView
            style={styles.historyContainer}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {historyLoading && (
              <Text
                style={{
                  color: menu.historyDate,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                Loading…
              </Text>
            )}

            {!historyLoading && history.length === 0 && (
              <Text
                style={{
                  color: menu.historyDate,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                No items yet
              </Text>
            )}

            {!historyLoading &&
              history.map((item) => {
                const isSelected = selectedHistoryMediaId === item.media_id;
                const dateLabel = new Date(item.updated_at).toLocaleDateString();
                const iconName = iconNameByKind(item.kind ?? undefined);

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.historyItem,
                      { backgroundColor: isSelected ? menu.historyActiveBg : menu.historyBg },
                    ]}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSelectedHistoryMediaId?.(item.media_id);
                        onTapHistory?.(item);
                      }}
                    >
                      <FontAwesome5
                        name={iconName as any}
                        size={18}
                        color={menu.menuIcon}
                        style={{ marginRight: 9 }}
                      />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          numberOfLines={1}
                          style={[styles.historyTitle, { color: menu.historyTitle }]}
                        >
                          {item.media_title}
                        </Text>
                        <Text style={[styles.historyDate, { color: menu.historyDate }]}>
                          {dateLabel}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onDeleteHistory?.(item.media_id)}
                      style={{ paddingHorizontal: 8, paddingVertical: 6 }}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Feather name="trash-2" size={16} color={menu.historyDate} />
                    </TouchableOpacity>
                  </View>
                );
              })}
          </ScrollView>
        </>
      )}
    </>
  );
}
