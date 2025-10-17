const books = [
  { 
    id: 1, 
    title: "Laskar Pelangi", 
    author: "Andrea Hirata",
    desc: "Perjalanan anak-anak Belitung dalam mengejar pendidikan di tengah keterbatasan.",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348867331i/1524183.jpg",
    reviews: []
  },
  { 
    id: 2, 
    title: "Negeri 5 Menara", 
    author: "Ahmad Fuadi",
    desc: "Kisah enam santri dengan mimpi besar dan semangat Man Jadda Wajada.",
    cover: "https://upload.wikimedia.org/wikipedia/id/4/48/Negeri_5_Menara_cover.jpg",
    reviews: []
  },
  { 
    id: 3, 
    title: "Dilan 1990", 
    author: "Pidi Baiq",
    desc: "Kisah cinta remaja Bandung yang ringan dan penuh kenangan SMA.",
    cover: "https://upload.wikimedia.org/wikipedia/id/1/1f/Dilan_1990_sampul.jpg",
    reviews: []
  },
  { 
    id: 4, 
    title: "5 CM", 
    author: "Donny Dhirgantoro",
    desc: "Perjalanan lima sahabat menaklukkan Gunung Semeru untuk meraih mimpi.",
    cover: "https://upload.wikimedia.org/wikipedia/id/5/55/5_cm_sampul.jpg",
    reviews: []
  },
  { 
    id: 5, 
    title: "Bumi", 
    author: "Tere Liye",
    desc: "Petualangan Raib, Seli, dan Ali di dunia paralel dengan kekuatan unik.",
    cover: "https://upload.wikimedia.org/wikipedia/id/f/fd/Bumi_sampul.jpg",
    reviews: []
  }
];

let selectedBook = null;

window.onload = function() {
  displayBooks(books);
};

function displayBooks(bookArray) {
  const container = document.getElementById('book-container');
  container.innerHTML = '';
  bookArray.forEach(book => {
    const div = document.createElement('div');
    div.classList.add('book');
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
  displayBooks(books);
}

function searchBook() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const filtered = books.filter(b => b.title.toLowerCase().includes(input));
  displayBooks(filtered);
}
// Tombol untuk ganti tema
document.getElementById('themeToggle').onclick = () => {
  document.body.classList.toggle('dark');

  // Ganti ikon tombol biar interaktif
  const icon = document.getElementById('themeToggle');
  if (document.body.classList.contains('dark')) {
    icon.textContent = '☀️';
  } else {
    icon.textContent = '🌙';
  }

