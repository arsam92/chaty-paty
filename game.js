const I={
 en:{seq:"SEQUENCES",score:"SCORE",hint:"INTELLIGENCE",stages:"Every solved sequence unlocks the next layer.",enter:"ENTER THE SIGNAL",rules:"RULES",passed:"PASSED",wrong:"NOT YET",hint1:"Hint 1",hint2:"Hint 2",reveal:"Reveal",local:"All answers stay inside this browser.",reset:"Reset complete.",manualTitle:"Field Manual"},
 fa:{seq:"مراحل",score:"امتیاز",hint:"اتاق تحلیل",stages:"هر مرحله که حل شود، لایه بعدی باز می‌شود.",enter:"ورود به سیگنال",rules:"قوانین",passed:"حل شد",wrong:"هنوز نه",hint1:"راهنما ۱",hint2:"راهنما ۲",reveal:"جواب",local:"همه چیز فقط داخل همین مرورگر اجرا می‌شود.",reset:"لاب ریست شد.",manualTitle:"دفترچه میدانی"}
};
let lang=localStorage.getItem("n17.lang")||"en";
let solved=new Set(JSON.parse(localStorage.getItem("n17.solved")||"[]"));
let score=Number(localStorage.getItem("n17.score")||0);
let current=1, attempts=0;
const stages=[
{id:1,sev:"EASY",title:{en:"The First Pulse",fa:"اولین پالس"},sub:{en:"Caesar shift / warm-up",fa:"شیفت سزار / گرم‌کن"},desc:{en:"The signal starts with an old trick. Decode the line below.",fa:"سیگنال با یک ترفند قدیمی شروع می‌شود. خط زیر را رمزگشایی کن."},body:"QEB NRFZH YOLTK CLG",answer:"the quick brown fox",h1:{en:"Three letters became different letters.",fa:"هر حرف سه خانه جابه‌جا شده."},h2:{en:"Move each letter back by 3.",fa:"هر حرف را ۳ خانه به عقب برگردان."},flag:"N17{FIRST_PULSE}"},
{id:2,sev:"MEDIUM",title:{en:"Dead Channel",fa:"کانال مرده"},sub:{en:"Morse / pattern",fa:"مورس / الگو"},desc:{en:"A short burst survived the dead channel. Read the dots and dashes.",fa:"یک انفجار کوتاه از کانال مرده جان سالم به در برده. نقطه‌ها و خط‌ها را بخوان."},body:"-. / .---- / --... / .---- / --",answer:"n17",h1:{en:"Spaces split the letters.",fa:"فاصله‌ها حروف را جدا می‌کنند."},h2:{en:"Use Morse, not a substitution cipher.",fa:"از مورس استفاده کن، نه جایگزینی حروف."},flag:"N17{DEAD_CHANNEL}"},
{id:3,sev:"HARD",title:{en:"Glass Directory",fa:"دایرکتوری شیشه‌ای"},sub:{en:"Base64 / ordering",fa:"Base64 / ترتیب"},desc:{en:"The directory is encoded. Decode each fragment, then read the filenames in numeric order.",fa:"دایرکتوری کدگذاری شده. هر تکه را Decode کن، بعد نام فایل‌ها را به ترتیب عددی بخوان."},body:"MS5zaWduYWwudHh0\nMi5zaGFkb3cudHh0\nMy5nYXRlLmxvZw==\nMS5h\n",answer:"1.signal.txt 2.shadow.txt 3.gate.log 1.a",h1:{en:"The long strings are Base64.",fa:"رشته‌های بلند Base64 هستند."},h2:{en:"Decode every line exactly. The tiny fragment is Base64 too.",fa:"هر خط را دقیق Decode کن؛ تکه کوچک هم Base64 است."},flag:"N17{GLASS_DIRECTORY}"},
{id:4,sev:"VERY HARD",title:{en:"False Horizon",fa:"افق جعلی"},sub:{en:"Vigenere / key discovery",fa:"ویژنه / کشف کلید"},desc:{en:"The key is hidden in the sentence: 'Night is the gate, seventeen is the answer.' Extract the repeated hint word, then decode.",fa:"کلید در جمله پنهان است: «Night is the gate, seventeen is the answer.» واژهٔ تکرارشونده را پیدا کن، بعد Decode کن."},body:"LXFOPV EF RNHR",answer:"attack at dawn",h1:{en:"The classic tutorial example uses Vigenere.",fa:"این نمونه از رمز ویژنه استفاده می‌کند."},h2:{en:"The key is NIGHT.",fa:"کلید NIGHT است."},flag:"N17{FALSE_HORIZON}"},
{id:5,sev:"VERY HARD",title:{en:"The Obvious File",fa:"فایل بدیهی"},sub:{en:"Hex / ASCII / misdirection",fa:"هگز / ASCII / انحراف ذهنی"},desc:{en:"The file looks like random hexadecimal. Convert it to ASCII, then reverse the result.",fa:"فایل مثل هگز تصادفی است. آن را به ASCII تبدیل کن، بعد نتیجه را برعکس بخوان."},body:"34373137646c724641",answer:"aF rld714"?trim(),h1:{en:"Pairs of hex digits map to characters.",fa:"هر دو رقم هگز یک کاراکتر می‌سازند."},h2:{en:"After ASCII, reverse the whole string.",fa:"بعد از ASCII، کل رشته را برعکس کن."},flag:"N17{OBVIOUS_FILE}"},
{id:6,sev:"EXTREME",title:{en:"Three Locks",fa:"سه قفل"},sub:{en:"Chain / mixed transforms",fa:"زنجیره / تبدیل‌های ترکیبی"},desc:{en:"Three locks. Each answer is the input to the next. Caesar → Base64 → reverse.",fa:"سه قفل. جواب هر مرحله ورودی مرحله بعد است. سزار → Base64 → برعکس."},body:"Q0hBUy0xNw==",answer:"n17-sec",h1:{en:"Start by Base64-decoding the string.",fa:"اول رشته را Base64 Decode کن."},h2:{en:"The decoded text still needs Caesar -1, then reverse.",fa:"متن Decode شده هنوز سزار -۱ و بعد reverse می‌خواهد."},flag:"N17{THREE_LOCKS}"},
{id:7,sev:"NEAR IMPOSSIBLE",title:{en:"The Signal Beneath",fa:"سیگنال زیرین"},sub:{en:"Meta / chain / final gate",fa:"متا / زنجیره / دروازه نهایی"},desc:{en:"You have collected six flags. The final gate cares only about their initials. Take the letters inside the braces, first character of each flag, then shift each by 1. Join with dashes.",fa:"شش پرچم جمع کرده‌ای. دروازه نهایی فقط به حروف اول داخل آکولادها اهمیت می‌دهد. حرف اول هر پرچم را بردار، بعد هرکدام را ۱ خانه جلو ببر و با خط تیره بچسبان."},body:"FIRST_PULSE\nDEAD_CHANNEL\nGLASS_DIRECTORY\nFALSE_HORIZON\nOBVIOUS_FILE\nTHREE_LOCKS",answer:"o-e-h-g-p-u",h1:{en:"The flags all begin with different letters.",fa:"پرچم‌ها با حروف متفاوت شروع می‌شوند."},h2:{en:"Shift F,D,G,F,O,T forward by one.",fa:"حروف F,D,G,F,O,T را یک خانه جلو ببر."},flag:"N17{THE_SIGNAL_BENEATH}"}
];

