const cv = document.getElementById('c'), cx = cv.getContext('2d');
let W, H, pts = [];

function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
resize();
addEventListener('resize', () => { resize(); spawnPts(); });

function spawnPts() {
 pts = Array.from({ length: 55 }, () => ({
   x: Math.random() * W,
   y: Math.random() * H,
   r: Math.random() * 1.1 + 0.2,
   vx: (Math.random() - .5) * .18,
   vy: (Math.random() - .5) * .18,
   o: Math.random() * .22 + .04
 }));
}
spawnPts();

function frame() {
 cx.clearRect(0, 0, W, H);

 const g = cx.createRadialGradient(W * .5, H * .38, 0, W * .5, H * .38, W * .85);
 g.addColorStop(0, 'rgba(25,8,8,1)');
 g.addColorStop(1, 'rgba(10,3,3,1)');
 cx.fillStyle = g;
 cx.fillRect(0, 0, W, H);

 pts.forEach(p => {
   p.x += p.vx; p.y += p.vy;
   if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
   if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
   cx.beginPath();
   cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
   cx.fillStyle = `rgba(230,80,80,${p.o})`;
   cx.fill();
 });

 requestAnimationFrame(frame);
}
frame();

const vizEl = document.getElementById('viz');
for (let i = 0; i < 6; i++) {
 const b = document.createElement('div');
 b.className = 'vb';
 b.style.setProperty('--s', `${.25 + Math.random() * .4}s`);
 b.style.animationDelay = `${Math.random() * .35}s`;
 vizEl.appendChild(b);
}

function setViz(on) {
 vizEl.querySelectorAll('.vb').forEach(b => b.classList.toggle('on', on));
}

const tracks = [
 { title: 'Russian Girl',  artist: 'Zhenya Lubich',       cover: 'rg.jpeg', src: 'rg.mp3' },
 { title: 'Одна Ночь',     artist: 'Yung Trappa & Baksh', cover: 'on.jpeg', src: 'on.m4a' },
];

let idx = 0, playing = false;
const audio = new Audio();
audio.volume = 0.75;

function fmt(s) {
 const t = Math.floor(s);
 return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

function loadTrack(i, autoplay) {
 idx = i;
 const t = tracks[i];
 audio.src = t.src;
 document.getElementById('t-title').textContent   = t.title;
 document.getElementById('t-artist').textContent  = t.artist;
 document.getElementById('cover-img').src         = t.cover;
 document.getElementById('t-dur').textContent     = '0:00';
 document.getElementById('t-cur').textContent     = '0:00';
 document.getElementById('prog-fill').style.width = '0%';
 if (autoplay) audio.play().catch(() => {});
}

audio.addEventListener('loadedmetadata', () => {
 document.getElementById('t-dur').textContent = fmt(audio.duration);
});

audio.addEventListener('timeupdate', () => {
 if (!audio.duration) return;
 document.getElementById('prog-fill').style.width = `${(audio.currentTime / audio.duration) * 100}%`;
 document.getElementById('t-cur').textContent = fmt(audio.currentTime);
});

audio.addEventListener('ended', () => nextTrack());

audio.addEventListener('play', () => {
 playing = true;
 document.getElementById('play-icon').innerHTML = '<path d="M6 19h4V5H6zm8-14v14h4V5z"/>';
 setViz(true);
});

audio.addEventListener('pause', () => {
 playing = false;
 document.getElementById('play-icon').innerHTML = '<path d="M8 5v14l11-7z"/>';
 setViz(false);
});

function togglePlay() {
 if (audio.paused) audio.play().catch(() => {});
 else audio.pause();
}

function prevTrack() { loadTrack((idx - 1 + tracks.length) % tracks.length, playing); }
function nextTrack() { loadTrack((idx + 1) % tracks.length, playing); }

function seek(e) {
 if (!audio.duration) return;
 const rect = document.getElementById('prog-bar').getBoundingClientRect();
 audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
}

document.getElementById('prog-bar').addEventListener('click', seek);
document.getElementById('play-btn').addEventListener('click', togglePlay);
document.getElementById('prev-btn').addEventListener('click', prevTrack);
document.getElementById('next-btn').addEventListener('click', nextTrack);

function doEnter() {
 document.getElementById('enter').classList.add('out');
 setTimeout(() => {
   document.getElementById('enter').style.display = 'none';
   document.getElementById('app').classList.add('visible');
   loadTrack(0, true);
 }, 700);
}
