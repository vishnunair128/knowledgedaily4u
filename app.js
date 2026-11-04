const $=i=>document.getElementById(i)||Object.assign(document.createElement("div"),{value:""}),C=2*Math.PI*74;
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const ld=k=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const LB=2.20462,rd1=x=>Math.round(x*10)/10,lbs=k=>Math.round(k*LB),sg=x=>(x>0?"+":"")+x;
const ftin=c=>{const t=Math.round(c/2.54);return Math.floor(t/12)+" ft "+(t%12)+" in"};
const imp=()=>S.units==="imperial";
const fH=c=>imp()?ftin(c)+" ("+Math.round(c)+" cm)":Math.round(c)+" cm ("+ftin(c)+")";
const fK=k=>imp()?lbs(k)+" lb ("+rd1(k)+" kg)":rd1(k)+" kg ("+lbs(k)+" lb)";
const fP=p=>imp()?rd1(p*LB)+" lb ("+rd1(p)+" kg)":rd1(p)+" kg ("+rd1(p*LB)+" lb)";
const fD=d=>imp()?sg(rd1(d*LB))+" lb ("+sg(rd1(d))+" kg)":sg(rd1(d))+" kg ("+sg(rd1(d*LB))+" lb)";
const fCm=c=>imp()?Math.round(c/2.54)+" in ("+Math.round(c)+" cm)":Math.round(c)+" cm ("+Math.round(c/2.54)+" in)";
const fL=l=>l.toFixed(1)+" litres ("+Math.round(l*33.814)+" fl oz)";
const fS=s=>s.replace(/\((\d+) ml\)/g,(m,n)=>"("+n+" ml, "+(n/29.57).toFixed(1)+" fl oz)").replace(/(\d+) g\b/g,(m,n)=>m+" ("+(n/28.35).toFixed(1)+" oz)");
let lastU=null;
const SK=["age","ht","wt","gw","pace"];
const slDef=k=>{const im=imp();return{age:["Age","years",18,80,1],ht:im?["Height","in",55,79,1]:["Height","cm",140,200,1],wt:im?["Weight now","lb",88,330,1]:["Weight now","kg",40,150,.5],gw:im?["Goal weight","lb",77,330,1]:["Goal weight","kg",35,150,.5],pace:im?["Change per week","lb",.5,2,.5]:["Change per week","kg",.25,1,.25]}[k]};
const toU=(k,v)=>!imp()?v:k==="ht"?v/2.54:(k==="wt"||k==="gw"||k==="pace")?v*LB:v;
const fromU=(k,v)=>!imp()?v:k==="ht"?v*2.54:(k==="wt"||k==="gw"||k==="pace")?v/LB:v;
function buildSliders(){lastU=S.units;$("sliders").innerHTML=SK.map(k=>{const d=slDef(k);return`<div class="sl"><div class="t"><label for="s_${k}">${d[0]}</label><span><b id="o_${k}"></b></span></div><input type="range" id="s_${k}" min="${d[2]}" max="${d[3]}" step="${d[4]}"></div>`}).join("");
SK.forEach(k=>$("s_"+k).addEventListener("input",e=>{S[k]=fromU(k,+e.target.value);render()}))}
let S=Object.assign({units:"metric",sex:"f",age:30,ht:165,wt:75,gw:65,act:1.375,pace:0.5,style:"bal",goal:"lose"},ld("lp2_s")||{});
const today=new Date().toDateString();
let D=ld("lp2_d");if(!D||D.d!==today)D={d:today,log:[],water:0,hab:[]};
const dkey=()=>new Date().toLocaleDateString("en-CA");
const save=()=>{sv("lp2_s",S);sv("lp2_d",D);try{const t=D.log.reduce((a,x)=>{a.k+=x.k*x.q;a.p+=x.p*x.q;a.c+=x.c*x.q;a.f+=x.f*x.q;return a},{k:0,p:0,c:0,f:0}),H=ld("lp2_h")||{};
if(D.log.length||D.water||(D.wk||[]).length||D.hab.length){H[dkey()]={k:Math.round(t.k),p:Math.round(t.p),c:Math.round(t.c),f:Math.round(t.f),w:D.water,wk:(D.wk||[]).length,b:D.burn||0,h:D.hab.length,t:(cur&&cur.k)||0}}
const ks=Object.keys(H).sort();while(ks.length>400)delete H[ks.shift()];sv("lp2_h",H);
const sig=JSON.stringify([S,D,H]);if(localStorage.getItem("lp2_sig")===sig)return;localStorage.setItem("lp2_sig",sig);localStorage.setItem("lp2_u",String(Date.now()));window.dispatchEvent(new Event("lp-saved"))}catch(e){}};
const DB={b:[["Roti / chapati","1 medium",100,3,18,2],["Plain paratha","1",200,4,28,8],["Aloo paratha","1",290,6,40,12],["Naan","1",260,8,45,5],["Puri","1",110,2,13,5],["White rice","1 cup cooked",205,4,45,0],["Brown rice","1 cup cooked",215,5,45,2],["Jeera rice","1 cup",240,4,44,5],["Veg pulao","1 cup",250,5,42,7],["Chicken biryani","1 plate",480,24,55,17],["Veg biryani","1 plate",400,9,62,13],["Curd rice","1 cup",220,6,35,6],["White bread","1 slice",75,2,14,1],["Brown bread","1 slice",70,3,12,1]],d:[["Dal","1 bowl",150,9,22,3],["Rajma","1 bowl",210,11,32,4],["Chole","1 bowl",250,11,36,7],["Sambar","1 bowl",120,6,18,3],["Paneer butter masala","1 bowl",380,14,10,32],["Palak paneer","1 bowl",280,14,9,21],["Mixed veg curry","1 bowl",140,4,16,7],["Aloo gobi","1 bowl",150,3,18,7],["Bhindi fry","1 bowl",120,3,10,8],["Chicken curry","1 bowl",250,24,6,14],["Butter chicken","1 bowl",380,26,10,26],["Fish curry","1 bowl",220,22,5,12],["Egg curry","2 eggs",230,13,6,17],["Grilled chicken breast","100 g",165,31,0,4],["Tandoori chicken","2 pieces",260,30,4,13],["Tofu","100 g",76,8,2,5],["Soya chunks","30 g dry",100,16,6,0],["Moong dal chilla","1",120,7,15,3]],t:[["Idli","2 pieces",120,4,24,0],["Plain dosa","1",130,3,22,3],["Masala dosa","1",290,6,42,11],["Upma","1 bowl",230,5,35,8],["Poha","1 plate",250,5,45,6],["Oats porridge with milk","1 bowl",180,8,28,4],["Medu vada","1",150,5,15,8],["Uttapam","1",200,6,32,5],["Besan chilla","1",130,6,14,5],["Boiled egg","1",78,6,1,5],["Omelette","2 eggs",190,13,1,15]],n:[["Samosa","1",260,4,28,15],["Pakora","4 pieces",200,5,18,12],["Vada pav","1",290,7,40,11],["Pav bhaji","1 plate",400,9,58,15],["Pani puri","6 pieces",200,3,32,7],["Bhel puri","1 plate",250,6,40,8],["Veg sandwich","1",250,7,35,9],["Pizza","1 slice",270,11,33,10],["Veg burger","1",350,10,45,15],["French fries","medium",365,4,48,17],["Instant noodles","1 pack",350,8,50,13],["Roasted makhana","30 g",100,3,20,1],["Roasted chana","30 g",110,6,17,2],["Popcorn, plain","1 bowl",60,2,12,1],["Almonds","10",70,3,2,6],["Peanuts","30 g",170,8,5,14],["Cashews","10",90,3,5,7],["Marie biscuit","1",35,1,6,1],["Potato chips","small pack",150,2,15,10]],f:[["Banana","1 medium",105,1,27,0],["Apple","1 medium",95,1,25,0],["Orange","1",62,1,15,0],["Mango","1 cup sliced",100,1,25,1],["Papaya","1 cup",55,1,14,0],["Grapes","1 cup",105,1,27,0],["Watermelon","1 cup",46,1,12,0],["Pomegranate","1 cup seeds",145,3,32,2],["Guava","1 medium",55,2,12,1],["Cucumber salad","1 bowl",30,1,6,0],["Mixed veg salad","1 bowl",50,2,10,1]],m:[["Milk, full fat","1 glass",160,8,12,9],["Milk, toned","1 glass",120,8,12,4],["Curd","1 bowl",100,6,8,4],["Paneer","50 g",130,9,2,10],["Buttermilk","1 glass",40,2,5,1],["Cheese slice","1",60,3,1,5],["Ghee","1 tsp",45,0,0,5],["Butter","1 tsp",36,0,0,4],["Whey protein","1 scoop",120,24,3,2]],s:[["Gulab jamun","1",150,2,22,6],["Jalebi","1 piece",150,1,28,5],["Rasgulla","1",125,3,28,1],["Kheer","1 bowl",250,6,38,8],["Besan ladoo","1",190,3,22,10],["Suji halwa","1 bowl",300,4,40,14],["Ice cream","1 scoop",140,2,16,7],["Dark chocolate","2 squares",110,1,12,7],["Sugar","1 tsp",16,0,4,0]],k:[["Tea with milk and sugar","1 cup",70,2,10,2],["Black coffee","1 cup",5,0,1,0],["Coffee with milk and sugar","1 cup",80,2,11,3],["Coconut water","1 glass",45,1,10,0],["Orange juice","1 glass",110,2,26,1],["Cola","1 can",140,0,35,0],["Sweet lassi","1 glass",230,6,35,7],["Sugarcane juice","1 glass",180,0,45,0],["Beer","1 bottle",150,1,13,0],["Wine","1 glass",125,0,4,0],["Whisky","1 peg (30 ml)",70,0,0,0]]};
const CATS=[["all","All"],["b","Breads & rice"],["d","Curries & protein"],["t","Breakfast"],["n","Snacks"],["f","Fruit & veg"],["m","Dairy & eggs"],["s","Sweets"],["k","Drinks"]];
const ALL=[];Object.keys(DB).forEach(g=>DB[g].forEach(r=>ALL.push({n:r[0],s:r[1],k:r[2],p:r[3],c:r[4],f:r[5],g:g})));
let cat="all";
const SL=[["age","Age","years",18,80,1],["ht","Height","cm",140,200,1],["wt","Weight now","kg",40,150,.5],["gw","Goal weight","kg",35,150,.5],["pace","Weight loss per week","kg",.25,1,.25]];
const SEG={units:[["metric","Metric: cm, kg"],["imperial","Imperial: ft, lb"]],goal:[["lose","Lose weight"],["maintain","Maintain (TDEE)"],["gain","Gain weight"]],sex:[["f","Female"],["m","Male"]],act:[[1.2,"Desk-bound"],[1.375,"Light"],[1.55,"Moderate"],[1.725,"Very active"]],style:[["bal","Balanced"],["hp","High protein"],["lc","Lower carb"]]};
const HAB=["Hit my protein target","Walk for 20 minutes","Drink 8 glasses of water","Eat a vegetable at 2 meals","Sleep 7 hours tonight"];
const MAC={p:{n:"Protein",k:4,col:"var(--p)",why:"Protects muscle while you lose fat and keeps hunger low.",src:"Eggs, dal, paneer, curd, chicken, fish, tofu, soya",max:200},c:{n:"Carbs",k:4,col:"var(--c)",why:"Your body’s main fuel. Pick slow carbs with fibre so energy stays steady.",src:"Oats, millets, whole wheat roti, fruit, vegetables, pulses",max:400},f:{n:"Fat",k:9,col:"var(--f)",why:"Needed for hormones and vitamins, but packed with calories. A little goes far.",src:"Nuts, seeds, olive or mustard oil, avocado, ghee in small amounts",max:120}};
let tab="p",cur={};

