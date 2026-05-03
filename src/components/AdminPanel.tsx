import { useState, useEffect } from 'react';
import { api } from '../hooks/useApi';

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
  push?: boolean;
}

interface SocialLinks {
  whatsapp: string;
  youtube: string;
  telegram: string;
  community: string;
}

interface AdminPanelProps {
  tools: Tool[];
  notifications: Notification[];
  socialLinks: SocialLinks;
  activeUsers: number;
  unreadCount: number;
  adminTab: string;
  setAdminTab: (t: string) => void;
  onLogout: () => void;
  onOpenNotifs: () => void;
  showToast: (m: string, t: 'success' | 'error') => void;
  onRefresh: () => Promise<void>;
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinks>>;
  setActiveUsers: React.Dispatch<React.SetStateAction<number>>;
  setDpImage: React.Dispatch<React.SetStateAction<string>>;
}

export default function AdminPanel({
  tools,
  notifications,
  activeUsers,
  unreadCount,
  adminTab,
  setAdminTab,
  onLogout,
  onOpenNotifs,
  showToast,
  onRefresh,
  setTools,
  setNotifications,
  setDpImage,
}: AdminPanelProps) {
  const [toolTitle, setToolTitle] = useState('');
  const [toolLink, setToolLink] = useState('');
  const [toolImage, setToolImage] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('normal');
  const [pushNotif, setPushNotif] = useState(false);
  const [currentUserPass, setCurrentUserPass] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [confirmUserPass, setConfirmUserPass] = useState('');
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [activeUsersList, setActiveUsersList] = useState<any[]>([]);

  useEffect(() => {
    api.getActiveUsers().then((data: { users?: any[] }) => {
      setActiveUsersList(data.users || []);
    }).catch(() => {});
  }, [activeUsers]);

  const handleAddTool = async () => {
    if (!toolTitle || !toolLink || !toolImage) {
      showToast('Please fill all fields and upload an image!', 'error');
      return;
    }
    try {
      const res = await api.addTool({ title: toolTitle, link: toolLink, image: toolImage });
      setTools(prev => [res, ...prev]);
      setToolTitle('');
      setToolLink('');
      setToolImage('');
      showToast('Tool uploaded successfully!', 'success');
      await onRefresh();
    } catch (e: any) {
      showToast(e.message || 'Failed to add tool', 'error');
    }
  };

  const handleDeleteTool = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    try {
      await api.deleteTool(id);
      setTools(prev => prev.filter(t => t.id !== id));
      showToast('Tool deleted!', 'success');
      await onRefresh();
    } catch (e: any) {
      showToast(e.message || 'Failed to delete', 'error');
    }
  };

  const handleSendNotif = async () => {
    if (!notifTitle || !notifMessage) {
      showToast('Please fill title and message!', 'error');
      return;
    }
    try {
      const res = await api.addNotification({
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        push: pushNotif,
      });
      setNotifications(prev => [res, ...prev]);
      setNotifTitle('');
      setNotifMessage('');
      setPushNotif(false);
      showToast('Notification sent to all users!', 'success');
      if (pushNotif && navigator.vibrate) navigator.vibrate([200, 100, 200]);
      await onRefresh();
    } catch (e: any) {
      showToast(e.message || 'Failed to send', 'error');
    }
  };

  const handleChangePassword = async (type: string) => {
    const current = type === 'user' ? currentUserPass : currentAdminPass;
    const newPass = type === 'user' ? newUserPass : newAdminPass;
    const confirm = type === 'user' ? confirmUserPass : confirmAdminPass;

    if (newPass !== confirm) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (newPass.length < 4) {
      showToast('Password must be at least 4 characters!', 'error');
      return;
    }

    try {
      await api.changePassword({ type, currentPassword: current, newPassword: newPass });
      if (type === 'user') {
        setCurrentUserPass('');
        setNewUserPass('');
        setConfirmUserPass('');
      } else {
        setCurrentAdminPass('');
        setNewAdminPass('');
        setConfirmAdminPass('');
      }
      showToast(`${type} password updated successfully!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to change password', 'error');
    }
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setToolImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await api.uploadDp(file);
        setDpImage(res.dpImage);
        showToast('DP updated successfully!', 'success');
      } catch (e: any) {
        showToast(e.message || 'Failed to upload DP', 'error');
      }
    }
  };

  const tabs = [
    { id: 'addTool', icon: 'fa-plus-circle', label: 'Add Tool' },
    { id: 'manageTools', icon: 'fa-list', label: 'Manage' },
    { id: 'sendNotif', icon: 'fa-paper-plane', label: 'Notif' },
    { id: 'passwords', icon: 'fa-key', label: 'Pass' },
    { id: 'users', icon: 'fa-users', label: 'Users' },
  ];

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
          ADMIN <span style={{ WebkitTextFillColor: '#ffd700', background: 'none', fontSize: '1.3rem' }}>👑</span> PANEL
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
      <div style={{ padding: '20px', textAlign: 'center', position: 'relative' }}>
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
            fontSize: '1.5rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #00ff41, #00f0ff, #b026ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          ADMIN DASHBOARD
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
          Manage your toolkit
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.5rem', color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              {tools.length}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px' }}>Tools</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.5rem', color: '#00ff41', textShadow: '0 0 10px #00ff41' }}>
              {activeUsers}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px' }}>Active</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.5rem', color: '#b026ff', textShadow: '0 0 10px #b026ff' }}>
              {tools.reduce((sum, t) => sum + (t.downloads || 0), 0)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px' }}>Downloads</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          padding: '0 20px',
          gap: '10px',
          marginBottom: '20px',
          overflowX: 'auto',
        }}
        className="hide-scrollbar"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            style={{
              padding: '12px 18px',
              background: adminTab === tab.id ? 'linear-gradient(135deg, #00ff41, #00f0ff)' : 'rgba(10,10,15,0.9)',
              border: adminTab === tab.id ? 'none' : '1px solid rgba(0,255,65,0.2)',
              borderRadius: '12px',
              color: adminTab === tab.id ? '#000' : 'rgba(255,255,255,0.6)',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontWeight: adminTab === tab.id ? 'bold' : 'normal',
            }}
          >
            <i className={`fas ${tab.icon}`} style={{ marginRight: '6px' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px', animation: 'fadeIn 0.4s ease' }}>
        {adminTab === 'addTool' && (
          <div
            style={{
              background: 'rgba(10,10,15,0.9)',
              border: '1px solid rgba(0,255,65,0.15)',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00f0ff', marginBottom: '20px', fontSize: '1rem' }}>
              <i className="fas fa-upload" style={{ marginRight: '8px' }} /> ADD NEW TOOL
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00ff41', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Tool Banner Image
              </label>
              <div
                style={{
                  border: '2px dashed rgba(0,255,65,0.3)',
                  borderRadius: '12px',
                  padding: '30px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2.5rem', color: '#00ff41', marginBottom: '10px' }} />
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Click or drag image here</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagePreview}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </div>
              {toolImage && (
                <img
                  src={toolImage}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', marginTop: '15px', border: '1px solid rgba(0,255,65,0.3)' }}
                />
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00ff41', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Tool Title
              </label>
              <input
                type="text"
                value={toolTitle}
                onChange={e => setToolTitle(e.target.value)}
                placeholder="Enter tool name..."
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '2px solid rgba(0,255,65,0.2)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#00ff41', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Download Link
              </label>
              <input
                type="text"
                value={toolLink}
                onChange={e => setToolLink(e.target.value)}
                placeholder="https://www.mediafire.com/..."
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '2px solid rgba(0,255,65,0.2)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={handleAddTool}
              style={{
                width: '100%',
                padding: '18px',
                background: 'linear-gradient(135deg, #00ff41, #00f0ff)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                transition: 'all 0.3s',
              }}
            >
              <i className="fas fa-rocket" style={{ marginRight: '8px' }} /> UPLOAD TOOL
            </button>
          </div>
        )}

        {adminTab === 'manageTools' && (
          <>
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '1.2rem',
                color: '#00ff41',
                textShadow: '0 0 10px #00ff41',
                padding: '0 0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <i className="fas fa-folder-open" /> ALL TOOLS
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #00ff41, transparent)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {tools.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                  <i className="fas fa-inbox" style={{ fontSize: '4rem', marginBottom: '20px', color: 'rgba(0,255,65,0.2)' }} />
                  <p>No tools added yet.</p>
                </div>
              ) : (
                tools.map(tool => (
                  <div
                    key={tool.id}
                    style={{
                      background: 'rgba(10,10,15,0.9)',
                      border: '1px solid rgba(0,255,65,0.15)',
                      borderRadius: '16px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      transition: 'all 0.3s',
                    }}
                  >
                    <img src={tool.image} alt={tool.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(0,255,65,0.2)' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.95rem', color: '#fff', marginBottom: '5px' }}>{tool.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>{tool.link}</p>
                      <p style={{ marginTop: '5px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                        <i className="fas fa-download" /> {tool.downloads || 0} downloads | <i className="fas fa-calendar" /> {tool.date}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTool(tool.id)}
                      style={{
                        background: 'rgba(255,0,64,0.2)',
                        border: '1px solid #ff0040',
                        color: '#ff0040',
                        padding: '10px 15px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: "'Share Tech Mono', monospace",
                        transition: 'all 0.3s',
                      }}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {adminTab === 'sendNotif' && (
          <>
            <div
              style={{
                background: 'rgba(10,10,15,0.9)',
                border: '1px solid rgba(0,255,65,0.15)',
                borderRadius: '16px',
                padding: '25px',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00ff41', marginBottom: '20px', fontSize: '1rem' }}>
                <i className="fas fa-broadcast-tower" style={{ marginRight: '8px' }} /> SEND NOTIFICATION TO ALL USERS
              </h3>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[
                  { type: 'normal', icon: 'fa-bell', label: 'Normal' },
                  { type: 'urgent', icon: 'fa-exclamation-circle', label: 'Urgent' },
                  { type: 'update', icon: 'fa-sync', label: 'Update' },
                ].map(t => (
                  <button
                    key={t.type}
                    onClick={() => setNotifType(t.type)}
                    style={{
                      padding: '10px 18px',
                      background: notifType === t.type ? 'linear-gradient(135deg, #00ff41, #00f0ff)' : 'rgba(0,0,0,0.5)',
                      border: notifType === t.type ? 'none' : '2px solid rgba(0,255,65,0.2)',
                      borderRadius: '10px',
                      color: notifType === t.type ? '#000' : 'rgba(255,255,255,0.6)',
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      fontWeight: notifType === t.type ? 'bold' : 'normal',
                    }}
                  >
                    <i className={`fas ${t.icon}`} style={{ marginRight: '6px' }} /> {t.label}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#00ff41', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Notification Title
                </label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={e => setNotifTitle(e.target.value)}
                  placeholder="Enter notification title..."
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '2px solid rgba(0,255,65,0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#00ff41', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Notification Message
                </label>
                <textarea
                  value={notifMessage}
                  onChange={e => setNotifMessage(e.target.value)}
                  rows={4}
                  placeholder="Type your message here..."
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '2px solid rgba(0,255,65,0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="pushNotifCheckbox"
                  checked={pushNotif}
                  onChange={e => setPushNotif(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#00ff41' }}
                />
                <label htmlFor="pushNotifCheckbox" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                  Send as Push Notification (Shows like WhatsApp notification)
                </label>
              </div>

              <button
                onClick={handleSendNotif}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #00ff41, #00f0ff)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  transition: 'all 0.3s',
                }}
              >
                <i className="fas fa-paper-plane" style={{ marginRight: '8px' }} /> SEND TO ALL USERS
              </button>
            </div>

            {/* Sent History */}
            <div
              style={{
                background: 'rgba(10,10,15,0.9)',
                border: '1px solid rgba(0,255,65,0.15)',
                borderRadius: '16px',
                padding: '25px',
              }}
            >
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00f0ff', marginBottom: '20px', fontSize: '1rem' }}>
                <i className="fas fa-history" style={{ marginRight: '8px' }} /> SENT NOTIFICATIONS HISTORY
              </h3>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)' }}>
                  <i className="fas fa-envelope-open" style={{ fontSize: '3rem', marginBottom: '15px', color: 'rgba(0,255,65,0.2)' }} />
                  <p>No notifications sent yet.</p>
                </div>
              ) : (
                notifications.map((n: Notification) => {
                  let typeIcon = 'fa-bell';
                  let typeColor = '#00ff41';
                  if (n.type === 'urgent') { typeIcon = 'fa-exclamation-circle'; typeColor = '#ff0040'; }
                  else if (n.type === 'update') { typeIcon = 'fa-sync'; typeColor = '#00f0ff'; }
                  return (
                    <div
                      key={n.id}
                      style={{
                        background: 'rgba(10,10,15,0.9)',
                        border: '1px solid rgba(0,255,65,0.15)',
                        borderRadius: '16px',
                        padding: '15px',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem', color: '#fff', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className={`fas ${typeIcon}`} style={{ color: typeColor }} /> {n.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{n.message}</p>
                        <p style={{ marginTop: '5px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                          <i className="fas fa-clock" /> {n.time}
                          {n.push && <span style={{ color: '#00ff41', marginLeft: '10px' }}><i className="fas fa-mobile-alt" /> Push Sent</span>}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {adminTab === 'passwords' && (
          <>
            {/* User Password */}
            <div
              style={{
                background: 'rgba(10,10,15,0.9)',
                border: '1px solid rgba(0,255,65,0.15)',
                borderRadius: '16px',
                padding: '25px',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00f0ff', marginBottom: '20px', fontSize: '1rem' }}>
                <i className="fas fa-user-shield" style={{ marginRight: '8px' }} /> USER PANEL PASSWORD
              </h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#00ff41', fontSize: '0.8rem', marginBottom: '6px' }}>Current Password</label>
                <input type="password" value={currentUserPass} onChange={e => setCurrentUserPass(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.2)', borderRadius: '10px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#00ff41', fontSize: '0.8rem', marginBottom: '6px' }}>New Password</label>
                <input type="password" value={newUserPass} onChange={e => setNewUserPass(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.2)', borderRadius: '10px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#00ff41', fontSize: '0.8rem', marginBottom: '6px' }}>Confirm New Password</label>
                <input type="password" value={confirmUserPass} onChange={e => setConfirmUserPass(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.2)', borderRadius: '10px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", outline: 'none' }} />
              </div>
              <button
                onClick={() => handleChangePassword('user')}
                style={{
                  width: '100%', padding: '15px', background: 'linear-gradient(135deg, #00ff41, #00f0ff)', border: 'none', borderRadius: '10px',
                  color: '#000', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '2px',
                }}
              >
                <i className="fas fa-save" style={{ marginRight: '6px' }} /> UPDATE USER PASSWORD
              </button>
            </div>

            {/* Admin Password */}
            <div
              style={{
                background: 'rgba(10,10,15,0.9)',
                border: '1px solid rgba(0,255,65,0.15)',
                borderRadius: '16px',
                padding: '25px',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00f0ff', marginBottom: '20px', fontSize: '1rem' }}>
                <i className="fas fa-user-cog" style={{ marginRight: '8px' }} /> ADMIN PANEL PASSWORD
              </h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#00ff41', fontSize: '0.8rem', marginBottom: '6px' }}>Current Password</label>
                <input type="password" value={currentAdminPass} onChange={e => setCurrentAdminPass(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.2)', borderRadius: '10px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#00ff41', fontSize: '0.8rem', marginBottom: '6px' }}>New Password</label>
                <input type="password" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.2)', borderRadius: '10px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#00ff41', fontSize: '0.8rem', marginBottom: '6px' }}>Confirm New Password</label>
                <input type="password" value={confirmAdminPass} onChange={e => setConfirmAdminPass(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.2)', borderRadius: '10px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", outline: 'none' }} />
              </div>
              <button
                onClick={() => handleChangePassword('admin')}
                style={{
                  width: '100%', padding: '15px', background: 'linear-gradient(135deg, #00ff41, #00f0ff)', border: 'none', borderRadius: '10px',
                  color: '#000', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '2px',
                }}
              >
                <i className="fas fa-save" style={{ marginRight: '6px' }} /> UPDATE ADMIN PASSWORD
              </button>
            </div>

            {/* DP Upload */}
            <div
              style={{
                background: 'rgba(10,10,15,0.9)',
                border: '1px solid rgba(0,255,65,0.15)',
                borderRadius: '16px',
                padding: '25px',
              }}
            >
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00f0ff', marginBottom: '20px', fontSize: '1rem' }}>
                <i className="fas fa-image" style={{ marginRight: '8px' }} /> CHANGE LOADING SCREEN DP
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '15px' }}>
                Upload a new image to show on the loading screen. All users will see this immediately.
              </p>
              <div
                style={{
                  border: '2px dashed rgba(0,255,65,0.3)',
                  borderRadius: '12px',
                  padding: '25px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <i className="fas fa-camera" style={{ fontSize: '2rem', color: '#00ff41', marginBottom: '10px' }} />
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Click to upload new DP</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDpChange}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </div>
            </div>
          </>
        )}

        {adminTab === 'users' && (
          <div
            style={{
              background: 'rgba(10,10,15,0.9)',
              border: '1px solid rgba(0,255,65,0.15)',
              borderRadius: '16px',
              padding: '25px',
            }}
          >
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00f0ff', marginBottom: '20px', fontSize: '1rem' }}>
              <i className="fas fa-users" style={{ marginRight: '8px' }} /> ACTIVE USERS
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px' }}>
              <div style={{ textAlign: 'center', background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '12px', padding: '15px 25px' }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '2rem', color: '#00ff41', textShadow: '0 0 10px #00ff41' }}>{activeUsers}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px' }}>Currently Active</div>
              </div>
            </div>

            <h4 style={{ fontFamily: "'Orbitron', sans-serif", color: '#00ff41', fontSize: '0.9rem', marginBottom: '15px' }}>Recent Activity</h4>
            {activeUsersList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)' }}>
                <i className="fas fa-user-slash" style={{ fontSize: '3rem', marginBottom: '15px', color: 'rgba(0,255,65,0.2)' }} />
                <p>No active users right now.</p>
              </div>
            ) : (
              activeUsersList.map((u, i) => (
                <div
                  key={u.id || i}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(0,255,65,0.1)',
                    borderRadius: '10px',
                    padding: '12px 15px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    animation: `slideInRight 0.3s ease ${i * 0.05}s both`,
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: u.type === 'admin' ? 'linear-gradient(135deg, #ff0040, #b026ff)' : 'linear-gradient(135deg, #00ff41, #00f0ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: '#000',
                  }}>
                    <i className={`fas ${u.type === 'admin' ? 'fa-user-cog' : 'fa-user'}`} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>
                      {u.type === 'admin' ? 'Admin User' : 'Regular User'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                      <i className="fas fa-clock" /> {new Date(u.lastSeen).toLocaleTimeString()}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    background: u.type === 'admin' ? 'rgba(255,0,64,0.2)' : 'rgba(0,255,65,0.15)',
                    color: u.type === 'admin' ? '#ff0040' : '#00ff41',
                    border: `1px solid ${u.type === 'admin' ? 'rgba(255,0,64,0.3)' : 'rgba(0,255,65,0.3)'}`,
                  }}>
                    {u.type}
                  </div>
                </div>
              ))
            )}
          </div>
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
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: adminTab === tab.id ? '#00ff41' : 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.3s',
              padding: '5px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              textShadow: adminTab === tab.id ? '0 0 10px #00ff41' : 'none',
            }}
          >
            <i className={`fas ${tab.icon}`} style={{ fontSize: '1.2rem' }} />
            <span>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
