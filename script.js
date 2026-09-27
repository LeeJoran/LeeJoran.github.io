// 鼠标粒子拖尾：低密度、缓慢淡出、不拦截任何交互
(function () {
  var canvas = document.getElementById('particles');
  if (!canvas) return;

  // 减少动态效果设置、触屏设备：默认关闭
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (reduced || touch) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var particles = [];
  var MAX = 140;
  var rafId = null;
  var lastX = -1, lastY = -1;

  // 低饱和浅蓝、蓝灰
  var COLORS = ['29,111,214', '122,167,216', '159,179,200', '185,204,221'];

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn(x, y) {
    if (particles.length >= MAX) {
      particles.splice(0, particles.length - MAX + 2);
    }
    particles.push({
      x: x + (Math.random() - .5) * 10,
      y: y + (Math.random() - .5) * 10,
      r: 1.2 + Math.random() * 2.4,
      a: .2 + Math.random() * .25,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18 - .06
    });
  }

  // 鼠标移动时生成；静止或离开页面即停止生成
  window.addEventListener('mousemove', function (e) {
    if (Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY) < 10) return;
    lastX = e.clientX;
    lastY = e.clientY;
    spawn(e.clientX, e.clientY);
  }, { passive: true });

  function tick() {
    rafId = requestAnimationFrame(tick);
    ctx.clearRect(0, 0, W, H);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.a -= 0.012;
      if (p.a <= 0) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx;
      p.y += p.vy;
      ctx.fillStyle = 'rgba(' + p.c + ',' + p.a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  rafId = requestAnimationFrame(tick);

  // 页面不可见时暂停动画
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  });
})();