function calc(){const b=10*S.wt+6.25*S.ht-5*S.age+(S.sex==="m"?5:-161),tdee=Math.round(b*S.act),floor=S.sex==="m"?1500:1200;
const dd=S.goal==="maintain"?0:Math.round(S.pace*1100)*(S.goal==="gain"?-1:1);let k=tdee-dd,hit=false;if(k<floor){k=floor;hit=true}
const pk=S.style==="hp"?2:S.style==="lc"?1.8:1.6,ff=S.style==="lc"?.35:.27,p=Math.round(pk*S.wt),f=Math.round(k*ff/9),c=Math.max(0,Math.round((k-p*4-f*9)/4));
return{tdee,bmr:Math.round(b),k,hit,floor,def:tdee-k,p,c,f}}
function tween(el,to){const from=+el.dataset.v||0;el.dataset.v=to;const t0=performance.now();
(function s(t){const x=Math.min(1,(t-t0)/500),e=1-Math.pow(1-x,3);el.textContent=Math.round(from+(to-from)*e).toLocaleString();if(x<1)requestAnimationFrame(s)})(t0)}
function arc(id,s,l){const e=$(id);e.style.strokeDasharray=Math.max(0,l*C-4)+" "+C;e.style.strokeDashoffset=-s*C}
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),1700)}

function buildControls(){
buildSliders();
Object.keys(SEG).forEach(k=>{$("seg_"+k).innerHTML=SEG[k].map(o=>`<button data-v="${o[0]}">${o[1]}</button>`).join("");
$("seg_"+k).addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;S[k]=k==="act"?+b.dataset.v:b.dataset.v;render()})})}

