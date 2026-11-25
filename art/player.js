// Render from absolute audio time so preview and final export use identical frames.
const clean=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,'');
const texture=document.createElement('canvas');texture.width=192;texture.height=192;
const tg=texture.getContext('2d'),pixels=tg.createImageData(192,192);
for(let i=0;i<pixels.data.length;i+=4){const n=rand(i)*255;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=n;pixels.data[i+3]=17}
tg.putImageData(pixels,0,0);
const grain=g.createPattern(texture,'repeat');
let edit,wordIndex;
window.loadEpisode=data=>{
 edit=data;
 for(const b of edit.beats){if(!scenes[b.id])throw Error('Missing scene '+b.id);
 b.words=edit.words.filter(w=>w.start>=b.start-.001&&w.start<b.speech_end)}
};
window.drawFrame=function(t){
 let i=edit.beats.findIndex((b,k)=>k===edit.beats.length-1||edit.beats[k+1].start>t);
 let b=edit.beats[i],end=edit.beats[i+1]?.start??edit.duration;
 let age=t-b.start,progress=clamp(age/(end-b.start));
 function on(text,occ=1){const hit=b.words.filter(w=>clean(w.text)===clean(text))[occ-1];if(!hit)throw Error('Missing cue '+text+' in '+b.id);return t-hit.start}
 g.setTransform(cv.width/360,0,0,cv.height/640,0,0);g.lineCap='round';g.lineJoin='round';
 g.save();
 let zoom=1.012+.037*smooth(progress);
 g.translate(180,340);g.scale(zoom,zoom);g.translate(-180,-340);
 scenes[b.id](t,{p:progress,age,on});g.restore();
 // Printed paper edge and sparse flecks give the entire film a tactile finish.
 layer(.18,()=>{g.fillStyle=grain;g.fillRect(0,0,360,640)});
 g.strokeStyle='#163c4c';g.lineWidth=7;g.strokeRect(4,4,352,632);
 g.strokeStyle='#f8f1d8';g.lineWidth=2;g.strokeRect(10,10,340,620);
 const active=b.words.findIndex((w,k)=>w.start<=t&&(b.words[k+1]?.start??w.end+.18)>t);
 if(active>=0){
  const first=Math.floor(active/3)*3,group=b.words.slice(first,first+3);
  const font=group.some(w=>w.text.length>11)?15:18;
  const widths=group.map(w=>{g.font=font+'px Label';return g.measureText(w.text).width});
  const total=widths.reduce((a,v)=>a+v,0)+(group.length-1)*8;
  const x0=180-total/2, y=532;
  g.save();g.translate(180,y);g.rotate(-.015+.025*sin(first));
  g.shadowColor='rgba(20,57,65,.25)';g.shadowBlur=0;g.shadowOffsetY=6;
  round(-Math.min(165,total/2+20),-27,Math.min(330,total+40),54,7,'#fbf1d5','#173e50',3);
  g.shadowColor='transparent';g.shadowOffsetY=0;
  let x=x0-180;
  group.forEach((w,j)=>{
   const selected=first+j===active,highlight=clean(w.text)===clean(b.accent||'__');
   if(selected)round(x-4,-17,widths[j]+8,34,4,highlight?'#ff7360':'#f9c64f',null);
   g.font=font+'px Label';g.fillStyle=selected&&highlight?'#fff9e9':'#164056';
   g.textAlign='left';g.textBaseline='middle';g.fillText(w.text,x,1);x+=widths[j]+8;
  });g.restore();
 }
 if(i===edit.beats.length-1){layer(smooth((t-edit.duration+.49)/.49),()=>rect(0,0,360,640,'#f8f1d8'))}
};
