import{initializeApp}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import{getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,getAdditionalUserInfo,deleteUser}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import{getFirestore,doc,getDoc,setDoc}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const CFG={apiKey:"AIzaSyAFibTZCROLP67UxEnW7ytA_iO_S-WhgeQ",authDomain:"knowledgedaily4u-be8e8.firebaseapp.com",projectId:"knowledgedaily4u-be8e8",storageBucket:"knowledgedaily4u-be8e8.firebasestorage.app",messagingSenderId:"56983472658",appId:"1:56983472658:web:76df0d495c913c79e066cb"};
const app=initializeApp(CFG),auth=getAuth(app),db=getFirestore(app);
const LS=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const PAY_URL="https://leanplate-pay.vishnunair128-99e.workers.dev";
window.LP_PAY=!!PAY_URL;
let user=null,timer=null,mode=null;
function mk(t,c){const b=document.createElement("button");b.className=c;b.style.cssText="padding:7px 14px;font-size:.9rem;margin:0";b.textContent=t;return b}
const box=document.createElement("span");box.style.cssText="display:inline-flex;gap:8px;align-items:center";
const bIn=mk("Sign in","add ghosta"),bUp=mk("Sign up","add"),bOut=mk("Sign out","add ghosta"),chip=document.createElement("a");chip.className="chip";chip.href="account.html";
box.append(bIn,bUp,chip,bOut);const tg=document.getElementById("tg");if(tg)tg.before(box);
const dlg=document.createElement("dialog");dlg.id="lpdlg";document.body.appendChild(dlg);
function msg(t){const e=document.getElementById("toast");if(!e)return;e.textContent=t;e.classList.add("on");clearTimeout(msg.t);msg.t=setTimeout(()=>e.classList.remove("on"),3200)}
function ui(){bIn.hidden=bUp.hidden=!!user;bOut.hidden=chip.hidden=!user;
if(user){const n=(user.displayName||user.email||"you").split(" ")[0].replace(/[<>&"]/g,"");
chip.innerHTML=(user.photoURL?'<img src="'+user.photoURL.replace(/"/g,"")+'" alt="" referrerpolicy="no-referrer" style="width:26px;height:26px;border-radius:50%">':'<span style="width:26px;height:26px;border-radius:50%;background:var(--brand);color:var(--bt);display:inline-flex;align-items:center;justify-content:center">'+(n[0]||"?").toUpperCase()+'</span>')+"<span>"+n+"</span>";
try{localStorage.setItem("lp_prof",JSON.stringify({name:user.displayName||"",email:user.email||"",photo:user.photoURL||"",since:(user.metadata&&user.metadata.creationTime)||""}))}catch(e){}}}
async function refreshPlan(){if(!PAY_URL||!user)return;
try{const t=await user.getIdToken(),r=await fetch(PAY_URL+"/plan",{headers:{Authorization:"Bearer "+t}});if(!r.ok)return;const j=await r.json(),cur=LS("lp2_plus"),exp=+j.exp||0;let ch=false;
if(exp>Date.now()){if(!cur||cur.exp!==exp){localStorage.setItem("lp2_plus",JSON.stringify({exp:exp,src:"paid"}));ch=true}}else if(cur){localStorage.removeItem("lp2_plus");ch=true}
if(ch){if(window.gate)gate();if(window.renderPlus)renderPlus();window.dispatchEvent(new Event("lp-render"))}}catch(e){}}
window.LPrefreshPlan=refreshPlan;
window.LPclaim=async pid=>{if(!user)return{error:"Please sign in first."};if(!PAY_URL)return{error:"Automatic upgrades are not switched on yet."};
try{const t=await user.getIdToken(),r=await fetch(PAY_URL+"/claim",{method:"POST",headers:{Authorization:"Bearer "+t,"Content-Type":"application/json"},body:JSON.stringify({payment_id:pid})}),j=await r.json();if(!r.ok)return{error:j.error||"We could not verify that payment."};await refreshPlan();return{ok:true,exp:j.exp}}catch(e){return{error:"Network problem. Please try again."}}};
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&user)refreshPlan()});
function announce(){window.__lpUser=user;window.dispatchEvent(new CustomEvent("lp-auth",{detail:user}))}
function openDlg(m){const up=m==="up";
dlg.innerHTML='<h2 style="margin:0 0 8px;font-size:1.4rem">'+(up?"Create your account":"Welcome back")+'</h2><p class="small" style="color:var(--mut);margin:0 0 14px">'+(up?"Sign up to save your food log, workouts and progress and see them on every device.":"Sign in to see your saved data and performance.")+'</p>'
+(up?'<label class="small" style="display:flex;gap:10px;align-items:flex-start;margin-bottom:14px"><input type="checkbox" id="lpc" style="width:20px;height:20px;margin-top:2px"><span>I am 18 or older and agree to the <a href="terms-and-conditions.html" target="_blank">Terms and Conditions</a> and <a href="privacy-policy.html" target="_blank">Privacy Policy</a>.</span></label>':"")
+'<p style="margin:0 0 12px"><button class="add" id="lpg" style="width:100%"'+(up?" disabled":"")+'>'+(up?"Sign up with Google":"Sign in with Google")+'</button></p><p class="small" style="margin:0;color:var(--mut)">'+(up?'Already have an account? <a href="#" id="lps">Sign in</a>':'New here? <a href="#" id="lps">Sign up</a>')+' &middot; <a href="#" id="lpx">Cancel</a></p>';
const c=dlg.querySelector("#lpc");if(c)c.onchange=()=>{dlg.querySelector("#lpg").disabled=!c.checked};
dlg.querySelector("#lps").onclick=e=>{e.preventDefault();openDlg(up?"in":"up")};
dlg.querySelector("#lpx").onclick=e=>{e.preventDefault();dlg.close()};
dlg.querySelector("#lpg").onclick=()=>{dlg.close();go(m)};
if(!dlg.open)dlg.showModal()}
const gather=()=>({u:+localStorage.getItem("lp2_u")||Date.now(),s:LS("lp2_s"),d:LS("lp2_d"),w:LS("lp2_w")||[],h:LS("lp2_h")||{},t:LS("lp2_t"),fav:LS("lp2_fav")||{},ci:LS("lp2_ci")||{}});
async function push(){if(!user)return false;try{await setDoc(doc(db,"users",user.uid,"data","main"),gather());return true}catch(e){msg("Could not sync right now. Your data is still saved on this device.");return false}}
async function pull(){try{
const sn=await getDoc(doc(db,"users",user.uid,"data","main"));
if(!sn.exists()){await push();msg("Your data is now saved to your account.");window.dispatchEvent(new Event("lp-synced"));return}
const c=sn.data(),lu=+localStorage.getItem("lp2_u")||0,cn=(c.u||0)>lu;let ch=false;
const wset=(k,v)=>{const n=JSON.stringify(v);if(localStorage.getItem(k)!==n){localStorage.setItem(k,n);ch=true}};
const lh=LS("lp2_h")||{};wset("lp2_h",cn?Object.assign({},lh,c.h||{}):Object.assign({},c.h||{},lh));
const m={};(cn?[...(LS("lp2_w")||[]),...(c.w||[])]:[...(c.w||[]),...(LS("lp2_w")||[])]).forEach(x=>m[x.d]=x);
wset("lp2_w",Object.values(m).sort((a,b)=>a.d<b.d?-1:1));
if(cn){if(c.s)wset("lp2_s",c.s);if(c.d)wset("lp2_d",c.d);if(c.t)wset("lp2_t",c.t);if(c.fav)wset("lp2_fav",c.fav)}
const lc=LS("lp2_ci")||{};wset("lp2_ci",cn?Object.assign({},lc,c.ci||{}):Object.assign({},c.ci||{},lc));
if(ch){localStorage.setItem("lp2_u",String(Math.max(lu,c.u||0)));msg("Synced from your account. Refreshing...");setTimeout(()=>location.reload(),800)}else{await push();window.dispatchEvent(new Event("lp-synced"))}
}catch(e){msg("Signed in, but syncing failed. Please check the Firestore rules.");window.dispatchEvent(new Event("lp-synced"))}}
async function go(m){mode=m;
try{const r=await signInWithPopup(auth,new GoogleAuthProvider()),isNew=getAdditionalUserInfo(r).isNewUser;
if(m==="in"&&isNew){await deleteUser(r.user);mode=null;user=null;ui();announce();msg("No account found for this Google account. Please sign up first.");openDlg("up");return}
user=r.user;
if(m==="up"&&isNew){try{await setDoc(doc(db,"users",user.uid,"data","profile"),{name:user.displayName||"",email:user.email||"",createdAt:Date.now(),consent:"terms and privacy policy"})}catch(e){}msg("Welcome! Your account is ready.")}
else if(m==="up")msg("You already have an account, so we signed you in.");
mode=null;ui();announce();refreshPlan();sessionStorage.setItem("lp_pulled","1");pull()
}catch(e){mode=null;ui();msg(e&&e.code==="auth/popup-blocked"?"Please allow pop-ups for this site, then try again.":"Sign-in was not completed.")}}
onAuthStateChanged(auth,u=>{user=u;if(mode)return;if(!u)try{localStorage.removeItem("lp_prof")}catch(e){}ui();announce();if(u)refreshPlan();
if(u&&!sessionStorage.getItem("lp_pulled")){sessionStorage.setItem("lp_pulled","1");pull()}if(!u)sessionStorage.removeItem("lp_pulled")});
bIn.onclick=()=>openDlg("in");bUp.onclick=()=>openDlg("up");
bOut.onclick=async()=>{if(await push()){["lp2_s","lp2_d","lp2_w","lp2_h","lp2_plus","lp2_u","lp2_sig","lp_prof","lp2_fav","lp2_ci"].forEach(k=>localStorage.removeItem(k));await signOut(auth);msg("Signed out. Data removed from this device.");setTimeout(()=>location.reload(),800)}else msg("Could not save before signing out, so you are still signed in.")};
window.addEventListener("lp-saved",()=>{clearTimeout(timer);timer=setTimeout(push,2500)});
window.addEventListener("lp-signout",()=>bOut.onclick());window.addEventListener("lp-open",e=>openDlg(e.detail));
ui();
