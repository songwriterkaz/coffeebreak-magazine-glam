(function(){
var P=window.MAG.pages,N=P.length,book=document.getElementById('book'),pos=document.getElementById('pos');
var single=false,cur=0,busy=false; // cur: single = page index, spread = spread index (0 = cover alone)
function mk(i,side){var d=document.createElement('div');if(i<0||i>=N){d.className='page '+side;d.style.visibility='hidden';return d;}
 var p=P[i];d.className='page '+side+' '+(p.c||'');d.innerHTML="<div class='pin'>"+p.h+"</div><div class='pno'>Coffeebreak Glam · "+(i+1)+"</div>";return d;}
function spreadIdx(s){return s===0?[-1,0]:[2*s-1,2*s];}
function maxS(){return single?N-1:Math.ceil((N-1)/2)+0;}
function draw(){book.innerHTML='';book.classList.toggle('single',single);
 if(single){book.appendChild(mk(cur,'R'));pos.textContent='Page '+(cur+1)+' of '+N;}
 else{var s=spreadIdx(cur);book.appendChild(mk(s[0],'L'));book.appendChild(mk(s[1],'R'));
  pos.textContent=cur===0?'Cover · Page 1 of '+N:(s[1]<N?'Pages '+(s[0]+1)+' and '+(s[1]+1)+' of '+N:'Page '+(s[0]+1)+' of '+N);}
 var sec=P[single?cur:Math.max(0,spreadIdx(cur)[1]<N?spreadIdx(cur)[1]:N-1)].s;var sel=document.getElementById('sec');
 for(var k=0;k<sel.options.length;k++){if(sel.options[k].text===sec)sel.selectedIndex=k;}
 fit();}
function go(d){var t=Math.max(0,Math.min(maxS(),cur+d));if(t===cur||busy)return;
 if(single||Math.abs(t-cur)!==1){cur=t;draw();return;}
 busy=true;var fwd=t>cur,a=spreadIdx(cur),b=spreadIdx(t);
 // show destination underneath, animate a leaf on top
 var under=[mk(fwd?a[0]:b[0],'L'),mk(fwd?b[1]:a[1],'R')];book.innerHTML='';book.appendChild(under[0]);book.appendChild(under[1]);
 var lf=document.createElement('div');lf.className='turn';lf.style.left='420px';lf.style.transformOrigin='left center';
 var f=document.createElement('div');f.className='face';f.appendChild(mk(fwd?a[1]:b[1],'R'));
 var bk=document.createElement('div');bk.className='face back';bk.appendChild(mk(fwd?b[0]:a[0],'L'));
 lf.appendChild(f);lf.appendChild(bk);if(!fwd)lf.style.transform='rotateY(-180deg)';book.appendChild(lf);
 void lf.offsetWidth;lf.style.transform=fwd?'rotateY(-180deg)':'rotateY(0deg)';
 setTimeout(function(){cur=t;busy=false;draw();},560);}
function goPage(n){n=Math.max(1,Math.min(N,n|0));cur=single?n-1:Math.floor(n/2);draw();}
function fit(){var w=single?420:840,avail=Math.min(window.innerWidth-12,1400),ah=window.innerHeight-160;var s=Math.min(avail/w,Math.max(ah,300)/594);book.style.transform='scale('+s+')';book.parentElement.style.height=(594*s+12)+'px';}
function mode(){var want=window.innerWidth<720;if(want===single)return;var page=single?cur+1:Math.max(1,spreadIdx(cur)[1]+1);single=want;goPage(page);}
var sel=document.getElementById('sec');window.MAG.toc.forEach(function(t){var o=document.createElement('option');o.value=t[1];o.text=t[0];sel.appendChild(o);});
sel.onchange=function(){goPage(+sel.value);};
document.getElementById('next').onclick=function(){go(1)};document.getElementById('prev').onclick=function(){go(-1)};
document.getElementById('first').onclick=function(){goPage(1)};document.getElementById('last').onclick=function(){goPage(N)};
document.getElementById('jumpgo').onclick=function(){goPage(+document.getElementById('jump').value)};
document.getElementById('jump').onkeydown=function(e){if(e.key==='Enter')goPage(+this.value)};
document.getElementById('fs').onclick=function(){if(document.fullscreenElement)document.exitFullscreen();else if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen();};
document.addEventListener('keydown',function(ev){if(ev.target.tagName==='INPUT')return;if(ev.key==='ArrowRight')go(1);if(ev.key==='ArrowLeft')go(-1);});
book.addEventListener('click',function(ev){var g=ev.target.closest('[data-go]');if(g){ev.preventDefault();goPage(+g.getAttribute('data-go'));return;}
 var td=ev.target.closest('.ws td');if(td){td.classList.toggle('hit');return;}if(ev.target.closest('a,td'))return;
 var r=book.getBoundingClientRect();go(ev.clientX>r.left+r.width/2?1:-1);});
var sx=null;book.addEventListener('touchstart',function(ev){sx=ev.touches[0].clientX},{passive:true});book.addEventListener('touchend',function(ev){if(sx===null)return;var dx=ev.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)go(dx<0?1:-1);sx=null;});
window.addEventListener('resize',function(){mode();fit();});
single=window.innerWidth<720;draw();
})();
