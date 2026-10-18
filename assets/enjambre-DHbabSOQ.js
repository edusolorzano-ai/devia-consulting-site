import{W as Y,S as J,e as K,C as R,o as Q,p as y,V as Z,q as $,i as ee,r as te,m as q,l as ne}from"./three.module-CTvVzimx.js";function ie(g,H){const M=matchMedia("(max-width: 720px)").matches||(navigator.hardwareConcurrency||8)<=4||navigator.connection?.saveData,X=matchMedia("(prefers-reduced-motion: reduce)").matches,d=M?12e3:4e4,z=new Y({canvas:g,antialias:!1,alpha:!0,powerPreference:"high-performance"}),W=Math.min(devicePixelRatio,M?1.5:2);z.setPixelRatio(W);const G=new J,m=new K(35,1,.1,100);m.position.set(0,0,11);const j=new Float32Array(d*3),E=new Float32Array(d*3),_=new Float32Array(d*3),B=new Float32Array(d*4),I=new Float32Array(d*3),h={ink:new R(7036239),bone:new R(16050650),terra:new R(12670767),ambar:new R(14717486)},a=1.25,e=Math.random;for(let t=0;t<d;t++){const o=e();let n,s,i,r;if(o<.42){const c=Math.floor(e()*12),f=(e()*2-1)*a,x=c%4,v=x&1?1:-1,F=x&2?1:-1,T=()=>(e()-.5)*.03;c<4?[n,s,i]=[f,v*a,F*a]:c<8?[n,s,i]=[v*a,f,F*a]:[n,s,i]=[v*a,F*a,f],n+=T(),s+=T(),i+=T(),r=h.bone.clone().lerp(h.ink,e()*.6)}else if(o<.62){const c=Math.floor(e()*6),f=(e()*2-1)*a,x=(e()*2-1)*a,v=c%2?1:-1;[n,s,i]=c<2?[v*a,f,x]:c<4?[f,v*a,x]:[f,x,v*a],r=h.ink.clone().multiplyScalar(.55)}else o<.95?(n=-.3+(e()*2-1)*.36,s=0+(e()*2-1)*.36,i=(e()*2-1)*.36,r=h.terra.clone().lerp(h.ambar,e()*.25)):(n=.42+(e()*2-1)*.2,s=-.32+(e()*2-1)*.05,i=(e()*2-1)*.05,r=h.bone.clone());j.set([n,s,i],t*3),I.set([r.r,r.g,r.b],t*3);const l=M?70:120,k=Math.ceil(d/l),O=t%l,U=Math.floor(t/l);E.set([(O/l-.5)*7,-.9,(U/k-.5)*4.5],t*3),_.set([e()*Math.PI*2,Math.floor(e()*6),e()],t*3),B.set([e(),e(),e()*2-1,e()*2-1],t*4)}const p=new Q;p.setAttribute("position",new y(j,3)),p.setAttribute("aGrid",new y(E,3)),p.setAttribute("aFlow",new y(_,3)),p.setAttribute("aRnd",new y(B,4)),p.setAttribute("aCol",new y(I,3));const b={uTime:{value:0},uMorph:{value:0},uPR:{value:W},uSize:{value:M?30:24},uMouse:{value:new Z(99,99)}},D=new $({uniforms:b,transparent:!0,depthWrite:!1,blending:ee,vertexShader:`
      uniform float uTime, uMorph, uPR, uSize; uniform vec2 uMouse;
      attribute vec3 aGrid, aFlow, aCol; attribute vec4 aRnd;
      varying vec3 vCol; varying float vA;
      vec3 shape(float i){
        if(i < 0.5){ // sistema (logo)
          return position * (1.0 + 0.015*sin(uTime*1.3 + aRnd.x*6.28));
        } else if(i < 1.5){ // caos: nube dispersa
          vec3 d = normalize(vec3(aRnd.z, aRnd.w, aRnd.y*2.0-1.0) + 0.001);
          float rr = 1.2 + aRnd.x*2.0;
          return d*rr + vec3(sin(uTime*.4+aRnd.y*9.), cos(uTime*.3+aRnd.x*7.), sin(uTime*.5+aRnd.z*5.))*0.25;
        } else if(i < 2.5){ // orden: tablero
          vec3 p = aGrid; p.y += sin(p.x*1.2 + uTime*0.8)*0.06 + sin(p.z*2.0+uTime)*0.04; return p;
        } else { // agentes: carriles en órbita
          float k = aFlow.y; float t = aFlow.x + uTime*(0.25 + aFlow.z*0.25)*(mod(k,2.0)>0.5?1.0:-1.0);
          float r = 1.25 + k*0.33;
          vec3 p = vec3(r*cos(t), sin(t*2.0 + k*1.7)*0.35 + (k-2.5)*0.12, r*sin(t));
          float a = k*0.5; p.yz = mat2(cos(a),-sin(a),sin(a),cos(a))*p.yz;
          return p + vec3(aRnd.z, aRnd.w, aRnd.y-.5)*0.04;
        }
      }
      void main(){
        float s = clamp(uMorph, 0.0, 3.999);
        float i0 = floor(s);
        float f = smoothstep(0.0, 1.0, clamp((fract(s) - aRnd.x*0.35)/0.65, 0.0, 1.0));
        float i1 = i0 + 1.0; if(i1 > 3.5) i1 = 0.0;
        vec3 p = mix(shape(i0), shape(i1), f);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vec2 d = mv.xy - uMouse * (-mv.z/9.0);
        float m = smoothstep(1.1, 0.0, length(d));
        mv.xy += normalize(d + 0.0001) * m * 0.45;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (0.35 + aRnd.y*0.9) / -mv.z;
        // en "agentes" los carriles se encienden en ámbar
        float flowW = smoothstep(2.3, 3.0, s) * (1.0 - smoothstep(3.5, 4.0, s));
        vCol = mix(aCol, mix(vec3(0.88,0.57,0.18), vec3(0.76,0.34,0.18), aRnd.y), flowW*0.75) + m*0.25;
        vA = 0.55 + aRnd.y*0.45;
      }`,fragmentShader:`
      varying vec3 vCol; varying float vA;
      void main(){ float d = length(gl_PointCoord - 0.5); if(d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vCol, a*vA); }`}),w=new te(p,D);G.add(w);let A=0,C=0,P=0,S=0,u=0;addEventListener("pointermove",t=>{A=t.clientX/innerWidth*2-1,C=-(t.clientY/innerHeight*2-1);const o=Math.tan(q.degToRad(m.fov/2))*9;b.uMouse.value.set(A*o*m.aspect,C*o)},{passive:!0});function L(){const t=g.clientWidth,o=g.clientHeight;z.setSize(t,o,!1),m.aspect=t/o,m.updateProjectionMatrix()}addEventListener("resize",L),L();let V=!0;new IntersectionObserver(([t])=>{V=t.isIntersecting}).observe(g);const N=new ne;(function t(){if(requestAnimationFrame(t),!V||document.hidden)return;const o=X?0:N.getElapsedTime();u+=(H()-u)*.06,P+=(A-P)*.04,S+=(C-S)*.04,b.uTime.value=o,b.uMorph.value=u;const n=innerWidth>720;w.rotation.y=o*.12+P*.5+u*.9,w.rotation.x=.42-S*.3;const s=n?Math.min(1,innerWidth/1400):.62;w.scale.setScalar(s);const i=[2.9,-2.1,1.9,-2.1].map(k=>k*(n?Math.min(1.3,1400/innerWidth):1)),r=Math.min(3,Math.floor(u)),l=u-r;w.position.x=n?q.lerp(i[r],i[Math.min(3,r+1)],l*l*(3-2*l)):0,w.position.y=n?0:3.7-Math.min(u,1)*1.9,m.position.z=n?12:18,z.render(G,m)})()}export{ie as initEnjambre};
