// ── Hamburger Menu ──
(function(){
  var btn=document.getElementById('navHamburger');
  var links=document.querySelector('.nav-links');
  var navbar=document.getElementById('navbar');
  if(!btn||!links)return;
  function closeMenu(){
    links.classList.remove('open');
    btn.classList.remove('open');
    if(navbar)navbar.classList.remove('menu-open');
    document.body.style.overflow='';
  }
  btn.addEventListener('click',function(){
    var isOpen=links.classList.toggle('open');
    btn.classList.toggle('open',isOpen);
    if(navbar)navbar.classList.toggle('menu-open',isOpen);
    document.body.style.overflow=isOpen?'hidden':'';
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',closeMenu);
    a.addEventListener('touchstart',function(){a.classList.add('touched');},{passive:true});
    a.addEventListener('touchend',function(){setTimeout(function(){a.classList.remove('touched');},300);},{passive:true});
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
})();

// ── Language Toggle ──
(function(){
  var KEY='mr-lang',lang=localStorage.getItem(KEY)||'de';
  function apply(l){
    document.querySelectorAll('[data-en]').forEach(function(el){
      if(!el.getAttribute('data-de'))el.setAttribute('data-de',el.innerHTML);
      el.innerHTML=l==='en'?el.getAttribute('data-en'):el.getAttribute('data-de');
    });
    document.body.classList.toggle('lang-en',l==='en');
    document.documentElement.lang=l;
    localStorage.setItem(KEY,l);lang=l;
  }
  document.addEventListener('DOMContentLoaded',function(){
    apply(lang);
    var btn=document.getElementById('langToggle');
    if(btn)btn.addEventListener('click',function(){apply(lang==='de'?'en':'de');});
  });
})();

// ── Nav Active State ──
(function(){
  var page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a){
    if(a.getAttribute('href')===page)a.classList.add('active');
  });
})();

// ── Cursor Effect ──
(function(){
  var c=document.getElementById('cursor');if(!c)return;
  var rafC;
  document.addEventListener('mousemove',function(e){
    var x=e.clientX,y=e.clientY;
    if(!rafC)rafC=requestAnimationFrame(function(){c.style.left=x+'px';c.style.top=y+'px';rafC=null;});
  },{passive:true});
  function h(sel){document.querySelectorAll(sel).forEach(function(el){
    el.addEventListener('mouseenter',function(){c.classList.add('hover');});
    el.addEventListener('mouseleave',function(){c.classList.remove('hover');});
  });}
  h('a');h('button');h('.dot');h('a.teaser-card');h('.proj-item');
})();

// ── Fireworks (fw-marcello) ──
(function(){
  function init(){
    var host=document.getElementById('fw-marcello');
    if(!host)return;
    var cvs=document.createElement('canvas');
    host.appendChild(cvs);
    var ctx=cvs.getContext('2d'),pts=[],raf=null;
    function size(){cvs.width=window.innerWidth;cvs.height=window.innerHeight;}
    function Pt(cx,cy){
      var a=Math.random()*Math.PI*2,s=3+Math.random()*5;
      this.x=cx;this.y=cy;this.vx=Math.cos(a)*s;this.vy=Math.sin(a)*s;
      this.life=1;this.decay=.004+Math.random()*.005;this.r=2+Math.random()*3;
      var hue=Math.random()<.5?270:210;
      this.col='hsl('+(hue+~~(Math.random()*40-20))+',85%,'+~~(60+Math.random()*20)+'%)';
    }
    function tick(){
      ctx.clearRect(0,0,cvs.width,cvs.height);
      for(var i=pts.length-1;i>=0;i--){
        var p=pts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.vx*=.93;p.vy*=.93;p.life-=p.decay;
        if(p.life<=0){pts.splice(i,1);continue;}
        ctx.globalAlpha=p.life;ctx.fillStyle=p.col;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill();
      }
      ctx.globalAlpha=1;
      if(pts.length)raf=requestAnimationFrame(tick);else raf=null;
    }
    function burst(ex,ey){
      for(var i=0;i<40;i++)pts.push(new Pt(ex,ey));
      if(!raf)raf=requestAnimationFrame(tick);
    }
    host.addEventListener('mousemove',function(e){if(Math.random()>.45)return;burst(e.clientX,e.clientY);},{passive:true});
    host.addEventListener('click',function(e){for(var i=0;i<5;i++)burst(e.clientX,e.clientY);});
    size();window.addEventListener('resize',size);
  }
  if(document.readyState==='complete')init();
  else window.addEventListener('load',init);
})();

// ── Footer Time + Scroll + Progress + Back-to-Top + Reveal ──
(function(){
  function updateTime(){var ft=document.getElementById('footer-time');if(ft)ft.textContent=new Date().toLocaleTimeString('de-CH',{timeZone:'Europe/Zurich',hour:'2-digit',minute:'2-digit'});}
  updateTime();setInterval(updateTime,60000);

  var navbar=document.getElementById('navbar');
  var progress=document.getElementById('progress');
  var backTop=document.getElementById('backTop');
  var lastScroll=0,ticking=false;
  window.addEventListener('scroll',function(){
    if(!ticking){requestAnimationFrame(function(){
      var cur=window.scrollY;
      if(navbar){
        navbar.classList.toggle('hidden',cur>lastScroll&&cur>100);
        navbar.classList.toggle('scrolled',cur>20);
        if(cur<=80)navbar.classList.remove('hidden');
      }
      lastScroll=cur;
      if(progress){
        var h=document.documentElement.scrollHeight-window.innerHeight;
        progress.style.transform='scaleX('+(h>0?cur/h:0)+')';
      }
      if(backTop)backTop.classList.toggle('visible',cur>400);
      ticking=false;
    });ticking=true;}
  },{passive:true});

  var obs=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target);}});},{threshold:0,rootMargin:'0px 0px 80px 0px'});
  document.querySelectorAll('.reveal,.reveal-scale,.reveal-left').forEach(function(el){obs.observe(el);});

  if(backTop)backTop.addEventListener('click',function(e){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});
})();

// ── Hero Badge Letter-Spacing ──
(function(){
  window.addEventListener('load',function(){
    document.querySelectorAll('.hero-badge-ring').forEach(function(ring){
      var tp=ring.querySelector('textPath');if(!tp)return;
      var pid=(tp.getAttribute('href')||'').replace('#','');
      var pathEl=document.getElementById(pid);if(!pathEl)return;
      var C=pathEl.getTotalLength();
      var textEl=tp.parentElement;
      var chars=[...tp.textContent];
      var n=chars.length;
      textEl.setAttribute('letter-spacing','0');
      var NW=tp.getComputedTextLength();
      var dotIdx=chars.indexOf('\u00B7');
      var special=new Set();
      if(dotIdx!==-1){special.add(dotIdx);special.add((dotIdx-1+n)%n);}
      var totalW=chars.reduce(function(a,c,i){return a+(special.has(i)?4:1);},0);
      var unit=(C-NW)/totalW;
      var svgNS='http://www.w3.org/2000/svg';
      textEl.textContent='';
      var newTp=document.createElementNS(svgNS,'textPath');
      newTp.setAttribute('href','#'+pid);newTp.setAttribute('startOffset','0');
      chars.forEach(function(ch,i){
        var ts=document.createElementNS(svgNS,'tspan');
        ts.setAttribute('letter-spacing',((special.has(i)?4:1)*unit).toFixed(2));
        ts.textContent=ch;
        newTp.appendChild(ts);
      });
      textEl.appendChild(newTp);
    });
  });
})();
