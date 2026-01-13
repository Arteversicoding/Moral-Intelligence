# Tutorial Pembuatan Web MoralQ (Moral Intelligence)

## 1. Judul
**MoralQ - Platform Panduan Bijak untuk Pendidik dengan AI**

Web aplikasi berbasis Firebase dan Gemini AI untuk membantu guru dan konselor dalam memberikan panduan moral kepada remaja.

---

## 2. Deskripsi Tentang Proyek Ini

**MoralQ (Moral Intelligence)** adalah sebuah platform web inovatif yang dirancang khusus untuk membantu para pendidik, konselor sekolah, dan orang tua dalam memberikan panduan moral dan solusi bijak dalam menghadapi berbagai masalah yang dialami oleh remaja. Di era digital ini, remaja menghadapi tantangan yang semakin kompleks, mulai dari tekanan akademik, masalah sosial, hingga dilema moral dalam kehidupan sehari-hari.

Platform ini hadir sebagai solusi modern dengan memanfaatkan teknologi kecerdasan buatan (AI) melalui Google Gemini API, yang mampu memberikan saran, panduan, dan rekomendasi yang tepat berdasarkan konteks permasalahan yang dihadapi. MoralQ tidak hanya berfungsi sebagai alat bantu konseling, tetapi juga sebagai sistem manajemen kasus yang memungkinkan pendidik untuk mendokumentasikan, melacak, dan mengevaluasi perkembangan setiap kasus siswa dengan lebih terstruktur dan profesional.

### Latar Belakang Masalah

Dalam dunia pendidikan, guru dan konselor sering kali menghadapi berbagai tantangan dalam memberikan bimbingan moral kepada siswa:
- Keterbatasan waktu untuk konsultasi individual dengan setiap siswa
- Kesulitan dalam mendokumentasikan dan melacak perkembangan kasus siswa
- Kebutuhan akan referensi dan panduan yang cepat dan akurat
- Kurangnya sistem yang terintegrasi untuk manajemen data konseling
- Tantangan dalam memberikan solusi yang tepat dan personal untuk setiap kasus

MoralQ hadir untuk menjawab tantangan-tantangan tersebut dengan menyediakan platform yang mudah digunakan, cepat, dan dilengkapi dengan kecerdasan buatan yang dapat membantu pengambilan keputusan.

### Fitur Utama:

1. **AI Chat Assistant (Gemini Integration)**
   - Konsultasi real-time dengan AI untuk mendapatkan panduan moral dan solusi masalah
   - AI yang telah dilatih khusus untuk konteks pendidikan dan moral intelligence
   - Memberikan saran yang kontekstual dan relevan dengan situasi spesifik
   - Mendukung percakapan dalam Bahasa Indonesia

2. **Manajemen Kasus Siswa**
   - Menyimpan dan mengelola data kasus siswa secara terstruktur
   - Tracking perkembangan setiap kasus dari waktu ke waktu
   - Kategorisasi kasus berdasarkan jenis masalah (akademik, sosial, moral, dll)
   - History percakapan dan tindakan yang telah dilakukan

3. **Sistem Authentication & Authorization**
   - Login menggunakan Google Account (OAuth 2.0)
   - Login menggunakan Email dan Password
   - Role-based access (Admin, Konselor, Guru)
   - Keamanan data dengan Firebase Authentication

4. **Export & Reporting**
   - Export laporan kasus ke format Word (DOCX)
   - Generate summary dan rekomendasi otomatis
   - Template laporan yang profesional dan terstruktur
   - Mendukung dokumentasi untuk keperluan administrasi sekolah

5. **Progressive Web App (PWA)**
   - Dapat diinstall di smartphone dan desktop
   - Bekerja offline tanpa koneksi internet
   - Notifikasi push untuk reminder follow-up kasus
   - Responsive design untuk semua ukuran layar

6. **Dashboard & Analytics**
   - Overview statistik kasus yang ditangani
   - Visualisasi data untuk analisis trend masalah siswa
   - Monitoring performa dan efektivitas bimbingan

### Teknologi yang Digunakan:

