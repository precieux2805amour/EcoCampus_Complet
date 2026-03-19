import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAlerts } from "../../services/alert.service";

function AdminAlerts() {

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchAlerts = async () => {

      try {

        const res = await getAllAlerts();
        setAlerts(res.data);

      } catch (error) {

        console.error("Erreur récupération alertes :", error);

      } finally {

        setLoading(false);

      }

    };

    fetchAlerts();

  }, []);

  const getStatusColor = (status) => {

    switch (status) {

      case "envoyé":
        return "bg-red-100 text-red-600";

      case "en cours":
        return "bg-gray-200 text-gray-700";

      case "traité":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";

    }

  };

  if (loading) {

    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Chargement...</p>
      </div>
    );

  }

  return (

    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        🚨 Liste des Alertes
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <table className="w-full text-left">

          <thead>

            <tr className="border-b">
              <th className="py-3">ID</th>
              <th>Description</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>

          </thead>

          <tbody>

            {alerts.map((alert) => (

              <tr
                key={alert.id}
                className="border-b hover:bg-gray-50 transition cursor-pointer"
                onClick={() =>
                  navigate(`/admin/alerts/${alert.id}`, {
                    state: { alert }
                  })
                }
              >

                <td className="py-3">{alert.id}</td>

                <td>{alert.description}</td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(alert.statut)}`}
                  >
                    {alert.statut}
                  </span>

                </td>

                <td>
                  {new Date(alert.createdAt).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {alerts.length === 0 && (

          <p className="text-center text-gray-500 mt-6">
            Aucune alerte trouvée
          </p>

        )}

      </div>

    </div>

  );

}

export default AdminAlerts;