function render(){
if(S.units!==lastU)buildSliders();
SK.forEach(k=>{$("s_"+k).value=toU(k,S[k]);$("o_"+k).textContent=k==="age"?S.age+" years":k==="ht"?fH(S.ht):k==="pace"?fP(S.pace):fK(S[k])});
const pl=document.querySelector('label[for="s_pace"]');if(pl){pl.textContent=S.goal==="gain"?"Weight gain per week":"Weight loss per week";pl.closest(".sl").hidden=S.goal==="maintain";$("s_gw").closest(".sl").hidden=S.goal==="maintain"}
Object.keys(SEG).forEach(k=>[...$("seg_"+k).children].forEach(b=>b.classList.toggle("on",b.dataset.v==String(S[k]))));
cur=calc();const d=cur;
tween($("kc"),d.k);tween($("gp"),d.p);tween($("gc"),d.c);tween($("gf"),d.f);
arc("ap",0,d.p*4/d.k);arc("ac",d.p*4/d.k,d.c*4/d.k);arc("af",(d.p*4+d.c*4)/d.k,d.f*9/d.k);
$("sub").innerHTML="<b>Your TDEE: "+d.tdee.toLocaleString()+" kcal a day.</b> This is everything you burn, including activity. Resting BMR: "+d.bmr.toLocaleString()+" kcal. "+(S.goal==="maintain"?"Eating at your TDEE keeps your weight steady.":"This plan is "+Math.abs(d.def)+" kcal "+(d.def>=0?"below":"above")+" your TDEE.");
$("fl").innerHTML=d.hit?'<div class="warn">We held your target at '+d.floor+' kcal, the lowest level generally considered safe without a doctor. Slow your pace or add activity.</div>':"";
timeline(d);renderDay();macroTab();renderMove();renderHealth();renderPlan();save()}

function timeline(d){const g=S.goal,lose=g==="gain"?S.gw-S.wt:S.wt-S.gw,ms=$("ms");if(g==="maintain"){$("tl").textContent="Maintenance mode: eat around your TDEE to hold your current weight.";["line","area"].forEach(i=>$(i).setAttribute("d",""));$("d0").setAttribute("cx",-20);$("d1").setAttribute("cx",-20);ms.innerHTML="";return}
if(lose<=0){$("tl").textContent="Set a goal weight "+(g==="gain"?"above":"below")+" your current weight to see your timeline.";["line","area"].forEach(i=>$(i).setAttribute("d",""));$("d0").setAttribute("cx",-20);$("d1").setAttribute("cx",-20);ms.innerHTML="";return}
const pace=Math.abs(d.def)/1100,wk=Math.ceil(lose/pace),dt=new Date(Date.now()+wk*6048e5).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const up=g==="gain",pd=up?"M12,86 C110,80 190,30 288,14":"M12,14 C110,20 190,70 288,86";$("line").setAttribute("d",pd);$("area").setAttribute("d",pd+" L288,100 L12,100Z");
$("d0").setAttribute("cx",12);$("d0").setAttribute("cy",up?86:14);$("d1").setAttribute("cx",288);$("d1").setAttribute("cy",up?14:86);
$("tl").textContent=fK(lose)+" to "+(g==="gain"?"gain":"lose")+". At about "+fP(pace)+" a week, that is roughly "+wk+" weeks, around "+dt+".";
ms.innerHTML=[.25,.5,.75,1].map(q=>"<span>Week "+Math.ceil(wk*q)+": "+fK(S.wt+(g==="gain"?lose:-lose)*q)+"</span>").join("")}

const tot=()=>D.log.reduce((t,x)=>{t.k+=x.k*x.q;t.p+=x.p*x.q;t.c+=x.c*x.q;t.f+=x.f*x.q;return t},{k:0,p:0,c:0,f:0});
function renderDay(){
$("list").innerHTML=D.log.map((x,i)=>`<div class="item"><span>${esc(x.n)}<br><span class="small" style="color:var(--mut)">${Math.round(x.k)} kcal per serving</span></span><span class="qty"><button aria-label="Fewer ${esc(x.n)}" data-a="-" data-i="${i}">−</button><b>${x.q}</b><button aria-label="More ${esc(x.n)}" data-a="+" data-i="${i}">+</button></span><b>${Math.round(x.k*x.q)}</b></div>`).join("");
$("none").hidden=D.log.length>0;
const t=tot(),d=cur,exb=D.burn||0,rem=d.k-t.k+exb,fr=Math.min(1,t.k/(d.k+exb));$("bn").textContent=exb?"Exercise added today: "+exb+" kcal.":"These are rough estimates, so many people only eat back about half of what they burn.";renderWk();
arc("lr",0,fr);$("lr").style.stroke=rem<0?"var(--p)":"var(--brand)";
$("left").textContent=Math.abs(Math.round(rem)).toLocaleString();$("leftl").textContent=rem<0?"kcal over":"kcal left";
$("prog").innerHTML=[["Protein","p",d.p,"var(--p)"],["Carbs","c",d.c,"var(--c)"],["Fat","f",d.f,"var(--f)"]].map(m=>`<div class="row"><div class="top"><span>${m[0]}</span><span><b>${Math.round(t[m[1]])}</b> / ${m[2]} g</span></div><div class="bar"><i style="width:${Math.min(100,t[m[1]]/m[2]*100)}%;background:${m[3]}"></i></div></div>`).join("");
$("water").innerHTML=Array.from({length:8},(_,i)=>`<button class="${i<D.water?"on":""}" data-w="${i+1}" aria-label="Glass ${i+1}">💧</button>`).join("");
$("wn").textContent=D.water+" of 8 glasses"+(D.water>=8?". Well done!":"");
$("hab").innerHTML=HAB.map((h,i)=>`<label class="${D.hab.includes(i)?"done":""}"><input type="checkbox" data-h="${i}" ${D.hab.includes(i)?"checked":""}>${h}</label>`).join("");
$("hn").textContent=D.hab.length+" of "+HAB.length+" done today"+(D.hab.length===HAB.length?". Great day!":"");
save()}
function addItem(n,k,p,c,f){const e=D.log.find(x=>x.n===n);if(e)e.q++;else D.log.push({n,k,p,c,f,q:1});toast("Added "+n+", "+Math.round(k)+" kcal");renderDay()}

