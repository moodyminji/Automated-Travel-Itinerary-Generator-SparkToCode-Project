// src/components/TripMap.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import type { ItineraryDay } from '../types';

// إصلاح أيقونات Leaflet مع Vite
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

function FitToMarkers({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [positions, map]);
  return null;
}

export default function TripMap({ days }: { days: ItineraryDay[] }) {
  const markers = useMemo(
    () =>
      days
        .flatMap((d) =>
          d.activities
            .filter((a) => typeof a.lat === 'number' && typeof a.lng === 'number')
            .map((a) => ({
              id: a.id,
              title: a.title,
              lat: a.lat as number,
              lng: a.lng as number,
              time: a.time,
              location: a.location,
            }))
        ),
    [days]
  );

  if (!markers.length) {
    return (
      <div className="rounded-2xl border border-[--color-border] h-64 flex items-center justify-center text-muted">
        No coordinates yet. Add <code>lat</code> &amp; <code>lng</code> to activities to see pins.
      </div>
    );
  }

  const first = markers[0];

  return (
    <MapContainer
      center={[first.lat, first.lng]}
      zoom={13}
      className="rounded-2xl overflow-hidden border border-[--color-border]"
      style={{ height: 320 }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>
            <div className="small">
              <div className="font-semibold">{m.title}</div>
              {m.time && <div>{m.time}</div>}
              {m.location && <div className="text-muted">{m.location}</div>}
            </div>
          </Popup>
        </Marker>
      ))}
      <FitToMarkers positions={markers.map((m) => [m.lat, m.lng]) as [number, number][]} />
    </MapContainer>
  );
}
