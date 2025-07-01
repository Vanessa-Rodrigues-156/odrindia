// components/VisionariesGallery.tsx

import React from 'react';

interface Visionary {
  name: string;
  title: string;
  imageUrl: string;
  alt: string;
  fallbackUrl?: string;
  ariaLabel: string;
}

const visionaries: Visionary[] = [
  {
    name: 'Ethan Katsh',
    title: 'Father of ODR, Founder of ODR Info',
    imageUrl: '/visionaries/ethan.jpg',
    fallbackUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9c5f16be-c5c4-495d-b531-2414378234cf.png',
    alt: 'Portrait of Ethan Katsh, Father of Online Dispute Resolution, Founder of ODR Info, depicted with scholarly attire and thoughtful expression',
    ariaLabel: 'Ethan Katsh, Father of ODR, Founder of ODR Info',
  },

  {
    name: 'Leah Wing',
    title: 'Senior Lecturer II, Legal Studies',
    imageUrl: '/visionaries/leah.jpg',
    fallbackUrl: 'https://placehold.co/150x150?text=Image+Unavailable',
    alt: 'Portrait of Leah Wing, Senior Lecturer II of Legal Studies, depicted in warm tones with attentive gaze',
    ariaLabel: 'Leah Wing Senior Lecturer II of Legal Studies',
  },
  {
    name: 'Chittu Nagarajan',
    title: 'Co-founder, odr.com',
    imageUrl: '/visionaries/chittu.png',
    fallbackUrl: 'https://placehold.co/150x150?text=Image+Unavailable',
    alt: 'Portrait of Chittu Nagarajan, co-founder of odr.com, with approachable expression and professional attire',
    ariaLabel: 'Chittu Nagarajan, co-founder odr.com',
  },
  {
    name: 'Amy J. Schmitz',
    title: 'Professor, \nThe Ohio State Moritz College of Law',
    imageUrl: '/visionaries/amy.jpg',
    fallbackUrl: 'https://placehold.co/150x150?text=Image+Unavailable',
    alt: 'Portrait of Amy J. Schmitz, Professor at The Ohio State Moritz College of Law, wearing professional attire with a confident smile',
    ariaLabel: 'Amy J. Schmitz is a professor, The Ohio State Moritz College of Law',
  },
  {
    name: 'Suman Kalani',
    title: `Associate Professor,\nSVKM's Pravin Gandhi College of Law`,
    imageUrl: '/visionaries/suman.jpg',
    fallbackUrl: 'https://placehold.co/150x150?text=Image+Unavailable',
    alt: `Portrait of Suman Kalani, Associate Professor at SVKM's Pravin Gandhi College of Law, portrayed with scholarly professionalism`,
    ariaLabel: `Suman Kalani Associate professor at SVKM's Pravin Gandhi College of Law`,
  },
];