**Frontend:**
- **HTML5** - Struktur aplikasi web modern
- **CSS3 & TailwindCSS** - Styling dan design system yang konsisten
- **JavaScript (ES6 Modules)** - Logic aplikasi dengan pattern modular
- **Service Worker** - Untuk fungsionalitas offline (PWA)

**Backend/Database:**
- **Firebase Firestore** - NoSQL database untuk menyimpan data real-time
- **Firebase Authentication** - Sistem autentikasi yang aman dan terintegrasi
- **Firebase Hosting** - Platform hosting yang cepat dan scalable
- **Firebase Storage** - Penyimpanan file dan media

**AI & APIs:**
- **Google Gemini API** - Large Language Model untuk AI chat assistant
- **Gemini Pro Model** - Model yang optimal untuk konversasi dan reasoning

**Development Tools:**
- **Live Server** - Development server untuk testing lokal
- **Firebase CLI** - Command line tools untuk deployment
- **Node.js & NPM** - Package management dan scripting

### Keunggulan MoralQ:

1. **Akses Mudah & Cepat** - Berbasis web, bisa diakses dari mana saja
2. **AI-Powered** - Bantuan cerdas dari Gemini AI untuk analisis dan saran
3. **Aman & Privat** - Data terenkripsi dan tersimpan aman di Firebase
4. **Gratis & Open Source** - Dapat digunakan dan dikembangkan oleh siapa saja
5. **Mudah Dikustomisasi** - Kode modular dan terdokumentasi dengan baik
6. **Scalable** - Dapat menangani banyak user dan data secara bersamaan

### Target Pengguna:

- **Guru Bimbingan Konseling** - Mengelola kasus dan konseling siswa
- **Guru Mata Pelajaran** - Memahami dan mengatasi masalah belajar siswa
- **Kepala Sekolah** - Monitoring dan evaluasi kasus di sekolah
- **Orang Tua** - Berkonsultasi tentang masalah anak remaja
- **Psikolog Pendidikan** - Dokumentasi dan tracking kasus klien

---

## 3. Penjelasan Struktur Project

#### 1. Root Files (File Utama)
```
├── index.html                      → Halaman utama/landing page aplikasi
├── 404.html                        → Halaman error 404 not found
├── offline.html                    → Halaman yang tampil saat offline
├── manifest.json                   → Konfigurasi PWA (app name, icons, theme)
├── sw.js                           → Service Worker untuk offline support
├── package.json                    → Dependencies dan npm scripts
├── package-lock.json               → Lock file untuk dependencies version
├── firebase.json                   → Konfigurasi Firebase hosting & deployment
├── tailwind.config.js              → Konfigurasi TailwindCSS
│
├── setup-storage.html              → Tool untuk setup Supabase storage
├── export-firestore-data.html      → Tool untuk export data Firestore
├── export-firestore-data-v2.html   → Tool export data versi 2
├── test-api-rotation.html          → Testing API key rotation
├── test-supabase-storage.html      → Testing koneksi Supabase
└── csp-debug.html                  → Debug Content Security Policy
```

#### 2. Folder `config/` - File Konfigurasi
```
config/
├── config.js                → Konfigurasi umum aplikasi
├── firebase-init.js         → Inisialisasi Firebase SDK
├── supabase-init.js         → Inisialisasi Supabase client
└── firestore.rules          → Security rules untuk Firestore database
```

#### 3. Folder `assets/` - Aset Aplikasi

##### 3.1 `assets/css/` - Styling
```
assets/css/
└── input.css               → Custom CSS untuk styling tambahan
```

##### 3.2 `assets/icons/` - Icon & Images
```
assets/icons/
├── icon-16x16.svg          → Favicon berbagai ukuran
├── icon-32x32.svg
├── icon-72x72.svg
├── icon-96x96.svg
├── icon-128x128.svg
├── icon-144x144.svg
├── icon-152x152.svg
├── icon-192x192.svg        → Icon untuk Android
├── icon-384x384.svg
├── icon-512x512.svg        → Icon untuk splash screen
├── screenshot-template.html → Template untuk screenshot PWA
├── FAVICON_INSTRUCTIONS.txt
└── PNG_GENERATION_INSTRUCTIONS.txt
```

