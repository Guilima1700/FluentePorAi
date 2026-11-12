'use client';

import { useId, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { LAND } from './worldLand';

const cities = [
  { id:'london', name:'Londres', country:'Reino Unido', phrase:'Hello, new possibilities.', lon:-.13, lat:51.51, label:[36,-9] },
  { id:'new-york', name:'Nova York', country:'Estados Unidos', phrase:'The world is yours.', lon:-74.01, lat:40.71, label:[-31,-11] },
  { id:'toronto', name:'Toronto', country:'Canadá', phrase:'Nice to meet you.', lon:-79.38, lat:43.65, label:[-36,-32] },
  { id:'sydney', name:'Sydney', country:'Austrália', phrase:'Let’s go a little further.', lon:151.21, lat:-33.87, label:[-7,24] },
];
const point = (lon, lat) => [((lon + 180) / 360) * 620, ((90 - lat) / 180) * 310];
const origin = point(-60.02, -3.12);

export default function ConnectionMap({ compact = false }) {
  const [active, setActive] = useState('london');
  const selected = cities.find(city => city.id === active);
  const title = useId();
  return <div className={`connection-map ${compact ? 'connection-map-compact' : ''}`}>
    <div className="map-topline"><span>SEU INGLÊS. SEM FRONTEIRAS.</span><span aria-hidden="true"><ArrowUpRight size={20} /></span></div>
    <svg className="connection-map-art" viewBox="0 0 620 350" role="group" aria-labelledby={title}>
      <title id={title}>Conexões de Manaus com o mundo. Escolha uma cidade para explorar.</title>
      <g className="map-grid" fill="none" stroke="currentColor" strokeWidth=".7">
        {[75,145,215,285].map(y=><path key={y} d={`M15 ${y}H605`} />)}
        {[85,195,305,415,525].map(x=><path key={x} d={`M${x} 25V315`} />)}
      </g>
      <g className="map-land" transform="translate(0 16)">
        {LAND.map((polygon,index)=><polygon key={index} points={polygon.map(([lon,lat])=>point(lon,lat).join(',')).join(' ')} />)}
      </g>
      <g transform="translate(0 16)" fill="none">
        {cities.map((city,index)=>{
          const [x,y]=point(city.lon,city.lat);
          const route=`M${origin[0]} ${origin[1]} Q${(origin[0]+x)/2} ${Math.min(origin[1],y)-55} ${x} ${y}`;
          return <path key={city.id} className={`map-route ${active===city.id?'map-route-active':''}`} d={route} style={{'--route-delay':`${index*.18}s`}} pathLength="1" />;
        })}
      </g>
      <g transform={`translate(${origin[0]} ${origin[1]+16})`} className="map-home">
        <circle r="9" /><circle r="3" />
        <text y="26" textAnchor="middle">Manaus, Brasil</text>
      </g>
      {cities.map(city=>{
        const [x,y]=point(city.lon,city.lat);
        return <g key={city.id} transform={`translate(${x} ${y+16})`} role="button" tabIndex="0" aria-label={`Explorar ${city.name}, ${city.country}`} aria-pressed={active===city.id} className={`map-city ${active===city.id?'is-selected':''}`} onClick={()=>setActive(city.id)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setActive(city.id)}}}>
          <circle className="map-city-target" r="16" />
          <circle className="map-city-halo" r="8" />
          <circle className="map-city-dot" r="3" />
          <text x={city.label[0]} y={city.label[1]} textAnchor="middle">{city.name}</text>
        </g>;
      })}
    </svg>
    <div className="map-city-choices" role="group" aria-label="Destinos do mapa">{cities.map(city=><button key={city.id} type="button" aria-pressed={active===city.id} onClick={()=>setActive(city.id)}>{city.name}</button>)}</div>
    <div className="map-destination" aria-live="polite" aria-atomic="true">
      <span className="map-destination-icon"><MapPin size={19} strokeWidth={1.5} aria-hidden="true" /></span>
      <div><span className="map-destination-country">{selected.name} · {selected.country}</span><p lang="en">{selected.phrase}</p></div>
      <ArrowUpRight size={24} aria-hidden="true" />
    </div>
    <p className="map-invitation">Toque em um destino. Imagine sua próxima conversa.</p>
  </div>;
}