const VisionariesGallery: React.FC = () => {
  // 3D tilt effect on mouse move
  React.useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.card');
    cards.forEach(card => {
      const cardInner = card.querySelector<HTMLElement>('.card-inner');
      if (!cardInner) return;
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 7;
        const rotateY = ((x - centerX) / centerX) * 7;
        cardInner.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
      });
      card.addEventListener('mouseleave', () => {
        cardInner.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
      });
    });
    return () => {
      cards.forEach(card => {
        card.replaceWith(card.cloneNode(true));
      });
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-sky-100">
      <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#0a1e42] sm:text-5xl md:text-6xl text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1e42] to-[#3a86ff]">
          ODR Lab Visionaries
        </span>
      </h2>
      <p className="mx-auto max-w-xl mb-12 text-lg text-gray-600 sm:text-xl md:text-2xl text-center font-medium">
        Pioneers of Collaborative ODR Innovation.
      </p>
      <div className="mt-2 mb-8 mx-auto w-24 h-1 bg-gradient-to-r from-[#3a86ff] to-indigo-600 rounded-full"></div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {visionaries.slice(0, 3).map((v, idx) => (
            <article
              className={
                `card cursor-pointer [perspective:1000px] animate-floatUpDown` +
                (idx ? ` [animation-delay:${idx * 0.2}s]` : '')
              }
              role="group"
              tabIndex={0}
              aria-label={v.ariaLabel}
              key={v.name}
            >
              {/* Your existing card content */}
              <div className="card-inner transition-transform duration-500 ease-[ease] [transform-style:preserve-3d] will-change-transform">
                <div className="relative p-8 flex flex-col items-center gap-4 h-full rounded-2xl shadow-lg bg-white overflow-hidden [backface-visibility:hidden]">
                  <img
                    src={v.imageUrl}
                    alt={v.alt}
                    loading="lazy"
                    className="
                      rounded-full border-4 border-blue-600
                      w-[65%] h-[54%]
                      sm:w-[120px] sm:h-[120px]
                      md:w-[160px] md:h-[160px]
                      lg:w-[180px] lg:h-[180px]
                      object-cover flex-shrink-0 shadow-lg transition-transform duration-300 ease-[ease]"
                    onError={e => {
                      if (v.fallbackUrl) (e.currentTarget as HTMLImageElement).src = v.fallbackUrl;
                    }}
                  />
                  <h3 className="name font-bold text-xl text-slate-800 text-center select-none">{v.name}</h3>
                  <p className="title font-medium text-base text-slate-600 text-center leading-tight select-none" dangerouslySetInnerHTML={{ __html: v.title.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Centered container for last 2 cards */}
        <div className="flex justify-center gap-8 mt-8">
          {visionaries.slice(3).map((v, idx) => (
            <article
              className={
                `card cursor-pointer [perspective:1000px] animate-floatUpDown` +
                ` [animation-delay:${(idx + 3) * 0.2}s]`
              }
              role="group"
              tabIndex={0}
              aria-label={v.ariaLabel}
              key={v.name}
            >
              {/* Your existing card content */}
              <div className="card-inner transition-transform duration-500 ease-[ease] [transform-style:preserve-3d] will-change-transform">
                <div className="relative p-8 flex flex-col items-center gap-4 h-full rounded-2xl shadow-lg bg-white overflow-hidden [backface-visibility:hidden]">
                  <img
                    src={v.imageUrl}
                    alt={v.alt}
                    loading="lazy"
                    className="rounded-full border-4 border-blue-600
                      w-[65%] h-[54%]
                      sm:w-[120px] sm:h-[120px]
                      md:w-[160px] md:h-[160px]
                      lg:w-[180px] lg:h-[180px]
                      object-cover flex-shrink-0 shadow-lg transition-transform duration-300 ease-[ease]"
                    onError={e => {
                      if (v.fallbackUrl) (e.currentTarget as HTMLImageElement).src = v.fallbackUrl;
                    }}
                  />
                  <h3 className="name font-bold text-xl text-slate-800 text-center select-none">{v.name}</h3>
                  <p className="title font-medium text-base text-slate-600 text-center leading-tight select-none" dangerouslySetInnerHTML={{ __html: v.title.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div >
      {/* <style>{`
        .card { perspective: 1000px; }
        .card-inner {
          transition: transform 0.5s ease;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .card:hover .card-inner {
          transform: rotateY(10deg) rotateX(5deg) translateZ(30px);
          box-shadow: 0 20px 30px rgb(0 0 0 / 0.15);
        }
        .card-front, .card-back {
          backface-visibility: hidden;
          border-radius: 1rem;
          box-shadow: 0 10px 20px rgb(0 0 0 / 0.1);
          background: white;
          overflow: hidden;
        }
        .card-front {
          position: relative;
          padding: 2rem 1.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          min-height: 520px;
          width: 20vw;
        }
        .card-front img {
          border-radius: 50%;
          border: 4px solid #2563EB;
          width: 420px;
          height: 320px;
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: 0 8px 15px rgb(37 99 235 / 0.3);
          transition: transform 0.3s ease;
        }
        .card:hover .card-front img {
          transform: scale(1.1);
        }
        .name {
          font-weight: 700;
          font-size: 1.25rem;
          color: #1e293b;
          text-align: center;
          user-select: none;
        }
        .title {
          font-weight: 500;
          font-size: 1rem;
          color: #475569;
          text-align: center;
          line-height: 1.3;
          user-select: none;
        }
        .gallery-container {
          max-width: 80vw;
          margin-left: auto;
          margin-right: auto;
          padding: 2rem 1rem;
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }
        h2.section-title {
          font-weight: 900;
          font-size: 2.25rem;
          color: #1e293b;
          text-align: center;
          margin-bottom: 0.25rem;
          user-select: none;
        }
        p.section-subtitle {
          text-align: center;
          margin-bottom: 3rem;
          color: #64748b;
          user-select: none;
          font-weight: 500;
        }
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style> */}
    </section >
  );
};

export default VisionariesGallery;