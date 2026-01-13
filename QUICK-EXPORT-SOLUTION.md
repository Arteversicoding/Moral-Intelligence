# 🚨 Quick Export Solution - Temporary Rules

## Masalah
Email Anda tidak ada di admin list, jadi tidak bisa export data.

## Solusi Cepat (Temporary)

### Option 1: Deploy Temporary Rules (RECOMMENDED)

Rules temporary ini membolehkan **siapa saja yang login** untuk READ data `quizResults` dan `surveyResponses`.

**⚠️ WARNING: Ini membuka akses READ untuk semua user yang login! Jangan lupa kembalikan ke rules asli setelah export!**

#### Langkah:

1. **Backup rules asli:**
```bash
copy firestore.rules firestore.rules.backup
```

2. **Gunakan temporary rules:**
```bash
copy firestore.rules.temp firestore.rules
```

3. **Deploy temporary rules:**
```bash
firebase deploy --only firestore:rules
```

4. **Export data Anda:**
   - Buka `export-firestore-data.html`
   - Login dengan Google account apapun
   - Export data

5. **KEMBALIKAN rules asli:**
```bash
copy firestore.rules.backup firestore.rules
firebase deploy --only firestore:rules
```

---

### Option 2: Tambahkan Email Anda ke Admin List (PERMANENT - RECOMMENDED)

Lebih aman dan permanent.

1. **Cek email yang Anda gunakan login:**
   - Buka console browser (F12)
   - Ketik: `firebase.auth().currentUser.email`
   - Copy email yang muncul

2. **Berikan email tersebut ke saya** atau edit sendiri file `firestore.rules`:

Cari bagian ini:
```javascript
function isAdmin() {
  return request.auth != null &&
         request.auth.token.email in [
           'admin@mi.com',
           'admin@moralintelligence.com',
           'superadmin@mi.com'
           // ← TAMBAHKAN EMAIL ANDA DI SINI
         ];
}
```

Ganti jadi:
```javascript
function isAdmin() {
  return request.auth != null &&
         request.auth.token.email in [
           'admin@mi.com',
           'admin@moralintelligence.com',
           'superadmin@mi.com',
           'emailanda@gmail.com'  // ← EMAIL ANDA
         ];
}
```

3. **Deploy:**
```bash
firebase deploy --only firestore:rules
```

4. **Test export tool** - seharusnya berhasil sekarang!

---

## Mana yang harus dipilih?

- **Option 1 (Temporary)**: Cepat, tapi **tidak aman** dan harus dikembalikan
- **Option 2 (Email Admin)**: **RECOMMENDED** - Aman, permanent, best practice

Saya sarankan **Option 2**. Berikan email Anda atau edit sendiri file `firestore.rules`.
