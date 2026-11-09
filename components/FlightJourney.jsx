'use client';
import { useEffect, useRef } from 'react';

// A continuous route measured from the actual sections, including after font and image loading.
export default function FlightJourney() {
  const svgRef=useRef(null), pathRef=useRef(null), trailRef=useRef(null), planeRef=useRef(null);
  useEffect(()=>{
    const svg=svgRef.current, path=pathRef.current, trail=trailRef.current, plane=planeRef.current;
    const host=svg.parentElement; const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery=window.matchMedia('(max-width: 767.98px), (hover: none) and (pointer: coarse)');
    let frame=0, length=0, start=0, end=1;
    const update=()=>{
      frame=0; if(query.matches||mobileQuery.matches||!length){svg.style.visibility='hidden';return} svg.style.visibility='visible';
      const target=window.innerHeight*.66-host.getBoundingClientRect().top;
      // y is monotonic; binary search puts the airplane at the current viewport position.
      let low=0,high=length; for(let i=0;i<15;i++){const mid=(low+high)/2;if(path.getPointAtLength(mid).y<target)low=mid;else high=mid}
      const distance=(low+high)/2; const p=path.getPointAtLength(distance), a=path.getPointAtLength(Math.max(0,distance-2)), b=path.getPointAtLength(Math.min(length,distance+2));
      plane.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI})`);
      trail.style.strokeDashoffset=String(length-distance);plane.style.opacity=target<start-40||target>end+40?'0':'1';
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
    const measure=()=>{
      // Mobile gets neither airplane nor trail, including phones in landscape.
      if(query.matches||mobileQuery.matches){length=0;svg.style.visibility='hidden';return;}
      const width=host.clientWidth, height=host.scrollHeight, top=host.getBoundingClientRect().top+window.scrollY;
      const ys=['sobre','cursos','metodologia','diferenciais','contato'].map(id=>document.getElementById(id).getBoundingClientRect().top+window.scrollY-top);
      const xs=[.965,.035,.965,.035,.965].map(x=>width*x);
      start=ys[0]-65;end=ys[4]+90;
      let d=`M ${xs[0]} ${start}`;
      for(let i=1;i<ys.length;i++){
        const boundary=ys[i];
        d+=` L ${xs[i-1]} ${boundary-80} C ${xs[i-1]} ${boundary-20}, ${xs[i]} ${boundary+20}, ${xs[i]} ${boundary+70}`;
      }
      d+=` L ${xs[4]} ${end}`;
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);path.setAttribute('d',d);trail.setAttribute('d',d);length=path.getTotalLength();trail.style.strokeDasharray=String(length);schedule();
    };
    const observer=new ResizeObserver(measure);observer.observe(host);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);query.addEventListener('change',measure);mobileQuery.addEventListener('change',measure);measure();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);query.removeEventListener('change',measure);mobileQuery.removeEventListener('change',measure)};
  },[]);
  return <svg ref={svgRef} className="flight-journey" aria-hidden="true" preserveAspectRatio="none"><path ref={pathRef} fill="none" stroke="var(--sky)" strokeWidth="1" strokeDasharray="3 9" opacity=".22"/><path ref={trailRef} fill="none" stroke="var(--red)" strokeWidth="1.3" opacity=".35"/><g ref={planeRef} className="journey-plane" style={{opacity:0}}><circle r="25" fill="var(--paper)" opacity=".95"/><g transform="translate(-24 -24) scale(.6)"><path d="M69 37 47 32 30 7H20l9 25-17-1-6-9H0l4 18-4 18h6l6-9 17-1-9 25h10l17-25 22-5c10-2 10-4 0-6Z" fill="var(--navy)"/><path d="m30 7 17 25-6-1L24 7ZM30 73l17-25-6 1-17 24Z" fill="var(--red)"/></g></g></svg>;
}
