import React, { useEffect, useState } from "react";
import AgendaNavbar from "../components/AgendaNavbar";
import { MdDelete, MdDownload } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteGiornata, fetchAgenda } from "../redux/slices/agendaSlice";
import Loading from "../components/utils/Loading";
import PaginationControls from "../components/utils/PaginationControls";
import { addNotification } from "../redux/slices/notificationSlice";
import { MessageType } from "../types";
import { hidePopup, showPopup } from "../redux/slices/popupSlice";
import { usePopup } from "../context/PopupContext";

function Storico() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    agenda,
    loadingGiornata: loading,
    errorGiornata: error,
  } = useAppSelector((state) => state.agenda);
  const { registerCallback } = usePopup();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchAgenda(searchTerm));
    }
  }, [id, dispatch, searchTerm]);

  useEffect(() => {
    if (
      error &&
      !error.includes("Giornata") &&
      !error.includes("non trovata")
    ) {
      dispatch(addNotification({ message: error, type: MessageType.ERROR }));
    }
  }, [error]);

  const handleDeleteConfirmClick = (date: string) => {
    const callbackId = "confirmDelete";
    registerCallback(callbackId, () => handleDelete(date));

    dispatch(
      showPopup({
        type: MessageType.ERROR,
        message:
          "Sei sicuro di voler eliminare la giornata? I dati non saranno recuperabili",
        onConfirmId: callbackId,
      })
    );
  };

  const handleDelete = (date: string) => {
    if (id && date) {
      dispatch(deleteGiornata(date));
      dispatch(hidePopup());
      dispatch(
        addNotification({
          message: "Giornata eliminata",
          type: MessageType.SUCCESS,
        })
      );
    }
  };

  return (
    <div className="container">
      <AgendaNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <table className="rounded-tl-none">
        <thead>
          <tr>
            <th>Data</th>
            <th>Sonno</th>
            <th>Uscita</th>
            <th>Fatti significativi</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={5}>{loading && <Loading />}</td>
            </tr>
          )}
          {!loading &&
            !error &&
            agenda.map((giornata, index) => (
              <tr key={index} className="hover:bg-gray-200 cursor-pointer" onClick={() => navigate(`/giornata/${id}/${giornata.Data}`)}>
                <td>{giornata.Data}</td>
                <td>
                  {giornata.Sonno?.Sveglia != null ? "✅" : "❌"} |{" "}
                  {giornata.Sonno?.Letto != null ? "✅" : "❌"}
                </td>
                <td>
                  {giornata.Uscite.some(
                    (uscita) => uscita.Data != null || uscita.Tipologia
                  )
                    ? giornata.Uscite.some(
                        (uscita) =>
                          uscita.Data != null && uscita.DataRientro != null
                      )
                      ? "✅"
                      : "🕒"
                    : "❌"}
                </td>
                <td>
                  {""
                    .concat(
                      giornata.FattiSignificativi?.Mattina ?? "",
                      " ",
                      giornata.FattiSignificativi?.Pomeriggio ?? "",
                      " ",
                      giornata.FattiSignificativi?.Sera ?? ""
                    )
                    .substring(0, 35)
                    .concat("...")}
                </td>
                <td className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button>
                    <Link
                      className="btn btn-sm btn-primary"
                      to={`/giornata/${id}/${giornata.Data}`}
                    >
                      <FaFileSignature />
                    </Link>
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() =>
                      dispatch(
                        addNotification({
                          message: "Funzione download disabilitata in modalità demo",
                          type: MessageType.INFO,
                        })
                      )
                    }
                  >
                    <MdDownload />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteConfirmClick(giornata.Data)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          {!loading && !error && agenda.length === 0 && (
            <tr>
              <td colSpan={5} className="italic text-gray-600">
                Nessun risultato trovato...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Storico;
