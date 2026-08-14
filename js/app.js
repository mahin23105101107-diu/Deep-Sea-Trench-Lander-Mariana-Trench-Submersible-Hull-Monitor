(function () {
  'use strict';
  function init() {
    var MAX_DEPTH = 10935, state = { depth: 0, mode: 'docked' }, elapsed = 0, emergencyShown = false, milestoneHit = {};
    function $(id) { return document.getElementById(id); }
    var marker=$('landerMarker'), pulse=$('landerPulse'), terminal=$('terminal'), sonarRange=$('sonarRange'), linkStatus=$('link-status');
    var hud={depth:$('hudDepth'),pressure:$('hudPressure'),hull:$('hudHull'),temp:$('hudTemp'),o2:$('hudO2'),batt:$('hudBatt')};
    var cells={hull:$('hullCell'),o2:$('o2Cell'),batt:$('battCell')};
    var pills={dive:$('pillDive'),hold:$('pillHold'),ascend:$('pillAscend'),docked:$('pillDocked')};
    function fmt(sec){var h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=Math.floor(sec%60);function p(n){return n<10?'0'+n:''+n;}return p(h)+':'+p(m)+':'+p(s);}
    function log(msg,cls){if(!terminal)return;var p=document.createElement('p');if(cls)p.className=cls;var ts=document.createElement('span');ts.className='ts';ts.textContent=fmt(elapsed);p.appendChild(ts);p.appendChild(document.createTextNode(msg));terminal.appendChild(p);terminal.scrollTop=terminal.scrollHeight;while(terminal.children.length>40)terminal.removeChild(terminal.firstChild);}
    function setMode(mode){state.mode=mode;Object.keys(pills).forEach(function(k){if(pills[k])pills[k].classList.toggle('active',k===mode);});[['btnDive','btnDive2'],['btnHold','btnHold2'],['btnAscend','btnAscend2']].forEach(function(pair){pair.forEach(function(id){var b=$(id);if(!b)return;if(pair[0]==='btnDive')b.disabled=(mode==='dive'&&state.depth>0)||state.depth>=MAX_DEPTH;if(pair[0]==='btnAscend')b.disabled=state.depth<=0;});});}
    var milestones=[{d:200,label:'Crossing into the twilight zone — sunlight fades.'},{d:1000,label:'Entering the midnight zone — no natural light remains.'},{d:4000,label:'Entering the abyssal zone.'},{d:6000,label:'Entering the hadal zone — trench territory begins.'},{d:10935,label:'Challenger Deep reached. Maximum depth of the Mariana Trench.'}];
    function update(){
      var d=state.depth,pct=Math.min(100,d/MAX_DEPTH*100);if(marker)marker.style.top=pct+'%';if(pulse)pulse.style.top=pct+'%';
      var pressure=1+d/10,hull=Math.min(100,d/MAX_DEPTH*92+(d>0?Math.random()*1.5:0)),temp=18.4-Math.min(17.2,d/1000*1.9);if(d>1000)temp=1.2+Math.random()*.6;var o2=Math.max(41,98-elapsed/6),batt=Math.max(6,100-elapsed/9);
      if(hud.depth)hud.depth.innerHTML=Math.round(d).toLocaleString()+'<span class="unit">m</span>';if(hud.pressure)hud.pressure.innerHTML=pressure.toFixed(1)+'<span class="unit">bar</span>';if(hud.hull)hud.hull.innerHTML=hull.toFixed(0)+'<span class="unit">%</span>';if(hud.temp)hud.temp.innerHTML=temp.toFixed(1)+'<span class="unit">°C</span>';if(hud.o2)hud.o2.innerHTML=o2.toFixed(0)+'<span class="unit">%</span>';if(hud.batt)hud.batt.innerHTML=batt.toFixed(0)+'<span class="unit">%</span>';
      if(cells.hull)cells.hull.className='hud-cell'+(hull>85?' state-red':hull>60?' state-amber':'');if(cells.o2)cells.o2.className='hud-cell'+(o2<55?' state-red':o2<70?' state-amber':'');if(cells.batt)cells.batt.className='hud-cell'+(batt<20?' state-red':batt<40?' state-amber':'');if(sonarRange)sonarRange.textContent=Math.max(0,Math.round(MAX_DEPTH-d)).toLocaleString()+' m to trench floor';
      milestones.forEach(function(m){if(d>=m.d&&!milestoneHit[m.d]){milestoneHit[m.d]=true;log(m.label,m.d===10935?'ok':'warn');}});
      if(window.HullSensors)window.HullSensors.update(d,MAX_DEPTH);if(window.Analytics)window.Analytics.update(d,MAX_DEPTH);
      if(hull>=86&&!emergencyShown&&state.mode==='dive')showEmergency(d,hull);
    }
    function begin(){if(state.depth>=MAX_DEPTH)return;setMode('dive');log('Descent initiated by operator command.','ok');}
    function hold(){if(state.mode==='docked'&&state.depth===0)return;setMode('hold');log('Position held at '+Math.round(state.depth).toLocaleString()+' m.');}
    function ascend(){if(state.depth<=0)return;setMode('ascend');log('Ascent initiated by operator command.','warn');}
    function reset(){state.depth=0;elapsed=0;milestoneHit={};if(window.Analytics)window.Analytics.reset();setMode('docked');update();log('System reset. Lander returned to surface platform.','ok');}
    [['btnDive','btnDive2',begin],['btnHold','btnHold2',hold],['btnAscend','btnAscend2',ascend]].forEach(function(x){[x[0],x[1]].forEach(function(id){var b=$(id);if(b)b.addEventListener('click',x[2]);});});var resetBtn=$('btnReset');if(resetBtn)resetBtn.addEventListener('click',reset);
    function showEmergency(d,hull){var o=$('emergencyOverlay');if(!o)return;$('criticalStress').textContent=hull.toFixed(0)+'%';$('criticalDepth').textContent=Math.round(d).toLocaleString()+' m';$('criticalPressure').textContent=(1+d/10).toFixed(0)+' bar';o.classList.add('show');o.setAttribute('aria-hidden','false');emergencyShown=true;log('CRITICAL: Hull stress threshold exceeded. Emergency ascent recommended.','crit');setMode('hold');}
    var close=$('emergencyClose'), ea=$('emergencyAscend');if(close)close.addEventListener('click',function(){var o=$('emergencyOverlay');o.classList.remove('show');o.setAttribute('aria-hidden','true');emergencyShown=false;});if(ea)ea.addEventListener('click',function(){var o=$('emergencyOverlay');o.classList.remove('show');o.setAttribute('aria-hidden','true');emergencyShown=false;ascend();});
    setInterval(function(){elapsed++;if(state.mode==='dive')state.depth=Math.min(MAX_DEPTH,state.depth+55);else if(state.mode==='ascend'){state.depth=Math.max(0,state.depth-65);if(state.depth===0)setMode('docked');}update();setMode(state.mode);},900);
    if(window.Sonar)window.Sonar.init(function(){return elapsed;});if(window.Accessibility)window.Accessibility.init();
    var navBtns=[].slice.call(document.querySelectorAll('.nav-btn')),pages=[].slice.call(document.querySelectorAll('.page')),current=null;
    function go(id,initial){if(!document.getElementById('page-'+id))id='overview';var next=document.getElementById('page-'+id);navBtns.forEach(function(b){var active=b.getAttribute('data-page')===id;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');});pages.forEach(function(p){p.classList.remove('active','page-visible');});next.classList.add('active');void next.offsetWidth;next.classList.add('page-visible');current=id;if(location.hash.replace('#','')!==id)history.replaceState(null,'','#'+id);if(id==='analytics'&&window.Analytics)window.Analytics.redraw();if(!initial){var h=next.querySelector('h1[tabindex],h2[tabindex]');if(h)h.focus({preventScroll:true});}window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
    navBtns.forEach(function(b){b.addEventListener('click',function(){go(b.getAttribute('data-page'),false);});});window.addEventListener('popstate',function(){go((location.hash||'#overview').slice(1),false);});
    setInterval(function(){if(linkStatus){var m=['Telemetry link stable','Acoustic modem syncing…','Telemetry link stable'];linkStatus.textContent=m[Math.floor(Math.random()*m.length)];}},6000);
    setMode('docked');update();go((location.hash||'#overview').slice(1),true);
    window.addEventListener('resize',function(){if(window.Analytics)window.Analytics.redraw();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
