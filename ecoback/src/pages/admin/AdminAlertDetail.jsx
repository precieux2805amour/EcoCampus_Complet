import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

function AdminAlertDetail() {

  const location = useLocation();
  const navigate = useNavigate();

  const alertData = location.state?.alert;

  const [collectors, setCollectors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("");

  if (!alertData) {
    return <div className="text-red-500">Alerte introuvable</div>;
  }

  // =========================
  // récupérer collecteurs
  // =========================

  const fetchCollectors = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await api.get("/users/collectors", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("COLLECTORS :", res.data);

      setCollectors(res.data.collectors || []);
      setMode("collectors");
      setShowModal(true);

    } catch (error) {

      console.error("Erreur collectors :", error);

      if (error.response) {
        window.alert(error.response.data.message);
      } else {
        window.alert("Erreur récupération collecteurs");
      }

    }
  };

  // =========================
  // récupérer notifications
  // =========================

  const fetchNotifications = async () => {

    try {

      const res = await api.get(`/notif/notification/${alertData.id}`);

      console.log("Notifications :", res.data);

      setNotifications(res.data.notifications || res.data || []);
      setMode("notifications");
      setShowModal(true);

    } catch (error) {

      console.error("Erreur notifications :", error);
      window.alert("Aucune notification trouvée");

    }

  };

  // =========================
  // attribution collecteur
  // =========================

  const assignCollector = async (collector) => {

    try {

      const res = await api.patch(`/alerts/assign/${alertData.id}`, {
        collectorId: collector.id
      });

      window.alert(res.data.message || "Collecteur attribué avec succès");

      setShowModal(false);

      navigate("/admin/alerts");

    } catch (error) {

      console.error("Erreur attribution :", error);
      window.alert("Erreur attribution collecteur");

    }

  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("fr-FR");
  };

  return (

    <div className="bg-white p-6 rounded shadow">

      {/* FLÈCHE RETOUR */}

      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black"
      >
        ⬅ Retour
      </button>

      <h2 className="text-2xl font-bold mb-6">
        Détails de l'alerte
      </h2>

      <p><strong>ID :</strong> {alertData.id}</p>
      <p><strong>Description :</strong> {alertData.description}</p>
      <p><strong>Statut :</strong> {alertData.statut}</p>
      <p><strong>User ID :</strong> {alertData.userId}</p>

      <p>
        <strong>Collecteur ID :</strong>{" "}
        {alertData.collectorId || "Non attribué"}
      </p>

      <p><strong>Créée le :</strong> {formatDate(alertData.createdAt)}</p>
      <p><strong>Mise à jour :</strong> {formatDate(alertData.updatedAt)}</p>

      {alertData.imageUrl && (
        <img
          src={alertData.imageUrl}
          alt="Alerte"
          className="mt-4 w-full max-w-md rounded"
        />
      )}

      {/* boutons */}

      <div className="flex gap-4 mt-6">

        <button
          onClick={fetchNotifications}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Notifications
        </button>

        <button
          onClick={fetchCollectors}
          disabled={alertData.statut !== "envoyé"}
          className={`px-4 py-2 rounded text-white ${
            alertData.statut === "envoyé"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Attribuer
        </button>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded w-96 max-h-[80vh] overflow-y-auto">

            {mode === "notifications" && (

              <>
                <h3 className="text-xl font-bold mb-4">
                  Notifications
                </h3>

                {notifications.length === 0 ? (
                  <p>Aucune notification</p>
                ) : (

                  notifications.map((notif) => (

                    <div
                      key={notif.id}
                      className="p-3 border mb-2 rounded"
                    >
                      {notif.message}
                    </div>

                  ))

                )}
              </>

            )}

            {mode === "collectors" && (

              <>
                <h3 className="text-xl font-bold mb-4">
                  Sélectionner un collecteur
                </h3>

                {collectors.length === 0 ? (
                  <p>Aucun collecteur disponible</p>
                ) : (

                  collectors.map((collector) => (

                    <div
                      key={collector.id}
                      onClick={() => assignCollector(collector)}
                      className="p-3 border mb-2 rounded cursor-pointer hover:bg-gray-100"
                    >
                      {collector.name} {collector.surname}
                    </div>

                  ))

                )}
              </>

            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Fermer
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default AdminAlertDetail;