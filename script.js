
"use strict";

// ========================================
// 1. DATA QUIZ
// ========================================

const quizData = [
   {
      soal: "Apa kepanjangan RPL",
      pilihan: ["Rekayasa Perangkat Lunak", "Rekayasa Program Linux", "Rancangan Perangkat Logika", "Rekayasa Pemrograman"],
      jawaban: 0
   },
   {
      soal: "Planet mana yang dijuluki sebagai 'Planet Merah'?",
      pilihan: ["Venus", "Jupiter", "Mars", "Saturnus"],
      jawaban: 2
   },
   {
      soal: "Berapa hasil dari 5 + 5 x 0?",
      pilihan: ["0", "5", "10", "50"],
      jawaban: 1
   },
   {
      soal: "Apa fungsi HTML?",
        pilihan: ["Styling", "Database", "Struktur web", "Server"],
        jawaban: 2
   },
   {
      soal: "Unsur kimia dengan lambang 'O' adalah...",
      pilihan: ["Emas", "Oksigen", "Osmium", "Ozon"],
      jawaban: 1
   },
   {
      soal: "Di antara berikut, mana yang BUKAN warna primer?",
      pilihan: ["Merah", "Kuning", "Hijau", "Biru"],
      jawaban: 2
   },
   {
      soal: "Hasil 3² + 4² adalah?",
        pilihan: ["12", "25", "49", "7"],
        jawaban: 1
   },
   {
      soal: "Kapan Indonesia memperingati Hari Kemerdekaan?",
      pilihan: ["17 Agustus", "28 Oktober", "10 November", "1 Mei"],
      jawaban: 0
   },
   {
      soal: "Kalau air dipanaskan sampai 100°C pada tekanan normal, air akan...",
      pilihan: ["Membeku", "Mendidih/Menguap", "Berubah jadi es krim", "Hilang"],
      jawaban: 1
   },
   {
      soal: "Siapakah pembuat website Maduviber ini?",
      pilihan: ["Orang Keren", "Siswa Genius", "Tukang Meme Professional", "Semua Benar"],
      jawaban: 3
   }
];


// ========================================
// 2. DATA DAN STATUS PENGGUNA
// ========================================

// Mengambil data yang pernah disimpan
let memeTextSaved = localStorage.getItem("madu_meme");
let savedScore = localStorage.getItem("madu_score");

// Jika belum ada skor, nilainya null.
// Jika sudah ada, ubah teks skor menjadi angka.
let quizScoreSaved = savedScore === null
   ? null
   : Number(savedScore);

// Status kuis yang sedang dikerjakan
let currentQuizIndex = 0;
let userScore = 0;

// Daftar meme dan efek suara
const imagePool = [
   {
      name: "Kuk",
      src: "assets/gambar/kuk_meme.jfif"
   },
   {
      name: "Terang",
      src: "assets/gambar/terang_meme.jfif"
   },
   {
      name: "Menarik",
      src: "assets/gambar/menarik_meme.jfif"
   },
   {
      name: "Ngotak",
      src: "assets/gambar/ngotak_meme.jfif"
   },
   {
      name: "Kerja Bagus",
      src: "assets/gambar/kerjabagus_meme.jfif"
   }
];

const sfxPool = [
   "🔊 SFX: Vine Boom!",
   "🎺 SFX: Sad Trombone",
   "💥 SFX: Bruh Sound!",
   "🎉 SFX: Airhorn Heboh!"
];

// Periksa apakah tombol rahasia sudah terbuka
checkSecretUnlock();


// ========================================
// 3. PINDAH HALAMAN
// ========================================

function switchPage(pageId) {
   // Sembunyikan semua halaman
   const pages = document.querySelectorAll(".page");

   pages.forEach(function (page) {
      page.classList.remove("active");
   });

   // Tampilkan halaman yang dipilih
   document.getElementById(pageId).classList.add("active");

   // Siapkan tampilan quiz
   if (pageId === "page-quiz") {
      if (quizScoreSaved === null) {
         currentQuizIndex = 0;
         userScore = 0;
         loadQuizQuestion();
      } else {
         showQuizResult();
      }
   }

   // Tampilkan rekap jika membuka halaman rahasia
   if (pageId === "page-secret") {
      renderSecretPage();
   }
}


// ========================================
// 4. MEME GENERATOR
// ========================================

// Mengambil satu pilihan secara acak
function randomItem(list) {
   const randomIndex = Math.floor(Math.random() * list.length);
   return list[randomIndex];
}


function generateMeme() {
    // 1. Ambil teks yang diketik pengguna
    const input = document.getElementById("meme-input");
    const memeText = input.value.trim();

    // 2. Pastikan input tidak kosong
    if (memeText === "") {
        alert("Tulis dulu teks memenya!");
        return;
    }

    // 3. Simpan teks meme
    memeTextSaved = memeText;
    localStorage.setItem("madu_meme", memeText);

    // 4. Tampilkan teks yang diketik pengguna
    document.getElementById("display-text").textContent =
        '"' + memeText + '"';

    // 5. Pilih gambar dan SFX secara acak
    const randomImage = randomItem(imagePool);
    const randomSfx = randomItem(sfxPool);

    // 6. Siapkan tempat untuk gambar
    const assetBox = document.getElementById("display-asset");
    assetBox.innerHTML = "";

    // 7. Tampilkan gambar meme
    const img = document.createElement("img");
    img.src = randomImage.src;
    img.alt = randomImage.name;
    img.className = "meme-generated-image";

    // 8. Tampilkan keterangan gambar dan SFX
    const caption = document.createElement("p");
    caption.textContent = randomImage.name + " | " + randomSfx;

    assetBox.appendChild(img);
    assetBox.appendChild(caption);

    // 9. Mainkan suara dan periksa tombol rahasia
    playSynthSfx();
    checkSecretUnlock();
}



