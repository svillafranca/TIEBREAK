import { useState, useRef, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ME = { id:1, name:"Sebastián", emoji:"🎾" };

const FRIENDS_INIT = [
  { id:2, name:"Andrés",  emoji:"💪", hasApp:true,  streak:-2 },
  { id:3, name:"Felipe",  emoji:"🧠", hasApp:true,  streak:2  },
  { id:4, name:"Matías",  emoji:"😤", hasApp:true,  streak:-1 },
  { id:5, name:"Camilo",  emoji:"🚀", hasApp:true,  streak:1  },
  { id:6, name:"Diego",   emoji:"🦁", hasApp:false, streak:0  },
];

const BARS = [
  { id:1, name:"El Tonel",   emoji:"🍺", dist:"180m", color:"#f5c842",
    coupons:[{id:"t1",icon:"🍺",label:"1 schop artesanal",stake:"1 schop El Tonel"},
             {id:"t2",icon:"🍺",label:"2 schop + papas",  stake:"2 schop + papas"},
             {id:"t3",icon:"🍻",label:"Jarra 1L",          stake:"jarra El Tonel"}]},
  { id:2, name:"El Saque",   emoji:"🍔", dist:"450m", color:"#ff7043",
    coupons:[{id:"s1",icon:"🍔",label:"Hamburguesa",       stake:"hamburguesa El Saque"},
             {id:"s2",icon:"🥗",label:"Menu del dia",      stake:"menu El Saque"}]},
  { id:3, name:"La Cancha",  emoji:"🍻", dist:"320m", color:"#4da6ff",
    coupons:[{id:"c1",icon:"🍻",label:"Round x4",          stake:"round La Cancha"}]},
  { id:4, name:"Botilleria", emoji:"🛒", dist:"90m",  color:"#68d391",
    coupons:[{id:"d1",icon:"🍺",label:"Pack 6 cervezas",   stake:"pack 6 Decima"}]},
];

const MATCHES_INIT = [
  { id:1, sport:"padel", mode:"2v2", club:"Club Decima", court:"Cancha 3",
    teamA:["Sebastián","Felipe"], teamB:["Andrés","Matías"],
    date:"Hoy", time:"19:00", visibility:"privado", minCat:null,
    bet:{ what:"2 schop El Tonel", status:"pending", payer:"Andrés", payee:"Sebastián" },
    result:null, winner:null, confirmedBy:[], verifiedByBoth:false, requests:[],
    msgs:[
      { id:1, from:"Andrés",    text:"Llegando en 10 minutos", time:"18:50", out:false },
      { id:2, from:"Sebastián", text:"Ya estamos en la cancha", time:"18:52", out:true  },
    ]},
  { id:2, sport:"padel", mode:"2v2", club:"Club Parque Urbano", court:"Cancha 1",
    teamA:["Felipe","Camilo"], teamB:[],
    date:"Sab 6 jul", time:"10:00", visibility:"publico", minCat:"Plata",
    bet:null, result:null, winner:null, confirmedBy:[], verifiedByBoth:false,
    requests:[{ name:"Rodrigo", cat:"Plata", chat:[] }],
    msgs:[{ id:1, from:"Felipe", text:"Partido abierto! Buscamos rival", time:"09:00", out:false }]},
];

const PAST_INIT = [
  { id:10, sport:"padel", club:"Club Decima", date:"28 jun",
    teamA:["Sebastián","Felipe"], teamB:["Andrés","Matías"],
    result:"6-3 / 6-4", winner:"A",
    bet:{ what:"2 schop El Tonel", status:"paid", payer:"Andrés", payee:"Sebastián" },
    verifiedByBoth:true },
  { id:11, sport:"tenis", club:"Club Parque Urbano", date:"21 jun",
    teamA:["Sebastián"], teamB:["Matías"],
    result:"7-5 / 6-3", winner:"A",
    bet:{ what:"hamburguesa El Saque", status:"paid", payer:"Matías", payee:"Sebastián" },
    verifiedByBoth:true },
];

const CLUBS_MOCK = [
  { id:"C1", name:"Club Decima Padel", addr:"Av. Picarte 1234", dist:0.8, sport:"padel",
    courts:["Cancha 1 (cristal)","Cancha 2 (cristal)","Cancha 3 (cesped)"],
    rating:4.7, reviews:89,
    slots:[
      { date:"Hoy",     time:"17:00", price:12000, available:false, platform:"playtomic", url:"https://playtomic.io" },
      { date:"Hoy",     time:"18:00", price:12000, available:false, platform:"playtomic", url:"https://playtomic.io" },
      { date:"Hoy",     time:"19:00", price:14000, available:true,  platform:"playtomic", url:"https://playtomic.io" },
      { date:"Hoy",     time:"20:00", price:14000, available:true,  platform:"playtomic", url:"https://playtomic.io" },
      { date:"Manana",  time:"10:00", price:10000, available:true,  platform:"matchpoint", url:"https://matchpoint.cl" },
      { date:"Manana",  time:"11:00", price:10000, available:false, platform:"matchpoint", url:"https://matchpoint.cl" },
      { date:"Manana",  time:"19:00", price:14000, available:true,  platform:"matchpoint", url:"https://matchpoint.cl" },
      { date:"Sab",     time:"09:00", price:10000, available:true,  platform:"matchpoint", url:"https://matchpoint.cl" },
      { date:"Sab",     time:"10:00", price:10000, available:true,  platform:"matchpoint", url:"https://matchpoint.cl" },
    ]},
  { id:"C2", name:"Parque Urbano Tennis", addr:"Los Robles 456", dist:2.1, sport:"tenis",
    courts:["Cancha A (arcilla)","Cancha B (arcilla)"],
    rating:4.5, reviews:62,
    slots:[
      { date:"Hoy",     time:"17:00", price:8000,  available:true,  platform:"vola",       url:"https://vola.cl" },
      { date:"Hoy",     time:"18:00", price:8000,  available:true,  platform:"vola",       url:"https://vola.cl" },
      { date:"Hoy",     time:"19:00", price:9000,  available:false, platform:"vola",       url:"https://vola.cl" },
      { date:"Manana",  time:"09:00", price:7000,  available:true,  platform:"easycancha", url:"https://easycancha.com" },
      { date:"Sab",     time:"10:00", price:8000,  available:true,  platform:"easycancha", url:"https://easycancha.com" },
    ]},
  { id:"C3", name:"Indoor Padel Sur", addr:"Camino Niebla 789", dist:3.4, sport:"padel",
    courts:["Cancha 1 (cristal)","Cancha 2 (cristal)","Cancha 3 (cristal)"],
    rating:4.9, reviews:134,
    slots:[
      { date:"Hoy",     time:"19:00", price:16000, available:true,  platform:"playtomic",  url:"https://playtomic.io" },
      { date:"Hoy",     time:"20:00", price:16000, available:true,  platform:"playtomic",  url:"https://playtomic.io" },
      { date:"Manana",  time:"19:00", price:16000, available:true,  platform:"matchpoint", url:"https://matchpoint.cl" },
      { date:"Sab",     time:"10:00", price:14000, available:true,  platform:"matchpoint", url:"https://matchpoint.cl" },
    ]},
];

const PLT = {
  playtomic:  { label:"Playtomic",  color:"#00c4a0" },
  matchpoint: { label:"Matchpoint", color:"#4da6ff" },
  vola:       { label:"Vola",       color:"#f5c842" },
  easycancha: { label:"EasyCancha", color:"#ff7043" },
};

const VIS_OPTS = [
  { id:"privado", icon:"locked", label:"Privado",     desc:"Solo tu agregas jugadores",                    color:"var(--mu2)" },
  { id:"amigos",  icon:"group",  label:"Solo amigos", desc:"Tus amigos con la app pueden solicitar unirse", color:"var(--bl)"  },
  { id:"publico", icon:"globe",  label:"Publico",     desc:"Cualquiera puede solicitar — tu aceptas",       color:"var(--ac)"  },
];
const CATS = ["Cualquier nivel","Iniciacion","Bronce","Plata","Oro","Elite"];

const toMin = t => { const [h,m] = t.split(":").map(Number); return h*60+m; };
const ini   = n => n ? n.slice(0,2).toUpperCase() : "??";
const wr    = (w,l) => (w+l)>0 ? Math.round(w/(w+l)*100) : 0;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#08090f;--bg2:#111520;--bg3:#181e2c;--bg4:#1e2840;--bg5:#263248;
  --bdr:rgba(255,255,255,.07);--bdr2:rgba(255,255,255,.14);
  --tx:#e8eaf2;--mu:#4a5568;--mu2:#7a8ba0;
  --ac:#00e5a0;--rd:#ff4757;--gd:#ffd32a;--bl:#4da6ff;--or:#ff8042;--pu:#a78bfa;
}
body{background:var(--bg);color:var(--tx);font-family:'Outfit',sans-serif;font-size:14px;min-height:100vh;overflow:hidden}
.app{max-width:420px;margin:0 auto;height:100vh;display:flex;flex-direction:column;background:var(--bg)}
.page{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch}
.page::-webkit-scrollbar{display:none}
.inner{padding:16px 16px 24px}
.ph{padding:16px 16px 10px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.ph-title{font-family:'Bebas Neue';font-size:22px;letter-spacing:1.5px}
/* nav */
.bnav{display:flex;background:rgba(8,9,15,.97);border-top:1px solid var(--bdr);padding:6px 0 18px;flex-shrink:0;z-index:50}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:4px 0;transition:all .15s}
.ni-ic{font-size:22px;line-height:1;transition:transform .2s}
.ni-lb{font-size:9px;font-weight:700;color:var(--mu);letter-spacing:.5px;text-transform:uppercase}
.ni.on .ni-lb{color:var(--ac)}
.ni.on .ni-ic{transform:scale(1.15)}
.ni-w{position:relative;display:inline-block}
.nbdg{position:absolute;top:-3px;right:-6px;background:var(--rd);color:#fff;font-size:8px;font-weight:700;min-width:15px;height:15px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 3px}
/* cards */
.card{background:var(--bg2);border:1px solid var(--bdr);border-radius:16px;overflow:hidden;margin-bottom:12px}
.card-ac{border-color:rgba(0,229,160,.22);background:linear-gradient(135deg,rgba(0,229,160,.05),transparent)}
.card-rd{border-color:rgba(255,71,87,.2);background:rgba(255,71,87,.03)}
.card-gd{border-color:rgba(255,211,42,.2);background:rgba(255,211,42,.03)}
/* btns */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:10px;font-family:'Outfit';font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .15s;white-space:nowrap}
.btn-p{background:var(--ac);color:#08090f}.btn-p:active{opacity:.85}
.btn-g{background:transparent;color:var(--tx);border:1.5px solid var(--bdr2)}.btn-g:active{background:var(--bg3)}
.btn-rd{background:rgba(255,71,87,.1);color:var(--rd);border:1.5px solid rgba(255,71,87,.25)}
.btn-ok{background:rgba(0,229,160,.1);color:var(--ac);border:1.5px solid rgba(0,229,160,.25)}
.btn-gd{background:rgba(255,211,42,.1);color:var(--gd);border:1.5px solid rgba(255,211,42,.3)}
.btn-bl{background:rgba(77,166,255,.1);color:var(--bl);border:1.5px solid rgba(77,166,255,.3)}
.btn-pu{background:rgba(167,139,250,.1);color:var(--pu);border:1.5px solid rgba(167,139,250,.3)}
.btn-f{width:100%}.btn-sm{padding:5px 11px;font-size:12px}.btn-xs{padding:4px 8px;font-size:11px}
.btn-lg{padding:13px 22px;font-size:15px;border-radius:12px}
/* input */
.inp{width:100%;background:var(--bg3);border:1.5px solid var(--bdr);border-radius:10px;padding:10px 12px;color:var(--tx);font-family:'Outfit';font-size:13px;outline:none;transition:border-color .15s}
.inp:focus{border-color:var(--ac)}.inp::placeholder{color:var(--mu)}
select.inp{cursor:pointer}
/* badge */
.bdg{display:inline-flex;align-items:center;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:700}
.b-ac{background:rgba(0,229,160,.12);color:var(--ac)}.b-rd{background:rgba(255,71,87,.12);color:var(--rd)}
.b-gd{background:rgba(255,211,42,.12);color:var(--gd)}.b-mu{background:var(--bg4);color:var(--mu2)}
.b-bl{background:rgba(77,166,255,.12);color:var(--bl)}.b-or{background:rgba(255,128,66,.12);color:var(--or)}
/* avatar */
.av{border-radius:50%;background:var(--bg4);border:2px solid rgba(0,229,160,.4);display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;color:var(--ac);font-family:'Outfit'}
.av-xl{width:56px;height:56px;font-size:15px}.av-md{width:38px;height:38px;font-size:12px}
.av-sm{width:30px;height:30px;font-size:10px}.av-xs{width:24px;height:24px;font-size:9px}
/* match card */
.mc{border:1.5px solid var(--bdr);border-radius:16px;overflow:hidden;background:var(--bg2);margin-bottom:10px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mc-h{padding:9px 14px;background:var(--bg3);display:flex;justify-content:space-between;align-items:center}
.mc-b{padding:13px 14px}
/* chat */
.chat-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}
.chat-msgs::-webkit-scrollbar{display:none}
.mw{display:flex;flex-direction:column;max-width:76%}
.mb{padding:10px 13px;border-radius:16px;font-size:13px;line-height:1.5}
.mo{align-self:flex-end}.mo .mb{background:var(--ac);color:#08090f;font-weight:600;border-bottom-right-radius:4px}
.mi{align-self:flex-start}.mi .mb{background:var(--bg4);border-bottom-left-radius:4px}
.mt{font-size:10px;color:var(--mu2);margin-top:3px}.mo .mt{text-align:right}
/* pill */
.pill{padding:7px 13px;border-radius:20px;border:1.5px solid var(--bdr);background:var(--bg3);color:var(--mu2);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.pill.on{background:rgba(0,229,160,.1);color:var(--ac);border-color:rgba(0,229,160,.4)}
.pill.on-gd{background:rgba(255,211,42,.1);color:var(--gd);border-color:rgba(255,211,42,.4)}
.pg{display:flex;flex-wrap:wrap;gap:7px}
/* label */
.lbl{font-size:10px;font-weight:700;color:var(--mu2);letter-spacing:.9px;text-transform:uppercase;margin-bottom:7px;display:block}
/* modal / sheet */
.ov{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:200;display:flex;align-items:flex-end;justify-content:center}
.sheet{background:var(--bg2);border:1px solid var(--bdr2);border-radius:22px 22px 0 0;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;padding:0 0 30px}
.sheet::-webkit-scrollbar{display:none}
.sh-handle{width:38px;height:4px;background:var(--bg5);border-radius:2px;margin:12px auto 20px}
.sh-inner{padding:0 18px}
/* step bar */
.step-bar{display:flex;gap:5px;margin-bottom:22px}
.step-seg{flex:1;height:3px;border-radius:2px;transition:background .3s}
/* share card */
.sc{width:100%;aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;position:relative}
.sc-logo{font-family:'Bebas Neue';font-size:11px;letter-spacing:3px;color:rgba(0,229,160,.5);margin-bottom:16px}
.sc-score{font-family:'Bebas Neue';font-size:52px;letter-spacing:4px;color:var(--ac);line-height:1;margin:10px 0 6px;text-shadow:0 0 30px rgba(0,229,160,.25)}
.sc-winner{font-size:12px;color:rgba(255,255,255,.55);margin-bottom:8px}
.sc-bet{display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:20px;background:rgba(255,211,42,.1);border:1px solid rgba(255,211,42,.25);font-size:12px;font-weight:700;color:var(--gd)}
/* coupon */
.cpn{background:linear-gradient(135deg,#0a0e08,#07090e);border:1.5px dashed rgba(0,229,160,.35);border-radius:10px;padding:8px 12px;text-align:center}
.cc{font-family:'Bebas Neue';font-size:17px;letter-spacing:5px;color:var(--ac)}
/* friend row */
.fr{display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid var(--bdr)}
.fr:last-child{border-bottom:none}
/* pulse */
.dot{width:7px;height:7px;border-radius:50%;background:var(--ac);display:inline-block;animation:pulse 1.5s ease infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)}}
/* progress */
.pbar-w{height:4px;background:var(--bg5);border-radius:2px;overflow:hidden;margin-top:8px}
.pbar{height:100%;background:linear-gradient(90deg,var(--ac),var(--bl));border-radius:2px;transition:width .6s}
/* anim */
@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fu .22s ease both}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.su{animation:slideUp .28s cubic-bezier(.32,.72,0,1)}
`;

// ─── ATOMS ───────────────────────────────────────────────────────────────────
const Av = ({ name, size="av-md" }) => <div className={"av "+size}>{ini(name)}</div>;
const Bdg = ({ t="mu", ch }) => <span className={"bdg b-"+t}>{ch}</span>;

// ─── BET WIDGET ──────────────────────────────────────────────────────────────
function BetWidget({ bet, me, onMarkPaid, onConfirm }) {
  if (!bet) return null;
  const isPayer = bet.payer === me;
  const isPayee = bet.payee === me;
  const paid    = bet.status === "paid";
  const waiting = bet.status === "waiting";
  const pending = bet.status === "pending";
  return (
    <div style={{background: paid ? "rgba(0,229,160,.06)" : "rgba(255,211,42,.06)",
      border:"1.5px solid "+(paid?"rgba(0,229,160,.25)":"rgba(255,211,42,.25)"),
      borderRadius:12, padding:"13px 14px"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:paid?0:10}}>
        <span style={{fontSize:22,flexShrink:0}}>💰</span>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:15,color:"var(--gd)",marginBottom:3}}>{bet.what}</div>
          <div style={{fontSize:12,color:"var(--mu2)"}}>
            {bet.payer
              ? <span><span style={{fontWeight:700,color:"var(--rd)"}}>{bet.payer}</span>{" debe a "}<span style={{fontWeight:700,color:"var(--ac)"}}>{bet.payee}</span></span>
              : "Apuesta acordada — pendiente de resultado"}
          </div>
        </div>
        <span className={"bdg "+(paid?"b-ac":waiting?"b-or":"b-rd")}>
          {paid ? "✓ Pagado" : waiting ? "⏳ Confirmando" : "💸 Pendiente"}
        </span>
      </div>
      {pending && isPayer && (
        <button className="btn btn-gd btn-f btn-sm" onClick={onMarkPaid}>
          Ya pague — marcar como pagado
        </button>
      )}
      {waiting && isPayee && (
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ok btn-f" onClick={onConfirm}>Confirmar que recibi</button>
          <button className="btn btn-rd">X</button>
        </div>
      )}
      {waiting && isPayer && (
        <div style={{fontSize:12,color:"var(--mu2)",textAlign:"center"}}>
          {"Esperando que "+bet.payee+" confirme…"}
        </div>
      )}
    </div>
  );
}

// ─── SHARE CARDS ─────────────────────────────────────────────────────────────
function ShareCard({ match, cardType }) {
  const wTeam = match.winner === "A" ? match.teamA : match.teamB;
  const lTeam = match.winner === "A" ? match.teamB : match.teamA;

  if (cardType === "streak") {
    return (
      <div className="sc" style={{background:"linear-gradient(155deg,#0d1a10,#081208 50%,#060e07)"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 30%,rgba(0,229,160,.12),transparent 60%)",pointerEvents:"none"}}/>
        <div className="sc-logo">TIEBREAK</div>
        <div style={{fontSize:48,marginBottom:8}}>🔥</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:58,color:"var(--ac)",lineHeight:1,marginBottom:6}}>3</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:2,color:"rgba(255,255,255,.7)",marginBottom:10}}>VICTORIAS SEGUIDAS</div>
        {lTeam[0] && <div style={{fontSize:13,color:"rgba(255,255,255,.45)"}}>{"contra @"+lTeam[0]}</div>}
        <div style={{fontSize:11,color:"rgba(255,255,255,.3)",letterSpacing:1,textTransform:"uppercase",marginTop:8}}>{match.sport+" · "+match.club+" · "+match.date}</div>
      </div>
    );
  }
  if (cardType === "debt" && match.bet) {
    return (
      <div className="sc" style={{background:"linear-gradient(155deg,#18120a,#100d06 50%,#0c0904)"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 30%,rgba(255,211,42,.08),transparent 55%)",pointerEvents:"none"}}/>
        <div className="sc-logo">TIEBREAK</div>
        <div style={{fontSize:44,marginBottom:8}}>🍺</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.5)",marginBottom:10,textAlign:"center",lineHeight:1.5}}>
          <span style={{color:"var(--rd)",fontWeight:700}}>{lTeam[0]}</span>{" le debe a "}<span style={{color:"var(--ac)",fontWeight:700}}>{wTeam[0]}</span>
        </div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:"var(--gd)",letterSpacing:2,marginBottom:10,textAlign:"center"}}>{match.bet.what}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.3)",letterSpacing:1,textTransform:"uppercase"}}>{match.sport+" · "+match.club+" · "+match.date}</div>
      </div>
    );
  }
  // default: result card
  return (
    <div className="sc" style={{background:"linear-gradient(155deg,#0a1628,#071020 50%,#050c18)"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 25%,rgba(0,229,160,.09),transparent 55%)",pointerEvents:"none"}}/>
      <div className="sc-logo">{"TIEBREAK · "+match.club}</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.3)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{match.sport+" · "+match.date}</div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:4}}>
        <div style={{textAlign:"center"}}>{wTeam.map(n=><div key={n} style={{fontWeight:700,fontSize:15,color:"#fff",lineHeight:1.3}}>{n}</div>)}</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:18,color:"rgba(255,255,255,.2)",letterSpacing:2}}>VS</div>
        <div style={{textAlign:"center",opacity:.4}}>{lTeam.map(n=><div key={n} style={{fontWeight:700,fontSize:15,color:"#fff",lineHeight:1.3}}>{n}</div>)}</div>
      </div>
      <div className="sc-score">{match.result || "6-4/6-3"}</div>
      <div className="sc-winner">{"🏆 "}<strong style={{color:"var(--ac)"}}>{wTeam.join(" + ")}</strong>{" gano"}</div>
      {match.bet && match.bet.what && (
        <div className="sc-bet">{"🍺 "+lTeam[0]+" paga: "+match.bet.what}</div>
      )}
    </div>
  );
}

function SharePanel({ match }) {
  const [cardType, setCardType] = useState("result");
  const hasBet = !!(match.bet && match.bet.what);
  const tabs = [
    { id:"result", label:"Resultado" },
    { id:"streak", label:"Racha x3" },
    ...(hasBet ? [{ id:"debt", label:"Apuesta" }] : []),
  ];
  const share = () => {
    const txt = match.teamA.join("+")+" vs "+match.teamB.join("+")+" — "+match.result;
    if (navigator.share) { navigator.share({ title:"TieBreak", text:txt }).catch(()=>{}); }
    else { alert("En la app movil abre Instagram Stories con la imagen"); }
  };
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        {tabs.map(t => (
          <div key={t.id} onClick={()=>setCardType(t.id)}
            style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",
              background: cardType===t.id ? "var(--ac)" : "var(--bg3)",
              color: cardType===t.id ? "#08090f" : "var(--mu2)",
              border:"1px solid "+(cardType===t.id ? "var(--ac)" : "var(--bdr)")}}>
            {t.label}
          </div>
        ))}
      </div>
      <div style={{borderRadius:16,overflow:"hidden",background:"#000",marginBottom:12}}>
        <ShareCard match={match} cardType={cardType} />
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn btn-p btn-f" onClick={share}>
          📸 Compartir en Instagram
        </button>
      </div>
    </div>
  );
}

// ─── MATCH DETAIL ────────────────────────────────────────────────────────────
function MatchDetail({ match, friends, bars, past, onBack, onUpdate }) {
  const [m, setM]   = useState({ ...match });
  const [inp, setInp] = useState("");
  const [showBet, setShowBet] = useState(false);
  const [showRes, setShowRes] = useState(false);
  const [showShare, setShowShare] = useState(!!(match.result && match.verifiedByBoth));
  const [winner, setWinner] = useState(match.winner || null);
  const [betType, setBetType] = useState("coupon");
  const [selCoupon, setSelCoupon] = useState(null);
  const [freeBet, setFreeBet] = useState("");
  const [showReqs, setShowReqs] = useState(false);
  const [reqInp, setReqInp] = useState({});
  const ref = useRef();

  useEffect(() => { ref.current && ref.current.scrollIntoView({ behavior:"smooth" }); }, [m.msgs]);

  const save = upd => { setM(upd); onUpdate(upd); };

  const send = () => {
    if (!inp.trim()) return;
    const msg = { id:Date.now(), from:ME.name, text:inp.trim(),
      time:new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"}), out:true };
    save({ ...m, msgs:[...m.msgs, msg] });
    setInp("");
  };

  const proposeBet = () => {
    const stake = betType === "coupon" ? (selCoupon ? selCoupon.stake : "") : freeBet;
    if (!stake) return;
    const bet = { what:stake, status:"pending", payer:null, payee:null };
    const msg = { id:Date.now(), special:"bet", stake, from:ME.name, time:"ahora", out:true };
    save({ ...m, bet, msgs:[...m.msgs, msg] });
    setShowBet(false);
  };

  const acceptBet = stake => {
    const bet = { ...m.bet, status:"pending", payer:m.teamB[0]||"Rival", payee:m.teamA[0]||ME.name };
    const msg = { id:Date.now(), from:m.teamB[0]||"Rival", text:"Apostado — que gane el mejor!", time:"ahora", out:false };
    save({ ...m, bet, msgs:[...m.msgs, msg] });
  };

  const registerResult = () => {
    if (!winner) return;
    const wT = winner === "A" ? m.teamA : m.teamB;
    const lT = winner === "A" ? m.teamB : m.teamA;
    const updBet = m.bet ? { ...m.bet, payer:lT[0], payee:wT[0], status:"pending" } : null;
    const msg = { id:Date.now(), special:"result", winner, teamA:m.teamA, teamB:m.teamB, bet:updBet, time:"ahora" };
    save({ ...m, result:"6-4 / 6-3", winner, bet:updBet, confirmedBy:[ME.name], msgs:[...m.msgs, msg] });
    setShowRes(false);
  };

  const rivalConfirm = () => {
    const upd = { ...m, confirmedBy:[...m.confirmedBy, m.teamB[0]||"Rival"], verifiedByBoth:true };
    save(upd);
    setShowShare(true);
  };

  const markPaid    = () => save({ ...m, bet:{ ...m.bet, status:"waiting" } });
  const confirmPaid = () => save({ ...m, bet:{ ...m.bet, status:"paid", confirmedAt:"Hoy" } });

  const acceptReq = name => {
    const newTeamB = [...(m.teamB||[]), name].slice(0, 2);
    const msg = { id:Date.now(), from:"Sistema", text:name+" se unio al partido", time:"ahora", out:false };
    save({ ...m, teamB:newTeamB, requests:m.requests.filter(r=>r.name!==name), msgs:[...m.msgs, msg] });
  };

  const rejectReq = name => save({ ...m, requests:m.requests.filter(r=>r.name!==name) });

  const sendToReq = (name) => {
    const txt = reqInp[name] || "";
    if (!txt.trim()) return;
    const upd = { ...m, requests: m.requests.map(r =>
      r.name === name ? { ...r, chat:[...(r.chat||[]), { from:ME.name, text:txt, time:"ahora", out:true }] } : r
    )};
    save(upd);
    setReqInp(p => ({ ...p, [name]:"" }));
  };

  // Calendar export
  const addToCalendar = type => {
    const title = "TieBreak: "+m.teamA.join("+")+" vs "+(m.teamB.join("+")||"rival")+" · "+m.club;
    const loc   = m.club + (m.court ? ", "+m.court : "");
    const timeStr = m.time || "19:00";
    const dateStr = m.date && m.date !== "Hoy" && m.date !== "Manana" ? "2025-07-05" : new Date().toISOString().slice(0,10);
    const start = new Date(dateStr+"T"+timeStr+":00");
    const end   = new Date(start.getTime() + 90*60*1000);
    const fmt   = d => d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
    if (type === "google") {
      const url = "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title)+"&dates="+fmt(start)+"/"+fmt(end)+"&location="+encodeURIComponent(loc);
      window.open(url, "_blank");
    } else {
      const ics = "BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:"+fmt(start)+"\nDTEND:"+fmt(end)+"\nSUMMARY:"+title+"\nLOCATION:"+loc+"\nEND:VEVENT\nEND:VCALENDAR";
      const blob = new Blob([ics], { type:"text/calendar" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "partido-tiebreak.ics";
      a.click();
    }
  };

  const awaitRival = m.result && !m.verifiedByBoth && m.confirmedBy.includes(ME.name);
  const isOwner    = m.teamA.includes(ME.name);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"var(--bg)"}}>

      {/* topbar */}
      <div style={{padding:"11px 14px 10px",borderBottom:"1px solid var(--bdr)",display:"flex",alignItems:"center",gap:10,flexShrink:0,background:"var(--bg2)"}}>
        <button className="btn btn-g btn-sm" onClick={onBack} style={{padding:"6px 10px"}}>←</button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {m.teamA.join("+")+" "+(m.teamB && m.teamB.length ? "vs "+m.teamB.join("+") : "— abierto")}
          </div>
          <div style={{fontSize:11,color:"var(--mu2)"}}>{m.club+" · "+m.sport+" · "+m.date+" "+m.time}</div>
        </div>
        <div style={{display:"flex",gap:6,flexShrink:0}}>
          {!m.result && m.teamB && m.teamB.length > 0 && (
            <button className="btn btn-g btn-xs" onClick={()=>setShowRes(true)}>Resultado</button>
          )}
          {!m.bet && !m.result && m.teamB && m.teamB.length > 0 && (
            <button className="btn btn-gd btn-xs" onClick={()=>setShowBet(true)}>💰</button>
          )}
        </div>
      </div>

      {/* calendar strip */}
      {!m.result && m.time && (
        <div style={{padding:"8px 14px",borderBottom:"1px solid var(--bdr)",background:"rgba(77,166,255,.04)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:11,color:"var(--bl)",fontWeight:600}}>
              {"📅 "+m.date+" a las "+m.time+" · "+m.club}
            </div>
            <div style={{display:"flex",gap:6}}>
              <button className="btn btn-bl btn-xs" onClick={()=>addToCalendar("google")} style={{fontSize:10}}>
                Google
              </button>
              <button className="btn btn-g btn-xs" onClick={()=>addToCalendar("apple")} style={{fontSize:10}}>
                iPhone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* visibility toggle (owner only) */}
      {!m.result && isOwner && (
        <div style={{padding:"7px 14px",borderBottom:"1px solid var(--bdr)",background:"var(--bg3)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:"var(--mu2)",fontWeight:600}}>Visibilidad:</span>
            {VIS_OPTS.map(v => {
              const sel = (m.visibility || "privado") === v.id;
              return (
                <div key={v.id} onClick={()=>save({...m, visibility:v.id, open:v.id!=="privado"})}
                  style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,cursor:"pointer",
                    background: sel ? "rgba(255,255,255,.05)" : "transparent",
                    border:"1px solid "+(sel ? v.color+"66" : "transparent"),
                    color: sel ? v.color : "var(--mu2)",
                    fontSize:11, fontWeight: sel ? 700 : 500}}>
                  {v.id==="privado"?"🔒":v.id==="amigos"?"👥":"🌐"} {v.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* join requests */}
      {m.requests && m.requests.length > 0 && isOwner && (
        <div style={{padding:"8px 14px",background:"rgba(167,139,250,.06)",borderBottom:"1px solid rgba(167,139,250,.18)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom: showReqs ? 10 : 0}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--pu)"}}>
              {"📬 "+m.requests.length+" solicitud"+(m.requests.length!==1?"es":"")+" para unirse"}
            </div>
            <button className="btn btn-pu btn-xs" onClick={()=>setShowReqs(p=>!p)}>
              {showReqs ? "Cerrar" : "Ver"}
            </button>
          </div>
          {showReqs && m.requests.map(req => (
            <div key={req.name} style={{marginBottom:10,padding:"10px 12px",background:"var(--bg3)",borderRadius:12,border:"1px solid var(--bdr)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <Av name={req.name} size="av-sm"/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>{req.name}</div>
                  <div style={{fontSize:11,color:"var(--mu2)"}}>{"Cat: "+(req.cat||"Sin especificar")}</div>
                </div>
                <button className="btn btn-ok btn-xs" onClick={()=>acceptReq(req.name)}>Aceptar</button>
                <button className="btn btn-rd btn-xs" onClick={()=>rejectReq(req.name)}>X</button>
              </div>
              {req.chat && req.chat.map((msg,ci) => (
                <div key={ci} className={"mw "+(msg.out?"mo":"mi")} style={{maxWidth:"90%",marginBottom:4}}>
                  <div className="mb" style={{fontSize:12}}>{msg.text}</div>
                </div>
              ))}
              <div style={{display:"flex",gap:6,marginTop:6}}>
                <input className="inp" style={{flex:1,fontSize:12,padding:"7px 10px"}}
                  placeholder={"Responder a "+req.name+"…"}
                  value={reqInp[req.name]||""}
                  onChange={e=>setReqInp(p=>({...p,[req.name]:e.target.value}))}
                  onKeyDown={e=>{ if(e.key==="Enter"){ sendToReq(req.name); }}}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* share card panel */}
      {showShare && m.result && (
        <div style={{padding:"12px 14px",borderBottom:"1px solid var(--bdr)",flexShrink:0,overflowY:"auto",maxHeight:"55vh"}}>
          <SharePanel match={m} />
        </div>
      )}

      {/* bet widget */}
      {m.bet && (
        <div style={{padding:"10px 14px",borderBottom:"1px solid var(--bdr)",flexShrink:0}}>
          <BetWidget bet={m.bet} me={ME.name} onMarkPaid={markPaid} onConfirm={confirmPaid}/>
        </div>
      )}

      {/* awaiting rival confirm */}
      {awaitRival && (
        <div style={{padding:"10px 14px",background:"rgba(77,166,255,.06)",borderBottom:"1px solid rgba(77,166,255,.18)",flexShrink:0}}>
          <div style={{fontSize:12,fontWeight:700,color:"var(--bl)",marginBottom:8}}>
            Esperando que el rival confirme el resultado
          </div>
          <button className="btn btn-bl btn-f btn-sm" onClick={rivalConfirm}>
            Simular: rival confirmo (demo)
          </button>
        </div>
      )}

      {/* verified */}
      {m.verifiedByBoth && (
        <div style={{padding:"9px 14px",background:"rgba(0,229,160,.07)",borderBottom:"1px solid rgba(0,229,160,.2)",flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,fontWeight:700,color:"var(--ac)"}}>Partido verificado · cupones 3er Tiempo activos hasta las 00:00</span>
        </div>
      )}

      {/* messages */}
      <div className="chat-msgs">
        {m.msgs.map(msg => {
          if (msg.special === "bet") return (
            <div key={msg.id} style={{background:"rgba(255,211,42,.07)",border:"1.5px solid rgba(255,211,42,.22)",borderRadius:14,padding:"12px 14px",alignSelf:"stretch"}}>
              <div style={{fontSize:11,color:"var(--gd)",fontWeight:700,marginBottom:6}}>💰 Propuesta de apuesta</div>
              <div style={{fontSize:16,fontWeight:700,color:"var(--gd)",marginBottom:10}}>{"Perdedor paga: "+msg.stake}</div>
              {!m.bet.payer && (
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-ok btn-f btn-sm" onClick={()=>acceptBet(msg.stake)}>Acepto</button>
                  <button className="btn btn-rd btn-f btn-sm">Rechazo</button>
                </div>
              )}
            </div>
          );
          if (msg.special === "result") return (
            <div key={msg.id} style={{textAlign:"center",padding:"6px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <span className="bdg b-ac">Partido registrado</span>
              {msg.bet && <div style={{fontSize:12,color:"var(--rd)",fontWeight:600}}>{"💸 "+msg.bet.payer+" debe "+msg.bet.what}</div>}
            </div>
          );
          return (
            <div key={msg.id} className={"mw "+(msg.out?"mo":"mi")}>
              {!msg.out && <div style={{fontSize:10,color:"var(--mu2)",marginBottom:3}}>{msg.from}</div>}
              <div className="mb">{msg.text}</div>
              <div className="mt">{msg.time}</div>
            </div>
          );
        })}
        <div ref={ref}/>
      </div>

      {/* input bar */}
      <div style={{padding:"10px 14px",borderTop:"1px solid var(--bdr)",display:"flex",gap:8,background:"var(--bg2)",flexShrink:0}}>
        {!m.result && m.teamB && m.teamB.length > 0 && !m.bet && (
          <button className="btn btn-gd btn-sm" onClick={()=>setShowBet(true)}>💰</button>
        )}
        <input className="inp" value={inp} onChange={e=>setInp(e.target.value)}
          placeholder="Mensaje…" onKeyDown={e=>e.key==="Enter"&&send()} style={{flex:1}}/>
        <button className="btn btn-p btn-sm" onClick={send} style={{padding:"10px 14px"}}>→</button>
      </div>

      {/* BET SHEET */}
      {showBet && (
        <div className="ov" onClick={()=>setShowBet(false)}>
          <div className="sheet su" onClick={e=>e.stopPropagation()}>
            <div className="sh-handle"/>
            <div className="sh-inner">
              <div style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:1,marginBottom:4}}>Apostar 💰</div>
              <p style={{fontSize:13,color:"var(--mu2)",marginBottom:16,lineHeight:1.5}}>
                La deuda queda registrada. El perdedor marca que pago y el ganador confirma.
              </p>
              <div className="pg" style={{marginBottom:14}}>
                <div className={"pill "+(betType==="coupon"?"on-gd":"")} onClick={()=>setBetType("coupon")}>Cupon de local</div>
                <div className={"pill "+(betType==="free"?"on":"")} onClick={()=>setBetType("free")}>Personalizada</div>
              </div>
              {betType==="coupon" && bars.map(b => (
                <div key={b.id} style={{marginBottom:14}}>
                  <div style={{fontWeight:700,color:b.color,fontSize:13,marginBottom:8}}>{b.emoji+" "+b.name+" · "+b.dist}</div>
                  {b.coupons.map(c => {
                    const sel = selCoupon && selCoupon.id === c.id;
                    return (
                      <div key={c.id} onClick={()=>setSelCoupon(c)}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderRadius:10,
                          border:"1.5px solid "+(sel?"rgba(255,211,42,.5)":"var(--bdr)"),
                          background:sel?"rgba(255,211,42,.05)":"var(--bg3)",
                          cursor:"pointer",marginBottom:6}}>
                        <span style={{fontSize:18}}>{c.icon}</span>
                        <span style={{flex:1,fontSize:13,fontWeight:sel?700:500,color:sel?"var(--gd)":"var(--tx)"}}>{c.label}</span>
                        {sel && <span style={{color:"var(--gd)",fontWeight:700,fontSize:16}}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
              {betType==="free" && (
                <input className="inp" placeholder="Ej: 1 schop en El Tonel" value={freeBet}
                  onChange={e=>setFreeBet(e.target.value)} style={{marginBottom:14}}/>
              )}
              <button className="btn btn-gd btn-f btn-lg" onClick={proposeBet}>Proponer apuesta</button>
            </div>
          </div>
        </div>
      )}

      {/* RESULT SHEET */}
      {showRes && (
        <div className="ov" onClick={()=>setShowRes(false)}>
          <div className="sheet su" onClick={e=>e.stopPropagation()}>
            <div className="sh-handle"/>
            <div className="sh-inner">
              <div style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:1,marginBottom:6}}>Resultado</div>
              <p style={{fontSize:12,color:"var(--mu2)",marginBottom:14,lineHeight:1.5}}>
                Registras tu version. El rival confirma desde su telefono. Solo cuando ambos confirmen se desbloquean los cupones.
              </p>
              {[["A",m.teamA],["B",m.teamB||[]]].filter(([,t])=>t.length>0).map(([side,team]) => (
                <div key={side} onClick={()=>setWinner(side)}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"14px 15px",borderRadius:12,
                    border:"1.5px solid "+(winner===side?"rgba(0,229,160,.45)":"var(--bdr)"),
                    background:winner===side?"rgba(0,229,160,.07)":"var(--bg3)",
                    cursor:"pointer",marginBottom:10}}>
                  <span style={{fontSize:20}}>🏆</span>
                  <div style={{flex:1,fontWeight:700,fontSize:14}}>{team.join(" + ")}</div>
                  {winner===side && <span style={{color:"var(--ac)",fontSize:18,fontWeight:700}}>✓</span>}
                </div>
              ))}
              {m.bet && (
                <div style={{background:"rgba(255,211,42,.05)",border:"1.5px solid rgba(255,211,42,.22)",borderRadius:10,padding:"11px 13px",marginBottom:14}}>
                  <div style={{fontSize:10,color:"var(--mu2)",marginBottom:2}}>DEUDA GENERADA</div>
                  <div style={{fontWeight:700,color:"var(--gd)"}}>{"Perdedor paga: "+m.bet.what}</div>
                </div>
              )}
              <button className="btn btn-p btn-f btn-lg" onClick={registerResult}>Registrar mi resultado</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NEW MATCH SHEET ─────────────────────────────────────────────────────────
function NewMatchSheet({ friends, bars, onSave, onClose }) {
  const [step,    setStep]    = useState(0);
  const [sport,   setSport]   = useState("padel");
  const [mode,    setMode]    = useState("2v2");
  const [club,    setClub]    = useState("");
  const [court,   setCourt]   = useState("");
  const [date,    setDate]    = useState("");
  const [time,    setTime]    = useState("");
  const [vis,     setVis]     = useState("privado");
  const [minCat,  setMinCat]  = useState("Cualquier nivel");
  const [tA,      setTA]      = useState([ME.name,""]);
  const [tB,      setTB]      = useState(["",""]);
  const [betType, setBetType] = useState("");
  const [selC,    setSelC]    = useState(null);
  const [freeBet, setFreeBet] = useState("");
  const betVal = betType==="coupon" ? (selC ? selC.stake : "") : betType==="free" ? freeBet : "";
  const isOpen = vis !== "privado";
  const withApp = friends.filter(f=>f.hasApp);
  const steps = ["Partido","Jugadores","Apuesta"];

  const create = () => {
    const ta = (mode==="2v2" ? tA.slice(0,2) : tA.slice(0,1)).filter(Boolean);
    const tb = isOpen ? [] : (mode==="2v2" ? tB.slice(0,2) : tB.slice(0,1)).filter(Boolean);
    onSave({
      id:Date.now(), sport, mode, club:club||"Sin club", court, date:date||"Hoy", time,
      visibility:vis, minCat: vis==="publico" ? minCat : null,
      teamA:ta, teamB:tb, open:isOpen, spots:isOpen?(mode==="2v2"?2:1):0,
      bet: betVal ? { what:betVal, status:"pending", payer:null, payee:null } : null,
      result:null, winner:null, confirmedBy:[], verifiedByBoth:false, requests:[],
      msgs:[{ id:1, from:ta[0]||"Tu",
        text: vis==="publico" ? "Partido publico! Solicita unirte"
            : vis==="amigos"  ? "Partido para amigos!"
            : "A jugar!", time:"ahora", out:false }],
    });
    onClose();
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet su" onClick={e=>e.stopPropagation()}>
        <div className="sh-handle"/>
        <div className="sh-inner">
          <div style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:1,marginBottom:14}}>Nuevo partido</div>
          <div className="step-bar" style={{marginBottom:20}}>
            {steps.map((s,i) => (
              <div key={s} style={{flex:1,display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
                <div className="step-seg" style={{background:i<=step?"var(--ac)":"var(--bg5)"}}/>
                <span style={{fontSize:9,fontWeight:700,color:i===step?"var(--ac)":"var(--mu)",letterSpacing:.5,textTransform:"uppercase"}}>{s}</span>
              </div>
            ))}
          </div>

          {/* Step 0 */}
          {step===0 && (
            <div className="fu">
              <span className="lbl">Deporte</span>
              <div className="pg" style={{marginBottom:14}}>
                {[["padel","Padel"],["tenis","Tenis"]].map(([v,l]) => (
                  <div key={v} className={"pill "+(sport===v?"on":"")} onClick={()=>setSport(v)}>{l}</div>
                ))}
              </div>
              <span className="lbl">Modalidad</span>
              <div className="pg" style={{marginBottom:14}}>
                {["1v1","2v2"].map(m => (
                  <div key={m} className={"pill "+(mode===m?"on":"")} onClick={()=>setMode(m)}>{m}</div>
                ))}
              </div>
              <span className="lbl">Club / Lugar *</span>
              <input className="inp" placeholder="Ej: Club Decima, Club Parque Urbano" value={club}
                onChange={e=>setClub(e.target.value)} style={{marginBottom:10}}/>
              <span className="lbl">Cancha (opcional)</span>
              <input className="inp" placeholder="Ej: Cancha 3" value={court}
                onChange={e=>setCourt(e.target.value)} style={{marginBottom:10}}/>
              <span className="lbl">Fecha</span>
              <input type="date" className="inp" value={date} onChange={e=>setDate(e.target.value)} style={{marginBottom:10}}/>
              <span className="lbl">Hora</span>
              <input type="time" className="inp" value={time} onChange={e=>setTime(e.target.value)} style={{marginBottom:18}}/>
              <button className="btn btn-p btn-f btn-lg"
                onClick={()=>{ if(!club.trim()){ alert("Ingresa el club o lugar"); return; } setStep(1); }}>
                Siguiente
              </button>
            </div>
          )}

          {/* Step 1 */}
          {step===1 && (
            <div className="fu">
              <span className="lbl">Visibilidad</span>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                {VIS_OPTS.map(v => {
                  const sel = vis === v.id;
                  return (
                    <div key={v.id} onClick={()=>setVis(v.id)}
                      style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:12,
                        border:"1.5px solid "+(sel ? v.color+"66" : "var(--bdr)"),
                        background: sel ? "rgba(0,0,0,.1)" : "var(--bg3)",
                        cursor:"pointer"}}>
                      <span style={{fontSize:22,marginTop:1}}>
                        {v.id==="privado"?"🔒":v.id==="amigos"?"👥":"🌐"}
                      </span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:14,color:sel?v.color:"var(--tx)",marginBottom:2}}>{v.label}</div>
                        <div style={{fontSize:12,color:"var(--mu2)",lineHeight:1.4}}>{v.desc}</div>
                        {v.id==="publico" && sel && (
                          <div style={{marginTop:9}}>
                            <div className="lbl" style={{marginBottom:6}}>Nivel minimo para unirse</div>
                            <div className="pg">
                              {CATS.map(c => (
                                <div key={c} onClick={e=>{ e.stopPropagation(); setMinCat(c); }}
                                  style={{padding:"4px 9px",borderRadius:14,fontSize:11,fontWeight:600,cursor:"pointer",
                                    background: minCat===c ? "rgba(0,229,160,.12)" : "var(--bg4)",
                                    color: minCat===c ? "var(--ac)" : "var(--mu2)",
                                    border:"1px solid "+(minCat===c ? "rgba(0,229,160,.35)" : "var(--bdr)")}}>
                                  {c}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,marginTop:2,
                        background: sel ? v.color : "var(--bg4)",
                        border:"1.5px solid "+(sel?v.color:"var(--bdr2)"),
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:11,color:sel?"#08090f":"transparent",fontWeight:700}}>✓</div>
                    </div>
                  );
                })}
              </div>

              <span className="lbl">Tu equipo (A)</span>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                {(mode==="2v2"?[0,1]:[0]).map(i => (
                  <select key={i} className="inp" value={tA[i]||""} onChange={e=>{ const t=[...tA]; t[i]=e.target.value; setTA(t); }}>
                    <option value="">{i===0?"Tu (obligatorio)":"— 2do jugador —"}</option>
                    <option value={ME.name}>{ME.name} (Yo)</option>
                    {withApp.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                  </select>
                ))}
              </div>

              {!isOpen && (
                <>
                  <span className="lbl">Equipo rival (B)</span>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                    {(mode==="2v2"?[0,1]:[0]).map(i => (
                      <select key={i} className="inp" value={tB[i]||""} onChange={e=>{ const t=[...tB]; t[i]=e.target.value; setTB(t); }}>
                        <option value="">— Selecciona rival —</option>
                        {withApp.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                      </select>
                    ))}
                  </div>
                </>
              )}

              {isOpen && (
                <div style={{background:"rgba(0,229,160,.05)",border:"1.5px solid rgba(0,229,160,.15)",borderRadius:11,padding:"10px 12px",marginBottom:14,fontSize:12,color:"var(--mu2)"}}>
                  {vis==="publico"
                    ? "Jugadores"+(minCat!=="Cualquier nivel"?" de nivel "+minCat+" o superior":"")+" podran solicitar unirse."
                    : "Tus amigos veran el partido y podran pedir unirse."}
                </div>
              )}

              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-g" onClick={()=>setStep(0)}>← Atras</button>
                <button className="btn btn-p" style={{flex:1}} onClick={()=>setStep(2)}>Siguiente</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step===2 && (
            <div className="fu">
              <span className="lbl">Apostamos? (opcional)</span>
              <div className="pg" style={{marginBottom:14}}>
                <div className={"pill "+(betType===""?"on":"")} onClick={()=>setBetType("")}>Sin apuesta</div>
                <div className={"pill "+(betType==="coupon"?"on-gd":"")} onClick={()=>setBetType("coupon")}>Cupon</div>
                <div className={"pill "+(betType==="free"?"on":"")} onClick={()=>setBetType("free")}>Personalizada</div>
              </div>

              {betType==="coupon" && bars.map(b => (
                <div key={b.id} style={{marginBottom:12}}>
                  <div style={{fontWeight:700,color:b.color,fontSize:13,marginBottom:7}}>{b.emoji+" "+b.name+" · "+b.dist}</div>
                  {b.coupons.map(c => {
                    const sel = selC && selC.id === c.id;
                    return (
                      <div key={c.id} onClick={()=>setSelC(c)}
                        style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",borderRadius:10,
                          border:"1.5px solid "+(sel?"rgba(255,211,42,.5)":"var(--bdr)"),
                          background:sel?"rgba(255,211,42,.05)":"var(--bg3)",
                          cursor:"pointer",marginBottom:5}}>
                        <span style={{fontSize:16}}>{c.icon}</span>
                        <span style={{flex:1,fontSize:13,fontWeight:sel?700:500,color:sel?"var(--gd)":"var(--tx)"}}>{c.label}</span>
                        {sel && <span style={{color:"var(--gd)",fontWeight:700}}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              ))}

              {betType==="free" && (
                <input className="inp" placeholder="Ej: 1 schop en El Tonel" value={freeBet}
                  onChange={e=>setFreeBet(e.target.value)} style={{marginBottom:14}}/>
              )}

              {betVal && (
                <div style={{background:"rgba(255,211,42,.07)",border:"1.5px solid rgba(255,211,42,.28)",borderRadius:11,padding:"12px 14px",marginBottom:14}}>
                  <div className="lbl" style={{marginBottom:2}}>APUESTA</div>
                  <div style={{fontWeight:700,fontSize:15,color:"var(--gd)"}}>{"Perdedor paga: "+betVal}</div>
                </div>
              )}

              <div style={{display:"flex",gap:8,marginTop:4}}>
                <button className="btn btn-g" onClick={()=>setStep(1)}>← Atras</button>
                <button className="btn btn-p btn-lg" style={{flex:1}} onClick={create}>Crear partido!</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: INICIO ───────────────────────────────────────────────────────────
function Inicio({ friends, matches, past, onOpenMatch, onNew }) {
  const myActive  = matches.filter(m => m.teamA.includes(ME.name) || (m.teamB && m.teamB.includes(ME.name)));
  const openOther = matches.filter(m => m.open && !m.result && !m.teamA.includes(ME.name));
  const myDebts   = matches.filter(m => m.bet && m.bet.payer===ME.name && m.bet.status!=="paid");
  const myCredit  = matches.filter(m => m.bet && m.bet.payee===ME.name && m.bet.status!=="paid");
  const pendConf  = matches.filter(m => m.result && !m.verifiedByBoth && (m.teamA.includes(ME.name)||(m.teamB&&m.teamB.includes(ME.name))) && !m.confirmedBy.includes(ME.name));
  const wins      = past.filter(m => (m.teamA.includes(ME.name)&&m.winner==="A")||(m.teamB&&m.teamB.includes(ME.name)&&m.winner==="B")).length;

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">TieBreak</div>
          <div style={{fontSize:12,color:"var(--mu2)"}}>{ME.name+" "+ME.emoji}</div>
        </div>
        <button className="btn btn-p" onClick={onNew} style={{gap:5}}>+ Partido</button>
      </div>
      <div className="inner">

        {/* stats */}
        <div className="card card-ac fu" style={{marginBottom:14}}>
          <div style={{padding:"13px 14px"}}>
            <div style={{display:"flex",gap:10}}>
              {[
                { v:wins,          l:"Victorias",c:"var(--ac)"  },
                { v:myDebts.length,l:"Debo",     c:myDebts.length>0?"var(--rd)":"var(--ac)" },
                { v:myCredit.length,l:"Me deben",c:myCredit.length>0?"var(--gd)":"var(--mu2)" },
              ].map((s,i) => (
                <div key={i} style={{flex:1,textAlign:"center",padding:"8px 4px",background:"rgba(0,0,0,.2)",borderRadius:10}}>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:s.c,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:10,color:"var(--mu2)",marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* alerts */}
        {pendConf.length > 0 && (
          <div className="fu" style={{background:"rgba(77,166,255,.08)",border:"1.5px solid rgba(77,166,255,.22)",borderRadius:14,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}
            onClick={()=>onOpenMatch(pendConf[0])}>
            <span style={{fontSize:22}}>📲</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:"var(--bl)",fontSize:13}}>Confirmar resultado pendiente</div>
              <div style={{fontSize:12,color:"var(--mu2)"}}>{pendConf[0].teamA.join("+")+" vs "+(pendConf[0].teamB||[]).join("+")}</div>
            </div>
            <span style={{color:"var(--bl)"}}>→</span>
          </div>
        )}

        {myDebts.length > 0 && (
          <div className="fu" style={{background:"rgba(255,71,87,.07)",border:"1.5px solid rgba(255,71,87,.2)",borderRadius:14,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>💸</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:"var(--rd)",fontSize:13}}>{"Tienes "+myDebts.length+" deuda"+(myDebts.length!==1?"s":"")+" pendiente"+(myDebts.length!==1?"s":"")}</div>
              <div style={{fontSize:12,color:"var(--mu2)"}}>{myDebts.map(m=>m.bet.what).join(" · ")}</div>
            </div>
          </div>
        )}

        {myCredit.length > 0 && (
          <div className="fu" style={{background:"rgba(0,229,160,.06)",border:"1.5px solid rgba(0,229,160,.18)",borderRadius:14,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>🤑</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:"var(--ac)",fontSize:13}}>{"Te deben "+myCredit.length+" apuesta"+(myCredit.length!==1?"s":"")}</div>
              <div style={{fontSize:12,color:"var(--mu2)"}}>{myCredit.map(m=>m.bet.payer+": "+m.bet.what).join(" · ")}</div>
            </div>
          </div>
        )}

        {/* active matches */}
        {myActive.length > 0 && (
          <>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:17,letterSpacing:1,marginBottom:10}}>Mis partidos activos</div>
            {myActive.map((m,i) => (
              <div key={m.id} className="mc fu"
                style={{animationDelay:i*.05+"s",
                  borderColor: m.bet&&m.bet.status==="pending" ? "rgba(255,71,87,.3)" : m.open ? "rgba(0,229,160,.25)" : "var(--bdr)"}}
                onClick={()=>onOpenMatch(m)}>
                <div className="mc-h">
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    {m.open && <span className="dot"/>}
                    <span style={{fontSize:11,color:"var(--mu2)"}}>{m.club+" · "+m.date+" "+m.time}</span>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    {m.open && <span className="bdg b-ac">Abierto</span>}
                    {m.bet && <span className={"bdg "+(m.bet.status==="paid"?"b-ac":m.bet.status==="pending"?"b-rd":"b-gd")}>
                      {m.bet.status==="paid"?"✓ Pagado":m.bet.status==="waiting"?"⏳":"💸"}
                    </span>}
                    {m.requests && m.requests.length > 0 && <span className="bdg b-or">{"📬 "+m.requests.length}</span>}
                  </div>
                </div>
                <div className="mc-b">
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{flex:1,fontWeight:700,fontSize:14}}>{m.teamA.join("+")}</span>
                    <span style={{fontFamily:"'Bebas Neue'",fontSize:15,color:"var(--mu2)"}}>VS</span>
                    <span style={{flex:1,textAlign:"right",fontWeight:700,fontSize:14,color:m.teamB&&m.teamB.length?"var(--tx)":"var(--mu2)"}}>
                      {m.teamB && m.teamB.length ? m.teamB.join("+") : "Buscando rival…"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* open matches from others */}
        {openOther.length > 0 && (
          <>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:17,letterSpacing:1,marginBottom:10,marginTop:4}}>Partidos abiertos de amigos</div>
            {openOther.map(m => (
              <div key={m.id} className="mc fu" style={{borderColor:"rgba(0,229,160,.22)"}} onClick={()=>onOpenMatch(m)}>
                <div className="mc-h">
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <span className="dot"/>
                    <span style={{fontSize:12,color:"var(--ac)",fontWeight:600}}>{m.date+" "+m.time+" · "+m.club}</span>
                  </div>
                  <span className="bdg b-mu">{m.sport}</span>
                </div>
                <div className="mc-b">
                  <div style={{fontWeight:700,fontSize:14,color:"var(--ac)",marginBottom:4}}>{m.teamA.join("+")+" "}<span style={{color:"var(--mu2)",fontWeight:400}}>busca rival</span></div>
                  {m.visibility==="publico" && m.minCat && m.minCat!=="Cualquier nivel" && <div style={{fontSize:11,color:"var(--mu2)"}}>{"Nivel min: "+m.minCat}</div>}
                </div>
              </div>
            ))}
          </>
        )}

        {/* past */}
        {past.length > 0 && (
          <>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:17,letterSpacing:1,marginBottom:10,marginTop:4}}>Historial</div>
            {past.slice(0,3).map((m,i) => (
              <div key={m.id} className="mc fu" style={{animationDelay:i*.05+"s"}}>
                <div className="mc-h">
                  <span style={{fontSize:11,color:"var(--mu2)"}}>{m.club+" · "+m.date+" · "+m.sport}</span>
                  {m.bet && <span className={"bdg "+(m.bet.status==="paid"?"b-ac":"b-rd")}>{m.bet.status==="paid"?"✓ Pagado":"💸 Deuda"}</span>}
                </div>
                <div className="mc-b">
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{flex:1,fontWeight:700,color:m.winner==="A"?"var(--ac)":"var(--mu2)"}}>{m.teamA.join("+")}</span>
                    <span style={{fontFamily:"'Bebas Neue'",fontSize:16,color:"var(--ac)"}}>{m.result}</span>
                    <span style={{flex:1,textAlign:"right",fontWeight:700,color:m.winner==="B"?"var(--ac)":"var(--mu2)"}}>{(m.teamB||[]).join("+")}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: AMIGOS ───────────────────────────────────────────────────────────
function Amigos({ friends, setFriends, onChallenge }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search,  setSearch]  = useState("");
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [emoji,   setEmoji]   = useState("🎾");
  const EMOJIS = ["🎾","💪","🧠","🦁","🚀","😤","🔥","⚡","🎯","👑","😈","🌊"];
  const filtered = friends.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const addFriend = () => {
    if (!name.trim()) return;
    setFriends(p => [...p, { id:Date.now(), name:name.trim(), emoji, phone:phone||"", hasApp:false, streak:0 }]);
    setName(""); setPhone(""); setEmoji("🎾"); setShowAdd(false);
  };

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-title">Amigos</div>
        <button className="btn btn-p btn-sm" onClick={()=>setShowAdd(true)}>+ Agregar</button>
      </div>
      <div className="inner" style={{paddingTop:0}}>
        <input className="inp" placeholder="Buscar por nombre…" value={search}
          onChange={e=>setSearch(e.target.value)} style={{marginBottom:16}}/>

        <div style={{fontFamily:"'Bebas Neue'",fontSize:16,letterSpacing:1,marginBottom:10,color:"var(--ac)"}}>
          {"En TieBreak · "+filtered.filter(f=>f.hasApp).length}
        </div>
        <div className="card fu" style={{marginBottom:18}}>
          {filtered.filter(f=>f.hasApp).length===0
            ? <div style={{textAlign:"center",padding:"20px 0",color:"var(--mu2)",fontSize:13}}>Sin amigos con la app aun</div>
            : filtered.filter(f=>f.hasApp).map(f => (
              <div key={f.id} className="fr">
                <div style={{position:"relative"}}>
                  <Av name={f.name} size="av-md"/>
                  <span style={{position:"absolute",bottom:-2,right:-4,fontSize:13}}>{f.emoji}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{f.name}</div>
                  <div style={{fontSize:11,color:f.streak>0?"var(--ac)":f.streak<0?"var(--rd)":"var(--mu2)",marginTop:1}}>
                    {f.streak!==0 ? (f.streak>0?"🔥 "+f.streak:"❄️ "+Math.abs(f.streak))+" seguidas" : "Sin partidos recientes"}
                  </div>
                </div>
                <button className="btn btn-p btn-xs" onClick={()=>onChallenge(f)}>Desafiar</button>
              </div>
            ))
          }
        </div>

        {filtered.filter(f=>!f.hasApp).length > 0 && (
          <>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:16,letterSpacing:1,marginBottom:10,color:"var(--mu2)"}}>
              {"Sin la app · "+filtered.filter(f=>!f.hasApp).length}
            </div>
            <div className="card fu">
              {filtered.filter(f=>!f.hasApp).map(f => (
                <div key={f.id} className="fr">
                  <Av name={f.name} size="av-md"/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:14,color:"var(--mu2)"}}>{f.name+" "+f.emoji}</div>
                    <div style={{fontSize:11,color:"var(--mu)"}}>{f.phone||"Sin numero"}</div>
                  </div>
                  <button className="btn btn-g btn-xs" onClick={()=>alert("Compartir invitacion con "+f.name)}>Invitar</button>
                </div>
              ))}
            </div>
          </>
        )}

        {showAdd && (
          <div className="ov" onClick={()=>setShowAdd(false)}>
            <div className="sheet su" onClick={e=>e.stopPropagation()}>
              <div className="sh-handle"/>
              <div className="sh-inner">
                <div style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:1,marginBottom:16}}>Agregar amigo</div>
                <span className="lbl">Nombre</span>
                <input className="inp" placeholder="Nombre del jugador" value={name}
                  onChange={e=>setName(e.target.value)} style={{marginBottom:12}}
                  onKeyDown={e=>e.key==="Enter"&&addFriend()}/>
                <span className="lbl">Telefono (opcional)</span>
                <input className="inp" placeholder="+56 9 XXXX XXXX" value={phone}
                  onChange={e=>setPhone(e.target.value)} style={{marginBottom:14}}/>
                <span className="lbl">Emoji</span>
                <div className="pg" style={{marginBottom:18}}>
                  {EMOJIS.map(em => (
                    <div key={em} className={"pill "+(emoji===em?"on":"")} style={{fontSize:20,padding:"5px 10px"}} onClick={()=>setEmoji(em)}>{em}</div>
                  ))}
                </div>
                <button className="btn btn-p btn-f btn-lg" onClick={addFriend}>Agregar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: 3er TIEMPO ──────────────────────────────────────────────────────
function TercerTiempo({ bars, matches }) {
  const [activated, setActivated] = useState({});
  const [demoOn,    setDemoOn]    = useState(false);
  const verified = matches.filter(m =>
    (m.teamA.includes(ME.name)||(m.teamB&&m.teamB.includes(ME.name))) && m.verifiedByBoth
  );
  const DEMO_HOUR = 20, DEMO_MIN = 30;
  const inWindow = verified.some(m => {
    const h = m.time ? parseInt(m.time.split(":")[0]) : null;
    return h !== null && DEMO_HOUR >= h+1 && DEMO_HOUR <= 23;
  });
  const unlocked = demoOn || inWindow;
  const myDebts  = matches.filter(m => m.bet && m.bet.payer===ME.name && m.bet.status!=="paid");

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">3er Tiempo</div>
          <div style={{fontSize:11,color:"var(--mu2)"}}>Descuentos para despues del partido</div>
        </div>
      </div>
      <div className="inner" style={{paddingTop:4}}>

        <div style={{background: unlocked?"rgba(0,229,160,.07)":"rgba(255,128,66,.06)",
          border:"1.5px solid "+(unlocked?"rgba(0,229,160,.25)":"rgba(255,128,66,.22)"),
          borderRadius:14, padding:"13px 15px", marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>{unlocked?"🍺":"🔒"}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:unlocked?"var(--ac)":"var(--or)"}}>
                {unlocked ? "Cupones activos" : "Cupones bloqueados"}
              </div>
              <div style={{fontSize:12,color:"var(--mu2)",marginTop:2}}>
                {unlocked
                  ? "Validos hasta las 00:00 · "+DEMO_HOUR+":"+String(DEMO_MIN).padStart(2,"0")+" ahora"
                  : "Juega y registra un partido hoy para desbloquear"}
              </div>
            </div>
            {!unlocked && (
              <button className="btn btn-ok btn-sm" onClick={()=>setDemoOn(true)}>Demo</button>
            )}
          </div>
          {unlocked && (
            <div style={{marginTop:10,padding:"8px 10px",background:"rgba(0,229,160,.08)",borderRadius:9,fontSize:11,color:"var(--mu2)"}}>
              Ambos equipos confirmaron el partido · ventana activa
            </div>
          )}
        </div>

        {!unlocked && (
          <div className="card fu" style={{marginBottom:16}}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>Para desbloquear hoy</div>
            {[
              { done:true,  label:"Crear partido en la app" },
              { done:false, label:"Registrar resultado" },
              { done:false, label:"Rival confirma el resultado" },
              { done:false, label:"Ventana horaria activa (fin partido → 00:00)" },
            ].map((s,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid var(--bdr)"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:s.done?"rgba(0,229,160,.15)":"var(--bg4)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,color:s.done?"var(--ac)":"var(--mu2)"}}>
                  {s.done?"✓":i+1}
                </div>
                <span style={{fontSize:13,color:s.done?"var(--mu2)":"var(--tx)",textDecoration:s.done?"line-through":"none"}}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {myDebts.length > 0 && (
          <div className="card card-rd fu" style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <span style={{fontSize:22}}>💸</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:"var(--rd)"}}>Tienes deudas — usa un cupon para pagar!</div>
              <div style={{fontSize:12,color:"var(--mu2)"}}>{myDebts.map(m=>m.bet.what).join(" · ")}</div>
            </div>
          </div>
        )}

        {bars.map((b,bi) => (
          <div key={b.id} className="card fu" style={{animationDelay:bi*.07+"s",padding:0,overflow:"hidden",marginBottom:14}}>
            <div style={{padding:"12px 14px",background:b.color+"14",borderBottom:"1px solid var(--bdr)",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:24}}>{b.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:b.color}}>{b.name}</div>
                <div style={{fontSize:11,color:"var(--mu2)"}}>{b.dist+" de distancia"}</div>
              </div>
              {!unlocked && <span style={{fontSize:18}}>🔒</span>}
            </div>
            <div style={{padding:"10px 14px 14px"}}>
              {b.coupons.map(c => {
                const key = b.id+"-"+c.id;
                const act = activated[key];
                return (
                  <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid var(--bdr)"}}>
                    <span style={{fontSize:18,opacity:unlocked?1:.4}}>{c.icon}</span>
                    <span style={{flex:1,fontSize:13,fontWeight:500,color:unlocked?"var(--tx)":"var(--mu)"}}>{c.label}</span>
                    {!unlocked
                      ? <span style={{fontSize:12,color:"var(--mu)"}}>🔒</span>
                      : act
                        ? <div className="cpn"><div style={{fontSize:7,color:"var(--mu2)"}}>CUPON · 1 USO</div><div className="cc">{"TB"+b.id+c.id.toUpperCase()}</div><div style={{fontSize:8,color:"var(--mu2)",marginTop:1}}>hasta 00:00</div></div>
                        : <button className="btn btn-ok btn-sm" onClick={()=>setActivated(p=>({...p,[key]:true}))}>Activar</button>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{textAlign:"center",fontSize:12,color:"var(--mu2)",paddingBottom:8}}>
          {"¿Tu local quiere sumarse? "}
          <button className="btn btn-g btn-xs" style={{marginLeft:6}} onClick={()=>alert("Gracias! Te contactamos pronto.")}>Proponer</button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: CANCHAS ─────────────────────────────────────────────────────────
function Canchas({ onSelectCourt }) {
  const [sport,     setSport]     = useState("todos");
  const [dateVal,   setDateVal]   = useState("");
  const [dateLabel, setDateLabel] = useState("Hoy");
  const [timeFrom,  setTimeFrom]  = useState("08:00");
  const [timeTo,    setTimeTo]    = useState("22:00");
  const [maxDist,   setMaxDist]   = useState(5);
  const [favs,      setFavs]      = useState([]);
  const [showFavs,  setShowFavs]  = useState(false);
  const [expanded,  setExpanded]  = useState(null);

  const handleDate = e => {
    const v = e.target.value;
    setDateVal(v);
    if (!v) { setDateLabel("Hoy"); return; }
    const d     = new Date(v+"T12:00:00");
    const today = new Date(); today.setHours(12,0,0,0);
    const tom   = new Date(today); tom.setDate(tom.getDate()+1);
    if (d.getTime()===today.getTime())     setDateLabel("Hoy");
    else if (d.getTime()===tom.getTime())  setDateLabel("Manana");
    else setDateLabel(d.toLocaleDateString("es-CL",{weekday:"short",day:"numeric",month:"short"}));
  };

  const toggleFav = id => setFavs(p => p.includes(id) ? p.filter(x=>x!==id) : p.length<3 ? [...p,id] : p);

  const matchDate = slotDate => {
    if (dateLabel==="Hoy")    return slotDate==="Hoy";
    if (dateLabel==="Manana") return slotDate==="Manana";
    return slotDate==="Sab";
  };

  const getSlots = club => club.slots.filter(s => {
    if (!matchDate(s.date)) return false;
    const sm = toMin(s.time);
    return sm >= toMin(timeFrom) && sm <= toMin(timeTo);
  });

  const filtered = CLUBS_MOCK.filter(c => {
    if (sport!=="todos" && c.sport!==sport) return false;
    if (c.dist > maxDist) return false;
    if (favs.length>0 && !favs.includes(c.id)) return false;
    return getSlots(c).some(s=>s.available);
  });

  const totalAvail = filtered.reduce((a,c) => a+getSlots(c).filter(s=>s.available).length, 0);

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-title">Buscar cancha</div>
          <div style={{fontSize:11,color:totalAvail>0?"var(--ac)":"var(--mu2)"}}>
            {totalAvail>0 ? totalAvail+" horario"+(totalAvail!==1?"s":"")+" disponibles" : "Sin disponibilidad — ajusta filtros"}
          </div>
        </div>
      </div>
      <div className="inner" style={{paddingTop:4}}>

        {/* sport */}
        <div className="pg" style={{marginBottom:14}}>
          {[["todos","Todos"],["padel","Padel"],["tenis","Tenis"]].map(([v,l]) => (
            <div key={v} className={"pill "+(sport===v?"on":"")} onClick={()=>setSport(v)}>{l}</div>
          ))}
        </div>

        {/* date */}
        <span className="lbl">Fecha</span>
        <div style={{position:"relative",marginBottom:14}}>
          <input type="date" className="inp" value={dateVal} onChange={handleDate} style={{paddingLeft:36}}/>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none"}}>📅</span>
          {dateVal && <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:12,fontWeight:700,color:"var(--ac)",pointerEvents:"none"}}>{dateLabel}</span>}
        </div>

        {/* time range */}
        <span className="lbl">{"Franja horaria · "+timeFrom+" — "+timeTo}</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          <div>
            <div style={{fontSize:10,color:"var(--mu2)",marginBottom:4}}>Desde</div>
            <input type="time" className="inp" value={timeFrom} onChange={e=>setTimeFrom(e.target.value)}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"var(--mu2)",marginBottom:4}}>Hasta</div>
            <input type="time" className="inp" value={timeTo} onChange={e=>setTimeTo(e.target.value)}/>
          </div>
        </div>

        {/* distance */}
        <span className="lbl">{"Distancia maxima · "+maxDist+" km"}</span>
        <div style={{padding:"4px 2px 14px"}}>
          <input type="range" min={1} max={10} step={0.5} value={maxDist}
            onChange={e=>setMaxDist(Number(e.target.value))}
            style={{width:"100%",accentColor:"var(--ac)",cursor:"pointer"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--mu2)",marginTop:4}}>
            <span>1 km</span><span>5 km</span><span>10 km</span>
          </div>
        </div>

        {/* favs */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <span className="lbl" style={{margin:0}}>
            {"Clubs favoritos"+(favs.length>0?" · "+favs.length+"/3":"")}
          </span>
          <button className="btn btn-g btn-xs" onClick={()=>setShowFavs(p=>!p)}>
            {showFavs?"Cerrar":"Elegir"}
          </button>
        </div>
        {showFavs && (
          <div className="card fu" style={{marginBottom:14,padding:0,overflow:"hidden"}}>
            {CLUBS_MOCK.map(c => {
              const sel = favs.includes(c.id);
              const disabled = !sel && favs.length >= 3;
              return (
                <div key={c.id} onClick={()=>!disabled&&toggleFav(c.id)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",
                    borderTop:"1px solid var(--bdr)",cursor:disabled?"not-allowed":"pointer",
                    opacity:disabled?.45:1, background:sel?"rgba(0,229,160,.05)":"transparent"}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13,color:sel?"var(--ac)":"var(--tx)"}}>{c.name}</div>
                    <div style={{fontSize:11,color:"var(--mu2)"}}>{c.dist+" km · "+c.sport}</div>
                  </div>
                  <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                    background:sel?"var(--ac)":"var(--bg4)",
                    border:"1.5px solid "+(sel?"var(--ac)":"var(--bdr2)"),
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,color:sel?"#08090f":"var(--mu2)",fontWeight:700}}>
                    {sel?"✓":""}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {favs.length>0 && !showFavs && (
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {favs.map(id => {
              const c = CLUBS_MOCK.find(x=>x.id===id);
              return c ? (
                <div key={id} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
                  background:"rgba(0,229,160,.08)",border:"1px solid rgba(0,229,160,.25)",
                  borderRadius:20,fontSize:12,color:"var(--ac)",fontWeight:600}}>
                  {"⭐ "+c.name}
                  <span style={{cursor:"pointer",opacity:.6,marginLeft:2}} onClick={()=>toggleFav(id)}>✕</span>
                </div>
              ) : null;
            })}
          </div>
        )}

        <div style={{fontSize:11,color:"var(--mu2)",background:"var(--bg3)",borderRadius:10,padding:"9px 12px",marginBottom:16,lineHeight:1.5}}>
          Disponibilidad simulada. Reservar abre la app del club para pagar directo.
        </div>

        {/* results */}
        {filtered.length===0
          ? <div style={{textAlign:"center",padding:"36px 20px",color:"var(--mu2)"}}>
              <div style={{fontSize:36,marginBottom:10}}>🔍</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:5}}>Sin canchas disponibles</div>
              <div style={{fontSize:12}}>Amplia la franja horaria, distancia o cambia la fecha</div>
            </div>
          : filtered.map((club,ci) => {
            const slots   = getSlots(club);
            const avail   = slots.filter(s=>s.available);
            const isExp   = expanded===club.id;
            const isFav   = favs.includes(club.id);
            return (
              <div key={club.id} className="card fu"
                style={{animationDelay:ci*.06+"s",padding:0,overflow:"hidden",marginBottom:14,
                  borderColor: isFav?"rgba(0,229,160,.3)":"var(--bdr)"}}>
                <div style={{padding:"13px 14px",cursor:"pointer"}} onClick={()=>setExpanded(isExp?null:club.id)}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:11}}>
                    <div style={{width:44,height:44,borderRadius:11,background:"var(--bg3)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                      🎾
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                        <span style={{fontWeight:700,fontSize:14}}>{club.name}</span>
                        {isFav && <span style={{fontSize:10,color:"var(--ac)",fontWeight:700}}>FAV</span>}
                      </div>
                      <div style={{fontSize:11,color:"var(--mu2)",marginBottom:5}}>{"📍 "+club.addr+" · "+club.dist+" km"}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span style={{fontSize:11,color:"var(--gd)",fontWeight:600}}>{"★ "+club.rating}</span>
                        <span style={{fontSize:10,color:"var(--mu2)"}}>{" ("+club.reviews+")"}</span>
                        <span className={"bdg "+(avail.length>0?"b-ac":"b-mu")} style={{fontSize:10}}>
                          {avail.length>0 ? avail.length+" libre"+(avail.length!==1?"s":"") : "Sin disp."}
                        </span>
                      </div>
                    </div>
                    <span style={{fontSize:16,color:"var(--mu2)",marginTop:4}}>{isExp?"▲":"▼"}</span>
                  </div>
                  <div style={{display:"flex",gap:5,marginTop:9,flexWrap:"wrap"}}>
                    {club.courts.map((c,ci2) => (
                      <span key={ci2} style={{fontSize:10,padding:"2px 7px",background:"var(--bg3)",borderRadius:5,color:"var(--mu2)"}}>{c}</span>
                    ))}
                  </div>
                </div>

                {isExp && (
                  <div style={{borderTop:"1px solid var(--bdr)",padding:"12px 14px",background:"var(--bg3)"}}>
                    <div className="lbl" style={{marginBottom:10}}>{"Horarios · "+dateLabel+" · "+timeFrom+"–"+timeTo}</div>
                    {slots.length===0
                      ? <div style={{textAlign:"center",padding:"12px 0",fontSize:12,color:"var(--mu2)"}}>Sin horarios en esta franja</div>
                      : slots.map((slot,si) => {
                        const pi = PLT[slot.platform];
                        return (
                          <div key={si} style={{display:"flex",alignItems:"center",gap:11,
                            padding:"10px 12px",borderRadius:11,marginBottom:8,
                            background:slot.available?"var(--bg2)":"var(--bg4)",
                            border:"1.5px solid "+(slot.available?"var(--bdr2)":"var(--bdr)"),
                            opacity:slot.available?1:.45}}>
                            <div style={{flexShrink:0,minWidth:48}}>
                              <div style={{fontFamily:"'Bebas Neue'",fontSize:21,color:slot.available?"var(--ac)":"var(--mu2)",lineHeight:1}}>{slot.time}</div>
                              <div style={{fontSize:9,color:"var(--mu2)"}}>60 min</div>
                            </div>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:700,fontSize:13}}>{"$"+slot.price.toLocaleString("es-CL")}</div>
                              <div style={{fontSize:10,fontWeight:700,color:pi?pi.color:"var(--mu2)",marginTop:1}}>
                                {pi ? pi.label : slot.platform}
                              </div>
                            </div>
                            {slot.available
                              ? <div style={{display:"flex",gap:6,flexShrink:0}}>
                                  <button className="btn btn-p btn-sm" style={{fontSize:12}}
                                    onClick={()=>window.open(slot.url,"_blank")}>
                                    Reservar →
                                  </button>
                                  {onSelectCourt && (
                                    <button className="btn btn-g btn-xs" style={{fontSize:11}}
                                      onClick={()=>onSelectCourt({ club:club.name, court:club.courts[0]||"", time:slot.time, date:dateLabel })}>
                                      + Partido
                                    </button>
                                  )}
                                </div>
                              : <span style={{fontSize:11,color:"var(--mu)",padding:"4px 9px",background:"var(--bg5)",borderRadius:7}}>Ocupado</span>
                            }
                          </div>
                        );
                      })
                    }
                  </div>
                )}
              </div>
            );
          })
        }

        <div style={{textAlign:"center",fontSize:11,color:"var(--mu2)",paddingBottom:8}}>
          Tu club no aparece? Integra con Playtomic, Matchpoint, Vola o EasyCancha.
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,     setTab]     = useState("inicio");
  const [friends, setFriends] = useState(FRIENDS_INIT);
  const [matches, setMatches] = useState(MATCHES_INIT);
  const [past,    setPast]    = useState(PAST_INIT);
  const [activeMatch, setActiveMatch] = useState(null);
  const [showNew, setShowNew] = useState(false);

  const pendDebts  = matches.filter(m=>m.bet&&m.bet.payer===ME.name&&m.bet.status==="pending").length;
  const pendConf   = matches.filter(m=>m.result&&!m.verifiedByBoth&&(m.teamA.includes(ME.name)||(m.teamB&&m.teamB.includes(ME.name)))&&!m.confirmedBy.includes(ME.name)).length;

  const updateMatch = upd => {
    if (upd.result && upd.verifiedByBoth) {
      setMatches(p => p.filter(m=>m.id!==upd.id));
      setPast(p => [upd,...p]);
    } else {
      setMatches(p => p.map(m=>m.id===upd.id?upd:m));
    }
  };

  const saveMatch = m => { setMatches(p=>[m,...p]); setActiveMatch(m); };

  const NAV = [
    { id:"inicio",  ic:"🏠", lb:"Inicio",  bdg:pendDebts+pendConf },
    { id:"canchas", ic:"🔍", lb:"Canchas"  },
    { id:"amigos",  ic:"👥", lb:"Amigos"   },
    { id:"tercer",  ic:"🍺", lb:"3er Tiempo"},
  ];

  if (activeMatch) return (
    <>
      <style>{css}</style>
      <div className="app">
        <MatchDetail
          match={activeMatch}
          friends={friends}
          bars={BARS}
          past={past}
          onBack={()=>setActiveMatch(null)}
          onUpdate={upd=>{ updateMatch(upd); setActiveMatch(upd); }}
        />
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {tab==="inicio"  && <Inicio friends={friends} matches={matches} past={past} onOpenMatch={m=>setActiveMatch(m)} onNew={()=>setShowNew(true)}/>}
        {tab==="canchas" && <Canchas onSelectCourt={()=>setShowNew(true)}/>}
        {tab==="amigos"  && <Amigos friends={friends} setFriends={setFriends} onChallenge={()=>setShowNew(true)}/>}
        {tab==="tercer"  && <TercerTiempo bars={BARS} matches={matches}/>}
        <div className="bnav">
          {NAV.map(n => (
            <div key={n.id} className={"ni "+(tab===n.id?"on":"")} onClick={()=>setTab(n.id)}>
              <div className="ni-w">
                <span className="ni-ic">{n.ic}</span>
                {n.bdg > 0 && <span className="nbdg">{n.bdg}</span>}
              </div>
              <span className="ni-lb">{n.lb}</span>
            </div>
          ))}
        </div>
      </div>
      {showNew && <NewMatchSheet friends={friends} bars={BARS} onSave={saveMatch} onClose={()=>setShowNew(false)}/>}
    </>
  );
}
