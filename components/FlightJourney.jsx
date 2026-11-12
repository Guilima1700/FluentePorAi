'use client';
import { useEffect, useId, useRef } from 'react';

// A continuous route measured from the actual sections, including after font and image loading.
export default function FlightJourney() {
  const svgRef=useRef(null), pathRef=useRef(null), trailRef=useRef(null), planeRef=useRef(null);
  const artworkId=useId().replace(/:/g,'');
  useEffect(()=>{
    const svg=svgRef.current, path=pathRef.current, trail=trailRef.current, plane=planeRef.current;
    const host=svg.parentElement; const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery=window.matchMedia('(max-width: 767.98px), (hover: none) and (pointer: coarse)');
    let frame=0, length=0, start=0, end=1, currentDistance=null, currentAngle=null;
    const update=()=>{
      frame=0; if(query.matches||mobileQuery.matches||!length){svg.style.visibility='hidden';return} svg.style.visibility='visible';
      const target=window.innerHeight*.66-host.getBoundingClientRect().top;
      // y is monotonic; binary search puts the airplane at the current viewport position.
      let low=0,high=length; for(let i=0;i<15;i++){const mid=(low+high)/2;if(path.getPointAtLength(mid).y<target)low=mid;else high=mid}
      const targetDistance=(low+high)/2;
      const snap=currentDistance===null||Math.abs(path.getPointAtLength(currentDistance).y-target)>window.innerHeight*.8;
      currentDistance=snap?targetDistance:currentDistance+(targetDistance-currentDistance)*.2;
      const distance=currentDistance; const p=path.getPointAtLength(distance), a=path.getPointAtLength(Math.max(0,distance-2)), b=path.getPointAtLength(Math.min(length,distance+2));
      const angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
      const turn=currentAngle===null?0:((angle-currentAngle+540)%360)-180;
      currentAngle=snap||currentAngle===null?angle:currentAngle+turn*.22;
      plane.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${currentAngle})`);
      trail.style.strokeDashoffset=String(length-distance);plane.style.opacity=target<start-40||target>end+40?'0':'1';
      if(Math.abs(targetDistance-currentDistance)>.2||Math.abs(turn)>.2)schedule();
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
    const measure=()=>{
      // Mobile gets neither airplane nor trail, including phones in landscape.
      if(query.matches||mobileQuery.matches){length=0;svg.style.visibility='hidden';return;}
      const width=host.clientWidth, height=host.scrollHeight, top=host.getBoundingClientRect().top+window.scrollY;
      const sections=['sobre','metodologia','depoimentos','faq'].map(id=>host.querySelector(`#${id}`)).filter(Boolean);
      if(sections.length<2){length=0;svg.style.visibility='hidden';return;}
      const ys=sections.map(section=>section.getBoundingClientRect().top+window.scrollY-top);
      const xs=ys.map((_,i)=>width*(i%2?.035:.965));
      start=ys[0]-65;end=ys[ys.length-1]+90;
      let d=`M ${xs[0]} ${start}`;
      for(let i=1;i<ys.length;i++){
        const boundary=ys[i];
        d+=` L ${xs[i-1]} ${boundary-80} C ${xs[i-1]} ${boundary-20}, ${xs[i]} ${boundary+20}, ${xs[i]} ${boundary+70}`;
      }
      d+=` L ${xs[xs.length-1]} ${end}`;
      currentDistance=null;currentAngle=null;
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);path.setAttribute('d',d);trail.setAttribute('d',d);length=path.getTotalLength();trail.style.strokeDasharray=String(length);schedule();
    };
    const observer=new ResizeObserver(measure);observer.observe(host);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);query.addEventListener('change',measure);mobileQuery.addEventListener('change',measure);measure();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);query.removeEventListener('change',measure);mobileQuery.removeEventListener('change',measure)};
  },[]);
  return (
    <svg ref={svgRef} className="flight-journey" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`${artworkId}-body`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffdf5"/><stop offset=".52" stopColor="#fff7e8"/><stop offset="1" stopColor="#adc9d6"/></linearGradient>
        <linearGradient id={`${artworkId}-wing`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff9ec"/><stop offset="1" stopColor="#8eb3c8"/></linearGradient>
        <linearGradient id={`${artworkId}-wake`}><stop stopColor="#669bbb" stopOpacity="0"/><stop offset="1" stopColor="#669bbb" stopOpacity=".45"/></linearGradient>
      </defs>
      <path ref={pathRef} fill="none" stroke="var(--sky)" strokeWidth="1" strokeDasharray="2 10" opacity=".18"/>
      <path ref={trailRef} fill="none" stroke="var(--red)" strokeWidth="1" opacity=".24"/>
      <g ref={planeRef} className="journey-plane" style={{opacity:0}}>
        <g transform="scale(.64) translate(-46 -41)">
          <path d="M-38 26Q-3 28 39 27M-38 57Q-3 54 39 55" fill="none" stroke={`url(#${artworkId}-wake)`} strokeWidth="1.4" strokeLinecap="round"/>
          <path d="m56 36-24-30q-3-2-6-1l9 32-19 2-8-12H3l5 15-5 15h5l8-12 19 2-9 31q3 1 6-1l24-30" fill={`url(#${artworkId}-wing)`} stroke="#01304a" strokeOpacity=".28" strokeWidth=".9" strokeLinejoin="round"/>
          <path d="m26 5 5 1 3 5-6-1ZM26 78l5-1 3-5-6 1Z" fill="#c1121f"/>
          <rect x="35" y="23" width="17" height="8" rx="4" fill="#244c61"/><rect x="37" y="23.5" width="15" height="4.5" rx="2.2" fill="#fef5e4"/>
          <rect x="35" y="51" width="17" height="8" rx="4" fill="#244c61"/><rect x="37" y="51.5" width="15" height="4.5" rx="2.2" fill="#fef5e4"/>
          <path d="M11 38q26-3 67-2c9 0 18 2 20 5-2 3-11 5-20 5q-41 1-67-2Z" fill={`url(#${artworkId}-body)`} stroke="#01304a" strokeOpacity=".35" strokeWidth=".8"/>
          <path d="M14 37.8h11v6.6H14Z" fill="#c1121f"/>
          <path d="m85 37.5 6 1.4 2 2.1-2 2.1-6 1.4 1-3.5Z" fill="#16445e"/>
          <path d="m86 38.4 4 .9 1 1.2h-4.5Z" fill="#91c1d6"/>
          <path d="M28 38.5h48M28 43.5h48" stroke="#01304a" strokeOpacity=".32" strokeWidth="1.2" strokeDasharray="1.2 4.3" strokeLinecap="round"/>
          <path d="m15 40 18-1v4l-18-1Z" fill="#01304a" fillOpacity=".28"/>
          <path d="m38 34 13 1.5M38 48l13-1.5" stroke="#fffaf0" strokeWidth="1" strokeOpacity=".8"/>
        </g>
      </g>
    </svg>
  );
}
