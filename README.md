# Moral Intelligence

Moral Intelligence adalah platform pembelajaran interaktif berbasis web yang dirancang untuk membantu pengguna memahami dan mengembangkan kecerdasan moral melalui materi pembelajaran, kuis interaktif, forum diskusi, serta asisten AI yang dapat membantu proses belajar.

## Fitur Utama

### 📚 Materi Pembelajaran
- Menampilkan materi pembelajaran secara terstruktur
- Fitur pencarian materi
- Tracking aktivitas membaca pengguna

### 🤖 AI Learning Assistant
- Chat AI berbasis Google Gemini
- Membantu menjawab pertanyaan terkait materi
- Pendamping belajar interaktif

### 📝 Quiz & Evaluasi
- Kuis interaktif
- Penyimpanan hasil kuis
- Tracking progres pengguna

### 💬 Forum Diskusi
- Membuat dan membaca diskusi
- Berinteraksi dengan pengguna lain
- Meningkatkan kolaborasi pembelajaran

### 👤 Manajemen Pengguna
- Registrasi akun
- Login dan autentikasi
- Profil pengguna
- Dashboard admin

### 📱 Progressive Web App (PWA)
- Dapat diakses melalui perangkat mobile
- Mendukung instalasi sebagai aplikasi
- Pengalaman penggunaan yang lebih responsif

---

## Teknologi yang Digunakan

### Frontend
- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Tailwind CSS

### Backend & Cloud Services
- Firebase Authentication
- Firebase Firestore
- Firebase Hosting

### Artificial Intelligence
- Google Gemini API

### Database
- Cloud Firestore

---

## Struktur Project

```text
repo-moral/
│
├── assets/
│   ├── components/
│   ├── css/
│   ├── icons/
│   ├── js/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── core/
│   │   ├── forum/
│   │   ├── materials/
│   │   └── quiz/
│   └── services/
│
├── config/
│   ├── firebase-init.js
│   ├── firestore.rules
│   └── config.js
│
├── pages/
│   ├── admin/
│   ├── auth/
│   └── features/
│
└── public/
```

---

## Instalasi

### Clone Repository

```bash
git clone https://github.com/username/moral-intelligence.git
cd moral-intelligence
```

### Konfigurasi Firebase

Buat project Firebase kemudian sesuaikan konfigurasi pada:

```javascript
config/config.js
```

Isi konfigurasi:

```javascript
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Konfigurasi Gemini API

Masukkan API Key Gemini pada:

```javascript
export const geminiApiKey = "YOUR_GEMINI_API_KEY";
```

---

## Menjalankan Project

Menggunakan Live Server:

```bash
Open With Live Server
```

Atau menggunakan Firebase Hosting:

```bash
firebase serve
```

Deploy:

```bash
firebase deploy
```

---

## Tujuan Pengembangan

Project ini dikembangkan sebagai media pembelajaran digital yang menggabungkan teknologi cloud, kecerdasan buatan, dan interaksi sosial untuk menciptakan pengalaman belajar yang lebih menarik, personal, dan kolaboratif.
