// ====== DATA BUKU (5 buku) ======
const BOOKS_KEY = 'br_books_v1';        // key localStorage untuk reviews / data lebih lanjut
const THEME_KEY = 'br_theme_v1';

let books = [
  { id:1, title:"The Alpha Girl’s Guide", author:"Henry Manampiring",
    desc:"Panduan untuk perempuan agar lebih percaya diri, mandiri, dan berani jadi diri sendiri tanpa kehilangan sisi lembutnya.",
    cover:"[SE046] The Alpha Girl s Guide (Henry….jpeg",
    reviews:[] },
  { id:2, title:"Loneliness Is My Best Friend", author:"Alvi Syahrin",
    desc:"Kumpulan refleksi tentang kesepian dan bagaimana kesendirian bisa menjadi ruang untuk mengenal diri dan menemukan ketenangan.",
    cover:"8933c53e-2762-42db-b04d-cd95a0d45d72.jpeg",
    reviews:[] },
  { id:3, title:"Laut Bercerita", author:"Leila S. Chudori",
    desc:"Kisah menyentuh tentang aktivis yang hilang di masa Orde Baru, menggambarkan perjuangan, kehilangan, dan kemanusiaan.",
    cover:"The Sea Speaks His Name (English Version).jpeg",
    reviews:[] },
  { id:4, title:"Negeri 5 Menara", author:"Ahmad Fuadi",
    desc:"Kisah enam santri dengan mimpi besar dan semangat Man Jadda Wajada yang menginspirasi banyak pembaca.",
    cover:"Negeri 5 Menara.jpeg",
    reviews:[] },
  { id:5, title:"Bumi", author:"Tere Liye",
    desc:"Petualangan Raib, Seli, dan Ali di dunia paralel penuh misteri dan kekuatan unik yang seru untuk diikuti.",
    cover:"d96aad48-8f1f-457d-b5da-132cdab3a624.jpeg",
    reviews:[] }
];

// load persisted reviews if ada
const saved = localStorage.getItem(BOOKS_KEY);
if(saved){
  try { 
    const parsed = JSON.parse(saved);
    // merge reviews keyed by id (so we keep original book list structure)
    books = books.map(b => {
      const found = parsed.find(x => x.id === b.id);
      return found ? {...b, reviews: found.reviews || []} : b;
    });
  } catch(e){ console.warn('load error', e) }
}

// apply saved theme
const savedTheme = localStorage.getItem(THEME_KEY);
if(savedTheme === 'dark') document.body.classList.add('dark');

