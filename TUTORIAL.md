# Tutorial Lengkap: Membuat Database, Mendapatkan API Keys, dan Deploy ke Vercel

Selamat datang di tutorial lengkap untuk proyek satriabahari.my.id! Tutorial ini akan memandu Anda dari awal hingga akhir dalam menyiapkan proyek ini, termasuk membuat database, mendapatkan API keys dan kredensial yang diperlukan, serta melakukan deploy ke Vercel. Semua informasi kredensial yang dibutuhkan sudah tercantum di file README.md, dan tutorial ini akan menjelaskan cara mendapatkannya secara detail.

Proyek ini menggunakan teknologi seperti Next.js, TypeScript, Tailwind CSS, Supabase (untuk database PostgreSQL), dan berbagai API eksternal untuk fitur seperti statistik Wakatime, GitHub, Codewars, dll.

## Persiapan Awal

Sebelum memulai, pastikan Anda memiliki:
- Akun GitHub (untuk cloning repository)
- Node.js atau Bun terinstal (disarankan menggunakan Bun)
- Akun di berbagai layanan yang akan digunakan (akan dijelaskan di bagian masing-masing)

### Langkah 1: Clone Repository

Clone repository dari GitHub:

```bash
git clone https://github.com/satriabahari/satriabahari.my.id
cd satriabahari.my.id-main
```

### Langkah 2: Install Dependencies

Gunakan Bun untuk menginstall dependencies:

```bash
bun install
```

## Bagian 1: Membuat Database dengan Supabase

Proyek ini menggunakan Supabase sebagai database PostgreSQL untuk menyimpan data proyek dan informasi lainnya. Supabase adalah platform open-source yang menyediakan database PostgreSQL, autentikasi, dan API real-time.

### Langkah-langkah Membuat Database Supabase:

