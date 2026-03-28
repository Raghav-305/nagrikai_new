import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const DELHI_CENTER = [28.6139, 77.2090];
const DELHI_BOUNDS = L.latLngBounds(
  [28.39, 76.84],
  [28.89, 77.35]
);

const severityWeights = {
  critical: 1.0,
  high: 0.8,
  medium: 0.5,
  low: 0.2,
};

const ensureDelhiViewport = (map) => {
  map.invalidateSize();
  map.setMaxBounds(DELHI_BOUNDS);
  map.fitBounds(DELHI_BOUNDS, { padding: [12, 12], maxZoom: 11 });
};

const ComplaintHeatMap = ({ complaints = [] }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markerLayerRef = useRef(null);

  const heatPoints = complaints
    .map((complaint) => {
      const lat = Number(complaint?.location?.latitude);
      const lng = Number(complaint?.location?.longitude);
      const severity = String(complaint?.ai_summary?.severity || complaint?.priority || 'medium').toLowerCase();

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
      }

      return [lat, lng, severityWeights[severity] || 0.3];
    })
    .filter(Boolean);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return undefined;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      maxBounds: DELHI_BOUNDS,
      maxBoundsViscosity: 1,
      minZoom: 10,
    }).setView(DELHI_CENTER, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '(c) OpenStreetMap',
    }).addTo(map);

    mapRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);
    map.whenReady(() => {
      ensureDelhiViewport(map);
      setTimeout(() => ensureDelhiViewport(map), 150);
    });

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      if (markerLayerRef.current) {
        map.removeLayer(markerLayerRef.current);
        markerLayerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    if (markerLayerRef.current) {
      markerLayerRef.current.clearLayers();
    }

    if (!heatPoints.length) {
      ensureDelhiViewport(map);
      return;
    }

    heatLayerRef.current = L.heatLayer(heatPoints, {
      radius: 28,
      blur: 20,
      maxZoom: 17,
      minOpacity: 0.35,
      gradient: {
        0.2: '#60a5fa',
        0.45: '#22c55e',
        0.7: '#f59e0b',
        0.9: '#ef4444',
        1.0: '#7f1d1d',
      },
    }).addTo(map);

    const bounds = L.latLngBounds(heatPoints.map(([lat, lng]) => [lat, lng]));
    if (bounds.isValid()) {
      const boundedPoints = bounds.pad(0.15);
      const delhiFocusedBounds = boundedPoints.intersects(DELHI_BOUNDS)
        ? boundedPoints
        : DELHI_BOUNDS;
      map.fitBounds(delhiFocusedBounds, { padding: [24, 24], maxZoom: 13 });
    }

    complaints.forEach((complaint) => {
      const lat = Number(complaint?.location?.latitude);
      const lng = Number(complaint?.location?.longitude);

      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !markerLayerRef.current) {
        return;
      }

      const severity = String(complaint?.ai_summary?.severity || complaint?.priority || 'medium').toLowerCase();
      const markerColor =
        severity === 'critical'
          ? '#dc2626'
          : severity === 'high'
            ? '#f59e0b'
            : severity === 'low'
              ? '#2563eb'
              : '#16a34a';

      const pinpoint = L.circleMarker([lat, lng], {
        radius: 7,
        color: '#ffffff',
        weight: 2,
        fillColor: markerColor,
        fillOpacity: 0.95,
      });

      pinpoint.bindPopup(`
        <div style="min-width: 180px; font-family: sans-serif;">
          <div style="font-weight: 700; margin-bottom: 6px;">${complaint.ticket_id || 'Complaint'}</div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Area:</strong> ${complaint?.location?.label || 'Unknown'}</div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Department:</strong> ${complaint?.department || 'Unassigned'}</div>
          <div style="font-size: 12px;"><strong>Severity:</strong> ${String(complaint?.ai_summary?.severity || complaint?.priority || 'medium').toUpperCase()}</div>
        </div>
      `);

      markerLayerRef.current.addLayer(pinpoint);
    });
  }, [complaints]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[420px] w-full rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800"
      />

      {!heatPoints.length && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm pointer-events-none">
          <div className="text-center px-6">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">No mappable complaints yet</div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Complaints with saved latitude and longitude will appear here.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintHeatMap;
