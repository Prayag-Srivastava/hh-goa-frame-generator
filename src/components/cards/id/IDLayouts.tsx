import{useEffect,useState,type PointerEvent as ReactPointerEvent}from'react';import QRCode from'qrcode';import type{CardData}from'../../../types';import{filterCss}from'../../../lib/imageProcess';import{GoaScene}from'../GoaArt';

type Box={x:number;y:number;w:number;h:number};
type Template={src:string;ratio:string;photo:Box;fields:Box[];qr:Box;text:'light'|'dark';qrPad?:number};

const templates:Record<string,Template>={
  // coordinates are percent-based against the real uploaded template dimensions
  'card-glow':{src:'/templates/card-glow.png',ratio:'610/907',photo:{x:7.5,y:28.0,w:38.6,h:33.0},fields:[{x:51.2,y:27.6,w:41.0,h:7.0},{x:51.2,y:37.2,w:41.0,h:7.0},{x:51.2,y:46.8,w:41.0,h:7.0},{x:51.2,y:56.5,w:41.0,h:7.0}],qr:{x:41.7,y:81.8,w:16.6,h:11.2},text:'dark',qrPad:10},
  'card-clean':{src:'/templates/card-clean.png',ratio:'477/712',photo:{x:8.1,y:28.0,w:36.5,h:31.8},fields:[{x:51.5,y:28.3,w:40.0,h:7.6},{x:51.5,y:38.1,w:40.0,h:7.6},{x:51.5,y:48.5,w:40.0,h:7.6},{x:51.5,y:58.6,w:40.0,h:7.6}],qr:{x:41.4,y:79.0,w:16.0,h:10.8},text:'dark',qrPad:9},
  'card-paper':{src:'/templates/card-paper.png',ratio:'476/713',photo:{x:8.0,y:27.5,w:36.4,h:32.4},fields:[{x:51.8,y:28.4,w:40.0,h:7.6},{x:51.8,y:38.4,w:40.0,h:7.6},{x:51.8,y:49.0,w:40.0,h:7.6},{x:51.8,y:59.2,w:40.0,h:7.6}],qr:{x:41.5,y:79.1,w:15.8,h:10.6},text:'dark',qrPad:9},
  'card-night':{src:'/templates/card-night.png',ratio:'475/711',photo:{x:7.8,y:30.2,w:36.3,h:31.0},fields:[{x:51.4,y:30.6,w:40.2,h:7.2},{x:51.4,y:40.4,w:40.2,h:7.2},{x:51.4,y:50.9,w:40.2,h:7.2},{x:51.4,y:60.9,w:40.2,h:7.2}],qr:{x:41.5,y:79.4,w:15.7,h:10.5},text:'light',qrPad:9},
  'card-landscape':{src:'/templates/card-landscape.png',ratio:'1317/711',photo:{x:10.9,y:27.1,w:29.2,h:48.2},fields:[{x:49.1,y:35.0,w:36.0,h:6.5},{x:49.1,y:44.1,w:36.0,h:6.5},{x:49.1,y:53.1,w:36.0,h:6.5},{x:49.1,y:62.2,w:36.0,h:6.5}],qr:{x:68.9,y:73.8,w:7.3,h:13.4},text:'light',qrPad:7}
};
const labels=['NAME','TEAM','ROLE','GITHUB'];

