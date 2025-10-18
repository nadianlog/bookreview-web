// script (1).js - Kode yang sudah diperbaiki
const books = [
  { 
    id: 1, 
    title: "Laut Bercerita", 
    author: "Lelia S. Chudori",
    desc: "Kisah menyentuh tentang aktivis yang hilang di masa Orde Baru, menggambarkan perjuangan, kehilangan, dan kemanusiaan.",
    cover: "The Sea Speaks His Name (English Version).jpeg",
    reviews: []
  },
  { 
    id: 2, 
    title: "Negeri 5 Menara", 
    author: "Ahmad Fuadi",
    desc: "Kisah enam santri dengan mimpi besar dan semangat Man Jadda Wajada.",
    cover: "Negeri 5 Menara.jpeg",
    reviews: []
  },
  { 
    id: 3, 
    title: "Lonelinnes is my best friend", 
    author: "Alvi Syahrin",
    desc: "Kumpulan refleksi tentang kesepian dan bagaimana kesendirian bisa menjadi ruang untuk mengenal diri dan menemukan ketenangan.",
    cover: "8933c53e-2762-42db-b04d-cd95a0d45d72.jpeg",
    reviews: []
  },
  { 
    id: 4, 
    title: "The Alpha Girls Guide", 
    author: "Henry Manampiring",
    desc: "Panduan untuk perempuan agar lebih percaya diri, mandiri, dan berani jadi diri sendiri tanpa kehilangan sisi lembutnya.",
    cover: "[SE046] The Alpha Girl s Guide (Henry….jpeg",
    reviews: []
  },
  { 
    id: 5, 
    title: "Bumi", 
    author: "Tere Liye",
    desc: "Petualangan Raib, Seli, dan Ali di dunia paralel dengan kekuatan unik.",
    cover: "d96aad48-8f1f-457d-b5da-132cdab3a624.jpeg",
    reviews: []
  }
];

let selectedBook = null;

// tampilkan semua buku
function displayBooks(bookArray) {
  const container = document.getElementById('book-container');
  container.innerHTML = '';
  bookArray.forEach(book => {
    const div = document.createElement('div');
    div.classList.add('book');
    // Tambahkan id ke div review biar lebih gampang di-update tanpa redraw semua buku
    div.innerHTML = `
      <img src="${book.cover}" alt="${book.title}">
      <div class="book-details">
        <h3>${book.title}</h3>
        <p class="author">by ${book.author}</p>
        <p>${book.desc}</p>
        <button onclick="selectBook(${book.id})">Lihat / Ulas Buku</button>
        <div id="reviews-${book.id}">
          ${book.reviews.length > 0 
            ? book.reviews.map(r => `<div class='review'><p>${r.text}</p><small>⭐${r.rating}</small></div>`).join('')
            : "<p><i>Belum ada ulasan</i></p>"}
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function selectBook(id) {
  selectedBook = books.find(b => b.id === id);
  document.getElementById('selectedBookTitle').textContent = selectedBook.title;
  document.getElementById('review-form').style.display = 'block';
}

function addReview() {
  if (!selectedBook) return alert('Pilih buku dulu!');
  const text = document.getElementById('reviewText').value;
  const rating = document.getElementById('rating').value;
  if (!text || !rating) return alert('Isi semua kolom ya!');
  selectedBook.reviews.push({ text, rating });
  document.getElementById('reviewText').value = '';
  document.getElementById('rating').value = '';
  // Gak perlu panggil displayBooks(books) lagi kalau cuma mau update review, tapi 
  // buat simpelnya saat ini, ini OK. Tapi idealnya cuma update DOM review-nya aja.
  displayBooks(books);
}

// fungsi pencarian
function searchBook() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  // Filter berdasarkan judul ATAU penulis biar lebih mantap
  const filtered = books.filter(b => 
    b.title.toLowerCase().includes(input) || 
    b.author.toLowerCase().includes(input)
  );
  displayBooks(filtered);
}


// Semua kode yang butuh DOM ready harus ada di sini:
window.onload = function() {
  displayBooks(books); // Tampilkan buku saat halaman pertama kali dibuka

  // Tombol ganti tema 🌙☀️ harus di dalam window.onload
  document.getElementById('themeToggle').onclick = () => {
    document.body.classList.toggle('dark');
    const icon = document.getElementById('themeToggle');
    icon.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  };
}; // <-- Penutup yang BENAR untuk window.onload
