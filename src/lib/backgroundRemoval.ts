type FaceBox={x:number;y:number;w:number;h:number}|null|undefined;

export async function removePhotoBackground(dataUrl:string,face?:FaceBox):Promise<string>{
  try{
    const mod=await import('@imgly/background-removal');
    const removeBackground=(mod as any).removeBackground;
    const blob:Blob=await removeBackground(dataUrl,{progress:()=>{},output:{format:'image/png',quality:.95}});
    const cutout=await blobToDataUrl(blob);
    return await keepLikelyPersonOnly(cutout,face);
  }catch(err){
    console.warn('Background removal fallback:',err);
    return dataUrl;
  }
}
function blobToDataUrl(blob:Blob){return new Promise<string>((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result));r.onerror=rej;r.readAsDataURL(blob)})}
function loadImg(src:string){return new Promise<HTMLImageElement>((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=src})}

async function keepLikelyPersonOnly(src:string,face?:FaceBox){
  const img=await loadImg(src);const w=img.width,h=img.height;const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.drawImage(img,0,0);
  const data=ctx.getImageData(0,0,w,h);const px=data.data;
  // First trim tiny semi-transparent artifacts.
  for(let i=0;i<px.length;i+=4){if(px[i+3]<34)px[i+3]=0}
  if(face){
    const fc=(face.x+face.w/2)*w;const ft=face.y*h;const fh=face.h*h;const fw=face.w*w;
    const left=fc-fw*1.45,right=fc+fw*1.45,top=Math.max(0,ft-fh*.9),bottom=Math.min(h,ft+fh*5.2);
    const cx=fc, cy=ft+fh*2.35, rx=fw*1.9, ry=fh*3.35;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const idx=(y*w+x)*4;if(px[idx+3]===0)continue;
      const inRect=x>=left&&x<=right&&y>=top&&y<=bottom;
      const ex=(x-cx)/rx,ey=(y-cy)/ry;const inEllipse=ex*ex+ey*ey<=1.08;
      // Softly remove objects far from the detected face/person column (bags, curtains, background clothing).
      if(!inRect||!inEllipse){px[idx+3]=0;continue}
      const edge=Math.max(Math.abs(ex),Math.abs(ey));if(edge>.92)px[idx+3]=Math.round(px[idx+3]*(1-(edge-.92)/.16));
    }
  }
  ctx.putImageData(data,0,0);return c.toDataURL('image/png');
}
