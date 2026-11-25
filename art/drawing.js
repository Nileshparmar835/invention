const cv=document.querySelector('canvas'), g=cv.getContext('2d',{alpha:false});
const ink='#174457',cream='#fff9e9',brass='#ed936e',gold='#ffd36f',night='#93d8d0';
const TAU=Math.PI*2, sin=Math.sin, cos=Math.cos;
function clamp(x,a=0,b=1){return Math.max(a,Math.min(b,x))}
function smooth(x){x=clamp(x);return x*x*(3-2*x)}
function lerp(a,b,x){return a+(b-a)*x}
function transform(x,y,s,fn,angle=0){g.save();g.translate(x,y);g.rotate(angle);g.scale(s,s);fn();g.restore()}
function layer(alpha,fn){g.save();g.globalAlpha*=clamp(alpha);fn();g.restore()}
function paint(fill,stroke,w){if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=w;g.stroke()}}
function path(d,fill,stroke=ink,w=1.5){const p=new Path2D(d);if(fill){g.fillStyle=fill;g.fill(p)}if(stroke){g.strokeStyle=stroke;g.lineWidth=w;g.stroke(p)}}
function line(x,y,X,Y,col=ink,w=1.4){g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.strokeStyle=col;g.lineWidth=w;g.stroke()}
function rect(x,y,w,h,c,st=null,lw=1){g.fillStyle=c;g.fillRect(x,y,w,h);if(st){g.lineWidth=lw;g.strokeStyle=st;g.strokeRect(x,y,w,h)}}
function round(x,y,w,h,r,c,st=ink,lw=1.5){g.beginPath();g.roundRect(x,y,w,h,r);paint(c,st,lw)}
function oval(x,y,rx,ry,c,st=null,w=1.4){g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);paint(c,st,w)}
function grad(y,Y,...cols){const a=g.createLinearGradient(0,y,0,Y);cols.forEach((c,i)=>a.addColorStop(i/(cols.length-1),c));return a}
function glow(x,y,r,inner,outer='rgba(255,194,91,0)'){const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,inner);q.addColorStop(1,outer);rect(x-r,y-r,r*2,r*2,q)}
function label(t,x,y,size,c=cream,f='Label',align='center'){g.fillStyle=c;g.font=size+'px '+f;g.textAlign=align;g.textBaseline='middle';g.fillText(t,x,y)}
function star(x,y,r,col){transform(x,y,r,()=>path('M0 -1 Q.13 -.14 1 0 Q.14 .13 0 1 Q-.13 .13 -1 0 Q-.14 -.14 0 -1Z',col,null))}
function rand(x){const n=sin(x*17.163+12.745)*48712.245;return n-Math.floor(n)}
function sky(t,storm=false){
 rect(-40,-60,460,780,grad(0,640,storm?'#b9f0e9':'#ffe2ac',storm?'#daf4df':'#ffe8b5','#fbf2d9'));
 oval(265,107,39,39,storm?'#fff2bb':'#ffad69','#183c4e',2);
 for(let i=0;i<7;i++){
  let x=((i*84+t*(i%2+1)*2)%500)-90,y=94+(i%3)*48;
  transform(x,y,1,()=>path('M-35 7 Q-26 -12 -10 -3 Q1 -27 20 -8 Q38 -11 43 7Z','#ffffff','#245168',1.7));
 }
 for(let i=0;i<45;i++){let x=rand(i+13)*420-30,y=rand(i+311)*310;oval(x,y,.7,.7,'rgba(15,72,81,.13)')}
}
function house(x,base,w,h,seed,far=false,lights=true){
 const tones=far?['#8bc6c0','#f6b9a5','#c2d7ab']:['#ed8f78','#f9c96c','#95c8bd','#e9a5b8'];
 const top=base-h;
 g.save();g.shadowColor='rgba(25,66,79,.22)';g.shadowOffsetY=3;
 rect(x,top,w,h,tones[seed%tones.length],'#204858',1.6);g.restore();
 path('M'+(x-5)+' '+top+' L'+(x+w*.3)+' '+(top-18)+' L'+(x+w*.83)+' '+(top-14)+' L'+(x+w+5)+' '+top+'Z','#f0a461','#204858',1.5);
 for(let yy=top+10;yy<base-5;yy+=15)for(let j=0;j<3;j++){
  let xx=x+4+j*(w-5)/3,ww=Math.max(3,w*.15);
  rect(xx,yy,ww,8,lights&&rand(j+yy+seed)>.39?'#fff6c9':'#346476','#204858',.7);
 }
}
function sea(t,lit=true,storm=false){
 sky(t,storm);
 path('M-20 336 Q35 300 76 320 T150 308 T237 320 T317 299 T400 309 L400 387 L-20 387Z','#a2d0bd','#246277',1.8);
 for(let i=0;i<15;i++)house(i*28-22,342,26,14+rand(i+90)*36,i,true,lit);
 rect(-30,342,420,350,grad(342,640,'#72c7c3','#4da6ad','#24798d'));
 line(-10,342,380,342,'#eff3d6',2);
 for(let i=0;i<75;i++){let x=rand(i+22)*445-40+sin(t*.4+i)*3,y=345+rand(i+213)*225;
  line(x,y,x+2+rand(i+93)*13,y,i%6?'rgba(237,250,225,.38)':'#fff0b2',.7)}
}
function stones(y){
 rect(-30,y,420,650-y,grad(y,635,'#f7dba9','#eebd89','#f8e9bf'));
 rect(-30,y-5,420,7,'#19475c','#173f54',1.5);
 for(let j=0;j<10;j++){let yy=y+8+j*j*2.3;line(-35,yy,392,yy,'#d49772',1.3);
  for(let i=-1;i<7;i++){let x=65*i+(j%2)*29;line(x,yy,x-4,yy+3+j*4,'#d49772',1)}}
}
function railing(x,y,n,step){for(let i=0;i<n;i++){let xx=x+i*step;line(xx,y-22,xx,y,'#232533',3);oval(xx,y-24,2.5,2.5,brass,ink,.8);if(i<n-1)path('M'+xx+' '+(y-19)+' q'+step/2+' 12 '+step+' 0',null,'#343341',1.6)}}
function quay(t,lit=true){sea(t,lit);for(let i=0;i<5;i++)house(-45+i*89,375,73,52+rand(90+i)*36,i,false,lit);
 rect(-25,375,410,48,grad(375,423,'#64606a','#3e4856'));for(let i=0;i<8;i++)line(i*59,380,i*59-5,399,'#454451');railing(-20,423,11,43);stones(427)}