// Membuat efek suara sederhana
function playSynthSfx() {
   try {
      const AudioClass = window.AudioContext || window.webkitAudioContext;

      if (!AudioClass) {
         console.log("Browser tidak mendukung efek suara ini.");
         return;
      }

      const audio = new AudioClass();
      const oscillator = audio.createOscillator();
      const volume = audio.createGain();

      oscillator.type = "sawtooth";

      oscillator.frequency.setValueAtTime(120, audio.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
         30,
         audio.currentTime + 0.3
      );

      volume.gain.setValueAtTime(0.3, audio.currentTime);
      volume.gain.exponentialRampToValueAtTime(
         0.01,
         audio.currentTime + 0.3
      );

      oscillator.connect(volume);
      volume.connect(audio.destination);

      oscillator.start();
      oscillator.stop(audio.currentTime + 0.3);

   } catch (error) {
      console.log("Efek suara gagal dimainkan.");
   }
}


// ========================================
// 5. QUIZ WAWASAN
// ========================================

function loadQuizQuestion() {
   // Jika semua soal sudah selesai
   if (currentQuizIndex >= quizData.length) {
      finishQuiz();
      return;
   }

   document.getElementById("quiz-container").style.display = "block";
   document.getElementById("quiz-result-container").style.display = "none";

   // Ambil soal yang sedang dikerjakan
   const question = quizData[currentQuizIndex];

   document.getElementById("quiz-progress-text").textContent =
      "Soal " + (currentQuizIndex + 1) + " dari " + quizData.length;

   document.getElementById("quiz-question-text").textContent =
      question.soal;

   const options = document.getElementById("quiz-options-container");

   // Kosongkan pilihan soal sebelumnya
   options.innerHTML = "";

   // Buat tombol untuk setiap pilihan jawaban
   for (let i = 0; i < question.pilihan.length; i++) {
      const button = document.createElement("button");

      button.className = "option-btn";
      button.textContent = question.pilihan[i];

      // Ketika tombol ditekan, periksa jawabannya
      button.onclick = function () {
         selectAnswer(i);
      };

      options.appendChild(button);
   }
}


function selectAnswer(selectedIndex) {
   const question = quizData[currentQuizIndex];

   // Tambahkan 10 poin jika jawaban benar
   if (selectedIndex === question.jawaban) {
      userScore = userScore + 10;
   }

   // Lanjut ke soal berikutnya
   currentQuizIndex = currentQuizIndex + 1;
   loadQuizQuestion();
}


function finishQuiz() {
   // Simpan skor terakhir
   quizScoreSaved = userScore;

   localStorage.setItem("madu_score", quizScoreSaved);

   showQuizResult();
   checkSecretUnlock();
}


// Menampilkan hasil quiz
function showQuizResult() {
   document.getElementById("quiz-container").style.display = "none";
   document.getElementById("quiz-result-container").style.display = "block";

   let message = "";

   if (quizScoreSaved >= 80) {
      message = "WAH KEREN! Wawasanmu Luas Banget!";
   } else if (quizScoreSaved >= 50) {
      message = "LUMAYAN LAH! Cukup Berwawasan.";
   } else {
      message = "WAH BOTTTT ULANG ULANG";
   }

   document.getElementById("result-title").textContent =
      "Skor Kamu: " + quizScoreSaved + "/100";

   document.getElementById("result-desc").textContent = message;
}


// ========================================
// 6. TOMBOL RAHASIA
// ========================================


function checkSecretUnlock() {
   // Periksa apakah kedua misi sudah selesai
   if (memeTextSaved && quizScoreSaved !== null) {
      const button = document.getElementById("btn-secret");
      const status = document.getElementById("secret-status");
      const counter = document.querySelector(".activity-count");

      // Tampilkan tombol rahasia
      button.hidden = false;
      button.classList.add("unlocked");

      // Perbarui keterangan tombol
      status.textContent = "Terbuka! Lihat rekap perjalananmu.";

      // Perbarui jumlah misi yang tersedia
      if (counter) {
         counter.textContent = "03 MISI TERSEDIA";
      }
   }
}



function renderSecretPage() {
   const box = document.getElementById("secret-summary-box");

   // Tentukan gelar berdasarkan skor
   let title = "Master Bot";

   if (quizScoreSaved >= 80) {
      title = "Pakar Genius Berjiwa Humoris";
   } else if (quizScoreSaved >= 50) {
      title = "Pujangga Absurd Berwawasan Cukup";
   }

   // Buat paragraf rekap
   const paragraph = document.createElement("p");

   paragraph.textContent =
      'Wah keren! Kamu membuat meme "' +
      memeTextSaved +
      '" dan mendapatkan skor ' +
      quizScoreSaved +
      "/100 di quiz wawasan.";

   // Buat label gelar
   const badge = document.createElement("div");

   badge.className = "badge";
   badge.textContent = "Gelar: " + title;

   // Masukkan hasil ke halaman
   box.innerHTML = "";
   box.appendChild(paragraph);
   box.appendChild(badge);
}


// ========================================
// 7. RESET DATA
// ========================================

function resetData() {
   // Hapus data milik Maduviber saja
   localStorage.removeItem("madu_meme");
   localStorage.removeItem("madu_score");

   // Muat ulang halaman dari awal
   window.location.reload();
}
