import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import darkMapImg from '../images/dark-map.png';
import lightMapImg from '../images/light-map.png';
import streetMapImg from "../images/street-map.png";
import satelliteMapImg from "../images/satellite-map.png";

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/orphanages-map.css';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';
import Orphanage from './Orphanage';

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanagesMap() {
  const [mapStyle, setMapStyle] = useState("light-v10");
  
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy" />

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>São Paulo</strong>
          <span>São Paulo</span>
        </footer>
      </aside>

      <Map
        center={[-23.6608494, -46.6592053]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        {/* <TileLayer 
          url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />

        {orphanages.map(orphanage => {
          return (
            <Marker 
              key={orphanage.id} 
              icon={mapIcon} 
              position={[orphanage.latitude, orphanage.longitude]}
            >
              <Popup
                closeButton={false}
                minWidth={240}
                maxWidth={240}
                className="map-popup"
              >
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20} color="#fff" />
                </Link>
              </Popup>
            </Marker>
          )
        })}
      </Map>

      <div className="map-styles">
        <button
          className="btn-street-map"
          onClick={() => {
            setMapStyle("streets-v11");
          }}
        >
          <img src={streetMapImg} alt="Modo ruas do mapa" />
        </button>
        <button
          className="btn-light-map"
          onClick={() => {
            setMapStyle("light-v10");
          }}
        >
          <img src={lightMapImg} alt="Modo claro do mapa" />
        </button>
        <button
          className="btn-dark-map"
          onClick={() => {
            setMapStyle("dark-v10");
          }}
        >
          <img src={darkMapImg} alt="Modo escuro do mapa" />
        </button>
        <button
          className="btn-satellite-map"
          onClick={() => {
            setMapStyle("satellite-v9");
          }}
        >
          <img src={satelliteMapImg} alt="Modo satélite do mapa" />
        </button>
      </div>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;