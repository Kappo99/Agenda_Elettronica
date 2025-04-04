import React, { useEffect, useMemo, useState } from "react";
import { MdDownload, MdEdit, MdEditDocument, MdSave } from "react-icons/md";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAnagraficaById } from "../redux/slices/anagraficaSlice";
import { todayStr } from "../utils/functions";
import SearchBar from "./utils/SearchBar";
import { fetchFamigliaById } from "../redux/slices/famigliaSlice";
import FormDownloadStoricoPopup from "./popup/FormDownloadStoricoPopup";

interface IProps {
  isFamiglia?: boolean;
  isEditing?: boolean;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  isCreating?: boolean;
  handleSave?: () => void;
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
}

function AgendaNavbar(props: IProps) {
  const { id } = useParams<{ id: string }>();
  const { str } = useParams<{ str: string }>();
  const { date } = useParams<{ date: string }>();
  const { selectedAnagrafica } = useAppSelector((state) => state.anagrafica);
  const { selectedFamiglia } = useAppSelector((state) => state.famiglia);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Storico");
  const [showDownloadForm, setShowDownloadForm] = useState(false);

  const isFamiglia = props.isFamiglia || location.pathname.includes("/famiglia");

  const tabs = useMemo(() => {
    const anagraficaTabs = [{ name: "Dati anagrafici", path: `/anagrafica/${id}` }];
    const famigliaTabs = [{ name: "Famiglia", path: `/famiglia/${id}` }];
    const userTabs = [
      { name: "Giornata", path: `/${str ?? (isFamiglia ? "famiglia" : "anagrafica")}/giornata/${id}/${todayStr()}` },
      { name: "Storico", path: `/${str ?? (isFamiglia ? "famiglia" : "anagrafica")}/storico/${id}` },
    ];
    const baseTabs = isFamiglia ? famigliaTabs : anagraficaTabs;

    if (isFamiglia || !selectedAnagrafica?.IsEducatore) {
      return [...userTabs, ...baseTabs];
    }

    return baseTabs;
  }, [id, str, isFamiglia, selectedAnagrafica]);

  // Imposto l'activeTab in base alla rotta corrente
  useEffect(() => {
    const matchedTab = tabs.find((tab) => tab.path.includes(location.pathname));

    if (matchedTab) {
      setActiveTab(matchedTab.name);
    }
  }, [location.pathname, tabs]);

  useEffect(() => {
    if (id && selectedAnagrafica?.Id !== Number(id)) {
      // Effettua la fetch solo se non esiste già un'anagrafica selezionata
      dispatch(fetchAnagraficaById(Number(id)));
    }
  }, [id, selectedAnagrafica, dispatch]);

  useEffect(() => {
    if (id && selectedFamiglia?.Id !== Number(id)) {
      // Effettua la fetch solo se non esiste già un'anagrafica selezionata
      dispatch(fetchFamigliaById(Number(id)));
    }
  }, [id, selectedFamiglia, dispatch]);

  const handleSave = () => {
    if (props.handleSave) {
      props.handleSave();
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    if (date) {
      navigate(location.pathname.replace(date, selectedDate));
    }
  };

  return (
    <>
      {showDownloadForm && (
          <FormDownloadStoricoPopup
              message='Seleziona il periodo da scaricare'
              onClose={() => setShowDownloadForm(false)}
          />
      )}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-y-4 mb-6">
        <h1 className="h1">
          {props.isCreating
            ? `Nuova ${isFamiglia ? "famiglia" : "anagrafica"}`
            : isFamiglia
							? selectedFamiglia
								? `${selectedFamiglia.Cognome}`
								: "Caricamento..."
							: selectedAnagrafica
								? `${selectedAnagrafica.Nome} ${selectedAnagrafica.Cognome}`
								: "Caricamento..."}
        </h1>
        {date && (
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium uppercase">Data</span>
            <div className="form-element text-lg font-medium">
              <input
                type="date"
                value={date}
                max={todayStr()}
                onChange={handleDateChange}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-y-4">
        <div className="flex items-center gap-5">
          {tabs.map((tab) => (
            <Link
              to={tab.path}
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2 ${
                id && !selectedAnagrafica?.IsEducatore
                  ? "cursor-pointer"
                  : "pointer-events-none"
              } border border-b-0 border-gray-300 rounded-t-2xl relative ${
                activeTab === tab.name
                  ? "bg-white"
                  : `bg-gray-100 ${id ? "hover:bg-white" : ""}`
              }`}
            >
              {tab.name}
              {activeTab === tab.name && (
                <div className="absolute -bottom-1 left-0 w-full h-2 bg-white z-[800]"></div>
              )}
            </Link>
          ))}
        </div>

        {activeTab === "Giornata" &&
          (props.isEditing ? (
            <button
              className="btn"
              disabled={selectedAnagrafica?.IsArchiviato}
              onClick={handleSave}
            >
              Salva <MdSave />
            </button>
          ) : (
            <button
              className="btn"
              disabled={selectedAnagrafica?.IsArchiviato}
              onClick={() =>
                props.setIsEditing && props.setIsEditing(!props.isEditing)
              }
            >
              Modifica <MdEdit />
            </button>
          ))}

        {activeTab === "Storico" && (
          <div className="flex items-center gap-4">
            {/* <SearchBar value={props.searchTerm ?? ''} onChange={props.setSearchTerm ?? (() => { })} /> */}
            <Link
              to={`/giornata/${id}/${todayStr()}`}
              className={`btn ${
                selectedAnagrafica?.IsArchiviato && " disabled"
              }`}
            >
              Giornata <MdEditDocument size={18} />
            </Link>
            <button className='btn btn-sm btn-outline' onClick={() => setShowDownloadForm(true)}><MdDownload size={20} /></button>
          </div>
        )}
      </div>
    </>
  );
}

export default AgendaNavbar;
