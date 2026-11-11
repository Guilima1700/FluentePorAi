'use client';

import { useId, useState } from 'react';
import { ChevronDown, Quote } from 'lucide-react';

export default function StudentStory({ story }) {
  const [expanded, setExpanded] = useState(false);
  const fullStoryId = useId();
  return (
    <>
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
      <figcaption className="story-author"><strong>{story.name}</strong><span>{story.byline}</span></figcaption>
      <div className="story-copy">
        <blockquote hidden={expanded} className="story-preview"><p>{story.preview}</p></blockquote>
        <blockquote id={fullStoryId} hidden={!expanded} className="story-full">
          {story.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </blockquote>
      </div>
      <button
        type="button"
        className="story-expand"
        aria-expanded={expanded}
        aria-controls={fullStoryId}
        onClick={() => setExpanded(value => !value)}
      >
        <span>{expanded ? 'Mostrar menos' : 'Ler depoimento completo'}<span className="sr-only"> de {story.name}</span></span>
        <ChevronDown size={17} aria-hidden="true" />
      </button>
    </>
  );
}