function macroTab(){const m=MAC[tab],g=Math.min(m.max,cur[tab]||0);
$("tabs").innerHTML=Object.keys(MAC).map(k=>`<button role="tab" class="${k===tab?"on":""}" data-t="${k}" style="${k===tab?"background:"+MAC[k].col:""}">${MAC[k].n}</button>`).join("");
const gre=document.getElementById("gr"),keep=gre?gre.value:g;
$("mc").innerHTML=`<div><h3>${m.n}: ${m.k} kcal per gram</h3><p>${m.why}</p><p class="small" style="color:var(--mut)">Good sources: ${m.src}.</p><p>Your daily target: <b>${cur[tab]} g</b>, about ${Math.round(cur[tab]*m.k/cur.k*100)}% of your calories.</p></div><div><div class="small" style="color:var(--mut)">Try it: drag to pick grams</div><input type="range" id="gr" min="0" max="${m.max}" value="${keep}" style="margin:8px 0"><div class="big"><span id="gk">${Math.round(keep*m.k)}</span> <span style="font-size:1.1rem">kcal</span></div><div class="small" style="color:var(--mut)"><span id="gg">${keep}</span> g × ${m.k} kcal</div></div>`;
$("gr").addEventListener("input",e=>{$("gg").textContent=e.target.value;$("gk").textContent=Math.round(e.target.value*m.k)})}

function foodList(){const q=$("fs").value.toLowerCase().trim(),r=ALL.map((f,i)=>[f,i]).filter(x=>(cat==="all"||x[0].g===cat)&&(!q||(x[0].n+" "+x[0].s).toLowerCase().includes(q)));
$("flist").innerHTML=r.length?r.map(x=>{const f=x[0];return `<div class="fr"><div><b>${f.n}</b><br><span class="small" style="color:var(--mut)">${fS(f.s)} · protein ${f.p} g · carbs ${f.c} g · fat ${f.f} g</span></div><b>${f.k} kcal</b><button class="add" data-f="${x[1]}" aria-label="Add ${f.n}">Add</button></div>`}).join(""):'<p class="small" style="margin:12px 0">No match. Try another word, or add your own food below.</p>'}
$("cats").innerHTML=CATS.map(c=>`<button data-c="${c[0]}" class="${c[0]==="all"?"on":""}">${c[1]}</button>`).join("");
$("cats").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;cat=b.dataset.c;[...$("cats").children].forEach(x=>x.classList.toggle("on",x===b));foodList()});
$("fs").addEventListener("input",foodList);
$("flist").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const f=ALL[+b.dataset.f];addItem(f.n+" ("+fS(f.s)+")",f.k,f.p,f.c,f.f)});
foodList();
$("list").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const i=+b.dataset.i,x=D.log[i];x.q+=b.dataset.a==="+"?.5:-.5;if(x.q<=0)D.log.splice(i,1);renderDay()});
$("water").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const n=+b.dataset.w;D.water=D.water===n?n-1:n;renderDay()});
$("hab").addEventListener("change",e=>{const i=+e.target.dataset.h;D.hab=e.target.checked?D.hab.concat(i):D.hab.filter(x=>x!==i);renderDay()});
$("tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(b){tab=b.dataset.t;macroTab()}});
$("cadd").addEventListener("click",()=>{const n=$("cn").value.trim(),p=+$("cp").value||0,c=+$("cc").value||0,f=+$("cf").value||0;let k=$("ck").value===""?p*4+c*4+f*9:+$("ck").value;
if(!n||k<=0){toast("Enter a name and calories or macros");return}addItem(n,k,p,c,f);["cn","ck","cp","cc","cf"].forEach(i=>$(i).value="")});
$("clr").addEventListener("click",()=>{D.log=[];D.burn=0;D.wk=[];renderDay();toast("Cleared today’s food")});
$("tg").addEventListener("click",()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark";sv("lp2_t",r.dataset.theme)});
const th=ld("lp2_t");if(th)document.documentElement.dataset.theme=th;
const ACT=[["Brisk walk",4.3],["Jogging",7],["Running",9.8],["Cycling",7.5],["Yoga",2.5],["Strength training",5],["HIIT",8],["Swimming",7],["Dancing",5.5],["Skipping",11],["Badminton",5.5],["Cricket",4.8]];
let ai=0;
const burnNow=()=>Math.round(ACT[ai][1]*S.wt*(+$("mins").value)/60);
function renderMove(){$("omin").textContent=$("mins").value;$("burn").textContent=burnNow()}
$("acts").innerHTML=ACT.map((a,i)=>`<button data-i="${i}" class="${i===0?"on":""}">${a[0]}</button>`).join("");
$("acts").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;ai=+b.dataset.i;[...$("acts").children].forEach(x=>x.classList.toggle("on",x===b));renderMove()});
$("mins").addEventListener("input",renderMove);
$("addb").addEventListener("click",()=>{if(!plusExp()&&(D.wk||[]).length>=2){toast("Free plan: 2 workouts a day. Unlock more with Plus.");location.href="plus.html";return}const x=burnNow();(D.wk=D.wk||[]).push({a:ACT[ai][0],m:+$("mins").value,k:x});D.burn=(D.burn||0)+x;toast("Added "+x+" kcal of exercise");renderDay()});
function renderWk(){const w=D.wk||[],plus=!!plusExp();$("wl").innerHTML=w.length?w.map((x,i)=>`<div class="fr" style="grid-template-columns:1fr auto auto"><span>${esc(x.a)} <span class="small" style="color:var(--mut)">${x.m} min</span></span><b>${x.k} kcal</b><button data-r="${i}" aria-label="Remove ${esc(x.a)}" style="width:30px;height:30px;border-radius:50%;border:1px solid var(--line);background:var(--bg);padding:0">×</button></div>`).join("")+`<p class="small" style="margin:8px 0 0"><b>${w.length}</b> workout${w.length>1?"s":""} today, <b>${D.burn||0}</b> kcal burned in total.</p>`:"";
$("wcap").textContent=plus?"Plus: log as many workouts as you like.":"Free plan: "+Math.max(0,2-w.length)+" of 2 workouts left today. Plus unlocks unlimited workouts."}
$("wl").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const i=+b.dataset.r,x=D.wk[i];D.burn=Math.max(0,(D.burn||0)-x.k);D.wk.splice(i,1);renderDay()});

