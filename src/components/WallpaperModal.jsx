// WallpaperModal — background theme customizer modal
import { useState } from 'react';
import { Image, Check, Sparkles, RefreshCw } from 'lucide-react';
import Modal from './Modal';
import { BACKGROUND_PRESETS, getSelectedBackground, applyBackground } from '../store';
import { useToast } from '../toast';

export default function WallpaperModal({ isOpen, onClose }) {
  const { toast } = useToast();
  const current = getSelectedBackground();
  const [selectedId, setSelectedId] = useState(current.id);
  const [customUrl, setCustomUrl] = useState(current.id === 'custom' ? current.url : '');

  const handleSelectPreset = (preset) => {
    setSelectedId(preset.id);
    applyBackground(preset);
    toast(`Applied "${preset.name}" background`, 'success');
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setSelectedId('custom');
    applyBackground(customUrl.trim());
    toast('Applied custom wallpaper image', 'success');
  };

  const handleResetDefault = () => {
    const def = BACKGROUND_PRESETS[0];
    setSelectedId(def.id);
    setCustomUrl('');
    applyBackground(def);
    toast('Reset to default Clinical Care wallpaper', 'info');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Background Wallpaper" size="md">
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: 'var(--neutral-600)', fontSize: '0.9rem', marginBottom: 16 }}>
          Select a life-saving healthcare photographic background to enhance your experience:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {BACKGROUND_PRESETS.map((preset) => {
            const isSelected = selectedId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                style={{
                  position: 'relative',
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected ? '3px solid var(--primary-500)' : '2px solid rgba(0,0,0,0.1)',
                  boxShadow: isSelected ? '0 8px 24px rgba(225, 29, 42, 0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  background: '#0f172a',
                  height: 130,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <img
                  src={preset.thumb}
                  alt={preset.name}
                  referrerPolicy="no-referrer"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isSelected ? 'brightness(0.95)' : 'brightness(0.75)',
                    transition: 'all 0.2s ease',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '8px 10px',
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 70%, transparent 100%)',
                    color: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.2 }}>{preset.name}</div>
                    {isSelected && (
                      <span
                        style={{
                          background: 'var(--primary-500)',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          display: 'grid',
                          placeItems: 'center',
                          color: '#fff',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                    {preset.tagline}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom image URL input */}
        <form onSubmit={handleApplyCustom} style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--neutral-200)' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: 6 }}>
            Or Enter Custom Wallpaper Image URL:
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              style={{ flex: 1, fontSize: '0.88rem' }}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={!customUrl.trim()}>
              Apply URL
            </button>
          </div>
        </form>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleResetDefault} style={{ color: 'var(--neutral-500)' }}>
            <RefreshCw size={14} /> Reset Default
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
