import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const WEDDING_DATE = new Date('2025-07-12T14:00:00');

const GALLERY_IMAGES = [
  {
    url: 'https://cdn.poehali.dev/projects/990f14c3-e120-4acd-bfea-32e07c81b509/files/2dc7b611-f750-493c-b522-68c976067072.jpg',
    alt: 'Цветочная арка',
    className: 'gallery-item-1',
  },
  {
    url: 'https://cdn.poehali.dev/projects/990f14c3-e120-4acd-bfea-32e07c81b509/files/5d298c5c-4299-4e0f-b9ff-e9d238a463ac.jpg',
    alt: 'Молодожёны в лесу',
    className: 'gallery-item-2',
  },
  {
    url: 'https://cdn.poehali.dev/projects/990f14c3-e120-4acd-bfea-32e07c81b509/files/4e927f83-afa4-4438-9766-f693542f6049.jpg',
    alt: 'Декор стола',
    className: 'gallery-item-3',
  },
];

const PROGRAM = [
  { time: '13:00', title: 'Сбор гостей', desc: 'Встреча у входа в поместье, приветственные напитки', icon: 'Users' },
  { time: '14:00', title: 'Церемония', desc: 'Выездная регистрация в розовом саду', icon: 'Heart' },
  { time: '15:00', title: 'Фотосессия', desc: 'Совместные фото с молодожёнами на территории', icon: 'Camera' },
  { time: '16:30', title: 'Банкет', desc: 'Торжественный ужин в банкетном зале', icon: 'Utensils' },
  { time: '18:00', title: 'Танцы и развлечения', desc: 'Живая музыка, конкурсы, танцевальная программа', icon: 'Music' },
  { time: '23:00', title: 'Финальный фейерверк', desc: 'Торжественное завершение вечера', icon: 'Sparkles' },
];

const PLAYLIST = [
  { artist: 'Ludovico Einaudi', title: 'Experience' },
  { artist: 'Ed Sheeran', title: 'Perfect' },
  { artist: 'John Legend', title: 'All of Me' },
  { artist: 'Christina Perri', title: 'A Thousand Years' },
  { artist: 'James Arthur', title: "Say You Won't Let Go" },
  { artist: 'Norah Jones', title: 'Come Away With Me' },
];

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);
  return timeLeft;
}

