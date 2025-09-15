<<<<<<< HEAD
# Moral-Intelligence
=======
# Moral Intelligence - Platform Panduan Bijak untuk Pendidik

## 📖 Deskripsi

Moral Intelligence adalah platform web yang dirancang khusus untuk membantu guru, konselor, dan orang tua dalam mengatasi tantangan mendidik remaja. Platform ini menggunakan teknologi AI (Gemini) untuk memberikan saran dan konsultasi yang relevan dan praktis.

## ✨ Fitur Utama

### 🔐 Sistem Autentikasi
- **Login/Register**: Sistem autentikasi yang aman dengan validasi
- **Session Management**: Manajemen sesi dengan timeout otomatis
- **Role-based Access**: Diferensiasi akses untuk admin dan user
- **Profile Management**: Pengelolaan profil pengguna yang lengkap

### 🤖 AI Chat dengan Gemini
- **Konsultasi Real-time**: Chat langsung dengan AI untuk mendapatkan saran
- **Context Awareness**: AI memahami konteks percakapan sebelumnya
- **Fallback System**: Sistem cadangan jika API tidak tersedia
- **Quick Suggestions**: Saran pertanyaan cepat untuk topik umum
- **Materi-Based Responses**: AI hanya menjawab berdasarkan materi yang tersedia
- **Konteks Konseling & Pembelajaran**: Diferensiasi konteks untuk konseling dan pembelajaran

### 💬 Forum Komunitas
- **Diskusi Interaktif**: Platform berbagi pengalaman antar pendidik
- **Kategori Terorganisir**: Pengelompokan berdasarkan topik (bullying, motivasi, dll)
- **Search & Filter**: Pencarian dan filter yang mudah digunakan
- **Like & Comment**: Sistem interaksi sosial

### 📚 Pusat Materi
- **Materi Terstruktur**: Konten pembelajaran yang terorganisir
- **Progress Tracking**: Pelacakan kemajuan belajar
- **Search Functionality**: Pencarian materi yang cepat
- **Responsive Design**: Tampilan yang optimal di semua device

### 🤖 Chat AI dengan Materi
- **Upload PDF**: Upload file PDF materi yang akan dipahami AI
- **Input Link**: Masukkan link website materi untuk diproses AI
- **Embedding Otomatis**: AI menggunakan Gemini embedding-001 untuk memahami materi
- **Chat Kontekstual**: AI menjawab berdasarkan materi yang diupload
- **Semantic Search**: Pencarian materi berdasarkan kemiripan makna

### 🔧 Admin Dashboard
- **System Overview**: Statistik pengguna, materi, dan aktivitas sistem
- **System Health**: Status AI, storage, dan performa sistem
- **Quick Actions**: Export data, clear data, dan refresh statistik
- **Simple Interface**: Dashboard sederhana untuk monitoring sistem

### 🎨 UI/UX Modern
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Tailwind CSS**: Framework CSS modern untuk styling
- **Smooth Animations**: Transisi dan animasi yang halus
- **Dark/Light Mode Ready**: Siap untuk implementasi tema

## 🚀 Teknologi yang Digunakan

### Frontend
- **HTML5**: Struktur halaman yang semantik
- **CSS3**: Styling modern dengan Tailwind CSS
- **JavaScript ES6+**: Logika aplikasi yang modern
- **Responsive Design**: Mobile-first approach

### AI Integration
- **Google Gemini API**: AI model untuk chat dan konsultasi
- **Fallback System**: Sistem cadangan untuk respons AI
- **Context Management**: Pengelolaan konteks percakapan

### Storage
- **LocalStorage**: Penyimpanan data sementara di browser
- **Session Management**: Manajemen sesi pengguna
- **Data Persistence**: Penyimpanan data yang persisten

## 📁 Struktur File

```
MI/
├── index.html              # Halaman utama aplikasi
├── login.html              # Halaman login
├── register.html           # Halaman registrasi
├── chat.html               # Halaman chat AI
├── materi-guru.html        # Halaman kelola materi guru
├── admin-dashboard.html    # Dashboard admin
├── config.js               # Konfigurasi aplikasi
├── auth-service.js         # Service autentikasi
├── gemini-service.js       # Service AI Gemini
└── README.md               # Dokumentasi ini
```

## 🔧 Instalasi & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd MI
```

### 2. Setup Gemini AI API
1. Dapatkan API key dari [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Edit file `config.js`
3. Ganti `YOUR_GEMINI_API_KEY_HERE` dengan API key Anda

```javascript
// config.js
const CONFIG = {
    GEMINI_API_KEY: 'your-actual-api-key-here',
    // ... konfigurasi lainnya
};
```

### 3. Jalankan Aplikasi
- Buka file `index.html` di browser
- Atau gunakan live server:
```bash
npx live-server
```

### 4. Deploy ke Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Inisialisasi project (pilih hosting)
firebase init hosting

# Deploy aplikasi
firebase deploy
```

## 🎯 Cara Kerja AI dengan Materi

### 1. Upload & Embedding
- Guru dapat upload PDF atau input link materi
- AI menggunakan **Gemini embedding-001** untuk memahami konten
- Materi diproses dan disimpan dengan embeddings untuk pencarian cepat

### 2. Chat Kontekstual
- AI menganalisis pertanyaan dan mencari materi yang relevan
- Menggunakan **semantic search** berdasarkan kemiripan makna
- AI hanya menjawab berdasarkan materi yang tersedia

### 3. Model AI
- **Chat**: Gemini 1.5 Flash untuk respons yang cepat dan akurat
- **Embedding**: Gemini embedding-001 untuk pemahaman materi
- **Fallback**: Sistem cadangan jika API tidak tersedia

## 🔑 Kredensial Demo

### Admin Account
- **Email**: admin@mi.com
- **Password**: admin123
- **Access**: Full admin dashboard, user management, system settings

### User Account
- **Email**: user@mi.com
- **Password**: user123
- **Access**: Basic user features, chat AI, materi upload

## 📱 Fitur Responsif

- **Mobile-First Design**: Optimal untuk perangkat mobile
- **Touch-Friendly**: Interface yang mudah digunakan dengan touch
- **Adaptive Layout**: Layout yang menyesuaikan ukuran layar
- **Progressive Web App Ready**: Siap untuk dijadikan PWA

## 🔒 Keamanan

- **Input Validation**: Validasi input yang ketat
- **Session Timeout**: Timeout otomatis untuk keamanan
- **XSS Prevention**: Pencegahan cross-site scripting
- **Secure Storage**: Penyimpanan data yang aman

## 🚧 Fitur yang Akan Datang

- [ ] **Firebase Integration**: Database dan hosting
- [ ] **Real-time Chat**: Chat antar pengguna
- [ ] **File Upload**: Upload materi dan dokumen
- [ ] **Push Notifications**: Notifikasi real-time
- [ ] **Analytics Dashboard**: Dashboard analitik untuk admin
- [ ] **Multi-language Support**: Dukungan multi bahasa

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Kontak

- **Email**: support@moralintelligence.com
- **Website**: https://moralintelligence.com
- **Documentation**: https://docs.moralintelligence.com

## 🙏 Ucapan Terima Kasih

- **Google Gemini AI** untuk teknologi AI yang powerful
- **Tailwind CSS** untuk framework CSS yang luar biasa
- **Inter Font** untuk tipografi yang indah
- **Heroicons** untuk icon yang konsisten

---

**Moral Intelligence** - Membantu pendidik membangun masa depan yang lebih baik melalui teknologi AI yang cerdas dan empatik. 🚀 
>>>>>>> 66def10 (first commit)
