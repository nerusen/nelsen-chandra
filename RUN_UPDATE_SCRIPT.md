# Panduan Menjalankan Script update_github.sh

## Persiapan Sebelum Menjalankan

### 1. Pastikan Anda Sudah Mengubah Link Repository
Buka file `update_github.sh` dan pastikan baris terakhir sudah diubah sesuai repository GitHub Anda:

```bash
echo "🔗 Check your repository at: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME"
```

Ganti `YOUR_USERNAME` dan `YOUR_REPO_NAME` dengan username dan nama repository GitHub Anda yang sebenarnya.

### 2. Pastikan Anda di Direktori yang Benar
Script ini harus dijalankan dari direktori root proyek `nelsen-chandra-main`.

## Cara Menjalankan Script

### Metode 1: Jalankan Langsung (Direkomendasikan)

#### Langkah 1: Berikan Permission Execute
```bash
chmod +x update_github.sh
```

#### Langkah 2: Jalankan Script
```bash
./update_github.sh
```

### Metode 2: Jalankan Manual Perintah Demi Perintah

Jika Anda ingin menjalankan perintah satu per satu secara manual:

#### Langkah 1: Cek Status Git
```bash
git status
```

#### Langkah 2: Tambahkan Semua File
```bash
git add .
```

#### Langkah 3: Commit Perubahan
```bash
git commit -m "feat: Add Smart Talk AI Chat feature

- Add login page with Google/GitHub authentication
- Implement private AI chat with OpenRouter integration
- Add real-time messaging with Supabase
- Include cooldown mechanism and welcome messages
- Add bubble chat UI with proper styling
- Update sidebar with login/logout functionality
- Add comprehensive Indonesian setup documentation"
```

#### Langkah 4: Force Push ke GitHub
```bash
git push origin main --force
```

## Penjelasan Detail Setiap Perintah

### 1. `chmod +x update_github.sh`
- **Fungsi**: Memberikan permission execute pada file script
- **Mengapa diperlukan**: File bash script perlu permission execute untuk bisa dijalankan
- **Output yang diharapkan**: Tidak ada output jika berhasil

### 2. `./update_github.sh`
Script akan menjalankan perintah berikut secara otomatis:

#### A. Cek Direktori
```bash
if [ "$(basename $(pwd))" != "nelsen-chandra-main" ]; then
    echo "❌ Error: Not in correct directory. Please run from nelsen-chandra-main/"
    exit 1
fi
```
- **Fungsi**: Memastikan Anda berada di direktori yang benar
- **Output jika salah direktori**: Error message dan script berhenti

#### B. Cek Status Git
```bash
git status
```
- **Fungsi**: Menampilkan status perubahan file di repository
- **Output**: Menampilkan file yang modified, untracked, dll.

#### C. Tambah Semua File
```bash
git add .
```
- **Fungsi**: Menambahkan semua file baru dan perubahan ke staging area
- **Output**: Tidak ada output jika berhasil

#### D. Commit Perubahan
```bash
git commit -m "feat: Add Smart Talk AI Chat feature

- Add login page with Google/GitHub authentication
- Implement private AI chat with OpenRouter integration
- Add real-time messaging with Supabase
- Include cooldown mechanism and welcome messages
- Add bubble chat UI with proper styling
- Update sidebar with login/logout functionality
- Add comprehensive Indonesian setup documentation"
```
- **Fungsi**: Membuat commit dengan pesan yang deskriptif
- **Output**: Commit hash dan pesan konfirmasi

#### E. Force Push ke GitHub
```bash
git push origin main --force
```
- **Fungsi**: Mengirim perubahan ke GitHub dan mengganti history yang ada
- **Output**: Progress upload dan konfirmasi berhasil

## Troubleshooting

### Error: Permission Denied
```bash
# Solusi: Berikan permission execute
chmod +x update_github.sh
```

### Error: Not in correct directory
```bash
# Solusi: Pindah ke direktori yang benar
cd /home/tiny/sd/nelsen-chandra-main
```

### Error: Repository tidak ditemukan
```bash
# Solusi: Cek dan update remote URL
git remote -v
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Error: Authentication failed
```bash
# Solusi: Setup autentikasi GitHub
# Opsi 1: Personal Access Token
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Opsi 2: SSH (jika sudah setup)
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Error: Branch 'main' tidak ada di remote
```bash
# Solusi: Push dengan upstream
git push -u origin main --force
```

## Verifikasi Setelah Menjalankan

### Cek Repository GitHub
1. Buka browser dan kunjungi repository GitHub Anda
2. Pastikan semua file baru sudah ter-upload:
   - `app/login/page.tsx`
   - Folder `modules/login/`
   - Folder `modules/smarttalk/`
   - `app/api/smart-talk/route.ts`
   - `SMART_TALK_SETUP.md`
   - `GITHUB_UPDATE_GUIDE.md`

### Cek Commit History
```bash
git log --oneline -5
```
- Harus menampilkan commit terbaru dengan pesan "feat: Add Smart Talk AI Chat feature"

### Cek Remote Status
```bash
git status
git branch -r
```

## File yang Akan Ditambahkan ke GitHub

Pastikan file-file berikut berhasil ter-upload:

### Halaman Baru:
- ✅ `app/login/page.tsx` - Halaman login
- ✅ `app/smart-talk/page.tsx` - Halaman Smart Talk (sudah ada, mungkin diupdate)

### Komponen Login:
- ✅ `modules/login/components/LoginForm.tsx`
- ✅ `modules/login/index.ts`

### Komponen Smart Talk:
- ✅ `modules/smarttalk/components/SmartTalk.tsx`
- ✅ `modules/smarttalk/components/SmartTalkRoom.tsx`
- ✅ `modules/smarttalk/components/SmartTalkAuth.tsx`
- ✅ `modules/smarttalk/components/SmartTalkInput.tsx`
- ✅ `modules/smarttalk/components/SmartTalkItem.tsx`
- ✅ `modules/smarttalk/components/SmartTalkList.tsx`
- ✅ `modules/smarttalk/components/SmartTalkItemSkeleton.tsx`
- ✅ `modules/smarttalk/index.ts`

### API Routes:
- ✅ `app/api/smart-talk/route.ts`

### File Konfigurasi yang Diupdate:
- ✅ `common/types/chat.ts` - Type definitions
- ✅ `common/components/layouts/sidebar/MenuItem.tsx` - Sidebar menu
- ✅ `messages/en.json` - English translations
- ✅ `messages/id.json` - Indonesian translations

### Dokumentasi:
- ✅ `SMART_TALK_SETUP.md` - Setup instructions
- ✅ `GITHUB_UPDATE_GUIDE.md` - GitHub update guide
- ✅ `RUN_UPDATE_SCRIPT.md` - File ini

## Tips Tambahan

1. **Backup dulu** jika ada data penting di repository GitHub
2. **Test locally** sebelum push ke production
3. **Monitor GitHub Actions** jika menggunakan CI/CD
4. **Update README.md** jika perlu menjelaskan fitur baru
5. **Tag release** setelah update berhasil

## Jika Bermasalah

Jika script gagal, Anda bisa:
1. Menjalankan perintah manual satu per satu
2. Menggunakan GitHub Desktop untuk upload
3. Upload ZIP file secara manual via GitHub web interface
4. Hubungi support GitHub jika ada masalah autentikasi

---

**Catatan**: Pastikan Anda memiliki akses write ke repository GitHub tersebut. Jika menggunakan GitHub Organizations, pastikan Anda memiliki permission yang cukup.
