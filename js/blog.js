/* ============================================
   CASTI YUSTE COACH - Blog JS
   Loads posts from data/posts.json and renders them
   ============================================ */

const POSTS_URL = (typeof window !== 'undefined' && window.location.pathname.includes('/posts/'))
  ? '../data/posts.json' : 'data/posts.json';

const POST_PATH = (typeof window !== 'undefined' && window.location.pathname.includes('/posts/'))
  ? '' : 'posts/';

let allPosts = [];

// Color cycle for blog card backgrounds
const CARD_COLORS = [
  'linear-gradient(135deg, #c8dbbe, #8aaa76)',
  'linear-gradient(135deg, #e8c4b4, #c97e6a)',
  'linear-gradient(135deg, #d4e4c8, #a0c488)',
  'linear-gradient(135deg, #f0d8cc, #e8a898)',
  'linear-gradient(135deg, #b8d4a8, #7aad6e)',
];

function createBlogCard(post, index) {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const cats = (post.categories || []).join(', ') || 'Blog';
  const excerpt = post.excerpt || '';
  return `
    <a href="${POST_PATH}${post.slug}.html" class="blog-card" style="text-decoration:none;">
      <div class="blog-card-img" style="background:${color};">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:2.5rem;opacity:0.5;">✈️</div>
        <span class="blog-card-read-time">5 MIN READ</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-title">${post.title}</div>
        <div class="blog-card-date">${post.date}</div>
      </div>
    </a>`;
}

async function loadPosts() {
  try {
    const res = await fetch(POSTS_URL);
    allPosts = await res.json();
    renderHomePosts();
    renderBlogPage();
  } catch (e) {
    console.warn('Could not load posts.json — are you running from a web server?', e);
  }
}

function renderHomePosts() {
  const grid = document.getElementById('home-blog-grid');
  if (!grid) return;
  const recent = allPosts.slice(0, 3);
  grid.innerHTML = recent.map((p, i) => createBlogCard(p, i)).join('');
}

function renderBlogPage(filter) {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  let posts = filter && filter !== 'Todos'
    ? allPosts.filter(p => p.categories && p.categories.includes(filter))
    : allPosts;

  grid.innerHTML = posts.length
    ? posts.map((p, i) => createBlogCard(p, i)).join('')
    : '<p style="color:var(--text-light);grid-column:1/-1;text-align:center;padding:2rem;">No hay artículos en esta categoría.</p>';
}

// Category filter buttons
document.addEventListener('DOMContentLoaded', function () {
  loadPosts();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderBlogPage(this.dataset.filter);
    });
  });
});
