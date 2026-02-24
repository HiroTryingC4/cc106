import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view when position changes
function MapViewController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.5
      });
    }
  }, [center, zoom, map]);
  
  return null;
}

// Component to handle map clicks and marker dragging
function LocationMarker({ position, setPosition, onLocationChange, onPositionChange }) {
  const markerRef = useRef(null);
  const map = useMap();

  // Handle map clicks
  useEffect(() => {
    const handleClick = (e) => {
      const newPos = [e.latlng.lat, e.latlng.lng];
      onPositionChange(newPos);
      reverseGeocode(e.latlng.lat, e.latlng.lng, onLocationChange);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationChange, onPositionChange]);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        const posArray = [newPos.lat, newPos.lng];
        onPositionChange(posArray);
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
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([14.5995, 120.9842]);
  const [mapZoom, setMapZoom] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    if (value) {
      setSearchQuery(value);
    }
  }, [value]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(false);
    const results = await searchLocation(searchQuery);
    setSearchResults(results);
    setShowResults(true);
    setIsSearching(false);

    if (results.length > 0) {
      // Automatically select first result and show on map
      const firstResult = results[0];
      const newPos = [parseFloat(firstResult.lat), parseFloat(firstResult.lon)];
      setPosition(newPos);
      setMapCenter(newPos);
      setMapZoom(15); // Zoom in closer when searching
      setSearchQuery(firstResult.display_name);
      onChange(firstResult.display_name, firstResult.lat, firstResult.lon);
    }
  };

  const handleSelectResult = (result) => {
    const newPos = [parseFloat(result.lat), parseFloat(result.lon)];
    setPosition(newPos);
    setMapCenter(newPos);
    setMapZoom(15);
    setSearchQuery(result.display_name);
    onChange(result.display_name, result.lat, result.lon);
    setShowResults(false);
  };

  const handleLocationChange = async (address, lat, lng) => {
    setSearchQuery(address);
    onChange(address, lat, lng);
    setIsLoadingAddress(false);
  };

  const handlePositionChange = (newPos) => {
    setPosition(newPos);
    setIsLoadingAddress(true);
    setSearchQuery('Loading address...');
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Search for a location (e.g., Quezon City, Manila)"
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {isSearching ? '⏳' : '🔍'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
              Select a location to pin on map:
            </div>
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

        {/* No Results Message */}
        {showResults && searchResults.length === 0 && !isSearching && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-600">No locations found. Try a different search term.</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 <strong>How to use:</strong>
        </p>
        <ul className="text-xs text-blue-700 mt-1 ml-4 list-disc space-y-1">
          <li>Search for your location above - it will appear on the map with a marker</li>
          <li>Drag the marker to adjust the exact position</li>
          <li>Or click anywhere on the map to place the marker</li>
        </ul>
      </div>

      {/* Map */}
      <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '400px' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewController center={mapCenter} zoom={mapZoom} />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationChange={handleLocationChange}
            onPositionChange={handlePositionChange}
          />
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      {position && searchQuery && !isLoadingAddress && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <strong>✓ Selected Location:</strong> {searchQuery}
          </p>
          <p className="text-xs text-green-600 mt-1">
            📍 Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
          <p className="text-xs text-green-600 mt-1 italic">
            You can drag the marker to fine-tune the exact position
          </p>
        </div>
      )}

      {/* Loading Address Indicator */}
      {isLoadingAddress && position && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="inline-block animate-spin mr-2">⏳</span>
            <strong>Getting address...</strong>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            📍 Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      )}

      {!position && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            ⚠️ No location selected yet. Search for a location or click on the map.
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