// ====== UTIL ======
function saveAll(){
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

function calcAverage(book){
  if(!book.reviews || book.reviews.length===0) return 0;
  const sum = book.reviews.reduce((s,r)=> s + Number(r.rating), 0);
  return (sum / book.reviews.length);
}
function renderStars(value){
  // value: number maybe decimal. render 5 stars, filled proportionally (we use full/empty)
  const full = Math.round(value); // round for display
  let html = '';
  for(let i=1;i<=5;i++){
    html += `<span class="star">${ i<=full ? '★' : '☆'}</span>`;
  }
  return html;
}

// ====== RENDER LIST VIEW ======
function displayList(list){
  const container = document.getElementById('list-view');
  container.innerHTML = '';
  list.forEach(book => {
    const avg = calcAverage(book);
    const card = document.createElement('article');
    card.className = 'book';
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}">
      <div class="book-details">
        <h3 onclick="openDetail(${book.id})">${book.title}</h3>
        <p class="author">by ${book.author}</p>
        <p class="desc">${book.desc}</p>
        <div class="book-meta">
          <div class="avg-rating">
            ${renderStars(avg)} <span class="avg-value">${ avg ? avg.toFixed(1) : '-'} / 5</span>
            <span style="color:var(--muted);font-size:13px;margin-left:8px">(${book.reviews.length} ulasan)</span>
          </div>
          <div style="margin-left:auto">
            <button class="small-btn" onclick="openDetail(${book.id})">Lihat</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// initial render
displayList(books);

// ====== SEARCH ======
function searchBook(){
  const q = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  if(!q) return displayList(books);
  const filtered = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  displayList(filtered);
}

// ====== DETAIL VIEW ======
let currentRating = 0; // rating selected in detail
function openDetail(id){
  const book = books.find(b=>b.id===id);
  if(!book) return;
  currentRating = 0;
  document.getElementById('list-view').style.display = 'none';
  const dv = document.getElementById('detail-view');
  dv.style.display = 'block';

  const detail = document.getElementById('detail-card');
  // build stars input (5 buttons)
  let starInputHtml = '<div class="star-input">';
  for(let i=1;i<=5;i++){
    starInputHtml += `<button class="star-btn" aria-label="${i} star" onclick="pickStar(${i}, ${id})">☆</button>`;
  }
  starInputHtml += '</div>';

  // reviews html
  const reviewsHtml = book.reviews.length > 0
    ? book.reviews.map(r => `<div class="review"><p><strong>⭐ ${r.rating}</strong> — ${escapeHtml(r.text)}</p></div>`).join('')
    : '<p><i>Belum ada ulasan</i></p>';

  detail.innerHTML = `
    <div id="detail-left">
      <img src="${book.cover}" alt="${book.title}">
    </div>
    <div id="detail-right">
      <h2>${book.title}</h2>
      <p class="author">by ${book.author}</p>
      <p class="full-desc">${book.desc}</p>

      <div class="avg-rating">
        <div id="avg-stars">${renderStars(calcAverage(book))}</div>
        <div class="avg-value" id="avg-value">${ book.reviews.length ? calcAverage(book).toFixed(1) : '-' } / 5</div>
        <div style="color:var(--muted);margin-left:8px" id="review-count">(${book.reviews.length} ulasan)</div>
      </div>

      <h3>Nilai & Tulis Ulasan</h3>
      ${starInputHtml}
      <div id="reviewBox">
        <textarea id="reviewText" placeholder="Tulis ulasanmu di sini..."></textarea>
        <button id="submitReview" onclick="submitReview(${book.id})">Kirim Ulasan</button>
      </div>

      <h3>Ulasan Pembaca</h3>
      <div class="reviews" id="reviews-list">
        ${reviewsHtml}
      </div>
    </div>
  `;

  // make sure star buttons reflect current state (none selected)
  updateStarButtons(0, id);
  // scroll top
  window.scrollTo({top:0, behavior:'smooth'});
}

// safe text escape
function escapeHtml(str){
  return String(str).replace(/[&<>"'`]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[s]));
}

// user picks star (interactive)
function pickStar(n, bookId){
  currentRating = n;
  updateStarButtons(n, bookId);
}
function updateStarButtons(n, bookId){
  // find buttons in detail view
  const dv = document.getElementById('detail-card');
  if(!dv) return;
  const btns = dv.querySelectorAll('.star-btn');
  btns.forEach((b, idx) => {
    if(idx < n) b.classList.add('active');
    else b.classList.remove('active');
    b.textContent = idx < n ? '★' : '☆';
  });
}

// submit review from detail page
function submitReview(bookId){
  const book = books.find(b=>b.id===bookId);
  if(!book) return alert('Buku tidak ditemukan');
  const text = document.getElementById('reviewText').value.trim();
  const rating = Number(currentRating);
  if(!rating || !text) return alert('Klik bintang (1-5) dan tulis ulasan sebelum mengirim.');

  book.reviews.unshift({ text, rating }); // newest first
  saveAll();
  // refresh detail (will recalc avg)
  openDetail(bookId);
  // optionally, scroll to reviews
  const reviewsList = document.getElementById('reviews-list');
  if(reviewsList) reviewsList.scrollIntoView({behavior:'smooth'});
}

// go back to list
function goBack(){
  document.getElementById('detail-view').style.display = 'none';
  document.getElementById('list-view').style.display = 'block';
}

// theme toggle (persist)
document.getElementById('themeToggle').addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
});

// ensure theme button icon correct on load
document.getElementById('themeToggle').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