const PLANS={veg:[["Breakfast",[["Oats porridge with milk",1],["Banana",1]]],["Mid-morning",[["Roasted chana",1],["Tea with milk and sugar",1]]],["Lunch",[["Roti / chapati",2],["Dal",1],["Mixed veg curry",1],["Curd",1],["Mixed veg salad",1]]],["Evening",[["Almonds",1],["Apple",1]]],["Dinner",[["Palak paneer",1],["Roti / chapati",1],["Cucumber salad",1]]]],nv:[["Breakfast",[["Omelette",1],["Brown bread",2]]],["Lunch",[["White rice",1],["Chicken curry",1],["Mixed veg salad",1],["Curd",1]]],["Evening",[["Banana",1],["Roasted chana",1]]],["Dinner",[["Grilled chicken breast",1],["Roti / chapati",2],["Bhindi fry",1],["Cucumber salad",1]]]]};
let diet="veg",mealItems=[];
let mealData=[];
function addMeal(m){m.items.forEach(([f,q])=>{const n=f.n+" ("+fS(f.s)+")",ex=D.log.find(y=>y.n===n);if(ex)ex.q+=q;else D.log.push({n:n,k:f.k,p:f.p,c:f.c,f:f.f,q:q})})}
function renderPlan(){const P=PLANS[diet],find=n=>ALL.find(f=>f.n===n),plus=!!plusExp();
const base=P.reduce((s,m)=>s+m[1].reduce((a,i)=>a+find(i[0]).k*i[1],0),0),sc=cur.k/base;
mealData=P.map(m=>{const items=m[1].map(i=>[find(i[0]),Math.max(.5,Math.round(i[1]*sc*2)/2)]);return{n:m[0],items:items,k:items.reduce((s,x)=>s+x[0].k*x[1],0)}});
const tot=mealData.reduce((s,m)=>s+m.k,0),open=D.mealOpen;
$("mp").innerHTML=mealData.map((m,i)=>{const show=plus||open===m.n;
const head=`<h3 style="margin:14px 0 2px">${m.n} <span class="small" style="color:var(--mut);font-weight:500">${Math.round(m.k)} kcal</span></h3>`;
if(!show)return head+`<p style="margin:4px 0 8px"><button class="add" data-o="${i}" style="padding:7px 16px">${open?"\ud83d\udd12 Plus":"Show this meal"}</button></p>`;
return head+m.items.map(x=>`<div class="fr" style="grid-template-columns:1fr auto"><span>${x[0].n} <span class="small" style="color:var(--mut)">(${fS(x[0].s)}) × ${x[1]}</span></span><b>${Math.round(x[0].k*x[1])}</b></div>`).join("")+`<p style="margin:8px 0 0"><button class="add" data-a="${i}" style="padding:7px 16px">Add ${m.n.toLowerCase()} to my log</button></p>`}).join("")
+(plus?`<p style="margin:16px 0 0"><b>About ${Math.round(tot)} kcal</b> for the day against your target of ${cur.k}. <button class="add" id="addplan" style="margin-left:8px">Add whole day to my log</button></p>`:`<p class="small" style="color:var(--mut);margin:14px 0 0">Free plan: 1 meal a day. Plus shows your whole day of meals (about ${Math.round(tot)} kcal) and adds it to your log in one tap. <a href="plus.html">See plans</a></p>`)}
$("mp").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const plus=!!plusExp();
if(b.id==="addplan"){mealData.forEach(addMeal);toast("Added a full day to your log");renderDay();return}
if(b.dataset.o!==undefined){if(!plus&&D.mealOpen){toast("Free plan: 1 meal a day. Unlock all meals with Plus.");location.href="plus.html";return}D.mealOpen=mealData[+b.dataset.o].n;renderPlan();save();return}
if(b.dataset.a!==undefined){const m=mealData[+b.dataset.a];addMeal(m);toast("Added "+m.n.toLowerCase()+" to your log");renderDay()}});
$("dietseg").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;diet=b.dataset.v;[...$("dietseg").children].forEach(x=>x.classList.toggle("on",x===b));renderPlan()});

function renderHealth(){const h=S.ht/100,b=S.wt/(h*h),pos=Math.min(100,Math.max(0,(b-15)/20*100)),cat=b<18.5?"Underweight":b<23?"Healthy range":b<25?"Overweight":"Obese range";
const rg=(a,b)=>imp()?lbs(a)+" to "+lbs(b)+" lb ("+Math.round(a)+" to "+Math.round(b)+" kg)":Math.round(a)+" to "+Math.round(b)+" kg ("+lbs(a)+" to "+lbs(b)+" lb)";
const rows=[["Your height",fH(S.ht)],["Your weight",fK(S.wt)],["Healthy weight for your height",rg(18.5*h*h,22.9*h*h)],["Water target",fL(S.wt*.035)+" a day"],["Daily steps","8,000 or more"],["Sleep","7 to 9 hours"],["Waist","under "+fCm(S.ht/2)]];
$("hc").innerHTML=`<div class="big">${b.toFixed(1)}</div><div style="font-weight:700;margin-bottom:10px">BMI: ${cat}</div><div style="display:flex;height:12px;border-radius:6px;overflow:hidden"><i style="width:17.5%;background:var(--f)"></i><i style="width:22.5%;background:var(--brand)"></i><i style="width:10%;background:var(--c)"></i><i style="width:50%;background:var(--p)"></i></div><div style="position:relative;height:18px"><span style="position:absolute;left:${pos}%;transform:translateX(-50%)" aria-hidden="true">▲</span></div>`+rows.map(r=>`<div class="fr" style="grid-template-columns:1fr auto"><span>${r[0]}</span><b>${r[1]}</b></div>`).join("")+`<p class="small" style="color:var(--mut);margin:10px 0 0">BMI is a rough guide and cannot see muscle. Cut-offs follow Asia-Pacific guidance used in India. The general WHO healthy range goes up to 24.9.</p>`}

