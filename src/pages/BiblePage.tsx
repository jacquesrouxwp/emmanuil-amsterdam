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

const SHARE_LABELS: Record<string, { placeholder: string; share: string; cancel: string; commentLabel: string }> = {
  ua: { placeholder: 'Додати коментар (необов\'язково)...', share: 'Поділитися', cancel: 'Скасувати', commentLabel: 'Ваш коментар' },
  ru: { placeholder: 'Добавить комментарий (необязательно)...', share: 'Поделиться', cancel: 'Отмена', commentLabel: 'Ваш комментарий' },
  en: { placeholder: 'Add a comment (optional)...', share: 'Share', cancel: 'Cancel', commentLabel: 'Your comment' },
  nl: { placeholder: 'Voeg een opmerking toe (optioneel)...', share: 'Delen', cancel: 'Annuleren', commentLabel: 'Uw opmerking' },
  es: { placeholder: 'Añadir un comentario (opcional)...', share: 'Compartir', cancel: 'Cancelar', commentLabel: 'Tu comentario' },
};

export function BiblePage() {
  const t = useT();
  const lang = useLang();
  const [bible, setBible] = useState<BibleBook[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('books');
  const [bookIdx, setBookIdx] = useState(0);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [shareModal, setShareModal] = useState(false);
  const [comment, setComment] = useState('');
  const [sharing, setSharing] = useState(false);
  const versesRef = useRef<HTMLDivElement>(null);
  const sl = SHARE_LABELS[lang] ?? SHARE_LABELS.en;

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

  const openShareModal = () => {
    hapticFeedback('medium');
    setComment('');
    setShareModal(true);
  };

  const handleShareVerse = async () => {
    if (!bible || selectedVerse === null) return;
    setSharing(true);
    hapticFeedback('medium');

    const book = bible[bookIdx];
    const verse = book.chapters[chapterIdx][selectedVerse];
    const ref = `${book.name} ${chapterIdx + 1}:${selectedVerse + 1}`;
    const body = comment.trim() ? `${verse}\n\n💬 ${comment.trim()}` : verse;
    const text = `${body}\n— ${ref}`;

    const tg = (window as any).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;

    if (userId && tg?.shareMessage) {
      try {
        const { id } = await prepareShare({ userId, title: ref, body });
        tg.shareMessage(id, () => {});
      } catch {
        shareUrl('https://t.me/myconclaw_bot/app', text);
      }
    } else {
      shareUrl('https://t.me/myconclaw_bot/app', text);
    }
    setSharing(false);
    setShareModal(false);
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
        {view === 'verses' && selectedVerse !== null && !shareModal && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            style={{ position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 50 }}
          >
            <button onClick={openShareModal}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: 14,
                background: 'linear-gradient(135deg, #C9A96E, #b8934a)',
                color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 20px rgba(201,169,110,0.4)', border: 'none',
              }}>
              <Share2 size={18} />
              {t.bible.shareVerse} — {book.name} {chapterIdx + 1}:{selectedVerse + 1}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share modal with optional comment */}
      <AnimatePresence>
        {shareModal && bible && selectedVerse !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShareModal(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101, background: 'var(--bg-primary)', borderRadius: '20px 20px 0 0', padding: '20px 16px 32px' }}
            >
              {/* Drag handle */}
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border-light)', margin: '0 auto 20px' }} />

              {/* Verse preview */}
              <div style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {bible[bookIdx].chapters[chapterIdx][selectedVerse]}
                </p>
                <p style={{ fontSize: 12, color: '#C9A96E', fontWeight: 600 }}>
                  — {bible[bookIdx].name} {chapterIdx + 1}:{selectedVerse + 1}
                </p>
              </div>

              {/* Comment field */}
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{sl.commentLabel}</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={sl.placeholder}
                rows={3}
                autoFocus
                style={{
                  width: '100%', borderRadius: 12, padding: '10px 14px', fontSize: 14, lineHeight: 1.5,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)', resize: 'none', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button onClick={() => setShareModal(false)}
                  style={{ flex: 1, padding: '13px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  {sl.cancel}
                </button>
                <button onClick={handleShareVerse} disabled={sharing}
                  style={{ flex: 2, padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg, #C9A96E, #b8934a)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: sharing ? 0.7 : 1 }}>
                  <Share2 size={16} />
                  {sl.share}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
