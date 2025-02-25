import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit, MdSave } from "react-icons/md";
import AgendaNavbar from "../components/AgendaNavbar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  createGiornata,
  fetchGiornataByData,
} from "../redux/slices/agendaSlice";
import Loading from "../components/utils/Loading";
import { useNavigate, useParams } from "react-router-dom";
import IGiornata, { exampleGiornata } from "../types/IGiornata";
import IPisolino, { examplePisolino } from "../types/IPisolino";
import ITerapia, { exampleTerapia } from "../types/ITerapia";
import { todayStr } from "../utils/functions";
import { fetchAnagraficaById } from "../redux/slices/anagraficaSlice";
import { addNotification } from "../redux/slices/notificationSlice";
import { MessageType, UscitaType } from "../types";
import IUscita, { exampleUscita } from "../types/IUscita";

function Giornata() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { date } = useParams<{ date: string }>();
  const dispatch = useAppDispatch();
  const { selectedGiornata, loadingGiornata, errorGiornata } = useAppSelector(
    (state) => state.agenda
  );
  const { selectedAnagrafica, loadingAnagrafica, errorAnagrafica } =
    useAppSelector((state) => state.anagrafica);

  const initialFormData: IGiornata = {
    ...exampleGiornata,
    Id_Anagrafica: Number(id),
    Data: date ?? "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IGiornata>(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);
    if (id && date) {
      dispatch(fetchGiornataByData({ id: Number(id), date }));
    }
  }, [id, date, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchAnagraficaById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!errorGiornata) {
      if (selectedGiornata) {
        setFormData(selectedGiornata);
      } else {
        setFormData(initialFormData);
      }
      setIsEditing(!selectedGiornata);
    }
  }, [selectedGiornata, errorGiornata]);

  useEffect(() => {
    if (errorGiornata) {
      if (!errorGiornata.includes("non trovata")) {
        dispatch(
          addNotification({ message: errorGiornata, type: MessageType.ERROR })
        );
      } else {
        if (selectedAnagrafica?.IsArchiviato) {
          dispatch(
            addNotification({
              message:
                "Anagrafica archiviata, non è possibile creare una nuova giornata",
              type: MessageType.WARNING,
            })
          );
        }
        setFormData(initialFormData);
        setIsEditing(true);
      }
    } else {
      setIsEditing(false);
    }
  }, [errorGiornata]);

  const addPisolino = () => {
    setFormData((prevData) => ({
      ...prevData,
      Sonno: {
        ...prevData.Sonno,
        Pisolini: [...(prevData.Sonno.Pisolini || []), examplePisolino],
      },
    }));
  };

  const removePisolino = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      Sonno: {
        ...prevData.Sonno,
        Pisolini: prevData.Sonno.Pisolini?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const addTerapia = () => {
    setFormData((prevData) => ({
      ...prevData,
      Terapie: [...(prevData.Terapie || []), exampleTerapia],
    }));
  };

  const removeTerapia = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      Terapie: prevData.Terapie?.filter((_, i) => i !== index) || [],
    }));
  };

  const addUscita = () => {
    setFormData((prevData) => ({
      ...prevData,
      Uscite: [...(prevData.Uscite || []), exampleUscita],
    }));
  };

  const removeUscita = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      Uscite: prevData.Uscite?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Dividi il nome per individuare la struttura annidata, se presente
    const nameParts = name.split("."); // Es: 'Sonno.Sveglia'

    setFormData((prevData) => {
      // Clona l'oggetto corrente di formData
      const updatedData = { ...prevData };

      // Naviga attraverso l'oggetto fino all'ultimo campo
      let currentLevel: any = updatedData;
      for (let i = 0; i < nameParts.length - 1; i++) {
        currentLevel[nameParts[i]] = { ...currentLevel[nameParts[i]] }; // Clona ogni livello per evitare la mutazione dello stato originale
        currentLevel = currentLevel[nameParts[i]];
      }

      // Aggiorna il valore del campo specifico
      currentLevel[nameParts[nameParts.length - 1]] = value;

      return updatedData;
    });
  };

  const handlePisolinoChange = (
    index: number,
    field: keyof IPisolino,
    value: string
  ) => {
    setFormData((prevData) => {
      const updatedPisolini = [...(prevData.Sonno.Pisolini || [])];
      updatedPisolini[index] = { ...updatedPisolini[index], [field]: value };
      return {
        ...prevData,
        Sonno: { ...prevData.Sonno, Pisolini: updatedPisolini },
      };
    });
  };

  const handleTerapiaChange = (
    index: number,
    field: keyof ITerapia,
    value: string
  ) => {
    setFormData((prevData) => {
      const updatedTerapie = [...(prevData.Terapie || [])];
      updatedTerapie[index] = { ...updatedTerapie[index], [field]: value };
      return { ...prevData, Terapie: updatedTerapie };
    });
  };

  const handleUscitaChange = (
    index: number,
    field: keyof IUscita,
    value: string
  ) => {
    setFormData((prevData) => {
      const updatedUscite = [...(prevData.Uscite || [])];
      updatedUscite[index] = { ...updatedUscite[index], [field]: value };
      return { ...prevData, Uscite: updatedUscite };
    });
  };

  const handleSave = () => {
    if (formData.Uscite.some((uscita) => uscita.Data && !uscita.Responsabile)) {
      dispatch(
        addNotification({
          message: "Inserire il responsabile per l'uscita",
          type: MessageType.WARNING,
          tag: "createGiornata",
        })
      );
      return;
    }
    if (
      formData.Uscite.some(
        (uscita) => uscita.DataRientro && !uscita.ResponsabileRientro
      )
    ) {
      dispatch(
        addNotification({
          message: "Inserire il responsabile per il rientro",
          type: MessageType.WARNING,
          tag: "createGiornata",
        })
      );
      return;
    }

    dispatch(createGiornata(formData));
  };

  return (
    <div className="container">
      {loadingGiornata && <Loading />}

      {!loadingGiornata && (formData || isEditing) && (
        <>
          <AgendaNavbar
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
          />

          <section
            id="sonno"
            className="bg-white border border-gray-300 rounded-2xl rounded-tl-none shadow-md p-6 pb-8 relative z-[94]"
          >
            <h2 className="h2 mb-4">Sonno</h2>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <div className="col-span-1">
                <div className="form-element">
                  <label htmlFor="sveglia">Sveglia</label>
                  <input
                    type="time"
                    id="sveglia"
                    name="Sonno.Sveglia"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Sonno.Sveglia ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="form-element">
                  <label htmlFor="letto">Letto</label>
                  <input
                    type="time"
                    id="letto"
                    name="Sonno.Letto"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Sonno.Letto ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="form-element">
                  <button
                    onClick={addPisolino}
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                  >
                    Pisolino <MdAdd size={18} />
                  </button>
                </div>
              </div>
              <div className="col-span-3">
                <div className="form-element">
                  <label htmlFor="sonno_note">Note</label>
                  <input
                    type="text"
                    id="sonno_note"
                    name="Sonno.Note"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Sonno.Note ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.Sonno.Pisolini &&
                formData.Sonno.Pisolini.length > 0 && (
                  <h4 className="h4">Pisolini</h4>
                )}
              {formData.Sonno.Pisolini?.map((pisolino, index) => (
                <div key={index} className="col-span-3">
                  <div className="grid grid-cols-10 gap-x-10 gap-y-4">
                    <div className="col-span-3">
                      <div className="form-element">
                        <label htmlFor={`sonno_pisolino_letto_${index}`}>
                          Letto
                        </label>
                        <input
                          type="time"
                          id={`sonno_pisolino_letto_${index}`}
                          disabled={!isEditing}
                          value={pisolino.Letto ?? ""}
                          onChange={(e) =>
                            handlePisolinoChange(index, "Letto", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="form-element">
                        <label htmlFor={`sonno_pisolino_sveglia_${index}`}>
                          Sveglia
                        </label>
                        <input
                          type="time"
                          id={`sonno_pisolino_sveglia_${index}`}
                          disabled={!isEditing}
                          value={pisolino.Sveglia ?? ""}
                          onChange={(e) =>
                            handlePisolinoChange(
                              index,
                              "Sveglia",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="form-element">
                        <label htmlFor={`sonno_pisolino_note_${index}`}>
                          Note
                        </label>
                        <input
                          type="text"
                          id={`sonno_pisolino_note_${index}`}
                          disabled={!isEditing}
                          value={pisolino.Note ?? ""}
                          onChange={(e) =>
                            handlePisolinoChange(index, "Note", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="form-element">
                        <button
                          className="btn btn-danger"
                          onClick={() => removePisolino(index)}
                          disabled={!isEditing}
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="pasti"
            className="bg-white border border-gray-300 rounded-2xl shadow-md p-6 pb-8 -mt-2 relative z-[95]"
          >
            <h2 className="h2 mb-4">Pasti</h2>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <div className="col-span-1">
                <div className="form-element !grid grid-cols-2">
                  <label htmlFor="colazione">Colazione</label>
                  <input
                    type="time"
                    id="colazione"
                    name="Pasti.Colazione"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.Colazione ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="form-element">
                  <label htmlFor="colazione_note">Note</label>
                  <input
                    type="text"
                    id="colazione_note"
                    name="Pasti.NoteColazione"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.NoteColazione ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="form-element !grid grid-cols-2">
                  <label htmlFor="pranzo">Pranzo</label>
                  <input
                    type="time"
                    id="pranzo"
                    name="Pasti.Pranzo"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.Pranzo ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="form-element">
                  <label htmlFor="pranzo_note">Note</label>
                  <input
                    type="text"
                    id="pranzo_note"
                    name="Pasti.NotePranzo"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.NotePranzo ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="form-element !grid grid-cols-2">
                  <label htmlFor="cena">Cena</label>
                  <input
                    type="time"
                    id="cena"
                    name="Pasti.Cena"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.Cena ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="form-element">
                  <label htmlFor="cena_note">Note</label>
                  <input
                    type="text"
                    id="cena_note"
                    name="Pasti.NoteCena"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.NoteCena ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="form-element !grid grid-cols-2">
                  <label htmlFor="merenda_mattino">Merenda mattino</label>
                  <input
                    type="time"
                    id="merenda_mattino"
                    name="Pasti.MerendaMattino"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.MerendaMattino ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="form-element">
                  <label htmlFor="mattino_note">Note</label>
                  <input
                    type="text"
                    id="mattino_note"
                    name="Pasti.NoteMerendaMattino"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.NoteMerendaMattino ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="form-element !grid grid-cols-2">
                  <label htmlFor="merenda_pomeriggio">Merenda pomeriggio</label>
                  <input
                    type="time"
                    id="merenda_pomeriggio"
                    name="Pasti.MerendaPomeriggio"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.MerendaPomeriggio ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="form-element">
                  <label htmlFor="pomeriggio_note">Note</label>
                  <input
                    type="text"
                    id="pomeriggio_note"
                    name="Pasti.NoteMerendaPomeriggio"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Pasti.NoteMerendaPomeriggio ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            id="uscite"
            className="bg-white border border-gray-300 rounded-2xl shadow-md p-6 pb-8 -mt-2 relative z-[96]"
          >
            <h2 className="h2">Uscite</h2>
            {formData.Uscite.map((uscita, index) => (
              <div key={index}>
                <div className="flex items-center justify-between gap-10 mt-6">
                  <h3 className="h3 mb-4">Uscita {index + 1}</h3>
                  <div className="form-element">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeUscita(index)}
                      disabled={!isEditing}
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-x-10 gap-y-4">
                  <div className="col-span-3">
                    <div className="form-element">
                      <label htmlFor="tipologia">Tipologia</label>
                      <select
                        id="tipologia"
                        disabled={!isEditing}
                        value={uscita.Tipologia ?? ""}
                        onChange={(e) =>
                          handleUscitaChange(index, "Tipologia", e.target.value)
                        }
                      >
                        <option value="" hidden></option>
                        <option value={UscitaType.ORDINARIA}>Ordinaria</option>
                        <option value={UscitaType.EXTRA}>Extra</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="form-element">
                      <label htmlFor="motivo">Motivo</label>
                      <input
                        type="text"
                        id="motivo"
                        disabled={!isEditing}
                        value={uscita.Motivo ?? ""}
                        onChange={(e) =>
                          handleUscitaChange(index, "Motivo", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="form-element">
                      <label htmlFor="uscita_data">Data</label>
                      <input
                        type="date"
                        id="uscita_data"
                        disabled={!isEditing}
                        value={uscita.Data ?? ""}
                        max={todayStr()}
                        onChange={(e) =>
                          handleUscitaChange(index, "Data", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="form-element">
                      <label htmlFor="uscita_orario">Orario</label>
                      <input
                        type="time"
                        id="uscita_orario"
                        disabled={!isEditing}
                        value={uscita.Ora ?? ""}
                        onChange={(e) =>
                          handleUscitaChange(index, "Ora", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="form-element">
                      <label htmlFor="uscita_responsabile">Responsabile</label>
                      <input
                        type="text"
                        id="uscita_responsabile"
                        disabled={!isEditing}
                        value={uscita.Responsabile ?? ""}
                        onChange={(e) =>
                          handleUscitaChange(
                            index,
                            "Responsabile",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <h3 className="h3 mb-4 mt-4">Rientro {index + 1}</h3>
                <div className="grid grid-cols-6 gap-x-10 gap-y-4">
                  <div className="col-span-2">
                    <div className="form-element">
                      <label htmlFor="rientro_data">Data</label>
                      <input
                        type="date"
                        id="rientro_data"
                        disabled={!isEditing}
                        value={uscita.DataRientro ?? ""}
                        max={todayStr()}
                        onChange={(e) =>
                          handleUscitaChange(
                            index,
                            "DataRientro",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="form-element">
                      <label htmlFor="rientro_orario">Orario</label>
                      <input
                        type="time"
                        id="rientro_orario"
                        disabled={!isEditing}
                        value={uscita.OraRientro ?? ""}
                        onChange={(e) =>
                          handleUscitaChange(
                            index,
                            "OraRientro",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="form-element">
                      <label htmlFor="rientro_responsabile">Responsabile</label>
                      <input
                        type="text"
                        id="rientro_responsabile"
                        disabled={!isEditing}
                        value={uscita.ResponsabileRientro ?? ""}
                        onChange={(e) =>
                          handleUscitaChange(
                            index,
                            "ResponsabileRientro",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-1/3 mt-6">
              <div className="form-element">
                <button
                  onClick={addUscita}
                  disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                >
                  Aggiungi uscita <MdAdd size={18} />
                </button>
              </div>
            </div>
          </section>

          <section
            id="igiene"
            className="bg-white border border-gray-300 rounded-2xl shadow-md p-6 pb-8 -mt-2 relative z-[97]"
          >
            <h2 className="h2 mb-4">Igiene personale</h2>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <div className="col-span-1">
                <div className="form-element">
                  <label htmlFor="bagno">Bagno</label>
                  <input
                    type="time"
                    id="bagno"
                    name="Igiene.Bagno"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Igiene.Bagno ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="form-element">
                  <label htmlFor="bagno_note">Note</label>
                  <input
                    type="text"
                    id="bagno_note"
                    name="Igiene.NoteBagno"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Igiene.NoteBagno ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="form-element">
                  <label htmlFor="cambio">Cambio</label>
                  <input
                    type="time"
                    id="cambio"
                    name="Igiene.Cambio"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Igiene.Cambio ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="form-element">
                  <label htmlFor="cambio_note">Note</label>
                  <input
                    type="text"
                    id="cambio_note"
                    name="Igiene.NoteCambio"
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.Igiene.NoteCambio ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            id="terapie"
            className="bg-white border border-gray-300 rounded-2xl shadow-md p-6 pb-8 -mt-2 relative z-[98]"
          >
            <h2 className="h2 mb-4">Terapie</h2>
            {formData.Terapie.map((terapia, index) => (
              <div
                key={index}
                className="grid grid-cols-10 gap-x-10 gap-y-4 mb-6"
              >
                <div className="col-span-4">
                  <div className="form-element">
                    <label htmlFor={`tipologia_${index}`}>Tipologia</label>
                    <input
                      type="text"
                      id={`tipologia_${index}`}
                      disabled={!isEditing}
                      value={terapia.Tipologia || ""}
                      onChange={(e) =>
                        handleTerapiaChange(index, "Tipologia", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="form-element">
                    <label htmlFor={`inizio_${index}`}>Inizio</label>
                    <input
                      type="time"
                      id={`inizio_${index}`}
                      disabled={!isEditing}
                      value={terapia.Inizio || ""}
                      onChange={(e) =>
                        handleTerapiaChange(index, "Inizio", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="form-element">
                    <label htmlFor={`termine_${index}`}>Termine</label>
                    <input
                      type="time"
                      id={`termine_${index}`}
                      disabled={!isEditing}
                      value={terapia.Termine || ""}
                      onChange={(e) =>
                        handleTerapiaChange(index, "Termine", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-span-9">
                  <div className="form-element">
                    <label htmlFor={`terapie_note_${index}`}>Note</label>
                    <input
                      type="text"
                      id={`terapie_note_${index}`}
                      disabled={!isEditing}
                      value={terapia.Note || ""}
                      onChange={(e) =>
                        handleTerapiaChange(index, "Note", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="form-element">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeTerapia(index)}
                      disabled={!isEditing}
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-1/3">
              <div className="form-element">
                <button
                  onClick={addTerapia}
                  disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                >
                  Aggiungi terapia <MdAdd size={18} />
                </button>
              </div>
            </div>
          </section>

          <section
            id="fatti-significativi"
            className="bg-white border border-gray-300 rounded-2xl shadow-md p-6 pb-8 -mt-2 relative z-[99]"
          >
            <h2 className="h2 mb-4">Fatti significativi</h2>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <div className="col-span-3">
                <div className="form-element flex-col !items-start !gap-2">
                  <label htmlFor="mattina" className="h4">
                    Mattina
                  </label>
                  <textarea
                    id="mattina"
                    name="FattiSignificativi.Mattina"
                    rows={4}
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.FattiSignificativi.Mattina ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-3">
                <div className="form-element flex-col !items-start !gap-2">
                  <label htmlFor="pomeriggio" className="h4">
                    Pomeriggio
                  </label>
                  <textarea
                    id="pomeriggio"
                    name="FattiSignificativi.Pomeriggio"
                    rows={4}
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.FattiSignificativi.Pomeriggio ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-3">
                <div className="form-element flex-col !items-start !gap-2">
                  <label htmlFor="sera" className="h4">
                    Sera
                  </label>
                  <textarea
                    id="sera"
                    name="FattiSignificativi.Sera"
                    rows={4}
                    disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
                    value={formData.FattiSignificativi.Sera ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between mt-4">
            <button
              className="btn btn-lg"
              disabled={isEditing || selectedAnagrafica?.IsArchiviato}
              onClick={() => setIsEditing(!isEditing)}
            >
              Modifica <MdEdit size={20} />
            </button>

            <button
              className="btn btn-lg"
              disabled={!isEditing || selectedAnagrafica?.IsArchiviato}
              onClick={handleSave}
            >
              Salva <MdSave size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Giornata;
