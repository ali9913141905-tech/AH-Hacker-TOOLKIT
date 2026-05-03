interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onClearAll: () => void;
}

export default function NotificationPanel({ notifications, onClose, onClearAll }: NotificationPanelProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 10000,
          backdropFilter: 'blur(5px)',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          background: 'rgba(5,5,5,0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: 10001,
          transition: 'right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          borderLeft: '1px solid rgba(0,255,65,0.2)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.4s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(0,255,65,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00ff41', fontSize: '1.2rem' }}>
            <i className="fas fa-bell" style={{ marginRight: '10px' }} /> NOTIFICATIONS
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }} className="hide-scrollbar">
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)' }}>
              <i className="fas fa-bell-slash" style={{ fontSize: '3rem', marginBottom: '15px', color: 'rgba(0,255,65,0.2)' }} />
              <p>No notifications yet.</p>
            </div>
          ) : (
            notifications.map(n => {
              let typeIcon = 'fa-bell';
              let typeColor = '#00ff41';
              if (n.type === 'urgent') { typeIcon = 'fa-exclamation-circle'; typeColor = '#ff0040'; }
              else if (n.type === 'update') { typeIcon = 'fa-sync'; typeColor = '#00f0ff'; }

              return (
                <div
                  key={n.id}
                  style={{
                    background: 'rgba(10,10,15,0.9)',
                    border: '1px solid rgba(0,255,65,0.1)',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '10px',
                    animation: 'slideInRight 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    borderLeft: !n.read ? '3px solid #ff0040' : '3px solid transparent',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '3px',
                      height: '100%',
                      background: !n.read
                        ? 'linear-gradient(to bottom, #ff0040, #b026ff)'
                        : 'linear-gradient(to bottom, #00ff41, #00f0ff)',
                    }}
                  />
                  <h4
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '0.9rem',
                      color: '#00f0ff',
                      marginBottom: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      paddingLeft: '8px',
                    }}
                  >
                    <i className={`fas ${typeIcon}`} style={{ color: typeColor }} />
                    {n.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', paddingLeft: '8px' }}>{n.message}</p>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '8px', paddingLeft: '8px' }}>
                    <i className="fas fa-clock" /> {n.time}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Clear All */}
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            style={{
              margin: '15px',
              padding: '12px',
              background: 'rgba(255,0,64,0.2)',
              border: '1px solid #ff0040',
              color: '#ff0040',
              borderRadius: '10px',
              fontFamily: "'Share Tech Mono', monospace",
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <i className="fas fa-trash-alt" style={{ marginRight: '6px' }} /> CLEAR ALL
          </button>
        )}
      </div>
    </>
  );
}
