import{initializeApp}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import{getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,getAdditionalUserInfo,deleteUser}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import{getFirestore,doc,getDoc,setDoc}from"https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const CFG={apiKey:"AIzaSyAFibTZCROLP67UxEnW7ytA_iO_S-WhgeQ",authDomain:"knowledgedaily4u-be8e8.firebaseapp.com",projectId:"knowledgedaily4u-be8e8",storageBucket:"knowledgedaily4u-be8e8.firebasestorage.app",messagingSenderId:"56983472658",appId:"1:56983472658:web:76df0d495c913c79e066cb"};
const app=initializeApp(CFG),auth=getAuth(app),db=getFirestore(app);
const LS=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
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
const gather=()=>({u:+localStorage.getItem("lp2_u")||Date.now(),s:LS("lp2_s"),d:LS("lp2_d"),w:LS("lp2_w")||[],h:LS("lp2_h")||{},plus:LS("lp2_plus"),t:LS("lp2_t")});
async function push(){if(!user)return false;try{await setDoc(doc(db,"users",user.uid,"data","main"),gather());return true}catch(e){msg("Could not sync right now. Your data is still saved on this device.");return false}}
async function pull(){try{
const sn=await getDoc(doc(db,"users",user.uid,"data","main"));
if(!sn.exists()){await push();msg("Your data is now saved to your account.");return}
const c=sn.data(),lu=+localStorage.getItem("lp2_u")||0,cn=(c.u||0)>lu;let ch=false;
const wset=(k,v)=>{const n=JSON.stringify(v);if(localStorage.getItem(k)!==n){localStorage.setItem(k,n);ch=true}};
const lh=LS("lp2_h")||{};wset("lp2_h",cn?Object.assign({},lh,c.h||{}):Object.assign({},c.h||{},lh));
const m={};(cn?[...(LS("lp2_w")||[]),...(c.w||[])]:[...(c.w||[]),...(LS("lp2_w")||[])]).forEach(x=>m[x.d]=x);
wset("lp2_w",Object.values(m).sort((a,b)=>a.d<b.d?-1:1));
if(cn){if(c.s)wset("lp2_s",c.s);if(c.d)wset("lp2_d",c.d);if(c.t)wset("lp2_t",c.t)}
const lp=LS("lp2_plus"),cp=c.plus,best=(lp&&cp)?(lp.exp>=cp.exp?lp:cp):(lp||cp);if(best)wset("lp2_plus",best);
if(ch){localStorage.setItem("lp2_u",String(Math.max(lu,c.u||0)));msg("Synced from your account. Refreshing...");setTimeout(()=>location.reload(),800)}else await push();
}catch(e){msg("Signed in, but syncing failed. Please check the Firestore rules.")}}
async function go(m){mode=m;
try{const r=await signInWithPopup(auth,new GoogleAuthProvider()),isNew=getAdditionalUserInfo(r).isNewUser;
if(m==="in"&&isNew){await deleteUser(r.user);mode=null;user=null;ui();announce();msg("No account found for this Google account. Please sign up first.");openDlg("up");return}
user=r.user;
if(m==="up"&&isNew){try{await setDoc(doc(db,"users",user.uid,"data","profile"),{name:user.displayName||"",email:user.email||"",createdAt:Date.now(),consent:"terms and privacy policy"})}catch(e){}msg("Welcome! Your account is ready.")}
else if(m==="up")msg("You already have an account, so we signed you in.");
mode=null;ui();announce();sessionStorage.setItem("lp_pulled","1");pull()
}catch(e){mode=null;ui();msg(e&&e.code==="auth/popup-blocked"?"Please allow pop-ups for this site, then try again.":"Sign-in was not completed.")}}
onAuthStateChanged(auth,u=>{user=u;if(mode)return;ui();announce();
if(u&&!sessionStorage.getItem("lp_pulled")){sessionStorage.setItem("lp_pulled","1");pull()}if(!u)sessionStorage.removeItem("lp_pulled")});
bIn.onclick=()=>openDlg("in");bUp.onclick=()=>openDlg("up");
bOut.onclick=async()=>{if(await push()){["lp2_s","lp2_d","lp2_w","lp2_h","lp2_plus","lp2_u","lp2_sig","lp_prof"].forEach(k=>localStorage.removeItem(k));await signOut(auth);msg("Signed out. Data removed from this device.");setTimeout(()=>location.reload(),800)}else msg("Could not save before signing out, so you are still signed in.")};
window.addEventListener("lp-saved",()=>{clearTimeout(timer);timer=setTimeout(push,2500)});
window.addEventListener("lp-signout",()=>bOut.onclick());window.addEventListener("lp-open",e=>openDlg(e.detail));
ui();