##### 3.3 `assets/components/` - Reusable Components
```
assets/components/
├── MaterialForm.js         → Component form upload materi
└── MaterialList.js         → Component list display materi
```

##### 3.4 `assets/services/` - API Services
```
assets/services/
└── materiService.js        → Service untuk CRUD materi ke Supabase
```

##### 3.5 `assets/js/` - JavaScript Logic

**3.5.1 Authentication (`assets/js/auth/`)**
```
assets/js/auth/
├── auth-guard.js           → Middleware cek user sudah login atau belum
├── auth-service.js         → Service login, register, logout
└── auth-ui.js              → UI logic untuk form login/register
```

**3.5.2 Chat AI (`assets/js/chat/`)**
```
assets/js/chat/
├── chat-logic.js           → Logic utama chat dengan Gemini AI
└── chat-firestore-service.js → Simpan history chat ke Firestore
```

**3.5.3 Core Functions (`assets/js/core/`)**
```
assets/js/core/
├── gemini-service-secure.js → Wrapper aman untuk Gemini API
├── pwa-installer.js         → Logic install PWA ke device
├── realtime-tracking.js     → Tracking activity user real-time
├── survey-firebase-handler.js → Handle survey/feedback user
├── user-stats.js            → Statistik penggunaan user
└── sw.js                    → Service worker helper
```

**3.5.4 Forum (`assets/js/forum/`)**
```
assets/js/forum/
├── forum-logic.js          → Logic CRUD forum posts
└── forum-search.js         → Search & filter forum
```

**3.5.5 Materials (`assets/js/materials/`)**
```
assets/js/materials/
├── materials-service.js    → Service upload/download materi
├── materials-display.js    → Display list materi di UI
└── materi-search.js        → Search & filter materi
```

**3.5.6 Quiz (`assets/js/quiz/`)**
```
assets/js/quiz/
├── test-logic.js           → Logic quiz/test soal
├── quiz-session-tracker.js → Track session & progress quiz
└── quiz-firestore-service.js → Simpan hasil quiz ke Firestore
```

#### 4. Folder `pages/` - Halaman-Halaman Aplikasi

##### 4.1 `pages/auth/` - Authentication Pages
```
pages/auth/
├── login.html              → Halaman login
├── register.html           → Halaman register/daftar
└── account-info.html       → Halaman info akun user
```

##### 4.2 `pages/features/` - Feature Pages
```
pages/features/
├── chat.html               → AI Chat Assistant page
├── materi.html             → Manajemen materi pembelajaran
├── forum.html              → Forum diskusi komunitas
├── profil.html             → Halaman profil user
├── feedback-survey.html    → Survey & feedback
└── privacy-security.html   → Privacy policy & security info
```

##### 4.3 `pages/admin/` - Admin Dashboard
```
pages/admin/
├── admin-dashboard.html    → Dashboard utama admin
└── api-monitor.html        → Monitor usage API Gemini
```

#### 5. Folder `public/` - Public Static Files
```
public/
└── index.html              → Public index (redirect)
```

---

## 4. Langkah-Langkah Pembuatan

### Langkah 1: Clone Project dari GitHub

Daripada coding dari nol, lebih baik langsung clone project MoralQ yang sudah jadi dari GitHub. Ini akan menghemat waktu dan kamu bisa langsung fokus ke setup backend.

#### 1.1 Download atau Clone Repository
```bash
# Clone dengan Git
git clone https://github.com/your-username/moral-intelligence.git

# Masuk ke folder project
cd moral-intelligence
```

**Atau download manual:**
1. Buka repository GitHub: `https://github.com/your-username/moral-intelligence`
2. Klik tombol **Code** > **Download ZIP**
3. Extract file ZIP ke folder yang kamu inginkan
4. Buka folder dengan code editor (VS Code, dll)

#### 1.2 Install Dependencies

Setelah clone/download project, install semua dependencies yang dibutuhkan:

```bash
# Install dependencies
npm install
```

