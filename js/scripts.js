$(document).ready(function () {
  $(window).scroll(function () {
    if (this.scrollY > 20)
      $(".header__navbar").addClass("header__sticky");
    else
      $(".header__navbar").removeClass("header__sticky");
  });

  $('.header__menu-toggler').click(function () {
    $(this).toggleClass("active");
    $(".header__navbar-menu").toggleClass("active");
  });

  $("a").click(function () {
    const elementClick = $(this).attr("href");
    const destination = $(elementClick).offset().top;
    $('html' || 'body').animate({ scrollTop: destination }, 1100);
    return false;
  });
});

(() => {

  const cnv = document.querySelector('canvas');
  const ctx = cnv.getContext('2d');

  let cw, ch, cx, cy;
  function resizeCanvas() {
    cw = cnv.width = innerWidth;
    ch = cnv.height = innerHeight;
    cx = cw / 2;
    cy = ch / 2;
  }
  resizeCanvas();
  window.addEventListener(`resize`, resizeCanvas);

  const cfg = {
    hue: 0,
    bgFillColor: `rgba(50, 50, 50, .01)`,
    dirsCount: 6,
    stepToTurn: 8,
    dotSize: 2,
    dotsCount: 300,
    dotVelocity: 2,
    distance: 170,
    gradientLen: 5,
  }

  function drawRect(color, x, y, w, h, shadowColor, shadowBlur, gco) {
    ctx.globalCompositeOperation = gco;
    ctx.shadowColor = shadowColor || `black`;
    ctx.shadowBlur = shadowBlur || 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  class Dot {
    constructor() {
      this.pos = { x: cx, y: cy };
      this.dir = (Math.random() * 3 | 0) * 2;
      this.step = 0;
    }

    redrawDot() {
      let xy = Math.abs(this.pos.x - cx) + Math.abs(this.pos.y - cy);
      let makeHue = (cfg.hue + xy / cfg.gradientLen) % 360;
      let color = `hsl(${makeHue}, 100%, 50%)`;
      let blur = cfg.dotSize - Math.sin(xy / 8) * 2;
      let size = cfg.dotSize;// - Math.sin(xy / 9) * 2 + Math.sin(xy / 2);
      let x = this.pos.x - size / 2;
      let y = this.pos.y - size / 2;

      drawRect(color, x, y, size, size, color, blur, `lighter`);
    }

    moveDot() {
      this.step++;
      this.pos.x += dirsList[this.dir].x * cfg.dotVelocity;
      this.pos.y += dirsList[this.dir].y * cfg.dotVelocity;
    }

    changeDir() {
      if (this.step % cfg.stepToTurn === 0) {
        this.dir = Math.random() > 0.5 ? (this.dir + 1) % cfg.dirsCount : (this.dir + cfg.dirsCount - 1) % cfg.dirsCount;
      }
    }

    killDot(id) {
      let percent = Math.random() * Math.exp(this.step / cfg.distance);
      if (percent > 100) {
        dotsList.splice(id, 1);
      }
    }
  }

  let dirsList = [];
  function createDirs() {
    for (let i = 0; i < 360; i += 360 / cfg.dirsCount) {
      let x = Math.cos(i * Math.PI / 180);
      let y = Math.sin(i * Math.PI / 180);
      dirsList.push({ x: x, y: y });
    }
  }
  createDirs();

  let dotsList = [];
  function addDot() {
    if (dotsList.length < cfg.dotsCount && Math.random() > .8) {
      dotsList.push(new Dot());
      cfg.hue = (cfg.hue + 1) % 360;
    }
  }

  function refreshDots() {
    dotsList.forEach((i, id) => {
      i.redrawDot();
      i.moveDot();
      i.changeDir();
      i.killDot(id)
    });
  }
  function loop() {
    drawRect(cfg.bgFillColor, 0, 0, cw, ch, 0, 0, `normal`);
    addDot();
    refreshDots();

    requestAnimationFrame(loop);
  }
  loop();

})();