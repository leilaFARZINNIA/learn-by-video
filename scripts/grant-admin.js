// scripts/grant-admin.js
const admin = require("firebase-admin");
const path = require("path");


const serviceAccount = require(path.resolve(__dirname, "./serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function main() {
  const email = process.argv[2];
  const mode = (process.argv[3] || "").toLowerCase(); 

  if (!email) {
    console.error("Usage: node scripts/grant-admin.js <email> [--revoke]");
    process.exit(1);
  }

  const user = await admin.auth().getUserByEmail(email);

  if (mode === "--revoke") {

    const existing = user.customClaims || {};
    delete existing.admin;
    await admin.auth().setCustomUserClaims(user.uid, existing);
    console.log(`❎ Removed admin claim from ${email}`);
  } else {

    const claims = { ...(user.customClaims || {}), admin: true };
    await admin.auth().setCustomUserClaims(user.uid, claims);
    console.log(`✅ Admin claim set for ${email}`);
  }


  await admin.auth().revokeRefreshTokens(user.uid);
  console.log("🔄 Refresh tokens revoked. Ask the user to sign-in again.");
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
