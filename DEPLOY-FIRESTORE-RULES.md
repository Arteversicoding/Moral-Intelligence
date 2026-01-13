# 🔐 Deploy Firestore Security Rules

## Masalah
Export tool tidak bisa mengakses data karena Firestore security rules terlalu ketat. Admin perlu akses READ untuk semua data.

## Solusi

### Opsi 1: Deploy Rules via Firebase Console (RECOMMENDED)

1. **Buka Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Pilih project: **mi-app-8ff5c**

2. **Buka Firestore Rules**
   - Di sidebar kiri, klik **Firestore Database**
   - Klik tab **Rules**

3. **Copy-Paste Rules Baru**
   - Copy semua isi file `firestore.rules` yang baru
   - Paste ke editor di Firebase Console
   - Klik **Publish**

### Opsi 2: Deploy via Firebase CLI

```bash
# Install Firebase CLI (jika belum)
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

## Perubahan Utama di Rules Baru:

### ✅ Correct Collection Names
- ✅ `quizResults` (plural) - sesuai dengan yang ada di codebase
- ✅ `surveyResponses` (plural) - sesuai dengan yang ada di codebase

### ✅ Admin Access
Admin sekarang bisa:
- ✅ READ all `quizResults` documents
- ✅ READ all `surveyResponses` documents
- ✅ READ all `chatHistory` documents
- ✅ UPDATE/DELETE semua data

### ✅ Admin Emails
```javascript
'admin@mi.com'
'admin@moralintelligence.com'
'superadmin@mi.com'
```

## Setelah Deploy Rules

1. **Login sebagai admin** di export tool
   - Gunakan salah satu email admin di atas
   - Login via Google Auth

2. **Test Export Tool**
   - Buka `export-firestore-data.html`
   - Klik tombol export
   - Data seharusnya bisa diakses sekarang

## Troubleshooting

### Masih "insufficient permissions"?
1. Pastikan Anda login dengan email admin yang benar
2. Check di Firebase Console → Authentication → Users
3. Verify email Anda terdaftar sebagai salah satu admin email

### Collection name tidak ditemukan?
Collection names yang digunakan:
- ✅ `quizResults` (plural)
- ✅ `surveyResponses` (plural)

Sudah disesuaikan dengan codebase yang ada.

### Email bukan admin?
Tambahkan email Anda ke list admin di `firestore.rules`:
```javascript
function isAdmin() {
  return request.auth != null &&
         request.auth.token.email in [
           'admin@mi.com',
           'admin@moralintelligence.com',
           'superadmin@mi.com',
           'youremail@gmail.com'  // ← tambahkan di sini
         ];
}
```

Lalu deploy ulang rules.
