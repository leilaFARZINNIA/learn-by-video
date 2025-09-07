// components/login/PasswordPolicyCard.tsx
import { PASSWORD_MAX, PASSWORD_MIN, PASSWORD_RECOMMENDED } from "@/constants/login/passwordPolicy";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Text, View } from "react-native";

export default function PasswordPolicyCard() {
  const { colors } = useTheme();
  const login = (colors as any).login;

  return (
    <View style={{
      borderWidth: 1, borderColor: login.border, backgroundColor: login.cardBg,
      padding: 12, borderRadius: 12
    }}>
      <Text style={{ fontWeight: "800", color: login.text, marginBottom: 6 }}>
        Password requirements
      </Text>
      <Text style={{ color: login.textMuted }}>{`\u2022 Minimum length: ${PASSWORD_MIN} (recommended: ${PASSWORD_RECOMMENDED}+)
\u2022 Accepts all characters (spaces & Unicode allowed)
\u2022 No forced pattern rules (no mandatory symbol/number mix)
\u2022 Avoid your name/email or common passwords
\u2022 Max length: ${PASSWORD_MAX}`}</Text>
      <Text style={{ color: login.textMuted, marginTop: 6 }}>
        Use a memorable passphrase (e.g., multiple random words). We'll validate strength during sign up.
      </Text>
    </View>
  );
}
