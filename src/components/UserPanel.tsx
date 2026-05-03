interface Tool {
  id: number;
  title: string;
  link: string;
  image: string;
  date: string;
  downloads: number;
  isNew: boolean;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
}

interface SocialLinks {
  whatsapp: string;
  youtube: string;
  telegram: string;
  community: string;
}

interface UserPanelProps {
  tools: Tool[];
  allTools: Tool[];
  notifications: Notification[];
  socialLinks: SocialLinks;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  unreadCount: number;
  onLogout: () => void;
  onOpenNotifs: () => void;
  showToast?: (m: string, t: 'success' | 'error') => void;
  totalDownloads: number;
  onDownload: (id: number) => Promise<void>;
}

export default function UserPanel({
  tools,
  allTools,
  socialLinks,
  searchQuery,
  setSearchQuery,
  unreadCount,
  onLogout,
  onOpenNotifs,
  totalDownloads,
  onDownload,
}: UserPanelProps) {
  const handleToolClick = async (tool: Tool) => {
    await onDownload(tool.id);
    window.open(tool.link, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '80px',
      }}
      className="hide-scrollbar"
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,255,65,0.2)',
          padding: '15px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #00ff41, #00f0ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          SHADOW <span style={{ WebkitTextFillColor: '#ffd700', background: 'none', fontSize: '1.3rem' }}>👑</span> TOOLKIT
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div
            onClick={onOpenNotifs}
            style={{
              position: 'relative',
              color: '#00ff41',
              fontSize: '1.3rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <i className="fas fa-bell" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#ff0040',
                  color: '#fff',
                  fontSize: '0.6rem',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  animation: 'badgePulse 1s infinite',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255,0,64,0.2)',
              border: '1px solid #ff0040',
              color: '#ff0040',
              padding: '8px 15px',
              borderRadius: '8px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <i className="fas fa-power-off" />
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '30px 20px', textAlign: 'center', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(0,255,65,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'glowPulse 4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <h1
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.8rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #00ff41, #00f0ff, #b026ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          SHADOW TOOLKIT
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
          Premium Tools & Resources
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '25px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.5rem', color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              {allTools.length}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px' }}>Tools</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.5rem', color: '#00ff41', textShadow: '0 0 10px #00ff41' }}>
              {totalDownloads}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px' }}>Downloads</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.5rem', color: '#b026ff', textShadow: '0 0 10px #b026ff' }}>
              ∞
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px' }}>Power</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0 20px 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            style={{
              width: '100%',
              padding: '15px 50px 15px 20px',
              background: 'rgba(0,0,0,0.6)',
              border: '2px solid rgba(0,255,65,0.2)',
              borderRadius: '15px',
              color: '#fff',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s',
            }}
          />
          <i
            className="fas fa-search"
            style={{
              position: 'absolute',
              right: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#00ff41',
              fontSize: '1.1rem',
            }}
          />
        </div>
        {searchQuery && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '10px' }}>
            Found {tools.length} result{tools.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Social Links */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
        {[
          { key: 'whatsapp', icon: 'fab fa-whatsapp', label: 'WhatsApp', color: '#25d366', borderColor: 'rgba(37,211,102,0.3)', shadow: 'rgba(37,211,102,0.3)' },
          { key: 'youtube', icon: 'fab fa-youtube', label: 'YouTube', color: '#ff0000', borderColor: 'rgba(255,0,0,0.3)', shadow: 'rgba(255,0,0,0.3)' },
          { key: 'telegram', icon: 'fab fa-telegram', label: 'Telegram', color: '#0088cc', borderColor: 'rgba(0,136,204,0.3)', shadow: 'rgba(0,136,204,0.3)' },
          { key: 'community', icon: 'fas fa-users', label: 'Community', color: '#00ff41', borderColor: 'rgba(0,255,65,0.3)', shadow: 'rgba(0,255,65,0.3)' },
        ].map(s => (
          <a
            key={s.key}
            href={socialLinks[s.key as keyof SocialLinks]}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 18px',
              background: 'rgba(10,10,15,0.9)',
              border: `1px solid ${s.borderColor}`,
              borderRadius: '12px',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.8rem',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 5px 20px ${s.shadow}`;
              (e.currentTarget as HTMLElement).style.borderColor = s.color;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.borderColor = s.borderColor;
            }}
          >
            <i className={s.icon} style={{ fontSize: '1.1rem', color: s.color }} />
            {s.label}
          </a>
        ))}
      </div>

      {/* Section Title */}
      <div
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1.2rem',
          color: '#00ff41',
          textShadow: '0 0 10px #00ff41',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <i className="fas fa-tools" /> AVAILABLE TOOLS
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #00ff41, transparent)' }} />
      </div>

      {/* Tools Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px',
          padding: '0 20px 20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {tools.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <i className="fas fa-box-open" style={{ fontSize: '4rem', marginBottom: '20px', color: 'rgba(0,255,65,0.2)' }} />
            <p>{searchQuery ? 'No tools found matching your search.' : 'No tools available yet. Check back later!'}</p>
          </div>
        ) : (
          tools.map((tool, index) => (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              style={{
                background: 'rgba(10,10,15,0.9)',
                border: '1px solid rgba(0,255,65,0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                animation: `cardAppear 0.6s ease-out ${index * 0.1}s both`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px) scale(1.02)';
                (e.currentTarget as HTMLElement).style.borderColor = '#00ff41';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0,255,65,0.15), 0 0 60px rgba(0,255,65,0.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,65,0.15)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {tool.isNew && (
                <div
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'linear-gradient(135deg, #ff0040, #b026ff)',
                    color: '#fff',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    zIndex: 3,
                  }}
                >
                  NEW
                </div>
              )}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={tool.image}
                  alt={tool.title}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    transition: 'transform 0.4s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.9) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              <div style={{ padding: '15px 20px 20px', position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '1.1rem',
                    color: '#fff',
                    marginBottom: '8px',
                    textShadow: '0 0 10px rgba(255,255,255,0.2)',
                  }}
                >
                  {tool.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fas fa-calendar" style={{ color: '#00ff41' }} /> {tool.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fas fa-download" style={{ color: '#00ff41' }} /> {tool.downloads || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,255,65,0.2)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0',
          zIndex: 1000,
        }}
      >
        {[
          { icon: 'fas fa-home', label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
          { icon: 'fas fa-bell', label: 'Alerts', action: onOpenNotifs },
          { icon: 'fas fa-arrow-up', label: 'Top', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        ].map((item, i) => (
          <div
            key={i}
            onClick={item.action}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: i === 0 ? '#00ff41' : 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.3s',
              padding: '5px 15px',
              borderRadius: '12px',
              cursor: 'pointer',
              textShadow: i === 0 ? '0 0 10px #00ff41' : 'none',
            }}
          >
            <i className={item.icon} style={{ fontSize: '1.3rem' }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
