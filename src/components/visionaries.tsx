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
    name: 'Amy J. Schmitz',
    title: 'Professor, The Ohio State Moritz College of Law',
    imageUrl: '/visionaries/amy.jpg',
    fallbackUrl: 'https://placehold.co/150x150?text=Image+Unavailable',
    alt: 'Portrait of Amy J. Schmitz, Professor at The Ohio State Moritz College of Law, wearing professional attire with a confident smile',
    ariaLabel: 'Amy J. Schmitz is a professor, The Ohio State Moritz College of Law',
  },
  {
    name: 'Ms. Leah Wing',
    title: 'Senior Lecturer II, Legal Studies',
    imageUrl: '/visionaries/leah.jpg',
    fallbackUrl: 'https://placehold.co/150x150?text=Image+Unavailable',
    alt: 'Portrait of Ms. Leah Wing, Senior Lecturer II of Legal Studies, depicted in warm tones with attentive gaze',
    ariaLabel: 'Ms. Leah Wing Senior Lecturer II of Legal Studies',
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
    <section className="my-16">
    <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#0a1e42] sm:text-5xl md:text-6xl text-center">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1e42] to-[#3a86ff]">
        ODR Lab Visionaries
    </span>
    </h2>
    <p className="section-subtitle mx-auto max-w-xl mb-12 text-lg text-gray-600 sm:text-xl md:text-2xl text-center font-medium">
      Celebrating the leaders whose visionary work has shaped and advanced the ODR ecosystem worldwide.
    </p>
    <div className="mt-2 mb-8 mx-auto w-24 h-1 bg-gradient-to-r from-[#3a86ff] to-indigo-600 rounded-full"></div>
      <div className="gallery-container grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto px-4">
        {visionaries.map((v, idx) => (
          <article
            className="card cursor-pointer"
            role="group"
            tabIndex={0}
            aria-label={v.ariaLabel}
            key={v.name}
            style={{ animation: 'floatUpDown 3.5s ease-in-out infinite', animationDelay: `${idx * 0.2}s` }}
          >
            <div className="card-inner">
              <div className="card-front">
                <img
                  src={v.imageUrl}
                  alt={v.alt}
                  loading="lazy"
                  onError={e => {
                    if (v.fallbackUrl) (e.currentTarget as HTMLImageElement).src = v.fallbackUrl;
                  }}
                />
                <h3 className="name">{v.name}</h3>
                <p className="title" dangerouslySetInnerHTML={{ __html: v.title.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          </article>
        ))}
      </div>
      <style>{`
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
          min-height: 320px;
        }
        .card-front img {
          border-radius: 50%;
          border: 4px solid #2563EB;
          width: 120px;
          height: 120px;
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
          max-width: 1200px;
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
      `}</style>
    </section>
  );
};

export default VisionariesGallery;