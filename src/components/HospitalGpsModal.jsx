// Hospital GPS Location & Turn-by-Turn Navigation Modal
import { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Car,
  Phone,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Clock,
  Building,
  ParkingCircle,
  Share2,
  X,
  Maximize2,
} from 'lucide-react';
import {
  getHospitalLocation,
  calculateDistanceKm,
  estimateDriveMinutes,
  getNavigationUrls,
} from '../data/hospitals';

export default function HospitalGpsModal({
  open,
  onClose,
  hospitalName,
  locationName,
  emergencyRequest,
  user,
}) {
  const [copied, setCopied] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(null);
  const [mapExpanded, setMapExpanded] = useState(false);

  // Retrieve hospital data
  const hospital = getHospitalLocation(hospitalName, locationName);

  // Request user's geolocation on open or click
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation error or permission denied:', err.message);
        setLocError('Unable to get exact location. Using Nairobi city center default.');
        // Fallback default: Nairobi CBD
        setUserLocation({ lat: -1.2921, lng: 36.8219 });
        setLocating(false);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (open) {
      detectUserLocation();
      setCopied(false);
    }
  }, [open, hospitalName]);

  if (!open || !hospital) return null;

  // Compute live distance & driving time
  const distanceKm = userLocation
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, hospital.coords.lat, hospital.coords.lng)
    : null;
  const driveMinutes = distanceKm ? estimateDriveMinutes(distanceKm) : null;

  const navUrls = getNavigationUrls(hospital, userLocation);
  const coordsText = `${hospital.coords.lat.toFixed(5)}, ${hospital.coords.lng.toFixed(5)}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(coordsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${hospital.name} - Blood Donation Emergency Location`,
        text: `Blood donation destination: ${hospital.name}, ${hospital.address}. GPS: ${coordsText}`,
        url: navUrls.googleMaps,
      }).catch(() => {});
    } else {
      handleCopyCoords();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`GPS Location for ${hospital.name}`}
      style={{ zIndex: 1200, padding: 12 }}
    >
      <div
        className="modal"
        style={{
          maxWidth: 680,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip with Live Hospital Branding */}
        <div
          style={{
            background: 'linear-gradient(135deg, #881337 0%, #b91c1c 50%, #991b1b 100%)',
            color: '#fff',
            padding: '14px 18px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'grid',
                  placeItems: 'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Navigation size={20} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.05rem', fontWeight: 800 }}>
                    {hospital.name}
                  </h3>
                  <span
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      color: '#fef08a',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 999,
                      letterSpacing: '0.04em',
                    }}
                  >
                    GPS VERIFIED
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
                  {hospital.neighborhood}, {hospital.city} · 24/7 Trauma & Blood Bank Receiving
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: 'none',
                color: '#fff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
              aria-label="Close GPS modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Real-Time Distance & Route Ribbon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.28)',
              padding: '6px 12px',
              borderRadius: 8,
              marginTop: 10,
              fontSize: '0.76rem',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Car size={14} color="#fca5a5" />
                <span>
                  Estimated Travel:{' '}
                  <strong style={{ color: '#fff' }}>
                    {distanceKm !== null ? `${distanceKm} km (~${driveMinutes} mins)` : 'Calculating distance...'}
                  </strong>
                </span>
              </span>

              <span style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.85 }}>
                <Compass size={13} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{coordsText}</span>
              </span>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handleCopyCoords}
                style={{
                  background: copied ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 150ms ease',
                }}
                title="Copy GPS coordinates to clipboard"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy GPS'}
              </button>
              <button
                onClick={handleShare}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                title="Share hospital location"
              >
                <Share2 size={12} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '12px 18px', overflowY: 'auto', flex: 1 }}>
          {/* Emergency Alert Context if responding to a specific request */}
          {emergencyRequest && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                padding: '8px 12px',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldAlert size={18} color="#dc2626" />
                <span style={{ fontSize: '0.78rem', color: '#991b1b', fontWeight: 600 }}>
                  Emergency Blood Destination for {emergencyRequest.urgency || 'Urgent'} Request: Needs{' '}
                  <strong>{emergencyRequest.bloodGroup}</strong> ({emergencyRequest.units || 1} units)
                </span>
              </div>
              {emergencyRequest.contact && (
                <a
                  href={`tel:${emergencyRequest.contact}`}
                  className="btn btn-sm btn-outline"
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    color: '#991b1b',
                    borderColor: '#f87171',
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={12} /> Call Contact ({emergencyRequest.contact})
                </a>
              )}
            </div>
          )}

          {/* Interactive Live GPS Map Embed */}
          <div
            style={{
              position: 'relative',
              borderRadius: 10,
              overflow: 'hidden',
              border: '1.5px solid var(--neutral-300)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              background: '#e2e8f0',
              marginBottom: 12,
              height: mapExpanded ? 340 : 210,
              transition: 'height 250ms ease',
            }}
          >
            <iframe
              title={`Map of ${hospital.name}`}
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              src={navUrls.osmEmbed}
              loading="lazy"
            />

            {/* Map Overlay Badge & Controls */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: '0.72rem',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                pointerEvents: 'none',
              }}
            >
              <MapPin size={13} color="#ef4444" />
              <span>{hospital.name} (GPS Pin)</span>
            </div>

            <button
              onClick={() => setMapExpanded(!mapExpanded)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(255, 255, 255, 0.92)',
                border: '1px solid var(--neutral-300)',
                color: 'var(--neutral-800)',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
              title={mapExpanded ? 'Shrink map' : 'Expand map view'}
            >
              <Maximize2 size={12} />
              {mapExpanded ? 'Compact' : 'Expand'}
            </button>
          </div>

          {/* Quick Launch GPS Navigation Buttons */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--neutral-600)',
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Launch Turn-by-Turn GPS App:</span>
              {locError && <span style={{ color: 'var(--neutral-500)', fontWeight: 400 }}>{locError}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
              {/* Google Maps Button */}
              <a
                href={navUrls.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  justifyContent: 'center',
                  padding: '9px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: '#15803d',
                  borderColor: '#15803d',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(21, 128, 61, 0.3)',
                }}
              >
                <Navigation size={16} /> Google Maps (Drive)
              </a>

              {/* Apple Maps */}
              <a
                href={navUrls.appleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  justifyContent: 'center',
                  padding: '9px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <Car size={16} /> Apple Maps
              </a>

              {/* Waze */}
              <a
                href={navUrls.waze}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  justifyContent: 'center',
                  padding: '9px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <Compass size={16} /> Waze GPS
              </a>
            </div>
          </div>

          {/* Hospital Address, Department, & Arrival Details */}
          <div
            style={{
              background: 'var(--neutral-50)',
              border: '1px solid var(--neutral-200)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <MapPin size={16} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: 'var(--neutral-900)' }}>Full Street Address:</strong>
                    <div style={{ color: 'var(--neutral-700)' }}>{hospital.address}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--neutral-500)', marginTop: 2 }}>
                      Landmark: {hospital.landmark}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <Building size={16} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: 'var(--neutral-900)' }}>Transfusion / Blood Bank Unit:</strong>
                    <div style={{ color: 'var(--neutral-700)' }}>{hospital.bloodBankUnit}</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <ParkingCircle size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: 'var(--neutral-900)' }}>Gate & Donor Parking:</strong>
                    <div style={{ color: 'var(--neutral-700)' }}>{hospital.gate}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--neutral-500)', marginTop: 2 }}>
                      {hospital.donorParking}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <Clock size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: 'var(--neutral-900)' }}>Operating Hours & Hotlines:</strong>
                    <div style={{ color: 'var(--neutral-700)' }}>{hospital.operatingHours}</div>
                    <div style={{ marginTop: 3 }}>
                      <a
                        href={`tel:${hospital.emergencyDirect || hospital.phone}`}
                        style={{
                          color: 'var(--primary-600)',
                          fontWeight: 700,
                          textDecoration: 'none',
                          fontSize: '0.78rem',
                        }}
                      >
                        📞 Direct Line: {hospital.emergencyDirect || hospital.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions for Blood Donors */}
            {hospital.notes && (
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: '1px solid var(--neutral-200)',
                  fontSize: '0.74rem',
                  color: 'var(--neutral-600)',
                }}
              >
                💡 <strong>Donor Arrival Tip:</strong> {hospital.notes}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '10px 18px',
            background: 'var(--neutral-100)',
            borderTop: '1px solid var(--neutral-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--neutral-500)' }}>
            Coordinates: {coordsText} · WGS84 Datum
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={onClose}>
              Close
            </button>
            <a
              href={navUrls.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={14} /> Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
