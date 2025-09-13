import { useAuth } from '@/auth/auth-context';
import AvatarCircle from '@/components/ui/Avatar';
import { Feather } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomHeaderProps {
  title?: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function CustomHeader({ title = '', isSidebarOpen, toggleSidebar }: CustomHeaderProps) {
  const router = useRouter();
  const segments = useSegments();
  const { colors } = useTheme();
  const header = (colors as any).header || {};
  const ui = (colors as any).settings; // برای fallback رنگ‌ها

  const { user } = useAuth();
  const photoURL = (user as any)?.avatar || (user as any)?.photoURL || null;
  const displayName = user?.name || (user as any)?.displayName || null;

  const isRoot = segments.join('/') === '' || segments.join('/') === 'index';
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 600;

  const iconColor = header.headerIcon ?? ui.text;
  const titleColor = header.headerTitleP ?? ui.text;
  const actionColor = header.headerAction ?? ui.accentBg;

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: header.headerBg ?? ui.bg, shadowColor: header.headerShadow ?? ui.cardShadow },
        isMobile ? styles.mobile : styles.web,
      ]}
    >
      {/* Left: menu/back (فقط موبایل) */}
      <View style={styles.left}>
        {isMobile && (
          isRoot ? (
            <TouchableOpacity
              onPress={toggleSidebar}
              style={styles.iconBtn}
              accessibilityLabel={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              <Feather name={isSidebarOpen ? "x" : "menu"} size={26} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} accessibilityLabel="Back">
              <Feather name="arrow-left" size={26} color={iconColor} />
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Title */}
      <Text
        numberOfLines={1}
        style={[
          styles.title,
          { color: titleColor },
          isMobile ? styles.titleMobile : styles.titleWeb,
        ]}
      >
        {title}
      </Text>

      {/* Right: avatar (logged-in) | sign-in (guest) */}
      <View style={styles.right}>
        {user ? (
          <TouchableOpacity
            onPress={() => router.push('/settings/account')}
            accessibilityLabel="Open account"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <AvatarCircle
              size={isMobile ? 32 : 36}
              uri={photoURL}
              name={displayName}
              email={user?.email}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push('/login')} accessibilityLabel="Sign in">
            <Text style={[styles.signInText, { color: actionColor }]}>Sign in</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 100,
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    minHeight: 64,
    transitionProperty: 'box-shadow, background',
    transitionDuration: '220ms',
  },
  mobile: { height: 100, paddingTop: 50, paddingHorizontal: 20 },
  web: { height: 64, paddingHorizontal: 28 },
  left: { flexDirection: 'row', alignItems: 'center', minWidth: 65 },
  right: { minWidth: 40, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { marginRight: 12, padding: 6 },
  title: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
  titleMobile: { fontSize: 18 },
  titleWeb: { fontSize: 22 },
  signInText: { fontWeight: '800', fontSize: 14 },
});
