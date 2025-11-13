# Instruksi Setup Smart Talk AI Chat

## Gambaran Umum
Smart Talk adalah fitur chat bertenaga AI yang terintegrasi ke dalam situs portofolio. Ini memungkinkan pengguna untuk melakukan percakapan pribadi dengan asisten AI menggunakan OpenRouter API.

## Prasyarat
- Aplikasi Next.js dengan NextAuth.js yang dikonfigurasi
- Database Supabase
- Akun OpenRouter API

## Cara Mendapatkan API Key OpenRouter

### Langkah-langkah Mendapatkan API Key:

1. **Kunjungi Website OpenRouter**
   - Buka https://openrouter.ai/ di browser Anda

2. **Buat Akun**
   - Klik "Sign Up" di pojok kanan atas
   - Daftar menggunakan email atau akun Google/GitHub

3. **Verifikasi Email**
   - Periksa email Anda dan klik link verifikasi

4. **Akses Dashboard**
   - Setelah login, klik "Dashboard" atau "API Keys"

5. **Buat API Key Baru**
   - Klik "Create API Key"
   - Berikan nama untuk key (misalnya: "SmartTalk-Chat")
   - Klik "Create"

6. **Salin API Key**
   - Copy API key yang dihasilkan
   - Simpan di tempat yang aman (jangan commit ke Git)

### Opsi Gratis dan Terjangkau:

#### **Free Tier (Gratis)**
- **Kredit Awal**: $1 kredit gratis untuk testing
- **Model yang Tersedia**: Claude 3 Haiku, Gemini Flash, Llama 3.1
- **Batasan**: Terbatas pada kredit awal
- **Rekomendasi**: Sangat baik untuk development dan testing

#### **Pay-as-you-go (Bayar sesuai penggunaan)**
- **Harga mulai dari**: $0.001 per token
- **Model Populer**:
  - Claude 3 Haiku: ~$0.0003 per pesan
  - Claude 3 Sonnet: ~$0.0015 per pesan
  - GPT-4o: ~$0.0015 per pesan
- **Keuntungan**: Tidak ada subscription bulanan, bayar sesuai penggunaan

#### **Rekomendasi untuk Smart Talk**:
- **Untuk Development**: Gunakan free tier ($1 kredit)
- **Untuk Production**: Claude 3 Haiku - balance antara harga dan kualitas
- **Budget-friendly**: Gemini Flash untuk penggunaan tinggi

### Tips Penggunaan:
- **Monitoring**: Pantau penggunaan di dashboard OpenRouter
- **Rate Limits**: Free tier memiliki batas 20 requests per menit
- **Cost Control**: Set budget limits untuk menghindari biaya berlebih

## Variabel Lingkungan
Tambahkan yang berikut ke file `.env.local` Anda:

```env
# OpenRouter API untuk respons AI
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Variabel NextAuth dan Supabase yang sudah ada harus sudah dikonfigurasi
```

## Skema Database
Buat tabel baru di database Supabase Anda:

```sql
CREATE TABLE smart_talk_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  image TEXT,
  message TEXT NOT NULL,
  is_reply BOOLEAN DEFAULT FALSE,
  reply_to TEXT,
  is_show BOOLEAN DEFAULT TRUE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_ai BOOLEAN DEFAULT FALSE,
  user_email TEXT NOT NULL, -- Untuk memfilter pesan per pengguna
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan Row Level Security
ALTER TABLE smart_talk_messages ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan agar pengguna hanya dapat melihat pesan mereka sendiri
CREATE POLICY "Users can view their own messages" ON smart_talk_messages
  FOR SELECT USING (auth.uid()::text = user_email);

-- Buat kebijakan untuk menyisipkan pesan
CREATE POLICY "Users can insert their own messages" ON smart_talk_messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_email);

-- Buat kebijakan agar AI dapat menyisipkan respons
CREATE POLICY "AI can insert responses" ON smart_talk_messages
  FOR INSERT WITH CHECK (email = 'ai@smarttalk.com');
```

## Fitur yang Diimplementasikan
- ✅ Halaman login dengan autentikasi Google/GitHub
- ✅ Chat pribadi per pengguna (difilter berdasarkan email)
- ✅ Respons AI menggunakan OpenRouter API (Claude 3 Haiku)
- ✅ Pembaruan real-time dengan Supabase
- ✅ Mekanisme cooldown (3 detik antar pesan)
- ✅ Pesan selamat datang saat pesan pertama pengguna
- ✅ UI bubble chat (pengguna: kanan neutral-700, AI: kiri neutral-800)
- ✅ Tombol login/logout di sidebar untuk Smart Talk
- ✅ Desain responsif konsisten dengan ruang chat

## Endpoint API
- `GET /api/smart-talk?email=user@example.com` - Ambil pesan pengguna
- `POST /api/smart-talk` - Kirim pesan atau dapatkan respons AI

## Komponen yang Dibuat
- `LoginForm` - Formulir autentikasi
- `SmartTalkRoom` - Komponen ruang chat utama
- `SmartTalkAuth` - Prompt login
- `SmartTalkInput` - Input dengan cooldown
- `SmartTalkItem` - Bubble pesan
- `SmartTalkList` - Daftar pesan
- `SmartTalkItemSkeleton` - Skeleton loading

## Pengujian
1. Kunjungi `/login` untuk autentikasi
2. Pergi ke `/smart-talk` untuk mulai chatting
3. Kirim pesan dan tunggu respons AI
4. Periksa fungsionalitas cooldown
5. Uji logout dari sidebar

## Catatan
- Pesan bersifat pribadi per email pengguna
- AI menggunakan model Claude 3 Haiku untuk respons
- Cooldown mencegah spam (3 detik)
- Pembaruan real-time bekerja melalui subscription Supabase
- Styling cocok dengan desain ruang chat yang ada
