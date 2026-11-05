/* Lean Plate extras: menu, tabs, calculator steps, daily check-in and health helper chat */
const CHAT_URL=""; // Paste your Cloudflare Worker address here to switch on the AI assistant
const LPTIPS={tired:"Aim for 7 to 9 hours of sleep, drink water and have a regular meal with some protein. A 10-minute walk can lift your energy. If tiredness lasts more than 2 weeks, see a doctor.",
head:"Drink a glass of water, rest somewhere quiet and do not skip meals. If it is sudden and severe, or comes with weakness, vision changes, fever or a stiff neck, get urgent medical care.",
stomach:"Sip water or ORS and eat small, plain meals such as curd rice, banana or khichdi. See a doctor if you cannot keep fluids down, see blood, have severe pain, or it lasts more than 2 days.",
cramps:"A warm compress, gentle walking and fluids can help. See a doctor if the pain is severe, bleeding is very heavy, or this is new for you.",
stress:"Try slow breathing (in for 4, out for 6) for two minutes, a short walk, and talking to someone you trust. Tele-MANAS (14416) offers free support 24/7.",
mood:"Be gentle with yourself. Keep a simple routine, get some daylight and talk to someone you trust. Tele-MANAS (14416 or 1-800-891-4416) is free and open 24/7. If you have thoughts of harming yourself, call 112 now.",
sleep:"Keep a regular wake-up time, avoid caffeine after noon and put screens away an hour before bed. If it goes on for weeks, speak to a doctor.",
dizzy:"Sit or lie down, drink water and have a small snack. If you have eaten very little today, please eat something. If you faint, or have chest pain or trouble breathing, call 112. If it keeps happening, see a doctor.",
aches:"If you started a new workout, soreness for 1 to 3 days is common. Rest, drink water and stretch gently. See a doctor if the pain is sharp, on one side only, or does not improve.",
cold:"Rest and drink plenty of fluids. See a doctor if a fever lasts more than 3 days, is very high, or you have trouble breathing.",
other:"Rest, drink water and eat regular meals. If it does not improve in a day or two, or it worries you, please see a doctor."};
const LPRED=/chest pain|can.?t breathe|trouble breathing|breathless|faint|unconscious|self.?harm|suicid|kill myself|seizure|stroke|severe bleeding|overdose/i;
const LPtoday=()=>new Date().toLocaleDateString("en-CA");
(function(){
const slug=document.body.dataset.p||"";
/* menu */
const mb=document.getElementById("menub"),md=document.getElementById("menud");
if(mb&&md){mb.onclick=()=>md.showModal();md.addEventListener("click",e=>{if(e.target===md||e.target.closest("a")||e.target.closest("[data-close]"))md.close()})}
/* tabs */
document.querySelectorAll("[data-tabs]").forEach(c=>{const tabs=[...c.querySelectorAll(":scope>[data-tab]")];if(!tabs.length)return;
const bar=document.createElement("div");bar.className="tabbar seg";bar.setAttribute("role","tablist");
const sel=i=>{tabs.forEach((t,j)=>t.hidden=j!==i);[...bar.children].forEach((b,j)=>{b.classList.toggle("on",j===i);b.setAttribute("aria-selected",String(j===i))})};
tabs.forEach((t,i)=>{const b=document.createElement("button");b.textContent=t.dataset.tab;b.setAttribute("role","tab");b.onclick=()=>sel(i);bar.appendChild(b)});
c.before(bar);sel(+c.dataset.start||0)});
/* calculator steps */
const wc=document.getElementById("wizcard");
if(wc){const steps=[...document.querySelectorAll("[data-step]")],dots=document.getElementById("stepdots");let i=0;
steps.forEach(()=>dots.appendChild(document.createElement("i")));
const show=n=>{i=n;steps.forEach((s,j)=>s.hidden=j!==n);[...dots.children].forEach((d,j)=>d.classList.toggle("on",j<=n));document.getElementById("wback").hidden=n===0;document.getElementById("wnext").textContent=n===steps.length-1?"See my plan":"Next"};
const result=on=>{wc.hidden=on;document.getElementById("respanel").hidden=!on};
document.getElementById("wnext").onclick=()=>{if(i<steps.length-1)show(i+1);else{S.done=true;render();result(true);window.scrollTo({top:0,behavior:"smooth"})}};
document.getElementById("wback").onclick=()=>show(i-1);
document.getElementById("editplan").onclick=()=>{result(false);show(0)};
show(0);result(!!S.done)}
})();
/* ---------- daily check-in ---------- */
(function(){
const dlg=document.createElement("dialog");dlg.id="cid";document.body.appendChild(dlg);
const NUM={one:1,two:2,three:3,four:4,five:5,half:.5,a:1,an:1};
const SYN={dahi:"curd",yogurt:"curd",yoghurt:"curd",chai:"tea",sabzi:"mixed veg curry",sabji:"mixed veg curry",chawal:"white rice",rice:"white rice",daal:"dal",paratha:"plain paratha",egg:"boiled egg",chicken:"chicken curry",milk:"milk, toned",coffee:"coffee with milk and sugar",tea:"tea with milk and sugar"};
const WO=[["none","No workout today"],["Brisk walk","Walk"],["Running","Run"],["Cycling","Cycle"],["Yoga","Yoga"],["Strength training","Strength"],["Badminton","Sports"],["Dancing","Dance"],["Other","Something else"]];
const MOOD=[[5,"😄","Great"],[4,"🙂","Good"],[3,"😐","Okay"],[2,"😕","Not great"],[1,"😣","Unwell"]];
const SYM=[["tired","Tired or low energy"],["head","Headache"],["stomach","Stomach upset"],["cramps","Period or cramps"],["stress","Stress or anxiety"],["mood","Low mood"],["sleep","Trouble sleeping"],["dizzy","Dizzy or weak"],["aches","Body aches"],["cold","Cold or fever"],["other","Something else"]];
let st;
const nm=()=>esc(((window.__lpUser&&window.__lpUser.displayName)||(ld("lp_prof")||{}).name||"there").split(" ")[0]);
function find(name){const words=name.split(/\s+/).filter(Boolean).map(w=>SYN[w]||w),q=words.join(" ").toLowerCase();let best=null,bs=0;
ALL.forEach(f=>{const fn=f.n.toLowerCase();let sc=0;if(fn===q)sc=10;else if(fn.includes(q))sc=5;else words.forEach(w=>{if(w.length>2&&fn.includes(w))sc++});if(sc>bs){bs=sc;best=f}});return bs>0?best:null}
function parse(t){const ok=[],miss=[];t.split(/,|\band\b|\n|;|\+/i).map(s=>s.trim()).filter(Boolean).forEach(s=>{let q=1,name=s;const m=s.match(/^(\d+(?:\.\d+)?|one|two|three|four|five|half|a|an)\s+(?:x\s*)?(.*)$/i);if(m){q=isNaN(m[1])?NUM[m[1].toLowerCase()]:+m[1];name=m[2]}
name=name.toLowerCase().replace(/\b(of|bowls?|cups?|pieces?|glass(es)?|plates?|slices?)\b/g,"").split(/\s+/).map(w=>w.length>3?w.replace(/s$/,""):w).join(" ").trim();
const f=name&&find(name);if(f)ok.push({f:f,q:q});else miss.push(s)});return{ok:ok,miss:miss}}
function addFoods(list){list.forEach(x=>{const f=x.f,n=f.n+" ("+fS(f.s)+")",ex=D.log.find(y=>y.n===n);if(ex)ex.q+=x.q;else D.log.push({n:n,k:f.k,p:f.p,c:f.c,f:f.f,q:x.q});bumpFav(n,f.k,f.p,f.c,f.f)});renderDay()}
function addWorkout(){if(!st.wo||st.wo==="none")return;const a=ACT.find(x=>x[0]===st.wo)||["Something else",4];
if(!plusExp()&&(D.wk||[]).length>=2){st.woMsg="The free plan logs 2 workouts a day, so this one was not added to your log.";return}
const k=Math.round(a[1]*S.wt*st.mins/60);(D.wk=D.wk||[]).push({a:a[0],m:st.mins,k:k});D.burn=(D.burn||0)+k;renderDay()}
function commit(){const ci=ld("lp2_ci")||{};ci[LPtoday()]={mood:st.mood,sx:st.sx,note:st.note,eat:st.added,wo:(st.wo&&st.wo!=="none")?{a:st.wo,m:st.mins}:null,t:Date.now()};sv("lp2_ci",ci);localStorage.setItem("lp2_u",String(Date.now()));window.dispatchEvent(new Event("lp-saved"))}
const q=s=>dlg.querySelector(s);
function chipsHtml(list,sel,multi){return'<div class="chips">'+list.map(x=>`<button data-v="${x[0]}" class="${(multi?sel.includes(x[0]):sel===x[0])?"on":""}">${x[1]}</button>`).join("")+"</div>"}
function draw(){const s=st.s;let h="";
if(s===0)h=`<h2>Welcome back, ${nm()}!</h2><p>Let’s do a quick check-in so your plan fits how you are doing today. It takes about a minute.</p><p><button class="add" id="c1">Start</button><button class="add ghosta" id="cx">Not now</button></p>`;
if(s===1)h=`<h2>What have you eaten today?</h2><p class="small" style="color:var(--mut)">Type it in your own words, for example “2 rotis, dal and a banana”.</p><textarea id="cie" rows="3" placeholder="What did you eat?">${esc(st.txt)}</textarea><p><button class="add" id="c1">Continue</button><button class="add ghosta" id="c0">I have not eaten yet</button></p>`;
if(s===2){const tk=st.m.ok.reduce((a,x)=>a+x.f.k*x.q,0);h=`<h2>Is this right?</h2>`+(st.m.ok.length?`<div>${st.m.ok.map(x=>`<div class="fr" style="grid-template-columns:1fr auto"><span>${esc(x.f.n)} × ${x.q}</span><b>${Math.round(x.f.k*x.q)} kcal</b></div>`).join("")}</div><p class="small">About ${Math.round(tk)} kcal in total.</p>`:`<p>I could not match anything. You can add foods on the Food page.</p>`)+(st.m.miss.length?`<p class="small" style="color:var(--mut)">Not found: ${st.m.miss.map(esc).join(", ")}. Add these on the Food page.</p>`:"")+`<p><button class="add" id="c1">${st.m.ok.length?"Add to my log":"Continue"}</button><button class="add ghosta" id="cb">Back</button></p>`}
if(s===3)h=`<h2>Did you work out today?</h2>`+chipsHtml(WO,st.wo||"",false)+(st.wo&&st.wo!=="none"?`<div class="sl" style="margin-top:22px"><div class="t"><label for="cim">For how long?</label><span><b id="cmo">${st.mins}</b> minutes</span></div><input type="range" id="cim" min="10" max="120" step="5" value="${st.mins}"></div>`:"")+`<p style="margin-top:22px"><button class="add" id="c1" ${st.wo?"":"disabled"}>Continue</button></p>`;
if(s===4)h=`<h2>How are you feeling?</h2><div class="mood">${MOOD.map(m=>`<button data-m="${m[0]}"><span>${m[1]}</span>${m[2]}</button>`).join("")}</div>`;
if(s===5)h=`<h2>I am sorry to hear that. What is going on?</h2><p class="small" style="color:var(--mut)">Pick anything that applies.</p>`+chipsHtml(SYM,st.sx,true)+`<textarea id="cin" rows="2" placeholder="Anything else you want to add (optional)">${esc(st.note)}</textarea><p><button class="add" id="c1">Continue</button></p>`;
if(s===6){const bad=st.mood<=2,red=LPRED.test(st.note);
h=`<h2>${st.mood>=4?"Great to hear!":st.mood===3?"Thanks for sharing.":"Thank you for telling me."}</h2>`
+(st.mood>=4?`<p>Keep it up. Small steady habits are what work.</p>`:st.mood===3?`<p>A short walk and some water can help you feel better.</p>`:"")
+(red?`<div class="warn"><b>This could be serious.</b> Please call 112 or go to the nearest hospital now. For mental health support call Tele-MANAS on 14416 (free, 24/7).</div>`:"")
+(bad?(st.sx.length?st.sx:["other"]).map(k=>`<p><b>${(SYM.find(x=>x[0]===k)||["","Something else"])[1]}:</b> ${LPTIPS[k]}</p>`).join("")+`<p class="small" style="color:var(--mut)">This is general information, not medical advice. If it gets worse or keeps coming back, please see a doctor.</p>`:"")
+(st.woMsg?`<p class="small">${esc(st.woMsg)}</p>`:"")
+`<p style="margin-top:20px"><a class="add" href="food.html">See my day</a><button class="add ghosta" id="cask">Ask the health helper</button><button class="add ghosta" id="cx">Close</button></p>`}
dlg.innerHTML='<div class="dots" id="cdots">'+[0,1,2,3,4,5,6].map(i=>`<i class="${i<=s?"on":""}"></i>`).join("")+"</div>"+h;
bind(s)}
function go(n){st.s=n;draw()}
function bind(s){const on=(sel,fn)=>{const e=q(sel);if(e)e.onclick=fn};
on("#cx",()=>{sessionStorage.setItem("lp_ci_skip","1");dlg.close()});on("#cb",()=>go(1));
on("#c1",()=>{if(s===0)go(1);else if(s===1){st.txt=q("#cie").value;st.m=parse(st.txt);go(st.txt.trim()?2:3)}
else if(s===2){if(st.m.ok.length){addFoods(st.m.ok);st.added=st.m.ok.map(x=>x.f.n)}go(3)}
else if(s===3){addWorkout();go(4)}else if(s===5){st.note=q("#cin").value;commit();go(6)}});
on("#c0",()=>{st.txt="";st.added=[];go(3)});
if(s===3){dlg.querySelectorAll(".chips button").forEach(b=>b.onclick=()=>{st.wo=b.dataset.v;draw()});const r=q("#cim");if(r)r.oninput=()=>{st.mins=+r.value;q("#cmo").textContent=r.value}}
if(s===4)dlg.querySelectorAll(".mood button").forEach(b=>b.onclick=()=>{st.mood=+b.dataset.m;if(st.mood<=2)go(5);else{commit();go(6)}});
if(s===5)dlg.querySelectorAll(".chips button").forEach(b=>b.onclick=()=>{const v=b.dataset.v;st.sx=st.sx.includes(v)?st.sx.filter(x=>x!==v):st.sx.concat(v);st.note=q("#cin").value;draw()});
on("#cask",()=>{dlg.close();if(window.LPchatOpen)window.LPchatOpen("I did a check-in. Any tips for me today?")})}
function openCI(){st={s:0,txt:"",m:{ok:[],miss:[]},wo:null,mins:30,mood:0,sx:[],note:"",added:[],woMsg:""};draw();if(!dlg.open)dlg.showModal()}
window.LPcheckin=openCI;document.addEventListener("click",e=>{if(e.target.closest("[data-ci]"))openCI()});
const slug=document.body.dataset.p||"";
const maybe=()=>{if(dlg.open||!LPin()||NOBAR.includes(slug)||sessionStorage.getItem("lp_ci_skip"))return;if((ld("lp2_ci")||{})[LPtoday()])return;if(!Object.keys(ld("lp2_h")||{}).length)return;openCI()};
window.addEventListener("lp-auth",()=>{if(!window.__lpUser)return;const fresh=!sessionStorage.getItem("lp_pulled");
if(fresh){let done=false;const run=()=>{if(done)return;done=true;setTimeout(maybe,500)};window.addEventListener("lp-synced",run,{once:true});setTimeout(run,8000)}else setTimeout(maybe,900)});
})();
/* ---------- health helper chat ---------- */
(function(){
const FAQ=[["How many calories should I eat?"],["How much protein do I need?"],["I feel dizzy"],["Healthy snack ideas"],["How much water should I drink?"]];
const M=[];
const ans=q=>{const t=q.toLowerCase(),c=cur;
if(LPRED.test(t))return"This could be serious. Please call 112 or go to the nearest hospital now. If you are thinking about harming yourself, call Tele-MANAS on 14416 (free, 24/7) or 112.";
const sx=[["head",/headache|migraine/],["stomach",/stomach|nausea|vomit|diarrh|loose motion|acidity|bloat|constipat/],["dizzy",/dizz|weakness|light.?headed/],["tired",/tired|fatigue|low energy|exhaust/],["cramps",/period|cramp/],["stress",/stress|anxi|panic|worried/],["mood",/depress|sad\b|low mood|hopeless/],["sleep",/sleep|insomnia/],["aches",/sore|ache|body pain|muscle pain/],["cold",/fever|cough|\bcold\b|\bflu\b/]];
for(const x of sx)if(x[1].test(t))return LPTIPS[x[0]]+"\n\nThis is general information, not medical advice. If it gets worse or worries you, please see a doctor.";
const R=[[/^(hi|hello|hey)\b|good (morning|evening)/,"Hi! I can help with basic questions about calories, protein, water, sleep, exercise and healthy habits. What would you like to know?"],
[/thank/,"You are welcome! Ask me anything else about your health habits."],
[/diabet|thyroid|pcos|pcod|blood pressure|\bbp\b|cholesterol|pregnan|breastfeed|kidney|liver|medicine|tablet|insulin|allerg/,"That depends on your health and any medicines you take, so please talk to your doctor or a registered dietitian. I can share general healthy-eating tips if you like."],
[/tdee|bmr|maintenance/,()=>"TDEE is the calories you burn in a day, including activity: about "+c.tdee+" kcal for you. Your resting BMR is about "+c.bmr+" kcal. Eating at your TDEE keeps your weight steady."],
[/calorie|kcal|how much.*eat/,()=>"Your estimated daily target is about "+c.k+" kcal. You burn roughly "+c.tdee+" kcal a day. Change your goal or activity on the Calculator page."],
[/protein/,()=>"Your protein target is about "+c.p+" g a day. Good sources are eggs, dal, paneer, curd, chicken, fish, tofu and soya. Spreading it across meals helps you feel full."],
[/macro/,()=>"Your daily targets are about "+c.p+" g protein, "+c.c+" g carbs and "+c.f+" g fat. The Macros page explains what each one does."],
[/\bfat\b|ghee|oil|butter/,()=>"Fat is needed for hormones and vitamins, but it is dense in calories (9 kcal per gram). Your target is about "+c.f+" g a day. Measure cooking oil instead of pouring it."],
[/carb|rice|roti|chapati|bread/,"Carbs are not the enemy. Roti and rice are fine in sensible portions. Pair them with dal or vegetables for protein and fibre, and choose whole grains or millets when you can."],
[/bmi|healthy weight|ideal weight/,()=>{const h=S.ht/100,b=S.wt/(h*h);return"Your BMI is about "+b.toFixed(1)+". A healthy range for your height is roughly "+fK(18.5*h*h).split(" (")[0]+" to "+fK(22.9*h*h).split(" (")[0]+". BMI is only a rough guide because it cannot see muscle."}],
[/water|hydrat|litre|liter/,()=>"A rough guide for you is about "+fL(S.wt*.035)+" a day. Drink more in hot weather or when you exercise. Pale yellow urine is a good sign."],
[/sleep/,"Most adults need 7 to 9 hours. Keep a regular wake-up time, avoid caffeine after noon and put screens away an hour before bed. Short sleep makes hunger and cravings worse."],
[/step|walk/,"A good target is 6,000 to 10,000 steps a day, but any increase helps. Start from where you are now and add a little each week."],
[/plateau|stuck|not losing|stopped losing/,"Weight naturally moves 1 to 2 kg day to day. Check that you are still measuring portions and cooking oil, walk a bit more, sleep well, and give it 2 to 3 weeks before cutting calories. Never go below the safe minimum."],
[/breakfast|skip.*meal|intermittent|fasting/,"You do not have to eat breakfast to lose weight. Total calories and what you can stick to matter most. Extreme fasting is not recommended, and if you take medicines for diabetes please ask your doctor first."],
[/sugar|sweet|craving|chocolate|dessert/,"You do not need to ban sweets. Plan a small portion after a meal rather than on an empty stomach, and keep protein and fibre high to reduce cravings."],
[/alcohol|beer|wine|whisky|drink/,"Alcohol has 7 kcal per gram and little nutrition, so it adds up fast. If you drink, keep it occasional and small, and have water alongside."],
[/snack/,"Easy snacks: roasted chana, a fruit, a bowl of curd, a handful of nuts, roasted makhana or sprouts chaat. Aim for 100 to 200 kcal with some protein."],
[/vegetarian|vegan|veg protein/,"Good vegetarian protein: dal, rajma, chole, paneer, curd, soya chunks, tofu, sprouts and eggs if you eat them. Combine dal with rice or roti for a fuller range of amino acids."],
[/workout|exercise|gym|beginner|start/,"A simple start: brisk walking 30 minutes on most days, plus 2 short strength sessions a week (squats, push-ups, glute bridges, plank). The Move page has a 20-minute routine with no equipment."],
[/supplement|protein powder|fat burner|detox|slimming tea/,"Most people do not need supplements. Whey protein is optional if you struggle to reach your protein target. Be careful with fat burners and detox products, as they are not proven and can be unsafe."],
[/how fast|per week|pace|faster/,"A steady 0.25 to 0.75 kg (0.5 to 1.5 lb) a week is realistic and safer. Losing faster than that can cost muscle and energy."],
[/motivat|give up|discourag/,"Progress is rarely a straight line. Focus on habits you can repeat, not perfection. Looking at weekly averages instead of daily weight helps a lot."],
[/healthy\?|good for me|bad for me|should i eat/,"Most foods fit into a healthy plan in the right portion. Look at the portion, how often you eat it, and what else is on your plate. Tell me the food and I can say more."]];
for(const r of R)if(r[0].test(t))return typeof r[1]==="function"?r[1]():r[1];
return"I can help with basic questions about calories, protein, water, sleep, exercise and healthy habits. For anything about your health condition or medicines, please see a doctor. You can also look at the FAQ page."};
const b=document.createElement("button");b.id="chatb";b.textContent="💬 Ask";b.setAttribute("aria-label","Open the health helper chat");
const p=document.createElement("div");p.id="chatp";p.hidden=true;p.setAttribute("role","dialog");p.setAttribute("aria-label","Health helper");
p.innerHTML='<div class="ch"><b>'+(CHAT_URL?"AI health assistant":"Health helper")+'</b><button id="chx" aria-label="Close chat">×</button></div><div id="chm" class="chm" aria-live="polite"></div><div class="chs" id="chs"></div><form id="chf"><input id="chi" type="text" placeholder="Ask a basic health question" autocomplete="off" maxlength="400" aria-label="Your question"><button class="add" type="submit">Send</button></form><p class="chn">General information only. Not a doctor. In an emergency call 112.</p>';
document.body.append(b,p);
const chm=p.querySelector("#chm"),chi=p.querySelector("#chi");
function say(r,t){const d=document.createElement("div");d.className="bub "+r;d.textContent=t;chm.appendChild(d);chm.scrollTop=chm.scrollHeight;return d}
p.querySelector("#chs").innerHTML=FAQ.map(f=>`<button type="button">${f[0]}</button>`).join("");
p.querySelector("#chs").onclick=e=>{const x=e.target.closest("button");if(x)ask(x.textContent)};
async function ask(t){t=t.trim();if(!t)return;say("u",t);M.push({role:"user",content:t});
const done=a=>{M.push({role:"assistant",content:a});return a};
if(CHAT_URL&&!LPRED.test(t)){const d=say("b","Thinking...");try{const r=await fetch(CHAT_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:M.slice(-10),context:{kcal:cur.k,protein:cur.p,carbs:cur.c,fat:cur.f,goal:S.goal}})}),j=await r.json();d.textContent=done(j.reply||ans(t))}catch(e){d.textContent=done(ans(t))}}
else say("b",done(ans(t)))}
p.querySelector("#chf").onsubmit=e=>{e.preventDefault();const t=chi.value;chi.value="";ask(t)};
const open=m=>{p.hidden=false;b.hidden=true;if(!chm.children.length)say("b","Hi! I am a basic health helper, not a doctor. Ask me about calories, protein, water, sleep or exercise.");if(m)ask(m);chi.focus()};
b.onclick=()=>open();p.querySelector("#chx").onclick=()=>{p.hidden=true;b.hidden=false};window.LPchatOpen=open;
})();
