import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  const [isStateDisabled, setIsStateDisabled] = useState(true);
  const [isCityDisabled, setIsCityDisabled] = useState(true);
  
  // Fetch countries on initial render
  useEffect(() => {
    axios.get('https://crio-location-selector.onrender.com/countries')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);
  
  // Fetch states when a country is selected
  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setIsStateDisabled(false);
    
    // Fetch states for the selected country
    axios.get(`https://crio-location-selector.onrender.com/country=${country}/states`)
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  };

  // Fetch cities when a state is selected
  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedCity('');
    setIsCityDisabled(false);
    
    // Fetch cities for the selected state and country
    axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`)
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  };

  // Handle city change
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  // Display the selected location
  const renderLocation = () => {
    if (selectedCity && selectedState && selectedCountry) {
      return `You selected ${selectedCity}, ${selectedState}, ${selectedCountry}`;
    }
    return null;
  };

  return (
    <div className="location-selector">
      <h2>Select Location</h2>

      <div>
        <label>Select Country:</label>
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
          
      <div>
        <label>Select State:</label>
        <select value={selectedState} onChange={handleStateChange} disabled={isStateDisabled}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Select City:</label>
        <select value={selectedCity} onChange={handleCityChange} disabled={isCityDisabled}>
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        {renderLocation() && <p>{renderLocation()}</p>}
      </div>
    </div>
  );
};

export default LocationSelector;
