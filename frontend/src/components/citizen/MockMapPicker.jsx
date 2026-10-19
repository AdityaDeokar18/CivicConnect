import React, { useState } from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import Button from '../common/Button';

export const MockMapPicker = ({ onLocationSelect, defaultAddress = '' }) => {
  const [address, setAddress] = useState(defaultAddress);
  const [coordinates, setCoordinates] = useState({ lat: 18.5204, lng: 73.8567 });
  const [pinned, setPinned] = useState(true);

  const presetLocations = [
    { name: 'Central Market, MG Road, Pune', lat: 18.5204, lng: 73.8567 },
    { name: '5th Cross, Model Colony, Pune', lat: 18.5323, lng: 73.8378 },
    { name: 'Sector 7, Viman Nagar, Pune', lat: 18.5678, lng: 73.9145 },
    { name: 'Senapati Bapat Road, Near Water Tank, Pune', lat: 18.5309, lng: 73.8291 },
    { name: 'Baner Main Road, Pune', lat: 18.5582, lng: 73.7946 },
  ];

  const handleSelectPreset = (loc) => {
    setAddress(loc.name);
    setCoordinates({ lat: loc.lat, lng: loc.lng });
    setPinned(true);
    if (onLocationSelect) {
      onLocationSelect({
        address: loc.name,
        latitude: loc.lat,
        longitude: loc.lng
      });
    }
  };

  const handleCurrentLocation = () => {
    // Mock user GPS capture
    const randomLoc = presetLocations[Math.floor(Math.random() * presetLocations.length)];
    handleSelectPreset(randomLoc);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Geotag Incident Location
        </label>
        <button
          type="button"
          onClick={handleCurrentLocation}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
        >
          <Navigation className="w-3.5 h-3.5" />
          Use My Current GPS
        </button>
      </div>

      {/* Simulated Map Canvas */}
      <div className="relative h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 flex flex-col justify-between p-4 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Map Header Overlay */}
        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs font-medium text-slate-700 max-w-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="truncate">{address || 'No location selected (Click map to pin)'}</span>
        </div>

        {/* Center Pin Indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg animate-bounce">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="w-3 h-1 bg-slate-800/30 rounded-full blur-[1px] mt-1" />
          </div>
        </div>

        {/* Coordinates badge */}
        <div className="self-end bg-slate-900/80 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur">
          GPS: {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
        </div>
      </div>

      {/* Quick Location Pills */}
      <div className="space-y-1.5">
        <p className="text-xs text-slate-500 font-medium">Quick Select Ward / Landmark:</p>
        <div className="flex flex-wrap gap-1.5">
          {presetLocations.map((loc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPreset(loc)}
              className="text-xs bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md transition-colors"
            >
              {loc.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockMapPicker;
