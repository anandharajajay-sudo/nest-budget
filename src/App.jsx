import { useState, useEffect } from "react";

// ─── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "nest-budget-v2";
const loadData  = () => { try { const r=localStorage.getItem(STORAGE_KEY); return r?JSON.parse(r):null; } catch{return null;} };
const saveData  = d  => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch{} };

// ─── Theme ────────────────────────────────────────────────────────────────────
const T={bg:"#F2F1ED",surface:"#FFFFFF",nav:"#1E3929",home:"#4C7EBE",abroad:"#C0573A",text:"#18181B",sub:"#3F3F46",muted:"#71717A",border:"#E4E0D9",success:"#15803D",danger:"#B91C1C",warning:"#B45309",brass:"#A07840"};

// ─── Constants ────────────────────────────────────────────────────────────────
const CATS=[{id:"housing",label:"Housing",icon:"🏠"},{id:"utilities",label:"Utilities",icon:"⚡"},{id:"subscriptions",label:"Subscriptions",icon:"📺"},{id:"health",label:"Health",icon:"💊"},{id:"pet",label:"Pet Care",icon:"🐾"},{id:"transport",label:"Transport",icon:"🚗"},{id:"food",label:"Groceries",icon:"🛒"},{id:"other",label:"Other",icon:"📌"}];
const FREQS=[{id:"weekly",label:"Weekly",mo:0.25,days:7},{id:"monthly",label:"Monthly",mo:1,days:0},{id:"bimonthly",label:"Every 2 months",mo:2,days:0},{id:"quarterly",label:"Every 3 months",mo:3,days:0},{id:"biannual",label:"Every 6 months",mo:6,days:0},{id:"annual",label:"Yearly",mo:12,days:0}];
const INV_TYPES=["ETF","Stocks","Bonds","Crypto","Property","Cash","Other"];
const TYPE_COLORS={ETF:"#4C7EBE",Stocks:"#2563EB",Bonds:"#15803D",Crypto:"#B45309",Property:"#7C2D12",Cash:"#6B7280",Other:"#7C3AED"};
const BILL_ICONS=["🏠","⚡","📡","📺","💪","📦","📱","🐾","✂️","🚗","🛒","💊","🎓","🎵","☕","💳","🏦","🌐","🐶","📌","🍔","🚿","🛁","🎮"];
const INCOME_ICONS=["💼","💻","🏘️","🎨","📊","🎸","💰","🏗️","📝","🤝","🛍️","🌐","💹","🏢","📱","💵","🎯","🧠"];
const GOAL_ICONS=["🛡️","✈️","💻","🏡","🚗","💍","🎓","🏖️","🎸","📱","💰","🌍","🎯","🍷","🐕"];
const GOAL_COLORS=["#15803D","#2563EB","#7C3AED","#B91C1C","#B45309","#0891B2","#BE185D","#059669","#A07840","#1E3929"];

// ─── Default Data ─────────────────────────────────────────────────────────────
const DEFAULT_DATA={
  currencies:[{id:"c1",code:"SGD",symbol:"$",name:"Singapore Dollar",country:"home"},{id:"c2",code:"MYR",symbol:"RM",name:"Ringgit",country:"abroad"}],
  bills:[
    {id:"b1",name:"Rent",amount:1200,currencyId:"c1",type:"auto",frequency:"monthly",category:"housing",nextDue:"2026-07-01",isPaid:false,icon:"🏠",note:""},
    {id:"b2",name:"Electricity",amount:85,currencyId:"c1",type:"auto",frequency:"monthly",category:"utilities",nextDue:"2026-07-15",isPaid:false,icon:"⚡",note:""},
    {id:"b3",name:"Internet",amount:35,currencyId:"c1",type:"auto",frequency:"monthly",category:"utilities",nextDue:"2026-07-20",isPaid:false,icon:"📡",note:""},
    {id:"b4",name:"Netflix",amount:15.99,currencyId:"c1",type:"auto",frequency:"monthly",category:"subscriptions",nextDue:"2026-07-08",isPaid:false,icon:"📺",note:""},
    {id:"b5",name:"Gym",amount:45,currencyId:"c1",type:"manual",frequency:"monthly",category:"health",nextDue:"2026-07-01",isPaid:false,icon:"💪",note:""},
    {id:"b6",name:"Storage Unit",amount:120,currencyId:"c2",type:"manual",frequency:"monthly",category:"housing",nextDue:"2026-07-05",isPaid:false,icon:"📦",note:""},
    {id:"b7",name:"Phone Plan",amount:25,currencyId:"c2",type:"auto",frequency:"monthly",category:"utilities",nextDue:"2026-07-12",isPaid:false,icon:"📱",note:""},
    {id:"b8",name:"Dog Vet Visit",amount:180,currencyId:"c1",type:"manual",frequency:"bimonthly",category:"pet",nextDue:"2026-07-22",isPaid:false,icon:"🐾",note:"Check-up every 2 months"},
    {id:"b9",name:"Dog Grooming",amount:75,currencyId:"c1",type:"manual",frequency:"quarterly",category:"pet",nextDue:"2026-08-10",isPaid:false,icon:"✂️",note:"Grooming every 3 months"},
  ],
  incomes:[
    {id:"inc1",name:"Salary",amount:2800,currencyId:"c1",frequency:"monthly",icon:"💼",note:"Main salary"},
    {id:"inc2",name:"Freelance",amount:400,currencyId:"c1",frequency:"monthly",icon:"💻",note:"Side projects"},
    {id:"inc3",name:"Rental",amount:280,currencyId:"c2",frequency:"monthly",icon:"🏘️",note:"Abroad property"},
  ],
  budgets:{housing:1300,utilities:160,subscriptions:60,health:60,pet:200,transport:80,food:300,other:100},
  savingsGoals:[
    {id:"s1",name:"Emergency Fund",targetAmount:5000,currentAmount:2340,currencyId:"c1",deadline:"2026-12-31",color:"#15803D",icon:"🛡️"},
    {id:"s2",name:"Summer Holiday",targetAmount:2000,currentAmount:850,currencyId:"c2",deadline:"2026-09-01",color:"#2563EB",icon:"✈️"},
    {id:"s3",name:"New Laptop",targetAmount:1500,currentAmount:400,currencyId:"c1",deadline:"2027-03-01",color:"#7C3AED",icon:"💻"},
  ],
  investments:[
    {id:"i1",name:"S&P 500 ETF",type:"ETF",amount:3500,currencyId:"c1",gainLossPercent:12.5,notes:"Vanguard FTSE All-World"},
    {id:"i2",name:"Tech Stocks",type:"Stocks",amount:1200,currencyId:"c1",gainLossPercent:-3.2,notes:"Mixed tech portfolio"},
    {id:"i3",name:"European Bonds",type:"Bonds",amount:800,currencyId:"c2",gainLossPercent:2.1,notes:"EU government bonds"},
    {id:"i4",name:"Crypto",type:"Crypto",amount:450,currencyId:"c1",gainLossPercent:28.7,notes:"BTC / ETH split"},
  ],
  settings:{homeLabel:"Home (UK)",abroadLabel:"Abroad (EU)",exchangeRate:1.17,baseCurrencyId:"c1"},
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid=()=>"id_"+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const getToday=()=>{const d=new Date();d.setHours(0,0,0,0);return d;};
function addFreq(ds,fid){const f=FREQS.find(x=>x.id===fid);if(!f)return ds;const d=new Date(ds);if(f.days){d.setDate(d.getDate()+f.days);}else{const od=d.getDate();d.setMonth(d.getMonth()+f.mo);const mx=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(od,mx));}return d.toISOString().split("T")[0];}
function rollForward(bill){const now=getToday();let nd=bill.nextDue,g=0;while(new Date(nd)<now&&g++<60)nd=addFreq(nd,bill.frequency);return{...bill,nextDue:nd,isPaid:false};}
function normalizeData(raw){return{currencies:raw.currencies?.length?raw.currencies:DEFAULT_DATA.currencies,bills:(raw.bills||DEFAULT_DATA.bills).map(b=>({icon:"📌",note:"",isPaid:false,...b})),incomes:raw.incomes||DEFAULT_DATA.incomes,budgets:raw.budgets||DEFAULT_DATA.budgets,savingsGoals:raw.savingsGoals||DEFAULT_DATA.savingsGoals,investments:raw.investments||DEFAULT_DATA.investments,settings:{...DEFAULT_DATA.settings,...(raw.settings||{})}};}
function fmt(amount,currency){if(!currency)return String(amount);return`${currency.symbol}${Number(amount).toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2})}`;}
const daysUntil=ds=>{const d=new Date(ds);d.setHours(0,0,0,0);return Math.round((d-getToday())/86400000);};
const fmtDate=ds=>new Date(ds).toLocaleDateString("en-GB",{day:"numeric",month:"short"});
const moEquiv=b=>{const f=FREQS.find(x=>x.id===b.frequency);return f?b.amount/f.mo:b.amount;};

