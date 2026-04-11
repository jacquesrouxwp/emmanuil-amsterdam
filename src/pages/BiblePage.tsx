import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Share2, BookOpen, Loader } from 'lucide-react';
import { hapticFeedback, shareUrl } from '@/lib/telegram';
import { useT, useLang } from '@/i18n/translations';
import { prepareShare } from '@/lib/api';

type BibleBook = { abbrev: string; name: string; chapters: string[][] };
type View = 'books' | 'chapters' | 'verses';

const OT_COUNT = 39;

const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export function BiblePage() {
  const t = useT();
  const lang = useLang();
  const [bible, setBible] = useState<BibleBook[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('books');
  const [bookIdx, setBookIdx] = useState(0);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [sharing, setSharing] = useState(false);
  const versesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('@/data/bible/ru_synodal.json').then((mod) => {
      setBible(mod.default as BibleBook[]);
      setLoading(false);
    });
  }, []);

  const goToBook = (idx: number) => {
    hapticFeedback('light');
    setBookIdx(idx);
    setChapterIdx(0);
    setSelectedVerse(null);
    setView('chapters');
  };

  const goToChapter = (idx: number) => {
    hapticFeedback('light');
    setChapterIdx(idx);
    setSelectedVerse(null);
    setView('verses');
    setTimeout(() => versesRef.current?.scrollTo({ top: 0 }), 50);
  };

  const toggleVerse = (idx: number) => {
    hapticFeedback('light');
    setSelectedVerse((prev) => (prev === idx ? null : idx));
  };

  const handleShareVerse = async () => {
    if (!bible || selectedVerse === null) return;
    setSharing(true);
    hapticFeedback('medium');

    const book = bible[bookIdx];
    const verse = book.chapters[chapterIdx][selectedVerse];
    const ref = `${book.name} ${chapterIdx + 1}:${selectedVerse + 1}`;
    const text = `${verse}\n— ${ref}`;

    const tg = (window as any).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;

    if (userId && tg?.shareMessage) {
      try {
        const { id } = await prepareShare({ userId, title: ref, body: verse });
        tg.shareMessage(id, () => {});
      } catch {
        shareUrl('https://t.me/myconclaw_bot/app', text);
      }
    } else {
      shareUrl('https://t.me/myconclaw_bot/app', text);
    }
    setSharing(false);
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
          <p style={{ fontSize: 14 }}>{t.bible.title}…</p>
        </div>
      </div>
    );
  }

  if (!bible) return null;

  const book = bible[bookIdx];
  const otBooks = bible.slice(0, OT_COUNT);
  const ntBooks = bible.slice(OT_COUNT);

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        {view !== 'books' && (
          <button
            onClick={() => { hapticFeedback('light'); setView(view === 'verses' ? 'chapters' : 'books'); setSelectedVerse(null); }}
            style={{ padding: '6px 8px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ChevronLeft size={20} color="var(--text-primary)" />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            {view === 'books' ? t.bible.title : view === 'chapters' ? book.name : `${book.name} ${chapterIdx + 1}`}
          </h1>
          {view === 'books' && (
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{t.bible.translation}</p>
          )}
          {view === 'chapters' && (
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
              {book.chapters.length} {t.bible.chapter.toLowerCase()}
              {book.chapters.length !== 1 ? (lang === 'ru' || lang === 'ua' ? 'ов' : 's') : ''}
            </p>
          )}
        </div>
        {view === 'books' && (
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,169,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} color="#C9A96E" />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* BOOKS VIEW */}
        {view === 'books' && (
          <motion.div key="books" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
            {/* Old Testament */}
            <div style={{ marginBottom: 8, padding: '4px 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-tertiary)' }}>{t.bible.oldTestament}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
              {otBooks.map((b, i) => (
                <button key={b.abbrev} onClick={() => goToBook(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', borderBottom: i < otBooks.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <span style={{ fontSize: 15 }}>{b.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{b.chapters.length}</span>
                </button>
              ))}
            </div>

            {/* New Testament */}
            <div style={{ marginBottom: 8, padding: '4px 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-tertiary)' }}>{t.bible.newTestament}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
              {ntBooks.map((b, i) => (
                <button key={b.abbrev} onClick={() => goToBook(OT_COUNT + i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', borderBottom: i < ntBooks.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <span style={{ fontSize: 15 }}>{b.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{b.chapters.length}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* CHAPTERS VIEW */}
        {view === 'chapters' && (
          <motion.div key="chapters" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {book.chapters.map((_, i) => (
                <button key={i} onClick={() => goToChapter(i)}
                  style={{ padding: '14px 8px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>
                  {i + 1}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* VERSES VIEW */}
        {view === 'verses' && (
          <motion.div key="verses" ref={versesRef} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 12 }}>{t.bible.tapToShare}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {book.chapters[chapterIdx].map((verse, i) => {
                const isSelected = selectedVerse === i;
                return (
                  <button key={i} onClick={() => toggleVerse(i)}
                    style={{
                      display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 10, textAlign: 'left', cursor: 'pointer', width: '100%',
                      background: isSelected ? 'rgba(201,169,110,0.15)' : 'transparent',
                      border: `1px solid ${isSelected ? 'rgba(201,169,110,0.4)' : 'transparent'}`,
                      transition: 'all 0.15s',
                    }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#C9A96E' : 'var(--text-tertiary)', minWidth: 22, paddingTop: 2, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)' }}>{verse}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share button — floats when verse selected */}
      <AnimatePresence>
        {view === 'verses' && selectedVerse !== null && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            style={{ position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 50 }}
          >
            <button onClick={handleShareVerse} disabled={sharing}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: 14,
                background: 'linear-gradient(135deg, #C9A96E, #b8934a)',
                color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 20px rgba(201,169,110,0.4)',
                border: 'none', opacity: sharing ? 0.7 : 1,
              }}>
              <Share2 size={18} />
              {t.bible.shareVerse} — {book.name} {chapterIdx + 1}:{selectedVerse + 1}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