**Dependencies yang akan terinstall:**
- `firebase-tools` - CLI untuk deploy ke Firebase
- `live-server` - Development server untuk testing lokal
- `tailwindcss` - CSS framework untuk styling
- `docx` - Library untuk export laporan ke Word
- `dotenv` - Manage environment variables

Tunggu hingga proses instalasi selesai (~2-5 menit tergantung koneksi internet).

---

### Langkah 2: Setup Firebase

Firebase digunakan untuk:
- **Authentication** - Login dengan Google/Email
- **Firestore** - Database untuk menyimpan data user dan kasus
- **Hosting** - Deploy aplikasi ke internet

#### 2.1 Buat Project Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add Project" atau "Tambah Proyek"
3. Beri nama project (contoh: "moralq-app")
4. Enable Google Analytics (optional)
5. Klik "Create Project"

#### 2.2 Setup Firebase Web App
1. Di Firebase Console, klik icon **Web** (`</>`)
2. Beri nickname untuk app (contoh: "MoralQ Web")
3. Centang "Also set up Firebase Hosting"
4. Klik "Register app"
5. **Copy konfigurasi Firebase** yang muncul

#### 2.3 Masukkan Konfigurasi ke Project

Buka file **`config/config.js`** (bukan `firebase-config.js`, tapi `config.js`) dan cari bagian `firebaseConfig`:

```javascript
export const firebaseConfig = {
    apiKey: "COPY_DARI_FIREBASE",
    authDomain: "COPY_DARI_FIREBASE",
    projectId: "COPY_DARI_FIREBASE",
    storageBucket: "COPY_DARI_FIREBASE",
    messagingSenderId: "COPY_DARI_FIREBASE",
    appId: "COPY_DARI_FIREBASE"
};
```

Ganti semua nilai `"COPY_DARI_FIREBASE"` dengan konfigurasi yang kamu dapat dari Firebase Console di langkah sebelumnya.

#### 2.4 Setup Firestore Database
1. Di sidebar Firebase Console, klik **Firestore Database**
2. Klik "Create database"
3. Pilih lokasi server (contoh: `asia-southeast1` untuk Singapore)
4. Pilih mode **Production** (nanti kita setup rules)
5. Klik "Enable"

#### 2.5 Deploy Firestore Rules
Firestore Rules mengatur siapa yang bisa akses data. Deploy rules dengan command:
```bash
firebase login
firebase deploy --only firestore:rules
```

#### 2.6 Setup Authentication
1. Di sidebar Firebase Console, klik **Authentication**
2. Klik "Get started"
3. Klik tab **Sign-in method**
4. Enable **Google** dan **Email/Password**
   - Untuk Google: Ikuti instruksi setup OAuth
   - Untuk Email/Password: Tinggal enable saja

---

### Langkah 3: Setup Chatbot AI (Gemini)

Gemini AI adalah otak dari aplikasi MoralQ. Fitur chatbot menggunakan Google Gemini API untuk memberikan panduan moral dan solusi bijak kepada pendidik dalam menangani kasus siswa.

#### 3.1 Dapatkan Gemini API Key