export default function IDLayout({card,onStickerMove}:{card:CardData,onStickerMove?:(i:number,x:number,y:number)=>void}){
  const t=templates[card.variant]||templates['card-glow'];
  const [qr,setQr]=useState('');
  useEffect(()=>{QRCode.toDataURL(`${location.origin}/card/${card.id}`,{margin:1,width:260,color:{dark:'#0a1810',light:'#fffdf2'}}).then(setQr)},[card.id]);
  const values=[card.name,card.crew,card.role,card.github||card.callsign];
  const landscape=card.variant==='card-landscape';
  const dark=t.text==='dark';
  return <div id="id-template-card" className="relative overflow-hidden rounded-[2rem] bg-ink shadow-[0_35px_100px_rgba(0,0,0,.65)]" style={{aspectRatio:t.ratio,width:landscape?'min(94vw,860px)':'min(88vw,430px)',fontFamily:'JetBrains Mono'}}>
    <img src={t.src} className="absolute inset-0 h-full w-full select-none object-cover" draggable={false}/>

    <div className="absolute overflow-hidden" style={box(t.photo,'1.55rem')}>
      <GoaScene variant={card.variant==='card-night'?'trance':'sunset'} className="absolute inset-0 h-full w-full opacity-95" soft/>
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/20 via-transparent to-yellow-sun/10"/>
      {card.photo?<img src={card.photo} className="relative z-10 h-full w-full object-cover drop-shadow-[0_12px_20px_rgba(0,0,0,.35)]" style={{filter:filterCss(card.filter),transform:`translate(${card.photoX}px,${card.photoY}px) scale(${card.photoZoom}) rotate(${card.photoRotate}deg)`}}/>:<div className="relative z-10 grid h-full place-items-center bg-transparent text-5xl opacity-80">👤</div>}
    </div>

    {t.fields.map((b,i)=><div key={i} className={`absolute overflow-hidden ${landscape?'rounded-xl bg-ink/28 backdrop-blur-[2px]':''}`} style={{...box(b,landscape?'.85rem':'.7rem'),color:dark?'#163326':'#FBF5E4'}}>
      <span className="absolute left-[7%] top-[18%] block max-w-[86%] truncate text-[7px] font-black tracking-[.22em] opacity-60 md:text-[8px]">{labels[i]}</span>
      <b className={`absolute left-[7%] top-[42%] block max-w-[86%] truncate font-black leading-none tracking-[-.03em] ${landscape?'text-[13px] md:text-[16px]':'text-[11px] md:text-[12px]'}`} style={{textShadow:dark?'0 1px 0 rgba(255,255,255,.22)':'0 1px 8px rgba(0,0,0,.65)'}}>{values[i]||'—'}</b>
    </div>)}

    <div className="absolute grid place-items-center overflow-hidden bg-[#fff8d9]/92 shadow-[0_0_16px_rgba(245,213,71,.5)]" style={{...box(t.qr,'.55rem'),padding:t.qrPad||8}}>
      {qr&&<img src={qr} className="h-full w-full object-contain"/>}
    </div>

    {card.stickers.map((st,i)=><span key={st.id+i} onClick={e=>e.stopPropagation()} onPointerDown={e=>startDrag(e,i,onStickerMove)} className={`absolute z-30 select-none ${onStickerMove?'cursor-grab active:cursor-grabbing':''}`} style={{left:`${st.x}%`,top:`${st.y}%`,fontSize:24*st.s,transform:`translate(-50%,-50%) rotate(${st.r}deg)`,touchAction:'none'}}>{st.emoji}</span>)}
    <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-white/10"/>
  </div>
}
function box(b:Box,radius:string){return{left:`${b.x}%`,top:`${b.y}%`,width:`${b.w}%`,height:`${b.h}%`,borderRadius:radius} as const}
function startDrag(e:ReactPointerEvent<HTMLElement>,i:number,move?:((i:number,x:number,y:number)=>void)){if(!move)return;e.stopPropagation();const el=e.currentTarget.parentElement as HTMLElement;const upd=(ev:globalThis.PointerEvent)=>{const r=el.getBoundingClientRect();move(i,Math.max(2,Math.min(98,(ev.clientX-r.left)/r.width*100)),Math.max(2,Math.min(98,(ev.clientY-r.top)/r.height*100)))};upd(e.nativeEvent);window.addEventListener('pointermove',upd);window.addEventListener('pointerup',()=>window.removeEventListener('pointermove',upd),{once:true})}