// ─── UI Primitives ────────────────────────────────────────────────────────────
function Modal({title,onClose,children}){return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}><div style={{background:T.surface,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:560,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -4px 40px rgba(0,0,0,0.18)"}}><div style={{padding:"1rem 1.25rem 0.75rem",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:T.surface,zIndex:1}}><span style={{fontWeight:800,fontSize:16,color:T.text}}>{title}</span><button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.muted}}>×</button></div><div style={{padding:"1rem 1.25rem 2rem"}}>{children}</div></div></div>);}
function ConfirmModal({message,onConfirm,onClose,confirmLabel="Delete"}){return(<Modal title="Are you sure?" onClose={onClose}><p style={{color:T.sub,fontSize:14,marginBottom:20,lineHeight:1.5}}>{message}</p><div style={{display:"flex",gap:8}}><button onClick={onClose} style={bst("outline")}>Cancel</button><button onClick={onConfirm} style={bst("danger")}>{confirmLabel}</button></div></Modal>);}
function Field({label,children,hint}){return(<div style={{marginBottom:"0.9rem"}}><label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</label>{children}{hint&&<div style={{fontSize:11,color:T.muted,marginTop:3}}>{hint}</div>}</div>);}
const inp={width:"100%",padding:"9px 11px",border:`1.5px solid ${T.border}`,borderRadius:9,fontSize:14,color:T.text,background:T.surface,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
const sel={...inp,cursor:"pointer"};
function bst(v){const b={padding:"10px 16px",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",border:"none",fontFamily:"inherit"};if(v==="primary")return{...b,background:T.nav,color:"#fff"};if(v==="danger")return{...b,background:T.danger,color:"#fff"};if(v==="success")return{...b,background:T.success,color:"#fff"};if(v==="outline")return{...b,background:"transparent",border:`1.5px solid ${T.border}`,color:T.muted};return b;}
function Tag({label,bg,color}){return<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,color:color||"#fff",background:bg||T.muted,textTransform:"uppercase",letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{label}</span>;}
function IconPicker({value,onChange,icons}){return(<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{icons.map(ic=>(<button key={ic} onClick={()=>onChange(ic)} style={{fontSize:19,width:36,height:36,borderRadius:9,border:`2px solid ${value===ic?T.nav:T.border}`,background:value===ic?`${T.nav}18`:"#F5F4F0",cursor:"pointer"}}>{ic}</button>))}</div>);}
function ColorDots({value,onChange,colors}){return(<div style={{display:"flex",flexWrap:"wrap",gap:8}}>{colors.map(c=>(<button key={c} onClick={()=>onChange(c)} style={{width:26,height:26,borderRadius:"50%",background:c,border:`3px solid ${value===c?T.text:"transparent"}`,cursor:"pointer",outline:"none"}} />))}</div>);}
function FAB({onClick,color}){return(<button onClick={onClick} style={{position:"fixed",bottom:76,right:18,width:52,height:52,borderRadius:"50%",background:color||T.nav,color:"#fff",fontSize:26,border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.28)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:90}}>+</button>);}

// ─── Bill Form ────────────────────────────────────────────────────────────────
function BillForm({bill,currencies,onSave,onClose}){
  const [f,setF]=useState({name:bill?.name||"",amount:bill?.amount||"",currencyId:bill?.currencyId||currencies[0]?.id||"",type:bill?.type||"manual",frequency:bill?.frequency||"monthly",category:bill?.category||"other",nextDue:bill?.nextDue||new Date().toISOString().split("T")[0],icon:bill?.icon||"📌",note:bill?.note||""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  function save(){if(!f.name.trim()||!f.amount)return;onSave({...bill,...f,amount:parseFloat(f.amount),id:bill?.id||uid(),isPaid:bill?.isPaid||false});}
  return(<div>
    <Field label="Name"><input style={inp} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="e.g. Rent"/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
      <Field label="Amount"><input style={inp} type="number" min="0" step="0.01" value={f.amount} onChange={e=>s("amount",e.target.value)} placeholder="0.00"/></Field>
      <Field label="Currency"><select style={sel} value={f.currencyId} onChange={e=>s("currencyId",e.target.value)}>{currencies.map(c=><option key={c.id} value={c.id}>{c.code} — {c.country==="home"?"Home":"Abroad"}</option>)}</select></Field>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
      <Field label="Type"><select style={sel} value={f.type} onChange={e=>s("type",e.target.value)}><option value="auto">Auto-deducted</option><option value="manual">Manual</option></select></Field>
      <Field label="Frequency"><select style={sel} value={f.frequency} onChange={e=>s("frequency",e.target.value)}>{FREQS.map(fr=><option key={fr.id} value={fr.id}>{fr.label}</option>)}</select></Field>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
      <Field label="Category"><select style={sel} value={f.category} onChange={e=>s("category",e.target.value)}>{CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select></Field>
      <Field label="Next due"><input style={inp} type="date" value={f.nextDue} onChange={e=>s("nextDue",e.target.value)}/></Field>
    </div>
    <Field label="Icon"><IconPicker value={f.icon} onChange={v=>s("icon",v)} icons={BILL_ICONS}/></Field>
    <Field label="Note"><input style={inp} value={f.note} onChange={e=>s("note",e.target.value)} placeholder="Anything to remember..."/></Field>
    <div style={{display:"flex",gap:8,marginTop:4}}>
      <button onClick={onClose} style={{...bst("outline"),flex:1}}>Cancel</button>
      <button onClick={save} style={{...bst("primary"),flex:2}}>Save bill</button>
    </div>
  </div>);
}

// ─── Income Form ──────────────────────────────────────────────────────────────
function IncomeForm({inc,currencies,onSave,onClose}){
  const [f,setF]=useState({name:inc?.name||"",amount:inc?.amount||"",currencyId:inc?.currencyId||currencies[0]?.id||"",frequency:inc?.frequency||"monthly",icon:inc?.icon||"💼",note:inc?.note||""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  function save(){if(!f.name.trim()||!f.amount)return;onSave({...inc,...f,amount:parseFloat(f.amount),id:inc?.id||uid()});}
  return(<div>
    <Field label="Source name"><input style={inp} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="e.g. Salary"/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
      <Field label="Amount"><input style={inp} type="number" min="0" step="0.01" value={f.amount} onChange={e=>s("amount",e.target.value)} placeholder="0.00"/></Field>
      <Field label="Currency"><select style={sel} value={f.currencyId} onChange={e=>s("currencyId",e.target.value)}>{currencies.map(c=><option key={c.id} value={c.id}>{c.code} — {c.country==="home"?"Home":"Abroad"}</option>)}</select></Field>
    </div>
    <Field label="Frequency"><select style={sel} value={f.frequency} onChange={e=>s("frequency",e.target.value)}>{FREQS.map(fr=><option key={fr.id} value={fr.id}>{fr.label}</option>)}</select></Field>
    <Field label="Icon"><IconPicker value={f.icon} onChange={v=>s("icon",v)} icons={INCOME_ICONS}/></Field>
    <Field label="Note"><input style={inp} value={f.note} onChange={e=>s("note",e.target.value)} placeholder="Employer, project..."/></Field>
    <div style={{display:"flex",gap:8,marginTop:4}}>
      <button onClick={onClose} style={{...bst("outline"),flex:1}}>Cancel</button>
      <button onClick={save} style={{...bst("success"),flex:2}}>Save income</button>
    </div>
  </div>);
}

// ─── Savings Form ─────────────────────────────────────────────────────────────
function SavingsForm({goal,currencies,onSave,onClose}){
  const [f,setF]=useState({name:goal?.name||"",targetAmount:goal?.targetAmount||"",currentAmount:goal?.currentAmount||0,currencyId:goal?.currencyId||currencies[0]?.id||"",deadline:goal?.deadline||"",color:goal?.color||GOAL_COLORS[0],icon:goal?.icon||"💰"});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  function save(){if(!f.name.trim()||!f.targetAmount)return;onSave({...goal,...f,targetAmount:parseFloat(f.targetAmount),currentAmount:parseFloat(f.currentAmount)||0,id:goal?.id||uid()});}
  return(<div>
    <Field label="Goal name"><input style={inp} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="e.g. Holiday Fund"/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
      <Field label="Target"><input style={inp} type="number" min="0" step="0.01" value={f.targetAmount} onChange={e=>s("targetAmount",e.target.value)} placeholder="0.00"/></Field>
      <Field label="Saved so far"><input style={inp} type="number" min="0" step="0.01" value={f.currentAmount} onChange={e=>s("currentAmount",e.target.value)} placeholder="0.00"/></Field>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
      <Field label="Currency"><select style={sel} value={f.currencyId} onChange={e=>s("currencyId",e.target.value)}>{currencies.map(c=><option key={c.id} value={c.id}>{c.code} — {c.country==="home"?"Home":"Abroad"}</option>)}</select></Field>
      <Field label="Target date"><input style={inp} type="date" value={f.deadline} onChange={e=>s("deadline",e.target.value)}/></Field>
    </div>
    <Field label="Icon"><IconPicker value={f.icon} onChange={v=>s("icon",v)} icons={GOAL_ICONS}/></Field>
    <Field label="Colour"><ColorDots value={f.color} onChange={v=>s("color",v)} colors={GOAL_COLORS}/></Field>
    <div style={{display:"flex",gap:8,marginTop:4}}>
      <button onClick={onClose} style={{...bst("outline"),flex:1}}>Cancel</button>
      <button onClick={save} style={{...bst("primary"),flex:2}}>Save goal</button>
    </div>
  </div>);
}

function AddFundsForm({goal,currency,onSave,onClose}){
  const [amount,setAmount]=useState("");
  const remaining=goal.targetAmount-goal.currentAmount;
  function save(){const v=parseFloat(amount);if(!v||v<=0)return;onSave(Math.min(goal.currentAmount+v,goal.targetAmount));onClose();}
  return(<div>
    <div style={{background:"#F5F4F0",borderRadius:12,padding:"0.9rem",marginBottom:"1rem",textAlign:"center"}}>
      <div style={{fontSize:12,color:T.muted,marginBottom:4}}>Still to save</div>
      <div style={{fontSize:28,fontWeight:900,color:remaining>0?T.text:T.success}}>{remaining>0?fmt(remaining,currency):"🎉 Goal reached!"}</div>
      <div style={{fontSize:12,color:T.muted,marginTop:2}}>{fmt(goal.currentAmount,currency)} of {fmt(goal.targetAmount,currency)}</div>
    </div>
    <Field label="Amount to add"><input style={inp} type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" autoFocus/></Field>
    <div style={{display:"flex",gap:8}}>
      <button onClick={onClose} style={{...bst("outline"),flex:1}}>Cancel</button>
      <button onClick={save} style={{...bst("success"),flex:2}}>Add funds</button>
    </div>
  </div>);
}

// ─── Investment Form ──────────────────────────────────────────────────────────
function InvestmentForm({inv,currencies,onSave,onClose}){
  const [f,setF]=useState({name:inv?.name||"",type:inv?.type||"ETF",amount:inv?.amount||"",currencyId:inv?.currencyId||currencies[0]?.id||"",gainLossPercent:inv?.gainLossPercent||0,notes:inv?.notes||""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  function save(){if(!f.name.trim()||!f.amount)return;onSave({...inv,...f,amount:parseFloat(f.amount),gainLossPercent:parseFloat(f.gainLossPercent)||0,id:inv?.id||uid()});}
  return(<div>
    <Field label="Name"><input style={inp} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="e.g. S&P 500 ETF"/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
      <Field label="Type"><select style={sel} value={f.type} onChange={e=>s("type",e.target.value)}>{INV_TYPES.map(t=><option key={t}>{t}</option>)}</select></Field>
      <Field label="Currency"><select style={sel} value={f.currencyId} onChange={e=>s("currencyId",e.target.value)}>{currencies.map(c=><option key={c.id} value={c.id}>{c.code} — {c.country==="home"?"Home":"Abroad"}</option>)}</select></Field>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
      <Field label="Current value"><input style={inp} type="number" min="0" step="0.01" value={f.amount} onChange={e=>s("amount",e.target.value)} placeholder="0.00"/></Field>
      <Field label="Gain/Loss %" hint="Use – for a loss"><input style={inp} type="number" step="0.1" value={f.gainLossPercent} onChange={e=>s("gainLossPercent",e.target.value)}/></Field>
    </div>
    <Field label="Notes"><input style={inp} value={f.notes} onChange={e=>s("notes",e.target.value)} placeholder="Provider, strategy..."/></Field>
    <div style={{display:"flex",gap:8,marginTop:4}}>
      <button onClick={onClose} style={{...bst("outline"),flex:1}}>Cancel</button>
      <button onClick={save} style={{...bst("primary"),flex:2}}>Save</button>
    </div>
  </div>);
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({data,onTabChange}){
  const{currencies,bills,incomes,savingsGoals,investments,settings}=data;
  const gc=id=>currencies.find(c=>c.id===id)||currencies[0]||{symbol:"?",code:"?",country:"home"};
  const bc=gc(settings.baseCurrencyId);
  const hc=currencies.find(c=>c.country==="home")||currencies[0];
  const ac=currencies.find(c=>c.country==="abroad")||currencies[1]||currencies[0];
  const tb=(a,cid)=>{const c=gc(cid);if(c.id===settings.baseCurrencyId)return a;return c.country==="abroad"?a/settings.exchangeRate:a*settings.exchangeRate;};
  const he=bills.filter(b=>gc(b.currencyId).country==="home").reduce((s,b)=>s+moEquiv(b),0);
  const ae=bills.filter(b=>gc(b.currencyId).country==="abroad").reduce((s,b)=>s+moEquiv(b),0);
  const te=he+tb(ae,ac.id);const hp=te>0?(he/te)*100:50;
  const ti=incomes.reduce((s,i)=>s+tb(moEquiv(i),i.currencyId),0);
  const nb=ti-te;const sp=nb>=0;
  const hr=new Date().getHours();const gr=hr<12?"Good morning":hr<17?"Good afternoon":"Good evening";
  const up=bills.filter(b=>!b.isPaid&&daysUntil(b.nextDue)<=14&&daysUntil(b.nextDue)>=-3).sort((a,b)=>new Date(a.nextDue)-new Date(b.nextDue)).slice(0,6);
  const ts=savingsGoals.reduce((s,g)=>s+tb(g.currentAmount,g.currencyId),0);
  const tt=savingsGoals.reduce((s,g)=>s+tb(g.targetAmount,g.currencyId),0);
  const spc=tt>0?Math.min(100,Math.round((ts/tt)*100)):0;
  const pv=investments.reduce((s,i)=>s+tb(i.amount,i.currencyId),0);
  const pg=investments.reduce((s,i)=>s+tb(i.amount*i.gainLossPercent/100,i.currencyId),0);
  const pgp=pv>0?(pg/(pv-pg))*100:0;
  const nw=ts+pv;
  const od=bills.filter(b=>!b.isPaid&&daysUntil(b.nextDue)<0).length;
  const sc2=bills.filter(b=>!b.isPaid&&daysUntil(b.nextDue)>=0&&daysUntil(b.nextDue)<=3).length;
  return(<div>
    <div style={{marginBottom:18}}><p style={{color:T.muted,fontSize:13,margin:"0 0 2px"}}>{gr} ✨</p><h2 style={{fontSize:22,fontWeight:900,color:T.text,margin:0,letterSpacing:"-0.02em"}}>Your finances, at a glance</h2></div>
    {(od>0||sc2>0)&&<div onClick={()=>onTabChange("bills")} style={{background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:12,padding:"10px 14px",marginBottom:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:13,color:T.danger,fontWeight:700}}>{od>0&&`${od} overdue`}{od>0&&sc2>0&&" · "}{sc2>0&&`${sc2} due soon`}</span><span style={{fontSize:12,color:T.danger}}>View →</span></div>}
    <div style={{background:sp?T.nav:"#7C1C1C",borderRadius:16,padding:"1.25rem 1.4rem",marginBottom:14,color:"#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div><div style={{fontSize:11,opacity:0.6,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>Monthly {sp?"surplus":"deficit"}</div><div style={{fontSize:34,fontWeight:900,letterSpacing:"-0.03em",fontVariantNumeric:"tabular-nums"}}>{sp?"":"-"}{fmt(Math.abs(nb),bc)}</div></div>
        <div style={{textAlign:"right",opacity:0.75,fontSize:12}}><div>↑ In: {fmt(ti,bc)}</div><div style={{marginTop:2}}>↓ Out: {fmt(te,bc)}</div></div>
      </div>
      <div style={{height:12,borderRadius:99,overflow:"hidden",display:"flex",background:"rgba(255,255,255,0.15)",marginBottom:10}}>
        <div style={{width:`${hp}%`,background:T.home,transition:"width 1s ease"}}/>
        <div style={{flex:1,background:T.abroad}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{cur:hc,amount:he,label:settings.homeLabel,color:T.home},{cur:ac,amount:ae,label:settings.abroadLabel,color:T.abroad}].map(({cur,amount,label,color})=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:9,height:9,borderRadius:2,background:color,flexShrink:0}}/>
            <div><div style={{fontSize:10,opacity:0.65,lineHeight:1}}>{label}</div><div style={{fontSize:14,fontWeight:800,fontVariantNumeric:"tabular-nums"}}>{fmt(amount,cur)}<span style={{fontSize:10,opacity:0.55,marginLeft:3}}>/mo</span></div></div>
          </div>
        ))}
      </div>
    </div>
    {incomes.length>0&&<div style={{background:T.surface,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:14}}>
      <div style={{padding:"0.7rem 1rem",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:13,color:T.text}}>Income</span><span style={{fontWeight:800,fontSize:13,color:T.success}}>{fmt(ti,bc)}/mo</span></div>
      {incomes.slice(0,3).map((inc,i)=>{const cur=gc(inc.currencyId);return(<div key={inc.id} style={{padding:"9px 1rem",borderBottom:i<Math.min(incomes.length,3)-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:17}}>{inc.icon}</span><span style={{flex:1,fontSize:13,fontWeight:600,color:T.text}}>{inc.name}</span><span style={{fontSize:13,fontWeight:800,color:T.success}}>{fmt(inc.amount,cur)}</span></div>);})}
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      <div onClick={()=>onTabChange("savings")} style={{background:T.surface,borderRadius:14,padding:"0.9rem",border:`1px solid ${T.border}`,cursor:"pointer"}}>
        <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Savings</div>
        <div style={{fontSize:19,fontWeight:900,color:T.text,marginBottom:4}}>{spc}%</div>
        <div style={{height:5,borderRadius:99,background:`${T.success}22`,marginBottom:4}}><div style={{height:"100%",width:`${spc}%`,borderRadius:99,background:T.success}}/></div>
        <div style={{fontSize:10,color:T.muted}}>{fmt(ts,bc)} / {fmt(tt,bc)}</div>
      </div>
      <div onClick={()=>onTabChange("investments")} style={{background:T.surface,borderRadius:14,padding:"0.9rem",border:`1px solid ${T.border}`,cursor:"pointer"}}>
        <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Portfolio</div>
        <div style={{fontSize:19,fontWeight:900,color:T.text,marginBottom:4,fontVariantNumeric:"tabular-nums"}}>{fmt(pv,bc)}</div>
        <div style={{fontSize:11,fontWeight:700,color:pg>=0?T.success:T.danger}}>{pg>=0?"▲":"▼"} {Math.abs(pgp).toFixed(1)}% overall</div>
      </div>
    </div>
    <div style={{background:T.surface,borderRadius:14,padding:"0.9rem 1.1rem",marginBottom:14,border:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Total net worth</div><div style={{fontSize:22,fontWeight:900,color:T.brass,fontVariantNumeric:"tabular-nums"}}>{fmt(nw,bc)}</div><div style={{fontSize:10,color:T.muted,marginTop:2}}>Savings + investments</div></div>
      <div style={{fontSize:36}}>🪺</div>
    </div>
    <div style={{background:T.surface,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden"}}>
      <div style={{padding:"0.85rem 1.1rem",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:800,fontSize:14,color:T.text}}>Coming up</span><span style={{fontSize:11,color:T.muted}}>Next 14 days</span></div>
      {up.length===0?<div style={{padding:"2rem 1rem",textAlign:"center",color:T.muted}}><div style={{fontSize:30,marginBottom:6}}>🎉</div><div style={{fontWeight:600,fontSize:13}}>All clear — nothing due soon!</div></div>
      :up.map((b,idx)=>{const cur=gc(b.currencyId);const days=daysUntil(b.nextDue);const dc=days<0?T.danger:days<=3?T.warning:T.muted;const dl=days<0?`${Math.abs(days)}d overdue`:days===0?"Today":`${days}d`;return(<div key={b.id} style={{padding:"10px 1.1rem",borderBottom:idx<up.length-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18,width:26,textAlign:"center"}}>{b.icon}</span><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.name}</div><div style={{fontSize:11,color:dc,fontWeight:600}}>{fmtDate(b.nextDue)} · {dl}</div></div><div style={{fontWeight:800,fontSize:14,color:T.text,fontVariantNumeric:"tabular-nums"}}>{fmt(b.amount,cur)}</div></div>);})}
    </div>
  </div>);
}

// ─── Bills Page ───────────────────────────────────────────────────────────────
function BillsPage({data,onUpdate}){
  const{currencies,bills,incomes,budgets,settings}=data;
  const[mode,setMode]=useState("bills");const[fc,setFc]=useState("all");const[ft,setFt]=useState("all");const[fcat,setFcat]=useState("all");const[modal,setModal]=useState(null);const[cdel,setCdel]=useState(null);
  const gc=id=>currencies.find(c=>c.id===id)||currencies[0]||{symbol:"?",code:"?",country:"home"};
  function togglePaid(id){onUpdate({...data,bills:bills.map(b=>{if(b.id!==id)return b;if(!b.isPaid)return{...b,isPaid:true,nextDue:addFreq(b.nextDue,b.frequency)};return{...b,isPaid:false};})});}
  function saveBill(bill){const ex=bills.find(b=>b.id===bill.id);onUpdate({...data,bills:ex?bills.map(b=>b.id===bill.id?bill:b):[...bills,bill]});setModal(null);}
  function saveInc(inc){const ex=incomes.find(i=>i.id===inc.id);onUpdate({...data,incomes:ex?incomes.map(i=>i.id===inc.id?inc:i):[...incomes,inc]});setModal(null);}
  function del(id){if(mode==="bills")onUpdate({...data,bills:bills.filter(b=>b.id!==id)});else onUpdate({...data,incomes:incomes.filter(i=>i.id!==id)});setCdel(null);}
  const filt=bills.filter(b=>{const cur=gc(b.currencyId);if(fc!=="all"&&cur.country!==fc)return false;if(ft!=="all"&&b.type!==ft)return false;if(fcat!=="all"&&b.category!==fcat)return false;return true;}).sort((a,b)=>new Date(a.nextDue)-new Date(b.nextDue));
  const uCats=[...new Set(bills.map(b=>b.category))];
  const pill=a=>({padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",border:`1.5px solid ${a?T.nav:T.border}`,background:a?T.nav:"transparent",color:a?"#fff":T.muted});
  const catSpend={};bills.forEach(b=>{const c=gc(b.currencyId);catSpend[b.category]=(catSpend[b.category]||0)+moEquiv(b)*(c.country==="home"?1:1/settings.exchangeRate);});
  return(<div>
    {modal&&mode==="bills"&&<Modal title={modal.mode==="add"?"Add bill":"Edit bill"} onClose={()=>setModal(null)}><BillForm bill={modal.item} currencies={currencies} onSave={saveBill} onClose={()=>setModal(null)}/></Modal>}
    {modal&&mode==="income"&&<Modal title={modal.mode==="add"?"Add income source":"Edit income"} onClose={()=>setModal(null)}><IncomeForm inc={modal.item} currencies={currencies} onSave={saveInc} onClose={()=>setModal(null)}/></Modal>}
    {cdel&&<ConfirmModal message={`Remove this ${mode==="bills"?"bill":"income source"} permanently?`} onConfirm={()=>del(cdel)} onClose={()=>setCdel(null)}/>}
    <div style={{display:"flex",background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:4,marginBottom:14,gap:4}}>
      {[{v:"bills",l:"💳 Bills & Payments"},{v:"income",l:"💰 Income Sources"}].map(({v,l})=>(
        <button key={v} onClick={()=>setMode(v)} style={{flex:1,padding:"8px",borderRadius:9,border:"none",background:mode===v?T.nav:"transparent",color:mode===v?"#fff":T.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
      ))}
    </div>
    {mode==="bills"?(<>
      <div style={{marginBottom:12}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
          {[{v:"all",l:"All"},{v:"home",l:`🏠 ${settings.homeLabel}`},{v:"abroad",l:`✈️ ${settings.abroadLabel}`}].map(({v,l})=>(<button key={v} style={pill(fc===v)} onClick={()=>setFc(v)}>{l}</button>))}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[{v:"all",l:"All types"},{v:"auto",l:"⚡ Auto"},{v:"manual",l:"✋ Manual"}].map(({v,l})=>(<button key={v} style={pill(ft===v)} onClick={()=>setFt(v)}>{l}</button>))}
          {uCats.map(cid=>{const cat=CATS.find(c=>c.id===cid);return(<button key={cid} style={pill(fcat===cid)} onClick={()=>setFcat(fcat===cid?"all":cid)}>{cat?.icon} {cat?.label}</button>);})}
        </div>
      </div>
      {fcat!=="all"&&budgets[fcat]>0&&(()=>{const spent=catSpend[fcat]||0;const lim=budgets[fcat];const pct=Math.min(100,Math.round((spent/lim)*100));const col=pct>=100?T.danger:pct>=80?T.warning:T.success;return(<div style={{background:T.surface,borderRadius:12,padding:"10px 14px",marginBottom:12,border:`1.5px solid ${col}40`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,fontWeight:700,color:T.sub}}>Budget: {CATS.find(c=>c.id===fcat)?.label}</span><span style={{fontSize:12,fontWeight:700,color:col}}>{pct}% used</span></div><div style={{height:6,borderRadius:99,background:`${col}22`,marginBottom:4}}><div style={{height:"100%",width:`${pct}%`,borderRadius:99,background:col}}/></div><div style={{fontSize:11,color:T.muted}}>£{spent.toFixed(0)}/mo · £{lim} limit</div></div>);})()}
      {filt.length>0&&<div style={{fontSize:12,color:T.muted,marginBottom:10}}>{filt.length} bill{filt.length!==1?"s":""} · {filt.filter(b=>!b.isPaid).length} pending</div>}
      {filt.length===0?<div style={{textAlign:"center",padding:"3rem 1rem",color:T.muted}}><div style={{fontSize:36,marginBottom:8}}>📭</div><div style={{fontWeight:700,fontSize:14,marginBottom:4}}>No bills here</div><div style={{fontSize:13}}>Tap + to add a payment</div></div>
      :filt.map(bill=>{
        const cur=gc(bill.currencyId);const days=daysUntil(bill.nextDue);const cat=CATS.find(c=>c.id===bill.category);const cCol=cur.country==="home"?T.home:T.abroad;const freq=FREQS.find(f=>f.id===bill.frequency);
        let dl,dc;if(bill.isPaid){dl="Paid ✓";dc=T.success;}else if(days<0){dl=`${Math.abs(days)}d overdue`;dc=T.danger;}else if(days===0){dl="Due today!";dc=T.danger;}else if(days<=3){dl=`${days}d left`;dc=T.warning;}else{dl=fmtDate(bill.nextDue);dc=T.muted;}
        return(<div key={bill.id} style={{background:T.surface,borderRadius:13,padding:"11px 13px",marginBottom:8,border:`1.5px solid ${bill.isPaid?"#DCFCE7":days<0?"#FEE2E2":days<=3?"#FEF3C7":T.border}`,opacity:bill.isPaid?0.72:1}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{fontSize:20,width:38,height:38,background:`${cCol}18`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{bill.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><span style={{fontWeight:700,fontSize:14,color:T.text}}>{bill.name}</span><span style={{fontWeight:900,fontSize:14,color:T.text,fontVariantNumeric:"tabular-nums",marginLeft:6,flexShrink:0}}>{fmt(bill.amount,cur)}</span></div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
                <Tag label={cur.country==="home"?"Home":"Abroad"} bg={cCol}/>
                <Tag label={bill.type==="auto"?"Auto":"Manual"} bg={bill.type==="auto"?"#6366F1":"#0891B2"}/>
                {cat&&<Tag label={`${cat.icon} ${cat.label}`} bg="transparent" color={T.muted}/>}
                {freq&&freq.id!=="monthly"&&<Tag label={freq.label} bg="transparent" color={T.muted}/>}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:7}}>
                <span style={{fontSize:11,fontWeight:700,color:dc}}>{dl}</span>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>togglePaid(bill.id)} style={{padding:"3px 8px",borderRadius:7,border:`1px solid ${bill.isPaid?T.success:T.border}`,background:bill.isPaid?"#DCFCE7":"transparent",color:bill.isPaid?T.success:T.muted,fontSize:11,fontWeight:700,cursor:"pointer"}}>{bill.isPaid?"✓ Paid":"Mark paid"}</button>
                  <button onClick={()=>setModal({mode:"edit",item:bill})} style={{padding:"3px 8px",borderRadius:7,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:11,cursor:"pointer"}}>✏️</button>
                  <button onClick={()=>setCdel(bill.id)} style={{padding:"3px 8px",borderRadius:7,border:`1px solid ${T.border}`,background:"transparent",color:T.danger,fontSize:11,cursor:"pointer"}}>🗑️</button>
                </div>
              </div>
              {bill.note&&<p style={{fontSize:11,color:T.muted,margin:"4px 0 0",fontStyle:"italic"}}>{bill.note}</p>}
            </div>
          </div>
        </div>);
      })}
    </>):(<>
      <div style={{background:"#F0FDF4",border:"1.5px solid #BBF7D0",borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,fontWeight:700,color:T.success}}>Total monthly income</span>
        <span style={{fontSize:16,fontWeight:900,color:T.success,fontVariantNumeric:"tabular-nums"}}>{fmt(incomes.reduce((s,i)=>s+moEquiv(i)*(gc(i.currencyId).country==="home"?1:1/settings.exchangeRate),0),currencies.find(c=>c.id===settings.baseCurrencyId)||currencies[0])}</span>
      </div>
      {incomes.length===0?<div style={{textAlign:"center",padding:"3rem 1rem",color:T.muted}}><div style={{fontSize:36,marginBottom:8}}>💰</div><div style={{fontWeight:700,fontSize:14,marginBottom:4}}>No income sources yet</div><div style={{fontSize:13}}>Tap + to add salary, freelance, rental, etc.</div></div>
      :incomes.map(inc=>{const cur=gc(inc.currencyId);const cCol=cur.country==="home"?T.home:T.abroad;const freq=FREQS.find(f=>f.id===inc.frequency);return(<div key={inc.id} style={{background:T.surface,borderRadius:13,padding:"11px 13px",marginBottom:8,border:`1.5px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:20,width:38,height:38,background:"#F0FDF4",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{inc.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><span style={{fontWeight:700,fontSize:14,color:T.text}}>{inc.name}</span><span style={{fontWeight:900,fontSize:14,color:T.success,fontVariantNumeric:"tabular-nums"}}>{fmt(inc.amount,cur)}</span></div>
            <div style={{display:"flex",gap:4,marginTop:4}}><Tag label={cur.country==="home"?"Home":"Abroad"} bg={cCol}/>{freq&&<Tag label={freq.label} bg="transparent" color={T.muted}/>}</div>
            {inc.note&&<p style={{fontSize:11,color:T.muted,margin:"5px 0 0",fontStyle:"italic"}}>{inc.note}</p>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginLeft:4}}>
            <button onClick={()=>setModal({mode:"edit",item:inc})} style={{padding:"4px 8px",borderRadius:7,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:11,cursor:"pointer"}}>✏️</button>
            <button onClick={()=>setCdel(inc.id)} style={{padding:"4px 8px",borderRadius:7,border:`1px solid ${T.border}`,background:"transparent",color:T.danger,fontSize:11,cursor:"pointer"}}>🗑️</button>
          </div>
        </div>
      </div>);})}
    </>)}
    <FAB onClick={()=>setModal({mode:"add",item:null})} color={mode==="income"?T.success:T.nav}/>
  </div>);
}

// ─── Savings Page ─────────────────────────────────────────────────────────────
function SavingsPage({data,onUpdate}){
  const{currencies,savingsGoals,settings}=data;
  const[modal,setModal]=useState(null);const[fm,setFm]=useState(null);const[cdel,setCdel]=useState(null);
  const gc=id=>currencies.find(c=>c.id===id)||currencies[0]||{symbol:"?",code:"?",country:"home"};
  const bc=gc(settings.baseCurrencyId);
  const tb=(a,cid)=>{const c=gc(cid);if(c.id===settings.baseCurrencyId)return a;return c.country==="abroad"?a/settings.exchangeRate:a*settings.exchangeRate;};
  function save(goal){const ex=savingsGoals.find(g=>g.id===goal.id);onUpdate({...data,savingsGoals:ex?savingsGoals.map(g=>g.id===goal.id?goal:g):[...savingsGoals,goal]});setModal(null);}
  function addFunds(gid,v){onUpdate({...data,savingsGoals:savingsGoals.map(g=>g.id===gid?{...g,currentAmount:v}:g)});}
  function del(id){onUpdate({...data,savingsGoals:savingsGoals.filter(g=>g.id!==id)});setCdel(null);}
  const ts=savingsGoals.reduce((s,g)=>s+tb(g.currentAmount,g.currencyId),0);
  const tt=savingsGoals.reduce((s,g)=>s+tb(g.targetAmount,g.currencyId),0);
  const op=tt>0?Math.min(100,Math.round((ts/tt)*100)):0;
  return(<div>
    {modal&&<Modal title={modal.mode==="add"?"New goal":"Edit goal"} onClose={()=>setModal(null)}><SavingsForm goal={modal.goal} currencies={currencies} onSave={save} onClose={()=>setModal(null)}/></Modal>}
    {fm&&<Modal title={`Add to ${fm.name}`} onClose={()=>setFm(null)}><AddFundsForm goal={fm} currency={gc(fm.currencyId)} onSave={v=>addFunds(fm.id,v)} onClose={()=>setFm(null)}/></Modal>}
    {cdel&&<ConfirmModal message="Remove this savings goal permanently?" onConfirm={()=>del(cdel)} onClose={()=>setCdel(null)}/>}
    <div style={{background:T.surface,borderRadius:16,padding:"1.1rem 1.25rem",marginBottom:14,border:`1px solid ${T.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}><span style={{fontWeight:800,fontSize:14,color:T.text}}>All goals combined</span><span style={{fontSize:13,fontWeight:700,color:T.success}}>{op}%</span></div>
      <div style={{height:8,borderRadius:99,background:`${T.success}22`,marginBottom:6}}><div style={{height:"100%",width:`${op}%`,borderRadius:99,background:T.success,transition:"width 1s ease"}}/></div>
      <div style={{fontSize:11,color:T.muted}}>{fmt(ts,bc)} saved of {fmt(tt,bc)} total</div>
    </div>
    {savingsGoals.length===0?<div style={{textAlign:"center",padding:"3rem 1rem",color:T.muted}}><div style={{fontSize:36,marginBottom:8}}>🎯</div><div style={{fontWeight:700,fontSize:14,marginBottom:4}}>No goals yet</div><div style={{fontSize:13}}>Tap + to set your first savings goal</div></div>
    :savingsGoals.map(goal=>{
      const cur=gc(goal.currencyId);const pct=goal.targetAmount>0?Math.min(100,Math.round((goal.currentAmount/goal.targetAmount)*100)):0;const rem=goal.targetAmount-goal.currentAmount;const dl=goal.deadline?daysUntil(goal.deadline):null;const done=pct>=100;
      return(<div key={goal.id} style={{background:T.surface,borderRadius:16,padding:"1.1rem 1.25rem",marginBottom:12,border:`1.5px solid ${done?goal.color+"60":T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{fontSize:22,width:44,height:44,background:`${goal.color}20`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{goal.icon}</div>
          <div style={{flex:1}}><div style={{fontWeight:800,fontSize:15,color:T.text}}>{goal.name}</div>{dl!==null&&<div style={{fontSize:11,color:dl<30?T.warning:T.muted}}>{done?"Goal reached! 🎉":dl>0?`${dl} days left`:"Deadline passed"}{goal.deadline&&!done?` · ${fmtDate(goal.deadline)}`:""}</div>}</div>
          <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:900,color:done?goal.color:T.text}}>{pct}%</div><div style={{fontSize:10,color:T.muted,fontVariantNumeric:"tabular-nums"}}>{fmt(goal.currentAmount,cur)}</div></div>
        </div>
        <div style={{height:8,borderRadius:99,background:`${goal.color}22`,marginBottom:10}}><div style={{height:"100%",width:`${pct}%`,borderRadius:99,background:goal.color,transition:"width 1s ease"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:T.muted}}>{done?"Complete":`${fmt(rem,cur)} to go`}<span style={{marginLeft:4}}>of {fmt(goal.targetAmount,cur)}</span></span>
          <div style={{display:"flex",gap:5}}>
            {!done&&<button onClick={()=>setFm(goal)} style={{padding:"5px 11px",borderRadius:8,border:"none",background:goal.color,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Add</button>}
            <button onClick={()=>setModal({mode:"edit",goal})} style={{padding:"5px 8px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:12,cursor:"pointer"}}>✏️</button>
            <button onClick={()=>setCdel(goal.id)} style={{padding:"5px 8px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.danger,fontSize:12,cursor:"pointer"}}>🗑️</button>
          </div>
        </div>
      </div>);
    })}
    <FAB onClick={()=>setModal({mode:"add",goal:null})}/>
  </div>);
}

// ─── Investments Page ─────────────────────────────────────────────────────────
function InvestmentsPage({data,onUpdate}){
  const{currencies,investments,settings}=data;
  const[modal,setModal]=useState(null);const[cdel,setCdel]=useState(null);
  const gc=id=>currencies.find(c=>c.id===id)||currencies[0]||{symbol:"?",code:"?",country:"home"};
  const bc=gc(settings.baseCurrencyId);
  const tb=(a,cid)=>{const c=gc(cid);if(c.id===settings.baseCurrencyId)return a;return c.country==="abroad"?a/settings.exchangeRate:a*settings.exchangeRate;};
  function save(inv){const ex=investments.find(i=>i.id===inv.id);onUpdate({...data,investments:ex?investments.map(i=>i.id===inv.id?inv:i):[...investments,inv]});setModal(null);}
  function del(id){onUpdate({...data,investments:investments.filter(i=>i.id!==id)});setCdel(null);}
  const tv=investments.reduce((s,i)=>s+tb(i.amount,i.currencyId),0);
  const tg=investments.reduce((s,i)=>s+tb(i.amount*i.gainLossPercent/100,i.currencyId),0);
  const tgp=tv>0?(tg/(tv-tg))*100:0;
  const byType=INV_TYPES.map(t=>({type:t,items:investments.filter(i=>i.type===t)})).filter(g=>g.items.length>0);
  return(<div>
    {modal&&<Modal title={modal.mode==="add"?"Add investment":"Edit investment"} onClose={()=>setModal(null)}><InvestmentForm inv={modal.inv} currencies={currencies} onSave={save} onClose={()=>setModal(null)}/></Modal>}
    {cdel&&<ConfirmModal message="Remove this holding from your portfolio?" onConfirm={()=>del(cdel)} onClose={()=>setCdel(null)} confirmLabel="Remove"/>}
    <div style={{background:T.nav,borderRadius:16,padding:"1.4rem",marginBottom:14,color:"#fff"}}>
      <div style={{fontSize:11,opacity:0.6,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>Total portfolio</div>
      <div style={{fontSize:32,fontWeight:900,letterSpacing:"-0.03em",fontVariantNumeric:"tabular-nums",marginBottom:8}}>{fmt(tv,bc)}</div>
      <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontWeight:700,fontSize:13,color:tg>=0?"#86EFAC":"#FCA5A5"}}>{tg>=0?"▲":"▼"} {fmt(Math.abs(tg),bc)} ({tgp>=0?"+":""}{tgp.toFixed(1)}%)</span><span style={{opacity:0.5,fontSize:12}}>{investments.length} holding{investments.length!==1?"s":""}</span></div>
    </div>
    {investments.length>0&&<div style={{background:T.surface,borderRadius:14,padding:"1rem 1.1rem",marginBottom:14,border:`1px solid ${T.border}`}}>
      <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Allocation</div>
      <div style={{height:10,borderRadius:99,overflow:"hidden",display:"flex",marginBottom:10,gap:1}}>{byType.map(g=>{const gv=g.items.reduce((s,i)=>s+tb(i.amount,i.currencyId),0);return<div key={g.type} style={{width:`${tv>0?(gv/tv)*100:0}%`,background:TYPE_COLORS[g.type]||T.muted,minWidth:2}}/>;})}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px 12px"}}>{byType.map(g=>{const gv=g.items.reduce((s,i)=>s+tb(i.amount,i.currencyId),0);const pct=tv>0?Math.round((gv/tv)*100):0;return(<div key={g.type} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:2,background:TYPE_COLORS[g.type]||T.muted}}/><span style={{fontSize:11,color:T.muted}}>{g.type} {pct}%</span></div>);})}</div>
    </div>}
    {investments.length===0?<div style={{textAlign:"center",padding:"3rem 1rem",color:T.muted}}><div style={{fontSize:36,marginBottom:8}}>📈</div><div style={{fontWeight:700,fontSize:14,marginBottom:4}}>Portfolio is empty</div><div style={{fontSize:13}}>Tap + to add your first holding</div></div>
    :investments.map(inv=>{const cur=gc(inv.currencyId);const gA=inv.amount*inv.gainLossPercent/100;const pos=inv.gainLossPercent>=0;return(<div key={inv.id} style={{background:T.surface,borderRadius:13,padding:"11px 13px",marginBottom:8,border:`1px solid ${T.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}><div style={{width:9,height:9,borderRadius:2,background:TYPE_COLORS[inv.type]||T.muted,flexShrink:0}}/><span style={{fontWeight:700,fontSize:14,color:T.text}}>{inv.name}</span></div><div style={{display:"flex",gap:5,marginBottom:inv.notes?4:0}}><Tag label={inv.type} bg={TYPE_COLORS[inv.type]||T.muted}/><Tag label={cur.code} bg={cur.country==="home"?T.home:T.abroad}/></div>{inv.notes&&<div style={{fontSize:11,color:T.muted,marginTop:3}}>{inv.notes}</div>}</div>
        <div style={{textAlign:"right",marginLeft:8}}><div style={{fontWeight:900,fontSize:15,color:T.text,fontVariantNumeric:"tabular-nums"}}>{fmt(inv.amount,cur)}</div><div style={{fontSize:12,fontWeight:700,color:pos?T.success:T.danger}}>{pos?"▲":"▼"} {Math.abs(inv.gainLossPercent).toFixed(1)}%</div><div style={{fontSize:11,color:T.muted}}>{pos?"+":""}{fmt(gA,cur)}</div></div>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:5,marginTop:8,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
        <button onClick={()=>setModal({mode:"edit",inv})} style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:11,cursor:"pointer"}}>✏️ Edit</button>
        <button onClick={()=>setCdel(inv.id)} style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${T.border}`,background:"transparent",color:T.danger,fontSize:11,cursor:"pointer"}}>🗑️ Remove</button>
      </div>
    </div>);})}
    <FAB onClick={()=>setModal({mode:"add",inv:null})}/>
  </div>);
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage({data,onUpdate}){
  const{currencies,settings,budgets}=data;
  const[sF,setSF]=useState({...settings});const[cF,setCF]=useState(currencies.map(c=>({...c})));const[bF,setBF]=useState({...budgets});const[saved,setSaved]=useState(false);
  const ss=(k,v)=>setSF(p=>({...p,[k]:v}));const sc=(i,k,v)=>setCF(p=>p.map((c,idx)=>idx===i?{...c,[k]:v}:c));const sb=(k,v)=>setBF(p=>({...p,[k]:parseFloat(v)||0}));
  function save(){onUpdate({...data,settings:sF,currencies:cF,budgets:bF});setSaved(true);setTimeout(()=>setSaved(false),2200);}
  const hc=cF.find(c=>c.country==="home");const ac=cF.find(c=>c.country==="abroad");
  return(<div>
    <div style={{background:T.surface,borderRadius:16,padding:"1.1rem 1.25rem",marginBottom:12,border:`1px solid ${T.border}`}}>
      <div style={{fontWeight:800,fontSize:13,color:T.text,marginBottom:12}}>Country labels</div>
      <Field label="Home country"><input style={inp} value={sF.homeLabel} onChange={e=>ss("homeLabel",e.target.value)}/></Field>
      <Field label="Abroad country"><input style={inp} value={sF.abroadLabel} onChange={e=>ss("abroadLabel",e.target.value)}/></Field>
    </div>
    <div style={{background:T.surface,borderRadius:16,padding:"1.1rem 1.25rem",marginBottom:12,border:`1px solid ${T.border}`}}>
      <div style={{fontWeight:800,fontSize:13,color:T.text,marginBottom:12}}>Currencies</div>
      {cF.map((cur,idx)=>(<div key={cur.id} style={{marginBottom:12,padding:11,background:"#F5F4F0",borderRadius:11}}>
        <div style={{fontSize:11,fontWeight:700,color:cur.country==="home"?T.home:T.abroad,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>{cur.country==="home"?"🏠 Home":"✈️ Abroad"} currency</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr",gap:8}}>
          <Field label="Code"><input style={inp} value={cur.code} onChange={e=>sc(idx,"code",e.target.value.toUpperCase())} maxLength={4}/></Field>
          <Field label="Symbol"><input style={inp} value={cur.symbol} onChange={e=>sc(idx,"symbol",e.target.value)} maxLength={4}/></Field>
          <Field label="Name"><input style={inp} value={cur.name} onChange={e=>sc(idx,"name",e.target.value)}/></Field>
        </div>
      </div>))}
      <Field label={`Exchange rate: 1 ${hc?.code||"Home"} = ? ${ac?.code||"Abroad"}`} hint="Used for cross-currency totals"><input style={inp} type="number" step="0.0001" value={sF.exchangeRate} onChange={e=>ss("exchangeRate",parseFloat(e.target.value)||1)}/></Field>
      <Field label="Show totals in"><select style={sel} value={sF.baseCurrencyId} onChange={e=>ss("baseCurrencyId",e.target.value)}>{cF.map(c=><option key={c.id} value={c.id}>{c.code} — {c.country==="home"?"Home":"Abroad"}</option>)}</select></Field>
    </div>
    <div style={{background:T.surface,borderRadius:16,padding:"1.1rem 1.25rem",marginBottom:16,border:`1px solid ${T.border}`}}>
      <div style={{fontWeight:800,fontSize:13,color:T.text,marginBottom:4}}>Monthly budget limits</div>
      <div style={{fontSize:12,color:T.muted,marginBottom:12}}>Set spending limits per category. A progress bar appears when you filter bills by that category.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
        {CATS.map(cat=>(<Field key={cat.id} label={`${cat.icon} ${cat.label}`}><input style={inp} type="number" min="0" step="10" value={bF[cat.id]||""} onChange={e=>sb(cat.id,e.target.value)} placeholder="No limit"/></Field>))}
      </div>
    </div>
    <button onClick={save} style={{width:"100%",padding:"13px",border:"none",borderRadius:12,background:saved?T.success:T.nav,color:"#fff",cursor:"pointer",fontWeight:800,fontSize:15,transition:"background 0.3s",fontFamily:"inherit"}}>{saved?"✓ Saved!":"Save settings"}</button>
    <p style={{textAlign:"center",fontSize:11,color:T.muted,marginTop:12}}>Data is saved locally in this browser.</p>
  </div>);
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const TABS=[{id:"dashboard",label:"Home",icon:"🏡"},{id:"bills",label:"Bills",icon:"📋"},{id:"savings",label:"Savings",icon:"🎯"},{id:"investments",label:"Invest",icon:"📈"},{id:"settings",label:"Settings",icon:"⚙️"}];

export default function App(){
  const[data,setData]=useState(null);
  const[tab,setTab]=useState("dashboard");
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    try{
      const raw=loadData();
      if(raw){const n=normalizeData(raw);n.bills=n.bills.map(b=>rollForward(b));setData(n);}
      else setData({...DEFAULT_DATA,bills:DEFAULT_DATA.bills.map(b=>rollForward(b))});
    }catch{setData({...DEFAULT_DATA,bills:DEFAULT_DATA.bills.map(b=>rollForward(b))});}
    setLoading(false);
  },[]);

  useEffect(()=>{if(data)saveData(data);},[data]);

  if(loading)return(<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}><div style={{fontSize:44}}>🪺</div><div style={{fontWeight:800,fontSize:18,color:T.text}}>Loading Nest…</div></div>);

  const od=data.bills.filter(b=>!b.isPaid&&daysUntil(b.nextDue)<0).length;

  return(<div style={{minHeight:"100vh",background:T.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif",color:T.text}}>
    <div style={{background:T.nav,color:"#fff",padding:"0.85rem 1.1rem 0.7rem",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:560,margin:"0 auto"}}>
        <div><div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1}}>🪺 Nest</div><div style={{fontSize:10,opacity:0.55,letterSpacing:"0.04em",textTransform:"uppercase"}}>Budget & Savings</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:12,opacity:0.7}}>{new Date().toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}</div>{od>0&&<div style={{fontSize:10,color:"#FCA5A5",fontWeight:700}}>{od} overdue</div>}</div>
      </div>
    </div>
    <div style={{padding:"1.1rem 1rem 90px",maxWidth:560,margin:"0 auto"}}>
      {tab==="dashboard"   &&<Dashboard       data={data} onTabChange={setTab}/>}
      {tab==="bills"       &&<BillsPage        data={data} onUpdate={setData}/>}
      {tab==="savings"     &&<SavingsPage      data={data} onUpdate={setData}/>}
      {tab==="investments" &&<InvestmentsPage  data={data} onUpdate={setData}/>}
      {tab==="settings"    &&<SettingsPage     data={data} onUpdate={setData}/>}
    </div>
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-around",padding:"6px 0 8px",zIndex:50}}>
      {TABS.map(t=>{const active=tab===t.id;const badge=t.id==="bills"&&od>0;return(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,background:"none",border:"none",cursor:"pointer",padding:"4px 10px",color:active?T.nav:T.muted,position:"relative"}}>
          <span style={{fontSize:20}}>{t.icon}</span>
          <span style={{fontSize:10,fontWeight:active?800:500}}>{t.label}</span>
          {badge&&<span style={{position:"absolute",top:2,right:6,width:8,height:8,borderRadius:"50%",background:T.danger,border:"2px solid #fff"}}/>}
          {active&&<div style={{position:"absolute",bottom:-8,left:"50%",transform:"translateX(-50%)",width:20,height:2,borderRadius:99,background:T.nav}}/>}
        </button>
      );})}
    </div>
  </div>);
}
