
(()=>{
  if(matchMedia("(pointer:coarse)").matches) return;

  const dog = document.querySelector(".dog-cursor");
  if(!dog) return;

  let mx = innerWidth * 0.5;
  let my = innerHeight * 0.5;
  let prevMx = mx;

  const offsetX = 42;
  const offsetY = 14;

  // false = dog faces left (original image)
  // true  = dog faces right (flipped)
  let facingRight = false;

  function targetX(){
    // When dog faces right, keep dog LEFT of cursor,
    // so the cursor appears on the dog's right side.
    return facingRight ? mx - offsetX : mx + offsetX;
  }

  function targetY(){
    return my + offsetY;
  }

  let tx = targetX();
  let ty = targetY();
  let x = tx + 70;
  let y = ty + 35;

  let lastTrail = 0;

  addEventListener("mousemove", e => {
    const dx = e.clientX - prevMx;

    // Only flip when horizontal movement is meaningful.
    if (Math.abs(dx) > 1.5) {
      facingRight = dx > 0;

      dog.style.transform = facingRight
        ? "translate(-50%,-50%) scaleX(-1)"
        : "translate(-50%,-50%) scaleX(1)";
    }

    prevMx = e.clientX;
    mx = e.clientX;
    my = e.clientY;

    // Rest position changes according to the dog's facing direction.
    tx = targetX();
    ty = targetY();

    const now = performance.now();
    if(now - lastTrail > 95){
      lastTrail = now;
      const t = document.createElement("i");
      t.className = "trail";
      t.style.left = x + "px";
      t.style.top = y + "px";
      document.body.appendChild(t);

      requestAnimationFrame(() => {
        t.style.transition = "opacity .38s ease";
        setTimeout(() => t.style.opacity = "0", 60);
      });
      setTimeout(() => t.remove(), 480);
    }
  });

  function frame(){
    x += (tx - x) * 0.10;
    y += (ty - y) * 0.10;

    dog.style.left = x + "px";
    dog.style.top = y + "px";

    requestAnimationFrame(frame);
  }

  frame();
})();