1. **Buat Akun Supabase**:
   - Kunjungi [supabase.com](https://supabase.com)
   - Klik "Start your project" dan daftar menggunakan email atau akun GitHub/Google
   - Verifikasi email Anda jika diperlukan

2. **Buat Proyek Baru**:
   - Setelah login, klik "New project"
   - Pilih organisasi (jika Anda memiliki beberapa)
   - Masukkan nama proyek, misalnya "satriabahari-my-id"
   - Pilih region terdekat (misalnya, Singapore atau Tokyo untuk Asia)
   - Buat password database (ingat password ini)
   - Klik "Create new project"

3. **Tunggu Proyek Siap**:
   - Proyek akan memakan waktu beberapa menit untuk disiapkan
   - Anda akan melihat dashboard proyek setelah selesai

4. **Konfigurasi Database**:
   - Di dashboard Supabase, buka tab "Settings" > "Database"
   - Catat informasi berikut (akan digunakan untuk environment variables):
     - Host: `db.[project-ref].supabase.co`
     - Database: `postgres`
     - Port: `5432`
     - Username: `postgres`
     - Password: Password yang Anda buat saat membuat proyek

5. **Buat Tabel Database**:
   - Buka tab "Table Editor"
   - Buat tabel sesuai kebutuhan proyek (misalnya tabel untuk projects, achievements, dll.)
   - Atau, jika proyek sudah memiliki schema, Anda bisa menjalankan SQL queries untuk membuat tabel

6. **Dapatkan API Keys**:
   - Di tab "Settings" > "API"
   - Catat:
     - Project URL: `https://[project-ref].supabase.co`
     - Anon public key: Untuk akses publik
     - Service role key: Untuk akses admin (jaga kerahasiaannya)

### Environment Variables untuk Supabase:

Setelah mendapatkan informasi di atas, tambahkan ke file `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
POSTGRES_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
POSTGRES_URL_NO_SSL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
POSTGRES_URL_NON_POOLING=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
POSTGRES_USER=postgres
POSTGRES_HOST=db.[project-ref].supabase.co
POSTGRES_PASSWORD=your_password_here
POSTGRES_DATABASE=postgres
```

## Bagian 2: Mendapatkan API Keys dan Kredensial

Proyek ini memerlukan berbagai API keys dari layanan eksternal. Berikut penjelasan detail cara mendapatkannya:

### 1. Nodemailer (untuk Email)

Nodemailer digunakan untuk mengirim email, misalnya untuk form kontak.

**Cara Mendapatkan:**
- Gunakan email provider seperti Gmail, Outlook, atau Yahoo
- Untuk Gmail:
  - Buka [myaccount.google.com](https://myaccount.google.com)
  - Aktifkan "2-Step Verification"
  - Buat "App Password" di bagian "Security" > "App passwords"
  - Pilih "Mail" dan "Other (custom name)", beri nama seperti "satriabahari-app"
  - Gunakan app password ini sebagai NODEMAILER_PW

**Environment Variables:**
```
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PW=your_app_password_here
```

### 2. GitHub Token

Digunakan untuk mengambil data kontribusi GitHub.

**Cara Mendapatkan:**
- Buka [github.com/settings/tokens](https://github.com/settings/tokens)
- Klik "Generate new token (classic)"
- Beri nama, misalnya "satriabahari-personal-website"
- Pilih scope: `read:user`, `read:org`, `repo` (untuk akses publik)
- Klik "Generate token"
- Salin token (hanya muncul sekali!)

**Environment Variables:**
```
GITHUB_READ_USER_TOKEN_PERSONAL=ghp_your_token_here
```

### 3. Umami Analytics

Untuk tracking analytics website.

**Cara Mendapatkan:**
- Kunjungi [umami.is](https://umami.is)
- Daftar akun
- Buat website baru di dashboard
- Dapatkan Website ID dan API Key dari settings

**Environment Variables:**
```
UMAMI_API_KEY=your_umami_api_key
UMAMI_WEBSITE_ID_SITE=your_site_id
UMAMI_WEBSITE_ID_MYID=your_myid_id
```

### 4. Wakatime

Untuk statistik coding time.

**Cara Mendapatkan:**
- Kunjungi [wakatime.com](https://wakatime.com)
- Daftar/Login
- Buka [wakatime.com/api-key](https://wakatime.com/api-key)
- Salin API Key
- User ID biasanya sama dengan username Anda

**Environment Variables:**
```
WAKATIME_API_ID=your_wakatime_username
WAKATIME_API_KEY=your_wakatime_api_key
```

### 5. Monkeytype

Untuk statistik typing.

**Cara Mendapatkan:**
- Kunjungi [monkeytype.com](https://monkeytype.com)
- Daftar akun
- Buka settings > Account > API
- Generate API key

**Environment Variables:**
```
MONKEYTYPE_API_KEY=your_monkeytype_api_key
```

### 6. Codewars

Untuk statistik coding challenges.

**Cara Mendapatkan:**
- Username Codewars Anda (tidak perlu API key khusus)
- Kunjungi profil Anda di [codewars.com/users/your_username](https://codewars.com/users/your_username)

**Environment Variables:**
```
CODEWARS_USER_ID=your_codewars_username
```

### 7. Google Auth (OAuth)

Untuk autentikasi dengan Google.

**Cara Mendapatkan:**
- Kunjungi [console.cloud.google.com](https://console.cloud.google.com)
- Buat project baru atau pilih existing
- Aktifkan Google+ API
- Buka "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
- Pilih "Web application"
- Tambahkan authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` dan `https://yourdomain.com/api/auth/callback/google`
- Dapatkan Client ID dan Client Secret

**Environment Variables:**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 8. Gemini API (Google AI)

Untuk fitur AI chat.

**Cara Mendapatkan:**
- Kunjungi [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Klik "Create API key"
- Salin API key

**Environment Variables:**
```
GEMINI_API_KEY=your_gemini_api_key
```

### 9. GitHub Auth (OAuth)

Untuk autentikasi dengan GitHub.

**Cara Mendapatkan:**
- Buka [github.com/settings/developers](https://github.com/settings/developers)
- Klik "New OAuth App"
- Isi:
  - Application name: satriabahari.my.id
  - Homepage URL: http://localhost:3000 (untuk development)
  - Authorization callback URL: http://localhost:3000/api/auth/callback/github
- Klik "Register application"
- Dapatkan Client ID dan Client Secret

**Environment Variables:**
```
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_app_secret
```

### 10. NextAuth Secret

Untuk keamanan NextAuth.

**Cara Mendapatkan:**
- Generate random string, bisa menggunakan command:
```bash
openssl rand -base64 32
```
Atau gunakan online generator seperti [random.org](https://www.random.org/strings/)

**Environment Variables:**
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

### 11. Firebase

Untuk real-time database dan autentikasi.

**Cara Mendapatkan:**
- Kunjungi [console.firebase.google.com](https://console.firebase.google.com)
- Buat project baru
- Aktifkan Authentication dan Realtime Database
- Buka Settings > General > Your apps > Add app (Web)
- Dapatkan config object dengan API key, auth domain, dll.

**Environment Variables:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DB_URL=https://your_project-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_CHAT_DB=messages
```

### 12. Miscellaneous

**Environment Variables:**
```
NEXT_PUBLIC_AUTHOR_EMAIL=your_email@example.com
DOMAIN=https://www.yourdomain.com
```

## Bagian 3: Deploy ke Vercel

Vercel adalah platform deployment yang optimal untuk aplikasi Next.js.

### Langkah-langkah Deploy:

1. **Buat Akun Vercel**:
   - Kunjungi [vercel.com](https://vercel.com)
   - Daftar menggunakan GitHub, GitLab, atau email

2. **Import Proyek**:
   - Klik "New Project"
   - Import dari GitHub repository
   - Pilih repository "satriabahari/satriabahari.my.id"
   - Vercel akan otomatis mendeteksi sebagai Next.js project

3. **Konfigurasi Build Settings**:
   - Build Command: `bun run build` (atau `npm run build`)
   - Output Directory: `.next` (default)
   - Install Command: `bun install` (atau `npm install`)

4. **Environment Variables**:
   - Di tab "Environment Variables", tambahkan semua variabel dari `.env`
   - Pastikan semua API keys dan kredensial sudah diisi
   - Untuk production, gunakan domain Anda di NEXTAUTH_URL dan DOMAIN

5. **Deploy**:
   - Klik "Deploy"
   - Tunggu proses build selesai
   - Jika berhasil, Anda akan mendapat URL deployment

6. **Konfigurasi Domain (Opsional)**:
   - Di dashboard Vercel, buka "Settings" > "Domains"
   - Tambahkan custom domain Anda
   - Update DNS records sesuai instruksi

7. **Update Environment Variables untuk Production**:
   - Setelah deploy, update NEXTAUTH_URL ke URL production
   - Update DOMAIN ke domain Anda
   - Redeploy jika perlu

### Troubleshooting Deploy:
- Pastikan semua environment variables sudah benar
- Cek logs build di Vercel dashboard jika ada error
- Untuk database Supabase, pastikan connection string benar
- Jika menggunakan custom domain, pastikan DNS sudah dikonfigurasi

## Kesimpulan

Selamat! Anda telah berhasil menyiapkan proyek satriabahari.my.id dari awal hingga deploy. Pastikan semua API keys dan kredensial sudah dikonfigurasi dengan benar sebelum deploy ke production.

Jika ada masalah, periksa:
- Logs aplikasi di Vercel
- Console browser untuk error JavaScript
- Environment variables sudah ter-set dengan benar
- Database Supabase sudah terhubung

Untuk development lokal, jalankan:
```bash
bun run dev
```

Dan buka [http://localhost:3000](http://localhost:3000)

Semoga tutorial ini membantu! Jika ada pertanyaan, silakan buat issue di repository GitHub.
