import type{PointerEvent as ReactPointerEvent}from'react';import type{CardData}from'../../../types';import{filterCss}from'../../../lib/imageProcess';

type Box={x:number;y:number;w:number;h:number};type Template={src:string;ratio:string;photo:Box;label:string;glow:string};
const templates:Record<string,Template>={
 'pfp-classic':{src:'/templates/pfp-classic.png',ratio:'620/666',photo:{x:16.2,y:16.4,w:67.4,h:56.7},label:'CLASSIC COAST',glow:'#F5D547'},
 'pfp-neon':{src:'/templates/pfp-neon.png',ratio:'578/661',photo:{x:16.5,y:15.8,w:67.0,h:57.5},label:'NEON BEACH',glow:'#FF3D8B'},
 'pfp-village':{src:'/templates/pfp-village.png',ratio:'555/657',photo:{x:15.4,y:14.7,w:69.4,h:58.5},label:'VILLAGE SUNSET',glow:'#F5D547'},
 'pfp-jungle':{src:'/templates/pfp-jungle.png',ratio:'578/660',photo:{x:15.8,y:15.9,w:68.4,h:57.5},label:'JUNGLE PORTAL',glow:'#FF3D8B'}
};
export default function PFPFrame({card,onStickerMove}:{card:CardData,exporting?:boolean,onStickerMove?:(i:number,x:number,y:number)=>void}){const t=templates[card.variant]||templates['pfp-classic'];return <div className="relative overflow-hidden rounded-[2rem] bg-black shadow-[0_35px_100px_rgba(0,0,0,.7)]" style={{aspectRatio:t.ratio,width:'min(88vw,520px)'}}>
  <img src={t.src} className="absolute inset-0 z-10 h-full w-full select-none object-cover [image-rendering:auto]" draggable={false}/>
  {card.photo&&<div className="absolute z-20 overflow-hidden rounded-full bg-transparent shadow-[inset_0_0_28px_rgba(0,0,0,.22)] ring-2 ring-yellow-sun/25" style={box(t.photo)}><img src={card.photo} className="h-full w-full object-cover drop-shadow-[0_14px_22px_rgba(0,0,0,.32)]" style={{filter:filterCss(card.filter),transform:`translate(${card.photoX}px,${card.photoY}px) scale(${card.photoZoom}) rotate(${card.photoRotate}deg)`}}/></div>}
  {!card.photo&&<div className="absolute left-1/2 top-[43%] z-30 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/20 px-5 py-4 text-6xl opacity-80">👤</div>}
  <div className="pointer-events-none absolute inset-0 z-30 rounded-[2rem]" style={{boxShadow:`inset 0 0 26px ${t.glow}77, 0 0 45px ${t.glow}44`}}/>
  <div className="absolute left-5 top-5 z-40 rounded-full bg-black/65 px-3 py-1 text-[10px] font-black text-yellow-sun ring-1 ring-yellow-sun/40 backdrop-blur">{card.rarity}</div>
  <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-center text-[10px] font-black tracking-[.16em] text-cream ring-1 ring-cream/15 backdrop-blur">{t.label}</div>
  {card.stickers.map((st,i)=><span key={st.id+i} onClick={e=>e.stopPropagation()} onPointerDown={e=>startDrag(e,i,onStickerMove)} className={`absolute z-50 select-none ${onStickerMove?'cursor-grab active:cursor-grabbing':''}`} style={{left:`${st.x}%`,top:`${st.y}%`,fontSize:28*st.s,transform:`translate(-50%,-50%) rotate(${st.r}deg)`,touchAction:'none'}}>{st.emoji}</span>)}
</div>}
function box(b:Box){return{left:`${b.x}%`,top:`${b.y}%`,width:`${b.w}%`,height:`${b.h}%`} as const}
function startDrag(e:ReactPointerEvent<HTMLElement>,i:number,move?:((i:number,x:number,y:number)=>void)){if(!move)return;e.stopPropagation();const el=e.currentTarget.parentElement as HTMLElement;const upd=(ev:globalThis.PointerEvent)=>{const r=el.getBoundingClientRect();move(i,Math.max(2,Math.min(98,(ev.clientX-r.left)/r.width*100)),Math.max(2,Math.min(98,(ev.clientY-r.top)/r.height*100)))};upd(e.nativeEvent);window.addEventListener('pointermove',upd);window.addEventListener('pointerup',()=>window.removeEventListener('pointermove',upd),{once:true})}
