import { useLocation, useNavigate } from "react-router-dom";
import { activateUser, deactivateUser } from "../../services/user.service";
import { useState } from "react";

function AdminUserDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(location.state?.user);

  if (!user) {
    return <p>Utilisateur introuvable</p>;
  }

  const handleActivate = async () => {
    try {
      await activateUser(user.id);
      setUser({ ...user, isActive: true });
    } catch (error) {
      console.error("Erreur activation :", error);
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateUser(user.id);
      setUser({ ...user, isActive: false });
    } catch (error) {
      console.error("Erreur désactivation :", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-300 px-4 py-2 rounded"
      >
        ← Retour
      </button>

      <div className="bg-white shadow rounded-lg p-6 max-w-lg">
        <h2 className="text-2xl font-bold mb-6">
          Détails utilisateur
        </h2>

        <p className="mb-2">
          <strong>Nom :</strong> {user.name}
        </p>

        <p className="mb-2">
          <strong>Prénom :</strong> {user.surname}
        </p>

        <p className="mb-2">
          <strong>Téléphone :</strong> {user.tel}
        </p>

        <p className="mb-2">
          <strong>Statut :</strong> {user.statut}
        </p>

        <p className="mb-6">
          <strong>Actif :</strong>{" "}
          {user.isActive ? "Oui" : "Non"}
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleActivate}
            disabled={user.isActive}
            className={`px-4 py-2 rounded text-white ${
              user.isActive
                ? "bg-gray-400"
                : "bg-green-600"
            }`}
          >
            Activer
          </button>

          <button
            onClick={handleDeactivate}
            disabled={!user.isActive}
            className={`px-4 py-2 rounded text-white ${
              !user.isActive
                ? "bg-gray-400"
                : "bg-red-600"
            }`}
          >
            Désactiver
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUserDetail;