/* ============================================
   CASTI YUSTE COACH - Blog JS
   Loads posts from data/posts.json and renders them
   ============================================ */

const IN_POSTS_DIR = typeof window !== 'undefined'
  && window.location.pathname.includes('/posts/');

const POSTS_URL = IN_POSTS_DIR ? '../data/posts.json' : 'data/posts.json';
const POST_PATH = IN_POSTS_DIR ? '' : 'posts/';
// posts.json stores image paths relative to the site root.
const ASSET_PREFIX = IN_POSTS_DIR ? '../' : '';

let allPosts = [];

// Fallback tint when a post has no image yet
const CARD_COLORS = [
  'linear-gradient(135deg, #c8dbbe, #8aaa76)',
  'linear-gradient(135deg, #e8c4b4, #c97e6a)',
  'linear-gradient(135deg, #d4e4c8, #a0c488)',
  'linear-gradient(135deg, #f0d8cc, #e8a898)',
  'linear-gradient(135deg, #b8d4a8, #7aad6e)',
];

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function thumbMarkup(post, index) {
  if (post.image) {
    return `<img src="${ASSET_PREFIX}${escapeHtml(post.image)}" alt="" loading="lazy">`;
  }
  const color = CARD_COLORS[index % CARD_COLORS.length];
  return `<div style="height:100%;background:${color};display:flex;
    align-items:center;justify-content:center;font-size:2.5rem;opacity:0.5;">✈️</div>`;
}

// Card used in the homepage rail
function createRailCard(post, index) {
  const cat = (post.categories || [])[0] || 'Blog';
  return `
    <a href="${POST_PATH}${encodeURIComponent(post.slug)}.html" class="rail-card">
      <div class="thumb">${thumbMarkup(post, index)}</div>
      <div class="body">
        <div class="kicker">${escapeHtml(cat)}</div>
        <h3>${escapeHtml(post.title)}</h3>
        <div class="meta">${escapeHtml(post.date)}</div>
      </div>
    </a>`;
}

// Card used in the blog.html grid
function createBlogCard(post, index) {
  return `
    <a href="${POST_PATH}${encodeURIComponent(post.slug)}.html" class="blog-card" style="text-decoration:none;">
      <div class="blog-card-img">
        ${thumbMarkup(post, index)}
        <span class="blog-card-read-time">5 MIN READ</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-title">${escapeHtml(post.title)}</div>
        <div class="blog-card-date">${escapeHtml(post.date)}</div>
      </div>
    </a>`;
}

async function loadPosts() {
  try {
    const res = await fetch(POSTS_URL);
    allPosts = await res.json();
    renderHomeRail();
    renderBlogPage(new URLSearchParams(window.location.search).get('cat'));
  } catch (e) {
    console.warn('Could not load posts.json — are you running from a web server?', e);
  }
}

function renderHomeRail() {
  const rail = document.getElementById('home-rail');
  if (!rail) return;
  rail.innerHTML = allPosts.slice(0, 6).map((p, i) => createRailCard(p, i)).join('');
}

function renderBlogPage(filter) {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  const posts = filter && filter !== 'Todos'
    ? allPosts.filter(p => p.categories && p.categories.includes(filter))
    : allPosts;

  grid.innerHTML = posts.length
    ? posts.map((p, i) => createBlogCard(p, i)).join('')
    : '<p style="color:var(--text-light);grid-column:1/-1;text-align:center;padding:2rem;">No hay artículos en esta categoría.</p>';

  // Reflect the active filter in the button row
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', (b.dataset.filter || '') === (filter || 'Todos'));
  });
}

document.addEventListener('DOMContentLoaded', function () {
  loadPosts();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      renderBlogPage(this.dataset.filter);
    });
  });
});
