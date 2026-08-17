(()=>{
  const dog = document.querySelector('.dog-cursor');
  if(!dog) return;

  // Only true for actual coarse-pointer devices such as phones/iPad.
  // Do NOT use 'ontouchstart' here because some desktop browsers expose it.
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  let mx = innerWidth * 0.5;
  let my = innerHeight * 0.5;
  let prevX = mx;

  const offsetX = isTouchDevice ? 48 : 42;
  const offsetY = isTouchDevice ? 18 : 14;

  let facingRight = false;
  let x = mx + offsetX;
  let y = my + offsetY;
  let tx = x;
  let ty = y;
  let fadeTimer = null;
  let lastTrail = 0;

  function setFacing(dx){
    if(Math.abs(dx) <= 1.5) return;
    facingRight = dx > 0;
    dog.style.transform = facingRight
      ? 'translate(-50%,-50%) scaleX(-1)'
      : 'translate(-50%,-50%) scaleX(1)';
  }

  function updateTarget(px, py){
    mx = px;
    my = py;
    tx = facingRight ? mx - offsetX : mx + offsetX;
    ty = my + offsetY;
  }

  function makeTrail(px, py){
    const now = performance.now();
    if(now - lastTrail < 95) return;
    lastTrail = now;

    const t = document.createElement('i');
    t.className = 'trail';
    t.style.left = px + 'px';
    t.style.top = py + 'px';
    document.body.appendChild(t);

    requestAnimationFrame(()=>{
      t.style.transition = 'opacity .38s ease';
      setTimeout(()=>t.style.opacity='0', 60);
    });
    setTimeout(()=>t.remove(), 480);
  }

  if(isTouchDevice){
    // Phone / iPad: hidden until finger touches the screen.
    dog.classList.remove('touch-active');

    addEventListener('touchstart', e=>{
      if(!e.touches || !e.touches.length) return;
      const t = e.touches[0];

      prevX = t.clientX;
      updateTarget(t.clientX, t.clientY);

      clearTimeout(fadeTimer);
      dog.classList.add('touch-active');
    }, {passive:true});

    addEventListener('touchmove', e=>{
      if(!e.touches || !e.touches.length) return;
      const t = e.touches[0];
      const dx = t.clientX - prevX;

      setFacing(dx);
      prevX = t.clientX;
      updateTarget(t.clientX, t.clientY);

      clearTimeout(fadeTimer);
      dog.classList.add('touch-active');
      makeTrail(x, y);
    }, {passive:true});

    addEventListener('touchend', ()=>{
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(()=>{
        dog.classList.remove('touch-active');
      }, 750);
    }, {passive:true});

    addEventListener('touchcancel', ()=>{
      clearTimeout(fadeTimer);
      dog.classList.remove('touch-active');
    }, {passive:true});

  } else {
    // Desktop: always visible and follows the normal cursor.
    dog.style.opacity = '1';

    addEventListener('mousemove', e=>{
      const dx = e.clientX - prevX;

      setFacing(dx);
      prevX = e.clientX;
      updateTarget(e.clientX, e.clientY);
      makeTrail(x, y);
    });
  }

  function frame(){
    x += (tx - x) * 0.10;
    y += (ty - y) * 0.10;

    dog.style.left = x + 'px';
    dog.style.top = y + 'px';

    requestAnimationFrame(frame);
  }

  frame();
})();