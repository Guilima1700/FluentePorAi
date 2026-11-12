'use client';

import { ArrowUpRight, Quote } from 'lucide-react';

export default function StudentStory({ story }) {
  return (
    <>
      <figcaption className="story-person">
      <div className="story-photo">
        <img
          src={story.photo}
          alt={story.name === 'Renata e família' ? 'Renata com Sophia e Davi' : `Retrato de ${story.name}`}
          width={story.width}
          height={story.height}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: story.position }}
        />
        <span className="story-photo-badge" aria-hidden="true"><Quote size={20} strokeWidth={1.5} /></span>
      </div>
      <div className="story-author"><strong>{story.name}</strong><span>{story.byline}</span></div>
      </figcaption>
      <div className="story-copy">
        <Quote size={22} strokeWidth={1.3} aria-hidden="true" />
        <blockquote className="story-preview"><p>{story.preview}</p></blockquote>
      </div>
      <a className="story-expand" href={`/depoimentos/#${story.id}`}>
        <span>Ler relato completo<span className="sr-only"> de {story.name}</span></span>
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </>
  );
}
