import type{Archetype}from'../types';export const archetypes:Archetype[]=[
{id:'wave',emoji:'🌊',name:'THE WAVE RIDER',short:'Wave Rider',tagline:'Chill commits. Clean swells.',palette:['#0284c7','#38bdf8','#FBF5E4'],stats:{ship:72,vibe:98,feni:42}},
{id:'susegad',emoji:'🔥',name:'THE SUSEGAD SHIPPER',short:'Susegad Shipper',tagline:'Relaxed outside. Ruthless at deploy.',palette:['#f97316','#F5D547','#0F4C3A'],stats:{ship:88,vibe:91,feni:76}},
{id:'trance',emoji:'⚡',name:'THE TRANCE CODER',short:'Trance Coder',tagline:'Night mode is a personality.',palette:['#7c3aed','#FF3D8B','#22d3ee'],stats:{ship:94,vibe:86,feni:61}},
{id:'coconut',emoji:'🥥',name:'THE COCONUT ARCHITECT',short:'Coconut Architect',tagline:'Systems deep as roots.',palette:['#0F4C3A','#FBF5E4','#84cc16'],stats:{ship:80,vibe:74,feni:48}},
{id:'bandit',emoji:'🎭',name:'THE BEACH BANDIT',short:'Beach Bandit',tagline:'Chaos with a product roadmap.',palette:['#FF3D8B','#FFD93D','#0a1810'],stats:{ship:99,vibe:89,feni:90}},
{id:'panjim',emoji:'🏛️',name:'THE PANJIM POET',short:'Panjim Poet',tagline:'Elegant APIs. Better endings.',palette:['#1d4ed8','#FBF5E4','#94a3b8'],stats:{ship:68,vibe:83,feni:55}},
{id:'dawn',emoji:'🌅',name:'THE DAWN DEALER',short:'Dawn Dealer',tagline:'Sunrise standup, shipped by brunch.',palette:['#fb7185','#F5D547','#fed7aa'],stats:{ship:92,vibe:80,feni:35}},
{id:'feni',emoji:'🎨',name:'THE FENI ARTIST',short:'Feni Artist',tagline:'Pixels, prototypes, pure mischief.',palette:['#d946ef','#a3e635','#FF3D8B'],stats:{ship:77,vibe:100,feni:97}}];export const getArchetype=(id:string)=>archetypes.find(a=>a.id===id)||archetypes[0];