// Fix the intentionally tricky level 5 answer: hex -> "G17dlrFA", reverse -> "AF rld71G".
stages[4].answer="AF rld71G";

const $=id=>document.getElementById(id);
function tr(k){return I[lang][k]||k}
function title(s){return s.title[lang]}
function sub(s){return s.sub[lang]}
function desc(s){return s.desc[lang]}

function save(){localStorage.setItem("n17.lang",lang);localStorage.setItem("n17.solved",JSON.stringify([...solved]));localStorage.setItem("n17.score",String(score))}
function log(text,cls=""){const d=document.createElement("div");d.textContent=text;if(cls)d.className=cls;$("terminalOutput").appendChild(d);$("terminalOutput").scrollTop=$("terminalOutput").scrollHeight}
function toast(msg){log("[signal] "+msg)}
function renderStages(){
  const root=$("stageList");root.innerHTML="";
  stages.forEach(s=>{
    const d=document.createElement("div");d.className="stage"+(s.id===current?" active ":" ")+(solved.has(s.id)?"done":"");
    d.innerHTML='<span class="num">'+s.id+'</span><b>'+title(s)+'</b><span class="status">'+(solved.has(s.id)?"✓":"LOCK")+'</span><small>'+sub(s)+'</small>';
    d.onclick=()=>{current=s.id;renderChallenge();renderStages()};root.appendChild(d)
  });
  $("stageCount").textContent=solved.size+"/7"
}
function renderChallenge(){
 const s=stages[current-1];
 $("sequenceEyebrow").textContent="SEQUENCE "+String(s.id).padStart(2,"0");
 $("sequenceTitle").textContent=title(s);$("sequenceDesc").textContent=desc(s);$("score").textContent=score;
 $("challenge").innerHTML='<div class="challenge-card">'+
  '<h3>'+s.sev+' // '+title(s)+'</h3><p>'+desc(s)+'</p>'+
  '<pre>'+s.body+'</pre>'+
  '<div class="solve-row"><input class="answer" id="answer" placeholder="type your answer..."><button class="primary" id="submit">'+(lang==="fa"?"بررسی":"SUBMIT")+'</button></div>'+
  '<div class="feedback" id="feedback"></div>'+
  '</div>';
 $("answer").onkeydown=e=>{if(e.key==="Enter")submitAnswer()};
 $("submit").onclick=submitAnswer;
 if(solved.has(s.id)){$("feedback").textContent="✓ "+tr("passed")+" — "+s.flag;$("feedback").className="feedback ok"}
}
function submitAnswer(){
 const s=stages[current-1],v=$("answer").value.trim().toLowerCase();attempts++;
 const expected=s.answer.trim().toLowerCase();
 if(v===expected){
   if(!solved.has(s.id)){solved.add(s.id);score+=s.points||[100,150,220,300,400,650,1200][s.id-1];save()}
   $("feedback").textContent="✓ "+tr("passed")+" // "+s.flag;$("feedback").className="feedback ok";
   const box=$("flagBox");box.style.display="block";box.innerHTML="FLAG: <b>"+s.flag+"</b>";
   log("[+] sequence "+String(s.id).padStart(2,"0")+" solved.");
   $("score").textContent=score;$("stageCount").textContent=solved.size+"/7";
   renderStages();
   if(s.id<7){setTimeout(()=>{current=s.id+1;renderChallenge();renderStages();log("[signal] next sequence unlocked.");},450)}
 }else{
   $("feedback").textContent="✗ "+tr("wrong");$("feedback").className="feedback bad";log("[-] incorrect answer.")
 }
}
function useHint(n){
 const s=stages[current-1];let text=n===1?s.h1[lang]:s.h2[lang];log("[hint "+n+"] "+text);$("hintText").textContent=text
}
$("hint1").onclick=()=>useHint(1);$("hint2").onclick=()=>useHint(2);
$("reveal").onclick=()=>{const s=stages[current-1];$("answer").value=s.answer;log("[reveal] answer loaded into input.");$("hintText").textContent=s.answer}
$("clearTerminal").onclick=()=>$("terminalOutput").innerHTML="";
$("termInput").onkeydown=e=>{if(e.key!=="Enter")return;const raw=e.target.value.trim();e.target.value="";if(!raw)return;log("n17@signal:~$ "+raw);const [cmd,...args]=raw.split(/\s+/);
 if(cmd==="help"){log("help  status  stages  hint  open <n>  flags  decode <text>  clear")}
 else if(cmd==="status"){log("signal=LOCAL // network=OFF // sequences="+solved.size+"/7")}
 else if(cmd==="stages"){stages.forEach(s=>log("#"+s.id+" "+title(s)+" ["+(solved.has(s.id)?"OPEN":"LOCK")+"]"))}
 else if(cmd==="open"){const n=Number(args[0]);if(n>=1&&n<=7){current=n;renderChallenge();renderStages();log("[signal] opened sequence "+n)}else log("usage: open <1-7>")}
 else if(cmd==="flags"){stages.filter(s=>solved.has(s.id)).forEach(s=>log(s.flag))}
 else if(cmd==="hint"){useHint(1)}
 else if(cmd==="decode"){const t=args.join("");try{log(atob(t))}catch{log("decode: not base64")}}
 else if(cmd==="clear")$("terminalOutput").innerHTML="";
 else log("command not found: "+cmd)
};
$("langBtn").onclick=()=>{lang=lang==="en"?"fa":"en";$("langBtn").textContent=lang==="en"?"FA":"EN";$("heroTitle").textContent=lang==="en"?"Someone left a signal.":"یک نفر یک سیگنال جا گذاشته.";$("heroText").textContent=lang==="en"?"It was not addressed to you. It was waiting for someone curious enough to listen.":"این سیگنال برای تو فرستاده نشده بود؛ فقط منتظر یک آدم کنجکاو بود.";document.documentElement.lang=lang;document.documentElement.dir=lang==="fa"?"rtl":"ltr";$("stagesTitle").textContent=tr("seq");$("scoreLabel").textContent=tr("score");$("hintTitle").textContent=tr("hint");$("sideNote").textContent=tr("stages");renderChallenge();renderStages();save()};
$("rulesBtn").onclick=()=>{$("modalTitle").textContent=tr("manualTitle");$("modalBody").innerHTML=lang==="en"?'<p>N17 is a fictional browser puzzle hunt. Solve the sequences in order, use the terminal as a helper, and treat every clue as part of the story.</p><ul><li>No external network requests.</li><li>No real-world intrusion or credential collection.</li><li>All answers and flags are stored locally.</li><li>Hints reduce the mystery but never block progress.</li></ul>':'<p>N17 یک بازی معمایی کاملاً خیالی در مرورگر است. مراحل را به ترتیب حل کن و از ترمینال به‌عنوان ابزار کمکی استفاده کن.</p><ul><li>هیچ درخواست واقعی به اینترنت ارسال نمی‌شود.</li><li>هیچ ورود یا جمع‌آوری رمز واقعی وجود ندارد.</li><li>پاسخ‌ها و پرچم‌ها محلی هستند.</li></ul>';$("modal").classList.remove("hidden")};
$("closeModal").onclick=()=>$("modal").classList.add("hidden");
$("enterBtn").onclick=()=>document.querySelector(".dashboard").scrollIntoView({behavior:"smooth"});
$("resetBtn").onclick=()=>{solved=new Set();score=0;attempts=0;save();renderChallenge();renderStages();$("flagBox").style.display="none";$("terminalOutput").innerHTML="";log("[signal] "+tr("reset"));};
$("soundBtn").onclick=()=>{$("soundBtn").textContent=$("soundBtn").textContent.endsWith("OFF")?"SOUND: ON":"SOUND: OFF";log("[signal] audio "+($("soundBtn").textContent.endsWith("ON")?"enabled":"disabled"))};

setTimeout(()=>{$("boot").classList.add("hidden");$("app").classList.remove("hidden");log("N17 channel established.");log("Type 'help' to inspect the terminal.");},1900);
renderChallenge();renderStages();save();
