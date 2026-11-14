const palette = ['#ffd6e7', '#ffc2d4', '#ff9fc1', '#ff89b5', '#f7b9d5', '#f9d4ea', '#f5e0f1', '#ffd9c2'];
const photoFiles = [
  'assets/photos/photo-1.JPG',
  'assets/photos/photo-2.JPG',
  'assets/photos/photo-3.JPG',
  'assets/photos/photo-4.JPG',
  'assets/photos/photo-5.JPG'
];

const phrases = [
  '你记得吗，这是我们见面的第一顿饭，在破破烂烂的酷乐潮玩，第一次见面就是叽叽喳喳。',
  '在小小的二中相依为命的两个人，此时都不知道今后还会在一起玩这么久嘎嘎嘎嘎嘎。',
  '你记得吗，曾经有一段时间你已经这么开心了，很怀念呀。要加油呦，一起享受生活吧！！！',
  '还记得我们那时候许的愿望，早知道把快乐写得大大的在上面了，真是不懂事了，怎么让快乐大帝挤在角落了。',
  '其实我们已经好久好久没像过去那样聊天了若彤。久到你我都不了解对方的近况，不知道对方现在爱看什么动漫，更不知道你到底在为什么烦恼。但是，无论如何，等你想张口说话的那一天，永远有一个倾听者在等着你。'
];

const refs = {
  cakeWrap: document.getElementById('cakeWrap'),
  wishPrompt: document.getElementById('wishPrompt'),
  confirmWishBtn: document.getElementById('confirmWishBtn'),
  gallery: document.getElementById('gallery'),
  photoWall: document.getElementById('photoWall'),
  handwriteNote: document.getElementById('handwriteNote'),
  finalLetter: document.getElementById('finalLetter'),
  letterText: document.getElementById('letterText'),
  passwordForm: document.getElementById('passwordForm'),
  passwordInput: document.getElementById('passwordInput'),
  passwordError: document.getElementById('passwordError')
};

let photoSequenceStarted = false;

function unlockSite() {
  document.body.classList.remove('site-locked');
  localStorage.setItem('birthday-locked', 'false');
  if (refs.passwordInput) refs.passwordInput.value = '';
  if (refs.passwordError) refs.passwordError.textContent = '';
}

function lockSite() {
  document.body.classList.add('site-locked');
  localStorage.setItem('birthday-locked', 'true');
}

function initPasswordGate() {
  const shouldLock = localStorage.getItem('birthday-locked') !== 'false';
  if (shouldLock) {
    lockSite();
  } else {
    unlockSite();
  }

  if (!refs.passwordForm || !refs.passwordInput) return;

  refs.passwordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = refs.passwordInput.value.trim();

    if (input === '1115') {
      unlockSite();
      return;
    }

    if (refs.passwordError) {
      refs.passwordError.textContent = '密码不正确，请重新输入。';
    }
    refs.passwordInput.focus();
  });
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function buildBalloonCake() {
  if (!refs.cakeWrap) return;

  refs.cakeWrap.innerHTML = '';

  const cake = document.createElement('div');
  cake.className = 'cake-illustration';

  const cakeShadow = document.createElement('div');
  cakeShadow.className = 'cake-shadow';
  cake.appendChild(cakeShadow);

  const cakeLayerTop = document.createElement('div');
  cakeLayerTop.className = 'cake-layer cake-layer-top';
  cake.appendChild(cakeLayerTop);

  const cakeLayerMid = document.createElement('div');
  cakeLayerMid.className = 'cake-layer cake-layer-mid';
  cake.appendChild(cakeLayerMid);

  const cakeLayerBase = document.createElement('div');
  cakeLayerBase.className = 'cake-layer cake-layer-base';
  cake.appendChild(cakeLayerBase);

  const cakePlate = document.createElement('div');
  cakePlate.className = 'cake-plate';
  cake.appendChild(cakePlate);

  const candle = document.createElement('div');
  candle.className = 'candle';
  const flame = document.createElement('span');
  flame.className = 'flame';
  candle.appendChild(flame);
  cake.appendChild(candle);

  refs.cakeWrap.appendChild(cake);
}