let W=ld("lp2_w")||[];
function renderWeight(){const el=$("wc");
if(W.length<2){el.innerHTML='<text x="150" y="60" text-anchor="middle" font-size="12" style="fill:var(--mut)">Log your weight on 2 or more days to see your chart</text>'}
else{const ws=W.map(x=>x.w),mn=Math.min(...ws)-1,mx=Math.max(...ws)+1,pt=W.map((x,i)=>[14+i*272/(W.length-1),106-(x.w-mn)/(mx-mn)*92]);
el.innerHTML='<path d="M'+pt.map(p=>p.join(",")).join(" L")+'" fill="none" stroke-width="3" stroke-linejoin="round" style="stroke:var(--brand)"/>'+pt.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" style="fill:var(--brand)"/>').join("")+'<text x="4" y="12" font-size="10" style="fill:var(--mut)">'+mx.toFixed(0)+' kg / '+lbs(mx)+' lb</text><text x="4" y="118" font-size="10" style="fill:var(--mut)">'+mn.toFixed(0)+' kg / '+lbs(mn)+' lb</text>'}
const f=W[0],l=W[W.length-1];
$("wsum").textContent=W.length>1?"From "+fK(f.w)+" to "+fK(l.w)+": "+fD(l.w-f.w)+" over "+W.length+" entries.":W.length?"First entry saved: "+fK(l.w)+". Keep going!":"No entries yet. Weigh yourself at the same time of day, each day or each week.";
$("wu").value=imp()?"lb":"kg";$("wi").placeholder=imp()?lbs(S.wt):rd1(S.wt)}
$("wadd").addEventListener("click",()=>{let v=+$("wi").value;if($("wu").value==="lb")v=v/LB;v=rd1(v);if(!(v>=30&&v<=300)){toast("Enter a realistic weight");return}
const d=new Date().toLocaleDateString("en-CA");W=W.filter(x=>x.d!==d);W.push({d:d,w:v});sv("lp2_w",W);S.wt=Math.min(150,Math.max(40,v));$("wi").value="";toast("Logged "+fK(v)+". Your plan is updated.");renderWeight();render()});
$("wun").addEventListener("click",()=>{W.pop();sv("lp2_w",W);renderWeight()});

const FAQ=[["Do I need to count calories forever?","No. Many people track for 2 to 4 weeks to learn portion sizes, then eyeball their meals and check in now and then."],["How much protein do I need?","About 1.6 to 2 g per kg of body weight (0.7 to 0.9 g per lb) while losing fat helps you keep muscle. The calculator sets this for you. If you have kidney disease, ask your doctor first."],["Why did the scale go up overnight?","Water, salt, meals and hormones can swing your weight by 1 to 2 kg (2 to 4 lb). Judge progress by weekly averages, not single mornings."],["Do I have to cut carbs?","No. Total calories drive weight change. Lower carb is just one way to eat, so choose what you can stick with."],["What if my weight stops dropping?","Check that you are still measuring portions and cooking oil, walk more, and sleep well. Give it 2 to 3 weeks before lowering calories, and never go below the safe minimum."],["Can I eat out or have sweets?","Yes. Log it, keep the rest of the day normal, and carry on at your next meal. One meal does not undo your progress."],["When should I see a doctor?","Before you start if you are pregnant, under 18, take medicines for diabetes or blood pressure, have a thyroid or heart condition, or have ever had an eating disorder. Also if you lose weight without trying or feel dizzy or very weak."]];
$("fq").innerHTML=FAQ.map(f=>"<details><summary>"+f[0]+"</summary><p>"+f[1]+"</p></details>").join("");

renderWeight();
const UNL={"sy6xoz":1,"vjh2uu":3,"10pu3fl":12};
const hh=s=>{let h=5381;s=s.trim().toUpperCase();for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(36)};
const plusExp=()=>{const p=ld("lp2_plus");return p&&p.exp>Date.now()?p.exp:0};
function gate(){const on=!!plusExp();
[$("wtc")].forEach(c=>{if(c.tagName!=="H2"&&!c.classList.contains("lead")&&!c.classList.contains("lockbox"))c.hidden=!on});
["progress"].forEach(id=>{const s=$(id);let lb=s.querySelector(".lockbox");if(!on&&!lb){lb=document.createElement("div");lb.className="lockbox card";lb.innerHTML='<h3>🔒 A Lean Plate Plus feature</h3><p>Unlock this with a Plus plan, from ₹9 for a month.</p><p style="margin:0"><a class="add" href="plus.html">See plans</a></p>';s.appendChild(lb)}if(on&&lb)lb.remove()})}
function renderPlus(){const e=plusExp();$("pst").textContent=e?"Plus is active until "+new Date(e).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})+".":"Plus is not active on this device yet."}
$("pgo").addEventListener("click",()=>{const m=UNL[hh($("pc").value)];if(!m){toast("That code is not valid. Check your payment confirmation.");return}const d=new Date(Math.max(Date.now(),plusExp()));d.setMonth(d.getMonth()+m);sv("lp2_plus",{exp:d.getTime()});$("pc").value="";toast("Plus unlocked. Enjoy!");gate();renderPlus()});
const MF=[["Carbs make you fat, so low-carb is the only way to lose weight.","Healthy low-carb and healthy low-fat diets worked about equally well.","In a 12-month randomised trial of 609 adults, average weight loss was about 6.0 kg (13.2 lb) on low-carb and 5.3 kg (11.7 lb) on low-fat. Genes and insulin levels did not predict who did better. The best plan is the one you can keep following.","Gardner CD et al. JAMA, 2018;319(7):667–679.",[["Read the paper","https://doi.org/10.1001/jama.2018.0245"]]],
["High-protein diets damage healthy kidneys.","In healthy adults, higher-protein diets did not harm kidney function.","A systematic review of 28 studies with about 1,358 people found no harmful effect on kidney filtration (GFR) in healthy adults. If you already have kidney disease, follow your doctor’s advice on protein.","Devries MC et al. Journal of Nutrition, 2018;148(11):1760–1775.",[["Read the paper","https://doi.org/10.1093/jn/nxy197"]]],
["Breakfast is the most important meal for losing weight.","Eating breakfast did not help people lose weight in trials.","A review of 13 randomised trials found that people who ate breakfast took in about 260 more kcal a day, and people who skipped it were about 0.44 kg (1 lb) lighter on average. The trials were short and of limited quality, so eat or skip breakfast based on what suits you.","Sievert K et al. BMJ, 2019;364:l42.",[["Read the paper","https://doi.org/10.1136/bmj.l42"]]],
["You must walk 10,000 steps every day.","For many people the benefit levels off at a lower number.","A pooled analysis of 15 studies found the risk of early death kept falling with more steps, up to about 6,000 to 8,000 a day for adults aged 60 and over and 8,000 to 10,000 for younger adults. This kind of study shows an association, not proof of cause.","Paluch AE et al. Lancet Public Health, 2022;7(3):e219–e228.",[["Read the paper","https://doi.org/10.1016/S2468-2667(21)00302-9"],["PubMed","https://pubmed.ncbi.nlm.nih.gov/35247352/"]]],
["Sleep has nothing to do with weight loss.","Short sleep made dieters lose less fat.","In a small randomised study of 10 adults eating the same reduced-calorie diet, sleeping 5.5 hours instead of 8.5 hours cut the share of weight lost as fat by 55% and increased hunger. It was a small, short study, but it fits our advice to aim for 7 to 9 hours.","Nedeltcheva AV et al. Annals of Internal Medicine, 2010;153(7):435–441.",[["Read the paper","https://doi.org/10.7326/0003-4819-153-7-201010050-00006"],["PubMed","https://pubmed.ncbi.nlm.nih.gov/20921542/"]]],
["Doing crunches burns belly fat.","You cannot choose where your body loses fat.","In a randomised study of 24 adults, six weeks of abdominal exercise did not change belly fat or waist size, although ab strength and endurance improved. Fat comes off from all over when you eat fewer calories than you burn.","Vispute SS et al. Journal of Strength and Conditioning Research, 2011;25(9):2559–2564.",[["Read the paper","https://doi.org/10.1519/JSC.0b013e3181fb4a46"],["PubMed","https://pubmed.ncbi.nlm.nih.gov/21804427/"]]]];
$("mf").innerHTML=MF.map(x=>`<details><summary><span class="tagm">Myth</span>${x[0]}</summary><p style="margin:12px 0 6px"><span class="tagf">Fact</span><b>${x[1]}</b></p><p class="small" style="color:var(--mut);margin:0 0 8px">${x[2]}</p><p class="src" style="margin:0"><b>Source:</b> ${x[3]} ${x[4].map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${l[0]}</a>`).join(" · ")}</p></details>`).join("");
buildControls();render();gate();renderPlus();

(function(){
if(!document.getElementById("pcards"))return;
let R=7;
const days=n=>{const a=[];for(let i=n-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);a.push(d.toLocaleDateString("en-CA"))}return a};
const fd=d=>new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"});
const card=(l,b,s)=>`<div class="card"><div class="small" style="color:var(--mut)">${l}</div><div class="big" style="font-size:2.1rem;margin:4px 0">${b}</div><div class="small" style="color:var(--mut)">${s}</div></div>`;
function perf(){
const H=ld("lp2_h")||{},Wt=ld("lp2_w")||[],ds=days(R),rows=ds.map(d=>[d,H[d]||null]),lg=rows.filter(r=>r[1]&&r[1].k>0),n=lg.length,tg=cur.k||0,any=rows.filter(r=>r[1]).length;
const sum=f=>rows.reduce((a,r)=>a+(r[1]?f(r[1]):0),0),avg=n?Math.round(lg.reduce((a,r)=>a+r[1].k,0)/n):0;
let streak=0;{const all=days(400).reverse();let i=(H[all[0]]&&H[all[0]].k>0)?0:1;for(;i<all.length;i++){const e=H[all[i]];if(e&&e.k>0)streak++;else break}}
const wd=Wt.filter(x=>x.d>=ds[0]),wch=wd.length>1?wd[wd.length-1].w-wd[0].w:null;
$("pcards").innerHTML=card("Average daily calories",n?avg.toLocaleString()+" kcal":"No data","Target "+tg.toLocaleString()+" kcal")
+card("Days logged",n+" of "+R,"Current streak: "+streak+" day"+(streak===1?"":"s"))
+card("Workouts",sum(e=>e.wk||0),sum(e=>e.b||0).toLocaleString()+" kcal burned")
+card("Water",any?(sum(e=>e.w||0)/any).toFixed(1)+" glasses":"No data","Average per logged day, goal 8")
+card("Habits done",any?Math.round(sum(e=>e.h||0)/any/HAB.length*100)+"%":"No data","Average per logged day")
+card("Weight change",wch===null?"Not enough data":fD(wch),"Log weight on the Progress page (Plus)");
const Wd=600,Ht=190,P=26,mx=Math.max(tg,...rows.map(r=>r[1]?r[1].k:0),100)*1.12,bw=(Wd-2*P)/R,ty=Ht-26-tg/mx*(Ht-44);
$("pc1").innerHTML=rows.map((r,i)=>{if(!r[1]||!r[1].k)return"";const h=r[1].k/mx*(Ht-44);return`<rect x="${P+i*bw+bw*.15}" y="${Ht-26-h}" width="${bw*.7}" height="${h}" rx="3" style="fill:${r[1].k>tg*1.1?"var(--p)":"var(--brand)"}"><title>${fd(r[0])}: ${r[1].k} kcal</title></rect>`}).join("")
+(tg?`<line x1="${P}" x2="${Wd-P}" y1="${ty}" y2="${ty}" stroke-width="2" stroke-dasharray="6 5" style="stroke:var(--c)"/><text x="${Wd-P}" y="${ty-5}" text-anchor="end" font-size="11" style="fill:var(--mut)">Target ${tg}</text>`:"")
+`<text x="${P}" y="${Ht-8}" font-size="11" style="fill:var(--mut)">${fd(ds[0])}</text><text x="${Wd-P}" y="${Ht-8}" text-anchor="end" font-size="11" style="fill:var(--mut)">${fd(ds[ds.length-1])}</text>`;
if(wd.length>1){const ws=wd.map(x=>x.w),mn=Math.min(...ws)-1,mw=Math.max(...ws)+1,pt=wd.map((x,i)=>[P+i*(Wd-2*P)/(wd.length-1),Ht-30-(x.w-mn)/(mw-mn)*(Ht-56)]);
$("pc2").innerHTML=`<path d="M${pt.map(p=>p.join(",")).join(" L")}" fill="none" stroke-width="3" stroke-linejoin="round" style="stroke:var(--brand)"/>`+pt.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" style="fill:var(--brand)"/>`).join("")+`<text x="4" y="14" font-size="11" style="fill:var(--mut)">${mw.toFixed(0)} kg / ${lbs(mw)} lb</text><text x="4" y="${Ht-8}" font-size="11" style="fill:var(--mut)">${mn.toFixed(0)} kg / ${lbs(mn)} lb</text>`}
else $("pc2").innerHTML=`<text x="300" y="95" text-anchor="middle" font-size="13" style="fill:var(--mut)">Log your weight on 2 or more days (Plus) to see this chart</text>`;
const fl=S.sex==="m"?1500:1200;let t;
if(!n)t="No food logged in this period yet. Log your meals on the Food page and your charts will fill in here.";
else if(avg<fl)t="Your logged average is below the usual safe minimum of "+fl+" kcal. If you simply did not log everything, that is fine. If you really ate this little, please eat more or speak to a doctor.";
else if(avg>tg*1.1)t="You averaged about "+(avg-tg)+" kcal above your target. Small changes, such as a smaller portion of rice or a lighter dinner, add up over time.";
else if(avg<tg*.9)t="You averaged a little under your target, which is fine if you feel well. Make sure you are getting enough protein.";
else t="Nicely done. Your average is close to your target. Consistency is what works.";
$("pins").textContent=t}
$("range").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const r=+b.dataset.r;if(r>7&&!plusExp()){toast("Longer history is a Plus feature.");return}R=r;[...$("range").children].forEach(x=>x.classList.toggle("on",x===b));perf()});
function an(){const u=window.__lpUser;$("authnote").innerHTML=u?"Signed in as <b>"+esc(u.displayName||u.email||"you")+"</b>. Your history is saved to your account and syncs across your devices.":"Use <b>Sign up</b> or <b>Sign in</b> at the top of the page to save your history to your account and see it on every device. Until then, your data stays on this device only."}
window.addEventListener("lp-auth",an);an();perf();
})();

