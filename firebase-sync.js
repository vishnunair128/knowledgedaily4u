import{initializeApp}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import{getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import{getFirestore,doc,getDoc,setDoc}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const CFG={apiKey:"AIzaSyAFibTZCROLP67UxEnW7ytA_iO_S-WhgeQ",authDomain:"knowledgedaily4u-be8e8.firebaseapp.com",projectId:"knowledgedaily4u-be8e8",storageBucket:"knowledgedaily4u-be8e8.firebasestorage.app",messagingSenderId:"56983472658",appId:"1:56983472658:web:76df0d495c913c79e066cb"};
const app=initializeApp(CFG),auth=getAuth(app),db=getFirestore(app);
const LS=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
let user=null,timer=null;
const btn=document.createElement("button");btn.className="add";btn.style.cssText="padding:7px 14px;font-size:.9rem";btn.textContent="Sign in with Google";
const tg=document.getElementById("tg");if(tg)tg.before(btn);
function msg(t){const e=document.getElementById("toast");if(!e)return;e.textContent=t;e.classList.add("on");clearTimeout(msg.t);msg.t=setTimeout(()=>e.classList.remove("on"),2600)}
const gather=()=>({u:+localStorage.getItem("lp2_u")||Date.now(),s:LS("lp2_s"),d:LS("lp2_d"),w:LS("lp2_w")||[],h:LS("lp2_h")||{},plus:LS("lp2_plus"),t:LS("lp2_t")});
async function push(){if(!user)return false;try{await setDoc(doc(db,"users",user.uid,"data","main"),gather());return true}catch(e){msg("Could not sync right now. Your data is still saved on this device.");return false}}
async function pull(){try{
const sn=await getDoc(doc(db,"users",user.uid,"data","main"));
if(!sn.exists()){await push();msg("Signed in. Your data is now saved to your account.");return}
const c=sn.data(),lu=+localStorage.getItem("lp2_u")||0,cn=(c.u||0)>lu;let ch=false;
const wset=(k,v)=>{const n=JSON.stringify(v);if(localStorage.getItem(k)!==n){localStorage.setItem(k,n);ch=true}};
const lh=LS("lp2_h")||{};wset("lp2_h",cn?Object.assign({},lh,c.h||{}):Object.assign({},c.h||{},lh));
const m={};(cn?[...(LS("lp2_w")||[]),...(c.w||[])]:[...(c.w||[]),...(LS("lp2_w")||[])]).forEach(x=>m[x.d]=x);
wset("lp2_w",Object.values(m).sort((a,b)=>a.d<b.d?-1:1));
if(cn){if(c.s)wset("lp2_s",c.s);if(c.d)wset("lp2_d",c.d);if(c.t)wset("lp2_t",c.t)}
const lp=LS("lp2_plus"),cp=c.plus,best=(lp&&cp)?(lp.exp>=cp.exp?lp:cp):(lp||cp);if(best)wset("lp2_plus",best);
if(ch){localStorage.setItem("lp2_u",String(Math.max(lu,c.u||0)));msg("Synced from your account. Refreshing...");setTimeout(()=>location.reload(),800)}else await push();
}catch(e){msg("Signed in, but syncing failed. Please check the Firestore rules.")}}
onAuthStateChanged(auth,u=>{user=u;window.__lpUser=u;
if(u){btn.textContent="Sign out ("+(u.displayName||u.email||"you").split(" ")[0]+")";btn.className="add ghosta";btn.style.marginLeft="0";if(!sessionStorage.getItem("lp_pulled")){sessionStorage.setItem("lp_pulled","1");pull()}}
else{btn.textContent="Sign in with Google";btn.className="add";sessionStorage.removeItem("lp_pulled")}
window.dispatchEvent(new CustomEvent("lp-auth",{detail:u}))});
btn.onclick=async()=>{
if(user){if(await push()){["lp2_s","lp2_d","lp2_w","lp2_h","lp2_plus","lp2_u","lp2_sig"].forEach(k=>localStorage.removeItem(k));await signOut(auth);msg("Signed out. Data removed from this device.");setTimeout(()=>location.reload(),800)}else msg("Could not save before signing out, so you are still signed in.");return}
try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){msg(e.code==="auth/popup-blocked"?"Please allow pop-ups for this site, then try again.":"Sign-in was not completed.")}};
window.addEventListener("lp-saved",()=>{clearTimeout(timer);timer=setTimeout(push,2500)});