function renderPhotos() {
  if (!refs.photoWall || !refs.handwriteNote) return;
  if (!refs.gallery || !refs.gallery.classList.contains('active')) return;
  if (photoSequenceStarted) return;

  photoSequenceStarted = true;

  let currentIndex = 0;
  let showGroupTimer = null;
  let hideGroupTimer = null;
  let textTimer = null;

  function clearTimers() {
    if (showGroupTimer) {
      clearTimeout(showGroupTimer);
      showGroupTimer = null;
    }
    if (hideGroupTimer) {
      clearTimeout(hideGroupTimer);
      hideGroupTimer = null;
    }
    if (textTimer) {
      clearTimeout(textTimer);
      textTimer = null;
    }
  }

  function triggerFinale() {
    if (!refs.gallery) return;
    refs.gallery.classList.add('is-finale');

    const card = refs.photoWall.querySelector('.photo-card');
    if (card) {
      card.classList.remove('is-visible', 'is-hiding');
      card.classList.add('is-final');
    }

    if (refs.finalLetter) {
      refs.finalLetter.classList.remove('hidden');
      refs.finalLetter.classList.add('visible');
    }
  }

  function showGroup(index) {
    clearTimers();

    const src = photoFiles[index];
    const text = phrases[index] || '愿你永远温柔，也永远被好好爱着。';

    refs.photoWall.innerHTML = `
      <figure class="photo-card is-visible" style="--index:${index};">
        <img src="${src}" alt="生日回忆 ${index + 1}" />
      </figure>
    `;

    typeHandwriteText(text, () => {
      const card = refs.photoWall.querySelector('.photo-card');
      if (!card) return;

      showGroupTimer = setTimeout(() => {
        card.classList.remove('is-visible');
        card.classList.add('is-hiding');
        refs.handwriteNote.classList.add('is-fading');

        hideGroupTimer = setTimeout(() => {
          if (index === photoFiles.length - 1) {
            triggerFinale();
            return;
          }

          const nextIndex = index + 1;
          refs.handwriteNote.classList.remove('is-fading');
          showGroup(nextIndex);
        }, 650);
      }, 5000);
    }, (timer) => {
      textTimer = timer;
    });
  }

  showGroup(currentIndex);
}

function typeHandwriteText(text, onComplete, onTickSet) {
  if (!refs.handwriteNote) return;
  if (typeof text !== 'string' || !text) {
    refs.handwriteNote.textContent = '';
    refs.handwriteNote.classList.remove('is-typing', 'is-fading');
    if (typeof onComplete === 'function') {
      onComplete();
    }
    return;
  }

  refs.handwriteNote.textContent = '';
  refs.handwriteNote.classList.remove('is-typing', 'is-fading');

  let index = 0;
  let typingTimer = null;

  function tick() {
    refs.handwriteNote.textContent = text.slice(0, index + 1);
    index += 1;

    if (index < text.length) {
      const pause = /[，。！？…]/.test(text[index - 1]) ? 200 : 70;
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(tick, pause);
      if (typeof onTickSet === 'function') {
        onTickSet(typingTimer);
      }
      return;
    }

    refs.handwriteNote.classList.add('is-typing');
    if (typeof onComplete === 'function') {
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(onComplete, 200);
      if (typeof onTickSet === 'function') {
        onTickSet(typingTimer);
      }
    }
  }

  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(tick, 40);
  if (typeof onTickSet === 'function') {
    onTickSet(typingTimer);
  }
}

function startWishFlow() {
  if (!refs.wishPrompt || !refs.confirmWishBtn) return;

  refs.confirmWishBtn.addEventListener('click', () => {
    if (!refs.cakeWrap) return;

    const candle = refs.cakeWrap.querySelector('.candle');
    if (candle) {
      candle.classList.add('extinguished');
    }

    const cakeIllustration = refs.cakeWrap.querySelector('.cake-illustration');
    if (cakeIllustration) {
      cakeIllustration.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      cakeIllustration.style.opacity = '0.78';
      cakeIllustration.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
      refs.cakeWrap.style.opacity = '0';
      refs.cakeWrap.style.transform = 'scale(0.9)';
      refs.cakeWrap.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

      if (refs.gallery) {
        refs.gallery.classList.add('active');
        refs.gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      renderPhotos();
    }, 1100);
  });
}

function initFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const fireworks = [];
  const particles = [];

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createRocket() {
    fireworks.push({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * (window.innerHeight * 0.58),
      color: palette[Math.floor(Math.random() * palette.length)],
      speed: 2.8 + Math.random() * 1.6
    });
  }

  function explode(rocket) {
    const count = 24 + Math.floor(Math.random() * 18);
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 1.4 + Math.random() * 3.2;
      particles.push({
        x: rocket.targetX,
        y: rocket.targetY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 34 + Math.random() * 36,
        size: 2 + Math.random() * 2.4,
        color: rocket.color
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (Math.random() < 0.05) {
      createRocket();
    }

    for (let i = fireworks.length - 1; i >= 0; i -= 1) {
      const rocket = fireworks[i];
      rocket.x += (rocket.targetX - rocket.x) * 0.055 * rocket.speed;
      rocket.y += (rocket.targetY - rocket.y) * 0.055 * rocket.speed;

      const distance = Math.hypot(rocket.targetX - rocket.x, rocket.targetY - rocket.y);
      if (distance < 3) {
        explode(rocket);
        fireworks.splice(i, 1);
      } else {
        ctx.beginPath();
        ctx.fillStyle = rocket.color;
        ctx.fillRect(rocket.x, rocket.y, 3, 10);
      }
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy + 0.12;
      particle.vy += 0.03;
      particle.life -= 1;
      const alpha = Math.max(0, particle.life / 70);

      if (particle.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  requestAnimationFrame(animate);
  window.addEventListener('resize', resizeCanvas);
}

initPasswordGate();
buildBalloonCake();
startWishFlow();
initFireworks();