function beam(x,y,scale,t){transform(x,y,scale,()=>{glow(0,0,75,'rgba(255,186,79,.18)');glow(0,0,33,'rgba(255,186,79,.36)');glow(0,0,15,'rgba(255,222,139,.5)')})}
function lamp(x,base,s,on,t){
 const f=clamp(on);
 transform(x,base,s,()=>{
 oval(2,0,17,3,'rgba(12,17,27,.32)');path('M-8 0 L-7 -5 L-4 -7 L-3 -16 L-2 -104 L2 -104 L3 -16 L4 -7 L7 -5 L8 0Z','#227f8b',ink,1.7);
 line(-.5,-14,-.5,-101,'#ab906a',.9);
 path('M-4 -99 Q-13 -106 -9 -111 Q-6 -116 -3 -110 M4 -99 Q13 -106 9 -111 Q6 -116 3 -110',null,'#9b835e',1.6);
 path('M-10 -128 L10 -128 L7 -110 Q0 -103 -7 -110Z',f>.04?grad(-129,-108,'#ffe9a8','#f0ad57'):'#588fb2',ink,1.8);
 if(f>0)layer(f,()=>{beam(0,-119,1,t);path('M-2 -112 Q-5 -115 0 -122 Q0 -118 2 -118 Q5 -114 2 -112Z','#fff4b8',null)});
 line(-5,-126,-3,-110,'#76694f',1);line(5,-126,3,-110,'#76694f',1);
 path('M-13 -128 L-9 -131 Q-5 -132 0 -138 Q4 -132 9 -131 L13 -128Z','#277b84',ink);oval(0,-139,1.9,2.6,brass,ink,.8);
 round(-6,-109,12,3,1,brass,ink,.8);
 });}
