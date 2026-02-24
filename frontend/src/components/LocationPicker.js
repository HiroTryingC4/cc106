import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition, onLocationChange }) {
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      reverseGeocode(e.latlng.lat, e.latlng.lng, onLocationChange);
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        setPosition([newPos.lat, newPos.lng]);
        reverseGeocode(newPos.lat, newPos.lng, onLocationChange);
      }
    },
  };

  return position ? (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  ) : null;
}

// Reverse geocoding to get address from coordinates
const reverseGeocode = async (lat, lng, callback) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    if (data.display_name) {
      callback(data.display_name, lat, lng);
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
  }
};

// Forward geocoding to search for location
const searchLocation = async (query) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Location search failed:', error);
    return [];
  }
};

const LocationPicker = ({ value, onChange, error }) => {
  // Default to Philippines center
  const [position, setPosition] = useState([14.5995, 120.9842]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    if (value) {
      setSearchQuery(value);
    }
  }, [value]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const results = await searchLocation(searchQuery);
    setSearchResults(results);
    setShowResults(true);

    if (results.length > 0) {
      const firstResult = results[0];
      const newPos = [parseFloat(firstResult.lat), parseFloat(firstResult.lon)];
      setPosition(newPos);
      setMapKey(prev => prev + 1); // Force map to re-center
    }
  };

  const handleSelectResult = (result) => {
    const newPos = [parseFloat(result.lat), parseFloat(result.lon)];
    setPosition(newPos);
    setSearchQuery(result.display_name);
    onChange(result.display_name, result.lat, result.lon);
    setShowResults(false);
    setMapKey(prev => prev + 1);
  };

  const handleLocationChange = (address, lat, lng) => {
    setSearchQuery(address);
    onChange(address, lat, lng);
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(false);
              }}
              placeholder="Search for a location (e.g., Manila, Philippines)"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
              >
                <div className="text-sm font-medium text-gray-900">{result.display_name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  📍 {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 <strong>How to use:</strong> Search for your location above, or click/drag the marker on the map to set the exact position.
        </p>
      </div>

      {/* Map */}
      <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '400px' }}>
        <MapContainer
          key={mapKey}
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationChange={handleLocationChange}
          />
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      {searchQuery && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <strong>Selected Location:</strong> {searchQuery}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">Location is required</p>
      )}
    </div>
  );
};

export default LocationPicker;