function RevealBlock({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Index() {
  const countdown = useCountdown(WEDDING_DATE);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: '', guests: '1', dietary: '', message: '', attending: 'yes' });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [suggestedSong, setSuggestedSong] = useState('');
  const [songSuggestions, setSongSuggestions] = useState<string[]>([]);

  const navItems = [
    { id: 'about', label: 'О нас' },
    { id: 'program', label: 'Программа' },
    { id: 'gallery', label: 'Галерея' },
    { id: 'playlist', label: 'Плейлист' },
    { id: 'contacts', label: 'Контакты' },
    { id: 'rsvp', label: 'RSVP' },
  ];

  useEffect(() => {
    const handler = () => {
      const sections = ['hero', 'about', 'program', 'gallery', 'playlist', 'contacts', 'rsvp'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleRsvp = (e: React.FormEvent) => { e.preventDefault(); setRsvpSent(true); };

  const addSong = () => {
    if (suggestedSong.trim()) { setSongSuggestions(prev => [...prev, suggestedSong.trim()]); setSuggestedSong(''); }
  };

  const allTracks = [...PLAYLIST, ...songSuggestions.map(s => ({ artist: 'Гость', title: s }))];

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-glass" style={{ borderBottom: '1px solid var(--warm-beige)' }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <button onClick={() => scrollTo('hero')} className="font-display text-xl italic" style={{ color: 'var(--sage)', letterSpacing: '0.04em' }}>
            А & М
          </button>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="text-xs uppercase tracking-widest transition-colors"
                style={{ color: activeSection === item.id ? 'var(--sage)' : 'var(--text-muted)', fontFamily: 'Golos Text', fontWeight: 500 }}>
                {item.label}
              </button>
            ))}
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(v => !v)} style={{ color: 'var(--sage)' }}>
            <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-5 flex flex-col gap-4" style={{ borderTop: '1px solid var(--warm-beige)', background: 'var(--cream)' }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="text-left text-sm uppercase tracking-widest py-1"
                style={{ color: 'var(--text-dark)', fontFamily: 'Golos Text' }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center hero-texture pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <span className="animate-float absolute top-24 left-[8%] text-5xl opacity-20" style={{ animationDelay: '0s' }}>🌿</span>
          <span className="animate-float absolute top-40 right-[10%] text-4xl opacity-15" style={{ animationDelay: '1.5s' }}>🌸</span>
          <span className="animate-float absolute bottom-40 left-[15%] text-3xl opacity-15" style={{ animationDelay: '0.8s' }}>🍃</span>
          <span className="animate-float absolute bottom-32 right-[12%] text-4xl opacity-20" style={{ animationDelay: '2s' }}>🌾</span>
        </div>

        <div className="text-center px-6 max-w-2xl relative z-10">
          <div className="text-xs uppercase tracking-[0.3em] mb-8 opacity-0 animate-fade-in"
            style={{ color: 'var(--sage-light)', fontFamily: 'Golos Text', animationFillMode: 'forwards', animationDelay: '0.2s' }}>
            Приглашают на свадьбу
          </div>

          <h1 className="font-display italic opacity-0 animate-fade-up"
            style={{ fontSize: 'clamp(4rem, 14vw, 9rem)', fontWeight: 300, lineHeight: 1.05, color: 'var(--text-dark)', animationFillMode: 'forwards', animationDelay: '0.4s' }}>
            Анна
            <span style={{ color: 'var(--sage)', display: 'block' }}>&</span>
            Михаил
          </h1>

          <div className="mt-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards', animationDelay: '0.9s' }}>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div style={{ height: '1px', background: 'var(--warm-beige)', width: '60px' }} />
              <span className="font-display italic text-2xl" style={{ color: 'var(--warm-brown)' }}>12 июля 2025</span>
              <div style={{ height: '1px', background: 'var(--warm-beige)', width: '60px' }} />
            </div>
            <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)', fontFamily: 'Golos Text' }}>
              Поместье «Лесная усадьба» · Подмосковье
            </p>
          </div>

          {/* COUNTDOWN */}
          <div className="mt-16 opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards', animationDelay: '1.1s' }}>
            <div className="grid grid-cols-4 gap-4 md:gap-10">
              {[
                { value: countdown.days, label: 'Дней' },
                { value: countdown.hours, label: 'Часов' },
                { value: countdown.minutes, label: 'Минут' },
                { value: countdown.seconds, label: 'Секунд' },
              ].map(({ value, label }) => (
                <div key={label} className="countdown-block">
                  <span className="countdown-number">{String(value).padStart(2, '0')}</span>
                  <span className="countdown-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards', animationDelay: '1.4s' }}>
            <button className="btn-sage" onClick={() => scrollTo('rsvp')}>Подтвердить присутствие</button>
          </div>
        </div>

        <button
          onClick={() => scrollTo('about')}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
          style={{ color: 'var(--text-muted)', animationFillMode: 'forwards', animationDelay: '1.8s', background: 'none', border: 'none', cursor: 'pointer' }}>
          <span className="text-xs uppercase tracking-widest" style={{ fontFamily: 'Golos Text' }}>Листать</span>
          <Icon name="ChevronDown" size={16} />
        </button>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealBlock className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--sage-light)', fontFamily: 'Golos Text' }}>Наша история</span>
            <h2 className="font-display italic mt-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text-dark)', fontWeight: 300 }}>О нас</h2>
          </RevealBlock>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <RevealBlock delay={100}>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full" style={{ border: '1px solid var(--warm-beige)' }} />
                <img src={GALLERY_IMAGES[1].url} alt="Анна и Михаил" className="w-full object-cover relative z-10" style={{ aspectRatio: '4/5' }} />
              </div>
            </RevealBlock>

            <RevealBlock delay={250}>
              <div className="space-y-8">
                {[
                  { icon: 'Heart', title: 'Как мы встретились', text: 'Наша история началась весной 2021 года на общей вечеринке друзей. Михаил рассказывал о горных походах, а Анна слушала с улыбкой — и с того вечера мы не расставались.' },
                  { icon: 'MapPin', title: 'Предложение', text: 'Михаил сделал предложение на закате в горах Карачаево-Черкессии — именно там, где оба мечтали оказаться вместе. Она сказала «да», не раздумывая ни секунды.' },
                  { icon: 'Calendar', title: '12 июля 2025', text: 'Мы выбрали лето — тепло, природа и близкие люди рядом. Будем рады разделить этот день с вами.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-5 items-start">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--warm-beige)' }}>
                      <Icon name={item.icon} size={18} style={{ color: 'var(--sage)' }} />
                    </div>
                    <div>
                      <h3 className="font-display italic text-xl mb-2" style={{ color: 'var(--text-dark)' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontFamily: 'Golos Text', fontSize: '0.92rem', lineHeight: 1.75 }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="py-28 px-6" style={{ background: 'var(--warm-beige)' }}>
        <div className="max-w-3xl mx-auto">
          <RevealBlock className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--sage-light)', fontFamily: 'Golos Text' }}>Расписание дня</span>
            <h2 className="font-display italic mt-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text-dark)', fontWeight: 300 }}>Программа</h2>
          </RevealBlock>

          <div>
            {PROGRAM.map((item, i) => (
              <RevealBlock key={i} delay={i * 80}>
                <div className="flex gap-6 items-start py-6" style={{ borderBottom: i < PROGRAM.length - 1 ? '1px solid rgba(139,111,94,0.2)' : 'none' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'var(--sage)' }}>
                    <Icon name={item.icon} size={15} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-4 mb-1 flex-wrap">
                      <span className="font-display italic text-xl" style={{ color: 'var(--text-dark)' }}>{item.title}</span>
                      <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--sage-light)', fontFamily: 'Golos Text' }}>{item.time}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'Golos Text', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealBlock className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--sage-light)', fontFamily: 'Golos Text' }}>Вдохновение</span>
            <h2 className="font-display italic mt-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text-dark)', fontWeight: 300 }}>Галерея</h2>
          </RevealBlock>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((img, i) => (
              <RevealBlock key={i} className={img.className} delay={i * 120}>
                <div className="w-full h-full overflow-hidden group cursor-pointer" style={{ minHeight: i === 0 ? '480px' : '220px' }}>
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ minHeight: 'inherit' }} />
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* PLAYLIST */}
      <section id="playlist" className="py-28 px-6" style={{ background: 'var(--warm-beige)' }}>
        <div className="max-w-2xl mx-auto">
          <RevealBlock className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--sage-light)', fontFamily: 'Golos Text' }}>Музыка вечера</span>
            <h2 className="font-display italic mt-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text-dark)', fontWeight: 300 }}>Плейлист</h2>
            <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'Golos Text' }}>Предложите песню — мы добавим её в программу вечера</p>
          </RevealBlock>

          <div className="mb-10" style={{ border: '1px solid rgba(139,111,94,0.2)', background: 'rgba(255,255,255,0.6)' }}>
            {allTracks.map((track, i) => (
              <RevealBlock key={i} delay={i * 40}>
                <div className="flex items-center gap-4 px-5 py-4 group" style={{ borderBottom: i < allTracks.length - 1 ? '1px solid rgba(139,111,94,0.1)' : 'none' }}>
                  <span className="font-display w-8 text-right flex-shrink-0" style={{ color: 'var(--sage-light)', fontWeight: 300, fontSize: '1.3rem' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="font-display italic" style={{ color: 'var(--text-dark)', fontSize: '1.1rem' }}>{track.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontFamily: 'Golos Text', fontSize: '0.8rem' }}>{track.artist}</div>
                  </div>
                  <Icon name="Music" size={13} style={{ color: 'var(--sage-light)', opacity: 0 }} className="group-hover:opacity-100 transition-opacity" />
                </div>
              </RevealBlock>
            ))}
          </div>

          <RevealBlock delay={300}>
            <div className="flex gap-3">
              <input type="text" className="input-wedding flex-1" placeholder="Исполнитель — Название песни"
                value={suggestedSong} onChange={e => setSuggestedSong(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSong()} />
              <button className="btn-sage px-5 flex items-center gap-2" onClick={addSong}>
                <Icon name="Plus" size={15} />
                <span>Добавить</span>
              </button>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* CONTACTS + MAP */}
      <section id="contacts" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealBlock className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--sage-light)', fontFamily: 'Golos Text' }}>Как нас найти</span>
            <h2 className="font-display italic mt-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text-dark)', fontWeight: 300 }}>Контакты</h2>
          </RevealBlock>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <RevealBlock delay={100}>
              <div className="space-y-8">
                <div>
                  <h3 className="font-display italic text-2xl mb-5" style={{ color: 'var(--sage)' }}>Церемония</h3>
                  <div className="flex gap-3 mb-3">
                    <Icon name="MapPin" size={16} style={{ color: 'var(--sage)', marginTop: '2px' }} className="flex-shrink-0" />
                    <div>
                      <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', fontFamily: 'Golos Text', fontWeight: 500 }}>Поместье «Лесная усадьба»</p>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'Golos Text' }}>Московская обл., Одинцовский р-н, д. Зеленово, 1</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Icon name="Clock" size={16} style={{ color: 'var(--sage)', marginTop: '2px' }} className="flex-shrink-0" />
                    <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'Golos Text' }}>Сбор гостей с 13:00, начало церемонии в 14:00</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--warm-beige)', paddingTop: '2rem' }}>
                  <h3 className="font-display italic text-2xl mb-4" style={{ color: 'var(--sage)' }}>Связаться с нами</h3>
                  <div className="space-y-3">
                    {[
                      { icon: 'Phone', href: 'tel:+79991234567', text: '+7 (999) 123-45-67 — Анна' },
                      { icon: 'Phone', href: 'tel:+79997654321', text: '+7 (999) 765-43-21 — Михаил' },
                      { icon: 'Mail', href: 'mailto:anna.mikhail.wedding@gmail.com', text: 'anna.mikhail.wedding@gmail.com' },
                    ].map(item => (
                      <a key={item.text} href={item.href} className="flex gap-3 items-center group">
                        <Icon name={item.icon} size={15} style={{ color: 'var(--sage)' }} />
                        <span className="text-sm group-hover:underline" style={{ color: 'var(--text-dark)', fontFamily: 'Golos Text' }}>{item.text}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </RevealBlock>

            <RevealBlock delay={200}>
              <div style={{ border: '1px solid var(--warm-beige)', overflow: 'hidden' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d74734.37!2d36.9!3d55.72!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54b5aab678067%3A0xc46a7c1b5ca09921!2z0J7QtNC40L3RhtC-0LLRgdC60LjQuSDRgNCw0LnQvtC9!5e0!3m2!1sru!2sru!4v1234567890"
                  width="100%"
                  height="340"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  title="Карта места проведения"
                />
              </div>
              <div className="flex gap-3 mt-3">
                <a href="https://yandex.ru/maps/?text=Одинцово+Московская+область" target="_blank" rel="noopener noreferrer"
                  className="btn-outline text-xs flex-1 text-center py-3">Яндекс Карты</a>
                <a href="https://maps.google.com/?q=Одинцово,Московская+область" target="_blank" rel="noopener noreferrer"
                  className="btn-outline text-xs flex-1 text-center py-3">Google Maps</a>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-28 px-6 relative overflow-hidden" style={{ background: 'var(--sage-dark)' }}>
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)' }} />
          <span className="animate-float absolute top-12 right-[5%] text-6xl opacity-10" style={{ animationDelay: '0.5s' }}>🌿</span>
          <span className="animate-float absolute bottom-16 left-[8%] text-5xl opacity-10" style={{ animationDelay: '1.2s' }}>🌸</span>
        </div>

        <div className="max-w-xl mx-auto relative z-10">
          <RevealBlock className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Golos Text' }}>Ждём вас</span>
            <h2 className="font-display italic mt-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'white', fontWeight: 300 }}>Подтверждение</h2>
            <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Golos Text' }}>Пожалуйста, ответьте до 1 июня 2025</p>
          </RevealBlock>

          {rsvpSent ? (
            <RevealBlock>
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🌸</div>
                <h3 className="font-display italic text-3xl mb-4" style={{ color: 'white' }}>Спасибо!</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Golos Text', lineHeight: 1.8 }}>
                  Мы получили ваш ответ и очень рады вас видеть на нашем празднике.
                </p>
              </div>
            </RevealBlock>
          ) : (
            <RevealBlock delay={150}>
              <form onSubmit={handleRsvp} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {[{ val: 'yes', label: '✓ Приду' }, { val: 'no', label: '✗ Не смогу' }].map(({ val, label }) => (
                    <button key={val} type="button"
                      onClick={() => setRsvpForm(f => ({ ...f, attending: val }))}
                      className="py-3 text-sm uppercase tracking-widest transition-all"
                      style={{
                        fontFamily: 'Golos Text',
                        background: rsvpForm.attending === val ? 'white' : 'transparent',
                        color: rsvpForm.attending === val ? 'var(--sage-dark)' : 'rgba(255,255,255,0.55)',
                        border: `1px solid ${rsvpForm.attending === val ? 'white' : 'rgba(255,255,255,0.2)'}`,
                        borderRadius: '2px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}>
                      {label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Golos Text' }}>Имя и фамилия *</label>
                  <input required type="text" className="input-wedding" placeholder="Иван Петров"
                    value={rsvpForm.name} onChange={e => setRsvpForm(f => ({ ...f, name: e.target.value }))} />
                </div>

                {rsvpForm.attending === 'yes' && (
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Golos Text' }}>Количество гостей</label>
                    <select className="input-wedding" value={rsvpForm.guests} onChange={e => setRsvpForm(f => ({ ...f, guests: e.target.value }))}>
                      <option value="1">1 человек (только я)</option>
                      <option value="2">2 человека</option>
                      <option value="3">3 человека</option>
                      <option value="4">4 человека</option>
                      <option value="5">5 человек</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Golos Text' }}>Пожелания по питанию</label>
                  <input type="text" className="input-wedding" placeholder="Вегетарианское меню, аллергия на орехи..."
                    value={rsvpForm.dietary} onChange={e => setRsvpForm(f => ({ ...f, dietary: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Golos Text' }}>Пожелания молодожёнам</label>
                  <textarea className="input-wedding resize-none" rows={3} placeholder="Ваши тёплые слова..."
                    value={rsvpForm.message} onChange={e => setRsvpForm(f => ({ ...f, message: e.target.value }))} />
                </div>

                <button type="submit"
                  className="w-full py-4 text-sm uppercase tracking-widest font-medium transition-all hover:-translate-y-px"
                  style={{ background: 'white', color: 'var(--sage-dark)', fontFamily: 'Golos Text', borderRadius: '2px', border: 'none', cursor: 'pointer' }}>
                  Отправить ответ
                </button>
              </form>
            </RevealBlock>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 text-center" style={{ background: 'var(--text-dark)' }}>
        <div className="font-display italic text-4xl mb-3" style={{ color: 'white', fontWeight: 300 }}>А & М</div>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Golos Text' }}>12 июля 2025 · Поместье «Лесная усадьба»</p>
        <p className="text-xs mt-8" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Golos Text' }}>Сделано с любовью ♡</p>
      </footer>
    </div>
  );
}