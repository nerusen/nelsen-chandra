# INTRUKSI STRIKE GAME RUNTUNAN HARI

## DESKRIPSI SINGKAT GAME
buatlah sebuah tab baru "Strike Game".
berisi sebuah permainan sederhana (strike runtunan hari secara total atau berturut-turut). 

# MAIN
dibagian atas terdapat judul, deskripsi, dan garis pembatas seperti tab lainnya. lalu dibawahnya terdapat sebuah container atau gelembung yang berisi foto profil dan username (google atau github). lalu dibawah sebelah kiri terdapat button reset (reset progress). dan di sisi kanan terdapat button leaderboard (papan peringkat semua user yang telah bermain maupun hanya login). lalu dibawahnya terdapat sebuah media berformat gif, yang menampilkan media sesuai level user. atur ukuran media agar tidak terlalu kecil dan besar. dibawah media gif terdapat button "Strike Upgrade". lalu dibawahnya terdapat beberapa gelembung yang berisi info user. seperti user strike name, user rank, user name, dan user leadboard. saat user klik gelembung masing masing, dapat menampilkan informasi user tersebut (dengan gaya popup). berikut adalah informasi masing masing :
• strike name: menampilkan popup strike name dan icon change name untuk mengganti nama strike.
• user rank: popup berisi user rank (name rank dan icon rank). 
• user name: popup berisi user name (username google atau github).
• user leadboard: popup urutan peringkat user tersebut (#urutan), sebagai contoh "#1". button leadboard yang memunculkan popup leadboard. 

dibagian bawah info player terdapat button dan icon "Guide" yang memunculkan popup informasi semua rank dan level. pada popup terdapat button group "Rank" dan "Level", masing-masing memiliki informasi. pada Rank terdapat tabel Rank, Badge (icon rank), dan Deskripsi. pada tabel Level terdapat Level (0-80) yang sesuai dengan image gif, tabel Strike (image gif sesuai level), tabel Deskripsi. sesuaikan style tabel agar rapi.

berikut adalah informasi nama & icon untuk setiap level:
level-0: GiBullseye (Unknown)
level-1: GiAncientSword (Beginner)
level-7: GiiAllForOne (Explorer)
level-15: GiBatBlade (Adventurer)
level-30: GiBoltShield (Hero)
level-50: GiBurningSkull (Knight)
level-75: GiAngelWings (Legend)
level-100: GiAngelOutfit (Mystic)
level-150: GiLaurelCrown (God)

icon informasi general:
Leadboard button: GiHolyGrail
Strike Upgrade button: GiUpgrade
reset button: (sesuaikan)

Isi Popup leadboard :
- Nomor 1 hingga semua user yang login.
- Foto user (Google atau github).
- Nama Strike dan Username, contoh: "Strike Name - Username".
- Image gif sesuai level user (sesuaikan ukuran image).
- Badge rank (icon rank).

Note Leadboard popup:
- setiap user memiliki style gelembung yang terpisah dengan user lain.
- top 1st, 2nd, 3rd memiliki style gelembung khusus (sesuaikan warna gelembung yang spesial, dan setiap warna 1, 2, dan 3 berbeda)

Rules:
1. strike dapat diupgrade hanya 1 kali dalam sehari (realtime).
2. jika terlewat 1 hari dan tidak di upgrade saat itu, maka menampilkan image level-0. namun masih menampilkan level strike user tersebut.
3. berikan button "restore strike" jika runtunan hari mati. dan akan mengembalikan image ke semula sesuai level strike user.
4. user dapat restore strike atau pulihkan strike hanya 3 kali selama 1 bulan. jika lebih dari itu, maka level menjadi 0 dan kembali ke semula.

opsional:
- buat label 0/3 (sesuai kesempatan pemulihan user) disamping button upgrade strike.
- buat tabel rules (atur ulang rangkaian kalimat pada bagian rules untuk ditampilkan pada semua user). buat kalimat yang mudah dipahami oleh pengguna.

kesimpulan rules:
- menggunakan realtime
- upgrade strike 1 kali dalam sehari.
- waktu bisa upgrade pada pukul 00.00 WIB.
- max 3 kali pemulihan dalam 1 bulan (sesuaikan bulan masehi) secara realtime.

Warning:
- Pastikan semua icon di import dengan benar dan lengkap.
- Pastikan semua ui Strike Game sesuai dengan tema dark/light.
- Pastikan image gif diatur ukurannya agar tidak berantakan.
- Pastikan style gelembung, teks, tema, dan lainnya sama seperti tab lainnya (jangan menirukan style music room).
- Atur icon Strike Game pada sidebar berbentuk icon api atau fire.
- Tidak bisa membuka Strike Game sebelum login. arahkan user ke halaman login untuk login (jika belum login).
- Buat file MarkDown lengkap mengatur database (supabase), dan konfigurasi lainnya.
- Jika perlu buatlah file sql lengkap berisi table dan rls police untuk Strike Games.
- Jika ada yang perlu ditanyakan, tanyakan saya terlebih dahulu! jika tidak ada, lanjutkan projek.

assets: 
- assets image gif berada pada /public/images/strike/
- ukuran image gif yaitu 480×480 pixel. sesuaikan ukuran dan tampilannya pada website (pada tampilan utama maupun pada leadboard dan informasi user). 