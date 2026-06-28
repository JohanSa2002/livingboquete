import { useCallback, useEffect, useState } from 'react';
import Masonry, { type MasonryItem } from './Masonry';

interface GalleryItem {
  id: string;
  cat: string;
  label: { es: string; en: string };
  img: string;
}

interface CategoryDef {
  id: string;
  label: { es: string; en: string };
}

interface Props {
  items: GalleryItem[];
  categories: CategoryDef[];
}

const HEIGHTS = [400, 300, 500, 350, 450, 280, 520, 380, 420, 320, 480, 360];

export default function GalleryMasonry({ items, categories }: Props) {
  const [activeCat, setActiveCat] = useState('all');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');

  useEffect(() => {
    const currentLang = document.documentElement.getAttribute('data-lang') as 'es' | 'en' | null;
    if (currentLang) setLang(currentLang);

    const observer = new MutationObserver(() => {
      const l = document.documentElement.getAttribute('data-lang') as 'es' | 'en' | null;
      if (l) setLang(l);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => observer.disconnect();
  }, []);

  const filtered = activeCat === 'all' ? items : items.filter(i => i.cat === activeCat);

  const masonryItems: MasonryItem[] = filtered.map((item, i) => ({
    id: item.id,
    img: item.img,
    height: HEIGHTS[i % HEIGHTS.length],
    label: item.label[lang],
  }));

  const handleItemClick = useCallback(
    (mItem: MasonryItem) => {
      setLightboxSrc(mItem.img);
      setLightboxAlt(mItem.label ?? '');
    },
    []
  );

  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  return (
    <>
      {/* Category filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
        {categories.map(c => {
          const isActive = c.id === activeCat;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              style={{
                cursor: 'pointer',
                padding: '9px 18px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                border: `1px solid ${isActive ? '#B95C36' : 'rgba(37,29,20,.16)'}`,
                background: isActive ? '#B95C36' : 'transparent',
                color: isActive ? '#F7F1E6' : '#251D14',
                transition: 'all .2s',
              }}
            >
              {c.label[lang]}
            </button>
          );
        })}
      </div>

      {/* Masonry grid */}
      <Masonry
        items={masonryItems}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={0.95}
        blurToFocus={true}
        onItemClick={handleItemClick}
      />

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeLightbox(); }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 32,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
          <img
            src={lightboxSrc}
            alt={lightboxAlt}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 12,
            }}
          />
        </div>
      )}
    </>
  );
}