function shop(t){
 sea(t);rect(-30,221,236,194,grad(221,415,'#f4a789','#f8d1a3','#ecc08d'),ink);
 path('M-32 223 L8 188 L183 190 L216 223Z','#48a5a5',ink,2);
 for(let i=0;i<17;i++)line(-12+i*13,217,-1+i*12,200,'#35798b',.8);
 rect(-24,224,238,6,'#e78e75',ink);rect(1,242,179,33,'#1c7590',ink,2);
 rect(5,246,171,25,'#247e94','#c29c6d',.8);label('B E L L   B A K E R Y',91,258,10,'#f4d9a3','Story');
 for(let i=0;i<10;i++)path('M'+(-15+i*20)+' 279 l20 0 5 17 -21 0Z',i%2?'#c99477':'#853f46',ink,.65);
 round(-5,300,99,94,4,'#e9a473','#b78874',3);
 rect(0,305,88,77,grad(303,382,'#bd8253','#ffd895','#cb905d'));
 for(let i=0;i<6;i++){const xx=6+(i%3)*28, yy=338+Math.floor(i/3)*28;oval(xx+7,yy,10,4,'#b77548','#805638',.8);line(xx+5,yy-2,xx+8,yy-4,'#efd39c',1.3)}
 line(-3,348,90,348,'#614b49',4);line(45,305,45,382,'#55454a',3);
 round(112,291,65,119,3,'#57abae','#ad8a70',2);
 round(121,301,46,63,2,grad(301,366,'#70c4bd','#eeb88a'),ink,1.5);oval(163,378,2,2,brass);stones(418);
}
function bridge(t,lit=false){sea(t,lit,true);
 for(let i=0;i<3;i++) {let x=-45+i*158;path('M'+x+' 441 v44 h20 q49 -76 115 0 h23 v-44Z','#f4b680',ink,2)}
 rect(-25,428,412,15,'#ffd79d',ink);for(let i=-1;i<12;i++){let x=i*38;rect(x,392,3,36,'#2d6774');oval(x+1,390,3,3,brass,ink,.8)}
 line(-20,400,380,400,'#2d6774',2);line(-20,406,380,406,'#428ea1',1.3);
 for(let i=0;i<8;i++){let y=486+i*9;line(17+i*31,y,42+i*31,y,'#6b8089',1.1)}
}
function person(x,y,s,t,opt={}){
 let {type='mara',facing=1,walk=0,reach=0,emotion='neutral',sit=0,tilt=0,tool=false,blow=false}=opt;
 transform(x,y,s,()=>{g.scale(facing,1);
 oval(1,0,17,3,'rgba(9,12,20,.29)');
 const phase=t*6,step=sin(phase)*walk,bodyY=-Math.abs(cos(phase))*walk*1.8+sit*10;
 for(let i=0;i<2;i++){let sign=2*i-1,hip=sign*5,foot=hip+step*11*sign+sit*10;
 path('M'+hip+' '+(-24+bodyY)+' Q'+(hip+sign*1.8+sit*12)+' '+(-13+sit*5)+' '+foot+' -3',null,'#20212a',5.2);
 round(foot-2.7,-4.7,9,4.8,2.2,'#2d2930','#141720',1)}
 transform(0,bodyY,1,()=>{
 const coat=type==='mara'?'#ff674e':type==='boy'?'#6aaca5':type==='clerk'?'#705cb1':'#eb9873';
 const dark=type==='mara'?'#cb5149':type==='boy'?'#408c87':'#554994';
 let swing=walk*sin(phase)*.6;
 function arm(px,angle){transform(px,-47,1,()=>{path('M0 0 Q1 11 1 19',null,ink,7);path('M0 1 Q1 11 1 17',null,coat,4.2);oval(1,20,2.9,3.2,'#382c30',ink,.8)},angle)}
 arm(-9,.18-swing);
 path('M-7 -52 Q0 -55 7 -51 Q11 -42 12 -24 L-12 -24 Q-11 -41 -7 -52Z',coat,ink,1.7);
 path('M-10 -31 Q-5 -29 -1 -31 L-1 -26 L-10 -26Z',dark,null);
 line(2,-47,3,-25,dark,1);for(let j=0;j<3;j++)oval(4,-43+j*6,.9,.9,brass);
 arm(8,-.22-reach*1.8+swing*.6);
 if(tool){let xx=11+reach*14, yy=-29-reach*18;line(xx-7,yy+28,xx+9,yy-22,'#32232b',3.5);line(xx-7,yy+28,xx+9,yy-22,'#b18354',1.5);round(xx+6,yy-27,6,8,1.4,brass,ink,1);if(reach>.25)oval(xx+10,yy-29,1.7,3,'#ffdc83')}
 transform(0,-64+sin(t*2)*.3,1,()=>{
 if(type==='mara'){oval(-11,6,6,7,'#31282e',ink);path('M-13 7q-7 6 -1 13q4 -7 3 -12Z','#382b31',ink)}
 oval(0,0,13.3,13.2,type==='mara'?'#eabb8f':type==='boy'?'#b77e5f':'#c99884',ink,2.5);
 if(type==='mara'){path('M-15 -4 Q-16 -14 -9 -16 Q-2 -22 7 -17 Q12 -16 13 -9 L17 -7 Q12 -4 -1 -5Z','#f05d50',ink,1.5);
 path('M-12 -8 Q-2 -12 11 -10',null,'#c16e60',1.1)}
 if(type==='boy'){path('M-14 -5 Q-15 -16 -3 -17 Q8 -19 12 -9 L14 -5Z','#5f8088',ink);round(-14,-8,28,5,2,'#88a5a7',ink,1);oval(-3,-18,3,3,'#acc6bc',ink,1)}
 if(type==='clerk'){path('M-15 -6 L-10 -8 L-9 -19 L7 -19 L10 -8 L15 -7 L15 -5Z','#4f4a9d',ink);line(-9,-10,8,-10,'#b18b5f',2)}
 let blink=(t+type.length*.47)%3.71<.11;
 if(blink){line(-3,-1,0,-1,cream,1.5);line(5,-1,8,-1,cream,1.5)}else{oval(-2,-.8,2,2.6,'#173f55');oval(6,-1.4,2,2.6,'#173f55')}
 if(type==='clerk'){oval(-2,-1,4,3.8,null,brass,.85);oval(6,-1,4,3.8,null,brass,.85);line(2,-1,2.5,-1,brass,1)}
 if(emotion==='worry'){line(-6,-4,-1,-6,cream,.9);line(4,-6,9,-5,cream,.9);path('M1 7q2 -3 5 -1',null,'#e9bca4',1.1)}
 else if(blow)oval(6,5,1.6,2,'#bd8a7f');else path('M0 5q3 3 6 0',null,'#ebc5ae',1);
 },tilt);
 if(type==='mara'){path('M-9 -51 Q1 -49 10 -53 L9 -48 Q0 -45 -9 -48Z','#ad4c45',ink,1);
 path('M-5 -49 Q-10 -42 -8 -36 L-4 -38 L-1 -49Z','#b85349',ink,.8)}
 });});
}