const LPdays=n=>{const a=[];for(let i=n-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);a.push(d.toLocaleDateString("en-CA"))}return a};
const LPcard=(l,b,s,sz)=>`<div class="card"><div class="small" style="color:var(--mut)">${l}</div><div class="big" style="font-size:${sz||"2.1rem"};margin:4px 0">${b}</div><div class="small" style="color:var(--mut)">${s}</div></div>`;
window.LPstats=n=>{const H=ld("lp2_h")||{},Wt=ld("lp2_w")||[],lim=n?LPdays(n)[0]:"";
const all=Object.keys(H).filter(k=>k>=lim).sort(),lg=all.filter(k=>H[k].k>0),sum=f=>all.reduce((a,k)=>a+(f(H[k])||0),0);
let streak=0;{const ds=LPdays(400).reverse();let i=(H[ds[0]]&&H[ds[0]].k>0)?0:1;for(;i<ds.length;i++){const e=H[ds[i]];if(e&&e.k>0)streak++;else break}}
let best=0,run=0,prev=null;lg.forEach(k=>{const t=new Date(k+"T00:00:00").getTime();run=(prev!==null&&Math.round((t-prev)/864e5)===1)?run+1:1;prev=t;if(run>best)best=run});
const wd=Wt.filter(x=>x.d>=lim);
return{logged:lg.length,avg:lg.length?Math.round(sum(e=>e.k>0?e.k:0)/lg.length):0,streak:streak,best:best,wk:sum(e=>e.wk),burn:sum(e=>e.b),water:all.length?sum(e=>e.w)/all.length:0,habit:all.length?Math.round(sum(e=>e.h)/all.length/HAB.length*100):0,wFirst:wd.length?wd[0].w:null,wLast:wd.length?wd[wd.length-1].w:null,wn:wd.length,days:all.length}};
(function(){
const a=document.getElementById("acct");if(!a)return;
const prof=()=>{const u=window.__lpUser;if(u)return{name:u.displayName||"",email:u.email||"",photo:u.photoURL||"",since:(u.metadata&&u.metadata.creationTime)||""};return ld("lp_prof")};
const row=(x,y)=>`<div class="fr" style="grid-template-columns:1fr auto"><span>${x}</span><b>${y}</b></div>`;
const AL={"1.2":"Desk-bound","1.375":"Light","1.55":"Moderate","1.725":"Very active"},GL={lose:"Lose weight",maintain:"Maintain (TDEE)",gain:"Gain weight"};
const dt=t=>new Date(t).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
function draw(){const p=prof();
if(!p){a.innerHTML=`<div class="card"><h2 style="margin-top:0">Sign in to see your profile</h2><p>Create a free account to save your progress and see it on every device.</p><p style="margin:0"><button class="add" id="ai">Sign in</button><button class="add ghosta" id="au">Sign up</button></p></div>`;$("ai").onclick=()=>window.dispatchEvent(new CustomEvent("lp-open",{detail:"in"}));$("au").onclick=()=>window.dispatchEvent(new CustomEvent("lp-open",{detail:"up"}));return}
const st=LPstats(0),pe=plusExp(),since=p.since&&!isNaN(new Date(p.since))?dt(p.since):"";
const prow=[row("Age",S.age+" years"),row("Sex",S.sex==="m"?"Male":"Female"),row("Height",fH(S.ht)),row("Weight",fK(S.wt)),S.goal!=="maintain"?row("Goal weight",fK(S.gw)):"",row("Goal",GL[S.goal]||""),row("Activity",AL[String(S.act)]||""),row("Daily target",cur.k.toLocaleString()+" kcal"),row("Protein, carbs, fat",cur.p+" g, "+cur.c+" g, "+cur.f+" g")].join("");
const perf=[row("Days logged",st.logged),row("Current streak",st.streak+" day"+(st.streak===1?"":"s")),row("Longest streak",st.best+" day"+(st.best===1?"":"s")),row("Average daily calories",st.logged?st.avg.toLocaleString()+" kcal":"No data"),row("Workouts logged",st.wk),row("Calories burned",st.burn.toLocaleString()+" kcal"),row("Water per day",st.days?st.water.toFixed(1)+" glasses":"No data"),row("Habits completed",st.days?st.habit+"%":"No data"),row("Weight change",st.wn>1?fD(st.wLast-st.wFirst):"Not enough data")].join("");
a.innerHTML=`<div class="card" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">${p.photo?`<img src="${esc(p.photo)}" alt="" referrerpolicy="no-referrer" style="width:72px;height:72px;border-radius:50%">`:""}<div><h2 style="margin:0">${esc(p.name||"Your account")}</h2><div style="color:var(--mut)">${esc(p.email)}</div><div class="small" style="color:var(--mut)">Signed in with Google${since?" · Member since "+since:""}</div></div><div style="margin-left:auto">${pe?`<span class="tagp">Plus until ${dt(pe)}</span>`:`<span class="tagf">Free plan</span> <a href="plus.html">Upgrade</a>`}</div></div>
<div class="eq" style="margin-top:16px"><div class="card"><h3>Your profile</h3>${prow}<p class="small" style="color:var(--mut);margin:10px 0 0">Change these on the Calculator page.</p></div><div class="card"><h3>Your performance to date</h3>${perf}</div></div>
<p style="margin-top:16px"><a class="add" href="performance.html">See charts and history</a><button class="add ghosta" id="aso">Sign out</button></p>`;
$("aso").onclick=()=>window.dispatchEvent(new Event("lp-signout"))}
window.addEventListener("lp-auth",draw);draw();
})();
(function(){
const h=document.getElementById("hero1");if(!h)return;const orig=h.innerHTML;
function draw(){const u=window.__lpUser;if(!u){h.innerHTML=orig;return}
const st=LPstats(7),nm=esc((u.displayName||"there").split(" ")[0]);
h.innerHTML=`<h1>Welcome back, ${nm}.</h1><p class="lead">Here is how your last 7 days went.</p><div class="pg" style="margin:16px 0">`
+LPcard("Average daily calories",st.logged?st.avg.toLocaleString()+" kcal":"No data","Target "+cur.k.toLocaleString()+" kcal")
+LPcard("Current streak",st.streak+" day"+(st.streak===1?"":"s"),st.logged+" of 7 days logged")
+LPcard("Workouts",st.wk,st.burn.toLocaleString()+" kcal burned")
+LPcard("Weight",fK(S.wt),S.goal==="maintain"?"Maintaining":"Goal "+fK(S.gw),"1.5rem")
+`</div><p><a class="add" href="food.html">Log today’s food</a><a class="add ghosta" href="performance.html">See full performance</a><a class="add ghosta" href="account.html">My account</a></p>`}
window.addEventListener("lp-auth",draw);draw();
})();