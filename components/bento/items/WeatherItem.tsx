"use client";

import { BentoItem } from "@/lib/types";
import { useState, useEffect } from "react";
import { MapPin, Search, Cloud, CloudRain, Sun, CloudSun, Wind, Snowflake, CloudLightning, CloudFog, Settings } from "lucide-react";

interface WeatherItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  icon: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export default function WeatherItem({ item, onUpdate, editable }: WeatherItemProps) {
  const [weather, setWeather] = useState<WeatherData | null>(item.content?.weather || null);
  const [location, setLocation] = useState(item.content?.location || "");
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Get weather icon based on condition code
  const getWeatherIcon = (weatherCode: number) => {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    if (weatherCode <= 3) { // Clear or partly cloudy
      return weatherCode === 0 ? "sun" : "cloud-sun";
    } else if (weatherCode <= 49) { // Fog
      return "fog";
    } else if (weatherCode <= 69) { // Rain
      return "cloud-rain";
    } else if (weatherCode <= 79) { // Snow
      return "snow";
    } else if (weatherCode <= 99) { // Thunderstorm
      return "lightning";
    }
    return "cloud";
  };

  // Render weather icon component
  const renderWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case "cloud":
        return <Cloud size={48} className="text-gray-400" />;
      case "cloud-rain":
        return <CloudRain size={48} className="text-blue-400" />;
      case "sun":
        return <Sun size={48} className="text-yellow-400" />;
      case "cloud-sun":
        return <CloudSun size={48} className="text-yellow-300" />;
      case "wind":
        return <Wind size={48} className="text-gray-400" />;
      case "snow":
        return <Snowflake size={48} className="text-blue-200" />;
      case "lightning":
        return <CloudLightning size={48} className="text-yellow-500" />;
      case "fog":
        return <CloudFog size={48} className="text-gray-300" />;
      default:
        return <Cloud size={48} className="text-gray-400" />;
    }
  };

  // Search for locations using geocoding API
  const searchLocations = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.results) {
        setSearchResults(data.results.map((result: any) => ({
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude,
          country: result.country
        })));
      } else {
        setSearchResults([]);
        setError("No locations found");
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      setError("Failed to search locations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data from Open-Meteo API
  const fetchWeather = async (latitude: number, longitude: number, locationName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.current) {
        const weatherCode = data.current.weather_code;
        const icon = getWeatherIcon(weatherCode);
        const condition = getWeatherCondition(weatherCode);
        
        const weatherData: WeatherData = {
          location: locationName,
          temperature: data.current.temperature_2m,
          condition: condition,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          feelsLike: data.current.apparent_temperature,
          icon: icon,
          latitude: latitude,
          longitude: longitude
        };
        
        setWeather(weatherData);
        
        onUpdate({
          ...item.content,
          weather: weatherData,
          location: locationName,
          latitude: latitude,
          longitude: longitude
        });
        
        return weatherData;
      } else {
        throw new Error('Invalid weather data');
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather data");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get weather condition description from code
  const getWeatherCondition = (code: number): string => {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return "Clear sky";
    if (code === 1) return "Mainly clear";
    if (code === 2) return "Partly cloudy";
    if (code === 3) return "Overcast";
    if (code <= 49) return "Fog";
    if (code <= 59) return "Drizzle";
    if (code <= 69) return "Rain";
    if (code <= 79) return "Snow";
    if (code <= 99) return "Thunderstorm";
    return "Unknown";
  };

  // Handle location selection
  const selectLocation = (result: GeocodingResult) => {
    setLocation(`${result.name}, ${result.country}`);
    fetchWeather(result.latitude, result.longitude, `${result.name}, ${result.country}`);
    setSearchResults([]);
    setShowSettings(false);
  };

  // Initialize with saved location or use geolocation
  useEffect(() => {
    const loadSavedWeather = async () => {
      if (item.content?.weather) {
        setWeather(item.content.weather);
      } else if (item.content?.latitude && item.content?.longitude && item.content?.location) {
        fetchWeather(item.content.latitude, item.content.longitude, item.content.location);
      } else {
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Get location name from coordinates
                const response = await fetch(
                  `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&format=json`
                );
                
                if (response.ok) {
                  const data = await response.json();
                  if (data.results && data.results.length > 0) {
                    const locationName = `${data.results[0].name}, ${data.results[0].country}`;
                    fetchWeather(position.coords.latitude, position.coords.longitude, locationName);
                  } else {
                    // If reverse geocoding fails, just use coordinates
                    fetchWeather(position.coords.latitude, position.coords.longitude, "Current Location");
                  }
                } else {
                  fetchWeather(position.coords.latitude, position.coords.longitude, "Current Location");
                }
              } catch (error) {
                console.error("Error in geolocation:", error);
                // Default to London if all else fails
                fetchWeather(51.5074, -0.1278, "London, UK");
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              // Default to London if geolocation fails
              fetchWeather(51.5074, -0.1278, "London, UK");
            }
          );
        } else {
          // Default to London if geolocation not supported
          fetchWeather(51.5074, -0.1278, "London, UK");
        }
      }
    };
    
    loadSavedWeather();
  }, []);

  return (
    <div className="w-full h-full p-4 relative">
      {editable && !showSettings && (
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-2 right-2 p-1.5 bg-secondary rounded-full hover:bg-secondary/80"
          title="Change location"
        >
          <Settings size={16} />
        </button>
      )}
      
      {showSettings ? (
        <div className="w-full space-y-4">
          <h3 className="text-center font-medium">Weather Settings</h3>
          
          <div className="space-y-2">
            <label className="block text-sm">Search Location</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city name"
                className="w-full p-2 pr-10 border rounded"
              />
              <button
                onClick={() => searchLocations(searchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Search size={18} />
              </button>
            </div>
            
            {loading && (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            
            {error && <p className="text-destructive text-sm">{error}</p>}
            
            {searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto border rounded mt-1">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => selectLocation(result)}
                    className="w-full text-left p-2 hover:bg-muted border-b last:border-b-0 flex items-center"
                  >
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span>
                      {result.name}, {result.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowSettings(false)}
              className="px-3 py-1 bg-secondary rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : weather ? (
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <MapPin size={16} className="mr-1" />
            <span className="font-medium">{weather.location}</span>
          </div>
          
          <div className="flex items-center justify-center my-2">
            {renderWeatherIcon(weather.icon)}
          </div>
          
          <div className="text-4xl font-bold mb-1">{Math.round(weather.temperature)}°C</div>
          <div className="text-lg mb-3">{weather.condition}</div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">Feels like:</span>
              <span>{Math.round(weather.feelsLike)}°C</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">Humidity:</span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">Wind:</span>
              <span>{Math.round(weather.windSpeed)} km/h</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>No weather data available</p>
        </div>
      )}
    </div>
  );
} 