'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, ArrowUpRight, Check, Globe2 } from 'lucide-react';
import ConnectionMap from './ConnectionMap';
import { LAND } from './worldLand';

const Globe3D = dynamic(()=>import('./InteractiveGlobe'),{ ssr:false, loading:()=><div className="map-loading"><Globe2 size={54} strokeWidth={1}/><span>Preparando o globo…</span></div> });
const options = [
  { id:'conexoes', name:'Mapa de conexões', description:'Uma leitura simples do mundo, com rotas delicadas e destinos interativos. É a proposta aplicada na página inicial.' },
  { id:'ilustrado', name:'Globo ilustrado', description:'Uma esfera gráfica, com a leveza de uma ilustração e as cores da marca. Sem rotação ou efeitos 3D.' },
  { id:'3d', name:'Globo em movimento', description:'A experiência tridimensional anterior, com rotação suave e exploração por toque. Uma alternativa com mais movimento.' },
];

function IllustratedGlobe() {
  // Orthographic projection centered between South America and Europe.
  const project=([lon,lat])=>{ const a=(lon+30)*Math.PI/180,b=lat*Math.PI/180;return [250+195*Math.cos(b)*Math.sin(a),230-195*Math.sin(b),Math.cos(b)*Math.cos(a)]; };
  const clipFront=polygon=>{
    const points=polygon.map(project), visible=[];
    for(let i=0;i<points.length;i++){
      const previous=points[(i+points.length-1)%points.length], current=points[i];
      if((previous[2]>=0)!==(current[2]>=0)){
        const t=previous[2]/(previous[2]-current[2]);
        const x=previous[0]+t*(current[0]-previous[0])-250,y=previous[1]+t*(current[1]-previous[1])-230;
        const length=Math.hypot(x,y);
        visible.push([250+x/length*195,230+y/length*195]);
      }
      if(current[2]>=0)visible.push(current.slice(0,2));
    }
    return visible;
  };
  const home=project([-60.02,-3.12]), london=project([-.13,51.51]);
  return <div className="illustrated-map"><svg viewBox="0 0 500 500" role="img" aria-label="Globo ilustrado em azul, com as Américas, Europa e África">
    <circle cx="250" cy="230" r="207" fill="none" stroke="#669bbb" opacity=".3" />
    <circle cx="250" cy="230" r="195" fill="#669bbb" />
    <clipPath id="illustrated-earth"><circle cx="250" cy="230" r="195" /></clipPath>
    <g clipPath="url(#illustrated-earth)">
      <g fill="none" stroke="#fef0d5" opacity=".25" strokeWidth="1"><ellipse cx="250" cy="230" rx="90" ry="195"/><path d="M55 230H445M75 145Q250 190 425 145M75 315Q250 270 425 315"/><path d="M250 35V425"/></g>
      {LAND.map(clipFront).filter(polygon=>polygon.length>=3).map((polygon,index)=><polygon key={index} points={polygon.map(p=>p.join(',')).join(' ')} fill="#fef0d5" stroke="#669bbb" strokeWidth=".5" />)}
      <path d={`M${home[0]} ${home[1]}Q155 55 ${london[0]} ${london[1]}`} fill="none" stroke="#c1121f" strokeWidth="2" strokeDasharray="4 6"/>
      <circle cx={home[0]} cy={home[1]} r="6" fill="#c1121f"/><circle cx={london[0]} cy={london[1]} r="6" fill="#c1121f"/>
    </g>
    <g fill="#01304a" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="12"><text x={home[0]-28} y={home[1]+30}>Manaus</text><text x={london[0]+14} y={london[1]-12}>Londres</text></g>
    <rect x="95" y="432" width="310" height="51" rx="25" fill="#01304a"/><text x="250" y="465" textAnchor="middle" fill="#fef0d5" fontFamily="Instrument Serif, Georgia, serif" fontSize="27">Um idioma. Um mundo inteiro.</text>
  </svg></div>;
}

export default function MapOptions(){
  const [selected,setSelected]=useState('conexoes');
  const option=options.find(item=>item.id===selected);
  return <main id="conteudo" className="map-review container">
    <a className="page-back" href="/"><ArrowLeft size={17}/> Voltar ao site</a>
    <div className="review-heading"><p className="eyebrow">DIREÇÕES VISUAIS · FLUENTE POR AÍ</p><h1>Um mundo.<br/><em>Três possibilidades.</em></h1><p>Compare as propostas para o mapa da abertura. Todas mantêm as cores e a personalidade da marca.</p></div>
    <div className="map-options" role="group" aria-label="Escolher uma proposta de mapa">{options.map((item,index)=><button key={item.id} type="button" aria-pressed={selected===item.id} onClick={()=>setSelected(item.id)}><span>0{index+1}</span>{item.name}{selected===item.id&&<Check size={17} aria-hidden="true"/>}</button>)}</div>
    <div className="map-review-stage"><div className="review-copy"><span className="eyebrow">INGLÊS PARA IR ALÉM</span><h2>English that<br/><em>takes you</em><br/>places.</h2><p>{option.description}</p><a href="https://wa.me/5592982021077" className="button button-light" target="_blank" rel="noopener noreferrer">Fale conosco pelo WhatsApp<ArrowUpRight size={17} aria-hidden="true"/><span className="sr-only"> (abre em nova aba)</span></a></div><div className={`review-map review-map-${selected}`}>{selected==='conexoes'?<ConnectionMap/>:selected==='ilustrado'?<IllustratedGlobe/>:<Globe3D className="review-globe"/>}</div></div>
    <p className="review-note" aria-live="polite">Visualizando: {option.name}. Esta página serve para comparar as propostas; a escolha não altera o site publicado.</p>
  </main>;
}
