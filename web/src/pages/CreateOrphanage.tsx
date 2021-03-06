import React, { FormEvent, useState, ChangeEvent, useEffect, CSSProperties } from "react";
import { useHistory } from "react-router-dom";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import { FiArrowLeft, FiPlus, FiRepeat, FiX } from "react-icons/fi";

import Sidebar from "../components/Sidebar";

import '../styles/pages/create-orphanage.css';
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { FaLongArrowAltDown } from "react-icons/fa";

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [instructions, setInstructions] = useState("");
  const [opening_hours, setOpeningHours] = useState("");
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  //Botao excluir imagem
  //Tirar do dois
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append("about", about);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("instructions", instructions);
    data.append("opening_hours", opening_hours);
    data.append("open_on_weekends", String(open_on_weekends));

    images.forEach(image => {
      data.append('images', image);
    });

    try {
      await api.post('orphanages', data);

      alert('Cadastro realizado com sucesso');
      history.push('/app');
    } catch (err) {
      alert('Erro ao realizar o cadastro')
    }
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files)
      return;

    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);
  }

  function handleDeleteImage(index: number) {
    setImages(images.filter((image, mapIndex) => index !== mapIndex));
    setPreviewImages(previewImages.filter((previewImage, mapIndex) => index !== mapIndex));
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-23.6815314, -46.8754995]}
              style={{ width: "100%", height: 280 }}
              zoom={15}
              onCLick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id="about"

                maxLength={300}
                value={about}
                onChange={(event) => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {
                  previewImages.map((image, index) => {
                    return (
                      <div
                        key={image}
                        className={`image-container ${(index + 1) % 5 === 0 ? 'last-image-container' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <FiX size={15} color="#ff0000" />
                        </button>
                        <img src={image} alt={name} />
                      </div>
                    )
                  })
                }

                < label htmlFor="image[]" className="new-image" >
                  <FiPlus size={24} color="#15b6d6" />
                </label>

              </div>

              <input
                multiple
                type="file"
                id="image[]"
                hidden
                onChange={handleSelectImages}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={(event) => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div >
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
