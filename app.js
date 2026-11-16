(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function sc(){top.classList.toggle('sc',window.scrollY>8)}
  window.addEventListener('scroll',sc,{passive:true});requestAnimationFrame(sc);
  if(bg){
    bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
    document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',function(){top.classList.remove('open');bg.setAttribute('aria-expanded','false')})});
  }
  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var t=document.querySelector(l.getAttribute('href'));if(t)io.observe(t)});
  }
  var moved=false;
  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var down=false,sx=0,sl=0;
    function step(){var k=tor.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0):300}
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||tor.scrollWidth<=tor.clientWidth+2)return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;tor.classList.add('drag')}tor.scrollLeft=sl-dx});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;tor.classList.remove('drag');if(moved){var w=step();tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'});setTimeout(function(){moved=false},50)}});
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    var nav=document.querySelector('[data-nav="'+tor.id+'"]');
    if(nav)nav.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){tor.scrollBy({left:step()*(+b.dataset.k),behavior:'smooth'})})});
  });
  // lightbox
  var lb=document.getElementById('lb'),li=document.getElementById('lbimg'),lc=document.getElementById('lbcap'),grp=[],idx=0,last=null;
  function show(i){idx=(i+grp.length)%grp.length;var a=grp[idx];li.src=a.getAttribute('href');var im=a.querySelector('img');li.alt=im?im.alt:'';lc.textContent=a.dataset.cap||'';}
  function open(a){grp=[].slice.call(document.querySelectorAll('[data-lb="'+a.dataset.lb+'"]'));last=a;show(grp.indexOf(a));lb.hidden=false;document.body.style.overflow='hidden';document.getElementById('lbx').focus();
    var multi=grp.length>1;document.getElementById('lbp').hidden=!multi;document.getElementById('lbn').hidden=!multi}
  function close(){lb.hidden=true;li.removeAttribute('src');document.body.style.overflow='';if(last)last.focus()}
  document.querySelectorAll('[data-lb]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(moved)return;open(a)})});
  if(lb){
    document.getElementById('lbx').addEventListener('click',close);
    document.getElementById('lbp').addEventListener('click',function(){show(idx-1)});
    document.getElementById('lbn').addEventListener('click',function(){show(idx+1)});
    lb.addEventListener('click',function(e){if(e.target===lb)close()});
    document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
    var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(idx+(d<0?1:-1))});
  }
  // mapa przy przewinieciu
  var m=document.getElementById('mapa');
  function load(){if(m.dataset.ok)return;m.dataset.ok=1;var f=document.createElement('iframe');f.src=m.dataset.src;f.title=m.dataset.title||'Mapa';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f)}
  if(m){if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){load();mo.disconnect()}},{rootMargin:'300px'});mo.observe(m)}else load()}
  var f=document.getElementById('form'),msg=document.getElementById('msg');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();msg.hidden=false;msg.scrollIntoView({block:'nearest',behavior:'smooth'})});
  var y=document.getElementById('rok');if(y)y.textContent=new Date().getFullYear();
})();