1. Buka [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Login** dengan Google Account kamu
3. Klik tombol **"Create API Key"** atau **"Get API Key"**
4. Pilih project atau buat project baru (jika diminta)
5. **Copy API Key** yang muncul (simpan di tempat aman!)

**Contoh API Key:**
```
AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

#### 3.2 Masukkan API Key ke Project

Buka file **`config/config.js`** (file yang sama dengan konfigurasi Firebase).

Scroll ke bawah, cari bagian yang ada tulisan **"API KEY ROTATION SYSTEM"** dan array `geminiApiKeys`:

```javascript
// ========================================
// 🔑 API KEY ROTATION SYSTEM
// ========================================

// Array of all available API keys
export const geminiApiKeys = [
    "AIzaSyAkIyXZk5Xk36eG4hrQ0aKlRlkg6B5gaw8", // Key 0
    "AIzaSyDNn9PAXXe5vkPL2kesLCov2yhvK5Z_hrk", // Key 1
    "YOUR_API_KEY_HERE",  // Key 2 - GANTI INI!
    // ... dst
];
```

**Cara mengisi:**
- Jika kamu punya **1 API key**: Ganti salah satu key di array (misal Key 0 atau Key 2)
- Jika kamu punya **banyak API key**: Tambahkan semua key kamu ke array (untuk menghindari limit)

**Contoh:**
```javascript
export const geminiApiKeys = [
    "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567", // API key kamu
];
```

**Note:** Project ini punya sistem rotation keys otomatis. Jadi kalau satu key kena limit, otomatis pindah ke key berikutnya.

#### 3.3 Test Chatbot

Untuk memastikan chatbot berfungsi:
1. Jalankan aplikasi dengan `npm start`
2. Login ke aplikasi
3. Buka halaman **Chat** (`pages/features/chat.html`)
4. Coba kirim pesan ke chatbot
5. Jika berhasil, chatbot akan merespon dengan jawaban yang relevan

**Note Penting:**
- API key ini **GRATIS** tapi ada limit penggunaan per hari
- Untuk production, sebaiknya API key disimpan di **environment variable** atau **backend proxy** agar lebih aman
- Jangan share API key ke publik atau commit ke GitHub!

---

### Langkah 4: Setup Supabase (Storage File)

Supabase digunakan untuk menyimpan file-file materi pembelajaran seperti PDF, DOCX, gambar, dan dokumen lainnya. User dapat upload dan download materi melalui aplikasi.

#### 4.1 Buat Project Supabase

1. Buka [Supabase.com](https://supabase.com/)
2. **Sign up** atau **Login** (bisa pakai GitHub account)
3. Klik tombol **"New Project"**
4. Isi detail project:
   - **Name**: `MoralQ Storage` (atau nama lain yang kamu suka)
   - **Database Password**: Buat password yang kuat (simpan baik-baik!)
   - **Region**: Pilih **Southeast Asia (Singapore)** untuk performa terbaik di Indonesia
5. Klik **"Create new project"**
6. Tunggu ~2 menit sampai project selesai di-setup

#### 4.2 Buat Storage Bucket

Storage bucket adalah tempat penyimpanan file di Supabase.

1. Di sidebar kiri, klik **Storage**
2. Klik tombol **"Create a new bucket"**
3. Isi form:
   - **Name**: `materi` (nama bucket untuk materi pembelajaran)
   - **Public bucket**: **Centang** (agar file bisa diakses publik)
4. Klik **"Create bucket"**

#### 4.3 Ambil API Keys

1. Di sidebar kiri, klik **Settings** (icon gear)
2. Klik **API** di menu settings
3. Di halaman API Settings, kamu akan melihat:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. **Copy kedua nilai tersebut**

#### 4.4 Masukkan Konfigurasi ke Project

Buka file `config/supabase-init.js` di project kamu, lalu isi:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // Paste Project URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // Paste anon key
```

#### 4.5 Setup Storage Policies (Opsional tapi Recommended)

Agar user yang sudah login bisa upload file, kita perlu setup policies:

1. Di Supabase Dashboard, klik bucket **`materi`**
2. Klik tab **"Policies"**
3. Klik **"New Policy"**
4. Buat 3 policy:

**Policy 1: Public Read (SELECT)**
- **Allowed operation**: SELECT
- **Policy name**: "Public can view files"
- **Target roles**: public
- **Click**: Use this template > "Enable read access for all users"

**Policy 2: Authenticated Upload (INSERT)**
- **Allowed operation**: INSERT
- **Policy name**: "Authenticated users can upload"
- **Using expression**: `auth.role() = 'authenticated'`

**Policy 3: Authenticated Delete (DELETE)**
- **Allowed operation**: DELETE
- **Policy name**: "Authenticated users can delete own files"
- **Using expression**: `auth.role() = 'authenticated'`

#### 4.6 Test Upload File

1. Jalankan aplikasi
2. Login
3. Buka halaman **Materi** (`pages/features/materi.html`)
4. Coba upload file (PDF, DOCX, atau gambar)
5. File harus muncul di list dan tersimpan di Supabase

---

## 5. Testing & Deployment

Setelah semua setup selesai (Firebase, Gemini AI, Supabase), saatnya test dan deploy aplikasi!

### 5.1 Testing di Local (Localhost)

Jalankan aplikasi di komputer kamu untuk testing:

```bash
# Jalankan development server
npm start

# Atau manual dengan live-server
npx live-server
```

Aplikasi akan otomatis terbuka di browser dengan URL:
```
http://127.0.0.1:8080
```

### 5.2 Checklist Testing Fitur

Test semua fitur utama untuk memastikan semuanya berfungsi:

**1. Authentication**
- [ ] Login dengan Email & Password
- [ ] Login dengan Google Account
- [ ] Register akun baru
- [ ] Logout

**2. AI Chatbot (Gemini)**
- [ ] Buka halaman Chat
- [ ] Kirim pertanyaan ke chatbot
- [ ] Chatbot merespon dengan jawaban yang relevan
- [ ] History chat tersimpan

**3. Materi (Supabase Storage)**
- [ ] Upload file PDF/DOCX/gambar
- [ ] File muncul di list materi
- [ ] Download file yang sudah diupload
- [ ] Delete file (jika ada fitur delete)

**4. Firestore Database**
- [ ] Data user tersimpan
- [ ] CRUD operations berfungsi
- [ ] Data realtime update

**5. PWA (Progressive Web App)**
- [ ] Aplikasi bisa diinstall di smartphone/desktop
- [ ] Offline mode berfungsi
- [ ] Icon dan splash screen muncul

### 5.3 Deploy ke Firebase Hosting

Jika semua test lokal sudah OK, deploy aplikasi ke internet agar bisa diakses publik:

#### 5.3.1 Login ke Firebase CLI
```bash
# Login ke Firebase
firebase login
```

Browser akan terbuka, pilih akun Google yang sama dengan Firebase Console.

#### 5.3.2 Initialize Firebase (jika belum)
```bash
# Initialize Firebase di project
firebase init

# Pilih:
# - Hosting
# - Existing project: pilih project yang sudah dibuat
# - Public directory: tekan Enter (default)
# - Single-page app: Yes
# - Overwrite index.html: No
```

#### 5.3.3 Deploy Aplikasi
```bash
# Deploy semua (hosting + firestore rules)
firebase deploy

# Atau deploy hosting saja (lebih cepat)
firebase deploy --only hosting
```

Tunggu proses deploy selesai (~1-2 menit).

#### 5.3.4 Akses Aplikasi Live

Setelah deploy berhasil, kamu akan dapat URL seperti:
```
✔  Deploy complete!

Hosting URL: https://your-project-id.web.app
```

Buka URL tersebut di browser untuk melihat aplikasi yang sudah live!

### 5.4 Update & Redeploy

Jika ada perubahan di code dan mau update aplikasi:

```bash
# Deploy ulang
firebase deploy --only hosting
```

Perubahan akan langsung terlihat di URL production.

---

## 6. Kesimpulan

Proyek **MoralQ** adalah web aplikasi modern yang menggabungkan kecerdasan buatan (Gemini AI) dengan Firebase untuk menciptakan platform yang membantu pendidik memberikan panduan moral kepada remaja.

### Poin Penting:
1. **Frontend sederhana** - Menggunakan HTML, CSS (Tailwind), dan JavaScript modular
2. **Backend powerful** - Firebase menyediakan database, authentication, dan hosting dalam satu platform
3. **AI Integration** - Gemini AI memberikan saran yang cerdas dan relevan
4. **PWA Ready** - Aplikasi dapat diinstall dan bekerja offline
5. **Mudah di-deploy** - Dengan satu command (`firebase deploy`), aplikasi langsung online

### Next Steps:
- Tambahkan fitur-fitur baru sesuai kebutuhan
- Improve UI/UX dengan animasi dan interaksi yang lebih baik
- Implementasi testing (unit test, integration test)
- Monitoring dan analytics untuk track penggunaan
- Optimization untuk performa yang lebih baik

**Selamat mencoba dan semoga sukses!**
