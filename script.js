/* ==========================================================================
   STÚDIO CONTÉM BELEZA · por Paola Sousa
   Unified Stage Choreography (Arch Window → Ritual Frames → Paola Studio)
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- Contact Config ---------- */
  const CONTACT = {
    // Substitua pelos dados oficiais do Stúdio Contém Beleza
    whatsappNumber: '5500000000000',
    instagramUrl: 'https://www.instagram.com/'
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Math Helpers ---------- */
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const invLerp = (a, b, v) => clamp((v - a) / (b - a), 0, 1);
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  /* ---------- Wire WhatsApp & Instagram Links ---------- */
  const wireLinks = () => {
    document.querySelectorAll('[data-wa]').forEach((el) => {
      const msg = el.getAttribute('data-wa') || 'Olá Paola! Gostaria de agendar um horário.';
      el.href = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });

    document.querySelectorAll('[data-ig]').forEach((el) => {
      el.href = CONTACT.instagramUrl;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
  };

  /* ---------- Header & Floating WhatsApp ---------- */
  const initChrome = () => {
    const hdr = document.getElementById('hdr');
    const floatWa = document.getElementById('floatWa');
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;

      if (hdr) {
        hdr.classList.toggle('is-scrolled', y > 32);
        // Hide header gently while immersed in the middle of the full-screen ritual
        const inDeepRitual = y > vh * 0.45 && y < vh * 2.8;
        const scrollingDown = y > lastY + 4;
        if (inDeepRitual && scrollingDown) {
          hdr.classList.add('is-hidden');
        } else if (y < lastY - 4 || !inDeepRitual) {
          hdr.classList.remove('is-hidden');
        }
      }

      if (floatWa) {
        floatWa.classList.toggle('is-visible', y > vh * 0.65);
      }

      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  /* ---------- Stage Choreography (Hero Arch → Ritual → Paola) ---------- */
  const initStage = () => {
    const stage = document.getElementById('top');
    const sticky = document.getElementById('stageSticky');
    const win = document.getElementById('stageWindow');
    const canvas = document.getElementById('stageCanvas');
    const shade = document.getElementById('stageShade');

    const heroTop = document.getElementById('heroTop');
    const heroBottom = document.getElementById('heroBottom');
    const heroFoot = document.getElementById('heroFoot');
    const hwL = document.getElementById('hwL');
    const hwR = document.getElementById('hwR');

    const chapters = Array.from(document.querySelectorAll('.chapter'));
    const trackItems = Array.from(document.querySelectorAll('#chTrack li'));
    const chTrack = document.getElementById('chTrack');

    const manifesto = document.getElementById('manifesto');
    const manifestoInner = document.getElementById('manifestoInner');

    if (!stage || !sticky || !win || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });

    // Use frames 001..112 (stops right at the glossy macro finish, before the solid pink blur)
    const TOTAL_FRAMES = 112;
    const frames = new Array(TOTAL_FRAMES);
    const studioImg = new Image();
    studioImg.decoding = 'async';
    studioImg.src = 'assets/hero-studio.jpg';

    const pad3 = (n) => String(n).padStart(3, '0');

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let isMobile = vw < 768;

    // Arch metrics in viewport pixels
    let arch0 = { top: 0, right: 0, bottom: 0, left: 0, w: 300, h: 390 };
    let archEnd = { top: 0, right: 0, bottom: 0, left: 0, w: 380, h: 500 };

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      isMobile = vw < 768;

      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);

      if (!isMobile) {
        const aw = Math.round(clamp(vw * 0.22, 230, 340));
        const ah = Math.round(clamp(vh * 0.46, 300, 440));
        const ax = Math.round((vw - aw) / 2);
        const ay = Math.round((vh - ah) * 0.52);

        arch0 = {
          w: aw,
          h: ah,
          left: ax,
          right: vw - ax - aw,
          top: ay,
          bottom: vh - ay - ah
        };

        const endW = Math.round(clamp(vw * 0.36, 320, 490));
        const endH = Math.round(clamp(vh * 0.72, 390, 640));
        const marginR = Math.round(Math.max(vw * 0.06, 24));
        const endLeft = vw - marginR - endW;
        const endTop = Math.round((vh - endH) * 0.52);

        archEnd = {
          w: endW,
          h: endH,
          left: endLeft,
          right: marginR,
          top: endTop,
          bottom: vh - endTop - endH
        };

        sticky.style.setProperty('--aw', `${aw}px`);
        sticky.style.setProperty('--ah', `${ah}px`);
        sticky.style.setProperty('--ay', `${ay}px`);
      } else {
        const aw = Math.round(clamp(vw * 0.5, 170, 230));
        const ah = Math.round(clamp(vh * 0.32, 210, 285));
        const ax = Math.round((vw - aw) / 2);
        const ay = Math.round((vh - ah) * 0.48);

        arch0 = {
          w: aw,
          h: ah,
          left: ax,
          right: vw - ax - aw,
          top: ay,
          bottom: vh - ay - ah
        };

        const endW = Math.round(vw * 0.88);
        const endH = Math.round(clamp(vh * 0.36, 210, 300));
        const endLeft = Math.round((vw - endW) / 2);
        const endTop = 84;

        archEnd = {
          w: endW,
          h: endH,
          left: endLeft,
          right: vw - endLeft - endW,
          top: endTop,
          bottom: vh - endTop - endH
        };

        sticky.style.setProperty('--aw', `${aw}px`);
        sticky.style.setProperty('--ah', `${ah}px`);
        sticky.style.setProperty('--ay', `${ay}px`);
        sticky.style.setProperty('--mt', `${endTop + endH + 22}px`);
      }
    };

    // Draw an image cover-fitted inside a target viewport box (in CSS pixels)
    const drawInBox = (img, boxX, boxY, boxW, boxH, scale = 1, focusX = 0.5, focusY = 0.5) => {
      if (!img || !img.complete || !img.naturalWidth) return false;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const baseScale = Math.max(boxW / iw, boxH / ih) * scale;
      const dw = iw * baseScale;
      const dh = ih * baseScale;
      const dx = boxX + (boxW - dw) * focusX;
      const dy = boxY + (boxH - dh) * focusY;

      ctx.drawImage(img, dx * dpr, dy * dpr, dw * dpr, dh * dpr);
      return true;
    };

    const getNearestLoadedFrame = (idx) => {
      const clamped = clamp(idx, 0, TOTAL_FRAMES - 1);
      if (frames[clamped] && frames[clamped].complete && frames[clamped].naturalWidth) {
        return frames[clamped];
      }
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = clamped - offset;
        if (prev >= 0 && frames[prev] && frames[prev].complete && frames[prev].naturalWidth) {
          return frames[prev];
        }
        const next = clamped + offset;
        if (next < TOTAL_FRAMES && frames[next] && frames[next].complete && frames[next].naturalWidth) {
          return frames[next];
        }
      }
      return null;
    };

    let targetP = 0;
    let currentP = 0;
    let rafId = null;

    const chapterRanges = [
      [0.17, 0.22, 0.31, 0.36],
      [0.36, 0.41, 0.50, 0.55],
      [0.55, 0.60, 0.68, 0.73]
    ];

    const render = (p) => {
      // 1. Arch Window Interpolation (Hero Arch → Fullscreen → Paola Arch)
      const openT = easeInOutCubic(invLerp(0.00, 0.21, p));
      const closeT = easeInOutCubic(invLerp(0.72, 0.95, p));

      let top, right, bottom, left, rTop, rBot;
      if (closeT <= 0.0001) {
        top = lerp(arch0.top, 0, openT);
        right = lerp(arch0.right, 0, openT);
        bottom = lerp(arch0.bottom, 0, openT);
        left = lerp(arch0.left, 0, openT);
        rTop = lerp(arch0.w * 0.52, 0, openT);
        rBot = lerp(8, 0, openT);
      } else {
        top = lerp(0, archEnd.top, closeT);
        right = lerp(0, archEnd.right, closeT);
        bottom = lerp(0, archEnd.bottom, closeT);
        left = lerp(0, archEnd.left, closeT);
        rTop = lerp(0, archEnd.w * 0.52, closeT);
        rBot = lerp(0, 8, closeT);
      }

      win.style.clipPath = `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${rTop.toFixed(1)}px ${rTop.toFixed(1)}px ${rBot.toFixed(1)}px ${rBot.toFixed(1)}px)`;

      // Visible box for framing the canvas media
      const boxX = left;
      const boxY = top;
      const boxW = Math.max(1, vw - left - right);
      const boxH = Math.max(1, vh - top - bottom);

      // 2. Canvas Drawing (Video Ritual Frames + Crossfade to Paola Studio Photo)
      ctx.fillStyle = '#F6DCDD';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scrubT = invLerp(0.04, 0.72, p);
      const frameIdx = Math.round(scrubT * (TOTAL_FRAMES - 1));
      const activeFrame = getNearestLoadedFrame(frameIdx);

      // Dissolve into Paola's studio photo as the arch contracts on the right
      const studioAlpha = easeInOutCubic(invLerp(0.68, 0.84, p));

      if (activeFrame && studioAlpha < 1) {
        ctx.globalAlpha = 1;
        const zoom = lerp(1.04, 1.0, openT);
        drawInBox(activeFrame, boxX, boxY, boxW, boxH, zoom, 0.5, 0.5);
      }

      if (studioAlpha > 0.001 && studioImg.complete && studioImg.naturalWidth) {
        ctx.save();
        ctx.globalAlpha = studioAlpha;
        const studioZoom = lerp(1.08, 1.0, closeT);
        drawInBox(studioImg, boxX, boxY, boxW, boxH, studioZoom, 0.5, 0.35);
        ctx.restore();
      }

      // 3. Hero Lockup Parting (0.00 -> 0.17)
      const heroMove = easeOutCubic(invLerp(0.00, 0.18, p));
      const heroAlpha = 1 - invLerp(0.02, 0.15, p);
      const footAlpha = 1 - invLerp(0.00, 0.08, p);
      const shiftX = heroMove * (isMobile ? 28 : 96);

      if (hwL) {
        hwL.style.transform = `translate3d(${-shiftX.toFixed(1)}px, 0, 0)`;
        hwL.style.opacity = heroAlpha.toFixed(3);
      }
      if (hwR) {
        hwR.style.transform = `translate3d(${shiftX.toFixed(1)}px, 0, 0)`;
        hwR.style.opacity = heroAlpha.toFixed(3);
      }
      if (heroTop) {
        heroTop.style.transform = `translate3d(0, ${(-heroMove * 34).toFixed(1)}px, 0)`;
        heroTop.style.opacity = heroAlpha.toFixed(3);
      }
      if (heroBottom) {
        heroBottom.style.transform = `translate3d(0, ${(heroMove * 34).toFixed(1)}px, 0)`;
        heroBottom.style.opacity = heroAlpha.toFixed(3);
      }
      if (heroFoot) {
        heroFoot.style.opacity = footAlpha.toFixed(3);
        heroFoot.style.pointerEvents = footAlpha > 0.2 ? 'auto' : 'none';
      }

      // 4. Shade & Chapters (0.16 -> 0.74)
      const shadeIn = invLerp(0.15, 0.23, p);
      const shadeOut = 1 - invLerp(0.66, 0.76, p);
      const shadeAlpha = Math.min(shadeIn, shadeOut);
      if (shade) shade.style.opacity = shadeAlpha.toFixed(3);
      if (chTrack) chTrack.style.opacity = shadeAlpha.toFixed(3);

      chapters.forEach((ch, i) => {
        const [sIn, eIn, sOut, eOut] = chapterRanges[i];
        let alpha = 0;
        let y = 22;

        if (p >= sIn && p <= eOut) {
          if (p < eIn) {
            const t = easeOutCubic(invLerp(sIn, eIn, p));
            alpha = t;
            y = lerp(22, 0, t);
          } else if (p <= sOut) {
            alpha = 1;
            y = 0;
          } else {
            const t = easeOutCubic(invLerp(sOut, eOut, p));
            alpha = 1 - t;
            y = lerp(0, -16, t);
          }
        }

        ch.style.opacity = alpha.toFixed(3);
        ch.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;

        if (trackItems[i]) {
          trackItems[i].classList.toggle('on', p >= sIn && p < sOut);
        }
      });

      // 5. Final Artist Manifesto (0.80 -> 0.96)
      const manT = easeOutCubic(invLerp(0.80, 0.96, p));
      if (manifestoInner) {
        manifestoInner.style.opacity = manT.toFixed(3);
        manifestoInner.style.transform = `translate3d(0, ${((1 - manT) * 26).toFixed(1)}px, 0)`;
      }
      if (manifesto) {
        manifesto.style.pointerEvents = manT > 0.65 ? 'auto' : 'none';
      }
    };

    const computeScrollProgress = () => {
      const rect = stage.getBoundingClientRect();
      const scrollable = Math.max(1, stage.offsetHeight - vh);
      targetP = clamp(-rect.top / scrollable, 0, 1);
      if (prefersReducedMotion) {
        currentP = targetP;
      }
      startLoop();
    };

    const tick = () => {
      const diff = targetP - currentP;
      if (Math.abs(diff) > 0.0004) {
        currentP += diff * 0.14;
        render(currentP);
        rafId = requestAnimationFrame(tick);
      } else {
        currentP = targetP;
        render(currentP);
        rafId = null;
      }
    };

    const startLoop = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    // Progressive Frame Preloader (loads keyframe stride first for instant scrubbing, then fills in)
    const preloadFrames = () => {
      const loadOne = (index) =>
        new Promise((resolve) => {
          if (frames[index]) return resolve();
          const img = new Image();
          img.decoding = 'async';
          img.onload = () => {
            if (index === 0) render(currentP);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = `assets/frames/frame_${pad3(index + 1)}.jpg`;
          frames[index] = img;
        });

      // Immediately load frame 0
      loadOne(0).then(async () => {
        // Pass 1: every 4th frame for immediate responsive scrubbing
        for (let i = 4; i < TOTAL_FRAMES; i += 4) {
          await loadOne(i);
        }
        // Pass 2: fill all remaining frames in small batches
        const batchSize = 6;
        for (let i = 1; i < TOTAL_FRAMES; i += batchSize) {
          const batch = [];
          for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
            if (!frames[j]) batch.push(loadOne(j));
          }
          await Promise.all(batch);
        }
      });
    };

    studioImg.onload = () => render(currentP);

    measure();
    computeScrollProgress();
    render(currentP);
    preloadFrames();

    window.addEventListener('scroll', computeScrollProgress, { passive: true });
    window.addEventListener('resize', () => {
      measure();
      computeScrollProgress();
      render(currentP);
    });
  };

  /* ---------- Services Interactive Arch Preview + Hover Floating Reveal ---------- */
  const initServices = () => {
    const svcList = document.getElementById('svcList');
    const items = Array.from(document.querySelectorAll('#svcList .svc-item'));
    const archImgs = Array.from(document.querySelectorAll('.svc-arch img'));
    const capNum = document.getElementById('svcCapNum');
    const capName = document.getElementById('svcCapName');

    const svcFloat = document.getElementById('svcFloat');
    const floatImgs = Array.from(document.querySelectorAll('.svc-float-arch img'));
    const floatNum = document.getElementById('svcFloatNum');
    const floatName = document.getElementById('svcFloatName');

    if (!items.length) return;

    // Open first item by default on desktop
    if (window.innerWidth >= 960) {
      items[0].open = true;
    }

    const activateService = (index) => {
      const numStr = String(index + 1).padStart(2, '0');
      const nameStr = items[index] ? items[index].dataset.name || '' : '';

      archImgs.forEach((img, i) => {
        img.classList.toggle('is-on', i === index);
      });
      if (capNum) capNum.textContent = numStr;
      if (capName) capName.textContent = nameStr;

      floatImgs.forEach((img, i) => {
        img.classList.toggle('is-on', i === index);
      });
      if (floatNum) floatNum.textContent = numStr;
      if (floatName) floatName.textContent = nameStr;
    };

    // Smooth cursor-tracking floating arch reveal when hovering service titles
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let floatRaf = null;
    let hasPosition = false;

    const tickFloat = () => {
      if (!svcFloat) return;
      const dx = targetX - curX;
      const dy = targetY - curY;
      curX += dx * 0.2;
      curY += dy * 0.2;
      const tilt = clamp(dx * 0.045, -4.5, 4.5);

      svcFloat.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;

      if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
        floatRaf = requestAnimationFrame(tickFloat);
      } else {
        floatRaf = null;
      }
    };

    const updateTargetFromEvent = (e) => {
      const cardW = 224;
      const cardH = 310;
      const pad = 20;
      let x = e.clientX + 28;
      if (x + cardW + pad > window.innerWidth) {
        x = e.clientX - cardW - 28;
      }
      const y = clamp(e.clientY - cardH * 0.55, pad + 72, window.innerHeight - cardH - pad);

      targetX = x;
      targetY = y;
      if (!hasPosition || prefersReducedMotion) {
        curX = x;
        curY = y;
        hasPosition = true;
      }
      if (floatRaf === null) {
        floatRaf = requestAnimationFrame(tickFloat);
      }
    };

    items.forEach((item, index) => {
      const summary = item.querySelector('summary');
      const body = item.querySelector('.svc-body');

      if (summary) {
        summary.addEventListener('mouseenter', (e) => {
          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            activateService(index);
            updateTargetFromEvent(e);
            if (svcFloat) svcFloat.classList.add('is-active');
          }
        });

        summary.addEventListener('mousemove', (e) => {
          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            updateTargetFromEvent(e);
            if (svcFloat) svcFloat.classList.add('is-active');
          }
        });

        summary.addEventListener('mouseleave', () => {
          if (svcFloat) svcFloat.classList.remove('is-active');
        });
      }

      if (body) {
        body.addEventListener('mouseenter', () => {
          if (svcFloat) svcFloat.classList.remove('is-active');
        });
      }

      item.addEventListener('toggle', () => {
        if (item.open) {
          activateService(index);
        }
      });
    });

    if (svcList && svcFloat) {
      svcList.addEventListener('mouseleave', () => {
        svcFloat.classList.remove('is-active');
      });
      window.addEventListener(
        'scroll',
        () => {
          svcFloat.classList.remove('is-active');
        },
        { passive: true }
      );
    }
  };

  /* ---------- Scroll Reveal & Portrait Parallax ---------- */
  const initReveals = () => {
    const revealEls = document.querySelectorAll('.reveal, .reveal-lines');

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16, rootMargin: '0px 0px -6% 0px' }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-in'));
    }

    // Subtle parallax on Paola's circular portrait frame
    const portraitFrame = document.getElementById('portraitFrame');
    if (portraitFrame && !prefersReducedMotion) {
      const onScroll = () => {
        const rect = portraitFrame.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom < 0 || rect.top > vh) return;
        const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
        const y = clamp(centerOffset * -28, -22, 22);
        portraitFrame.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  };

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    wireLinks();
    initChrome();
    initStage();
    initServices();
    initReveals();
  });
})();
