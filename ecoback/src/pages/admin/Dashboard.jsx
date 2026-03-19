import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/admin/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStats(res.data.stats);
        setRecentAlerts(res.data.recentAlerts);
      } catch (error) {
        console.error("Erreur dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "envoyé":
        return "bg-blue-100 text-blue-600";
      case "en cours":
        return "bg-yellow-100 text-yellow-600";
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
        📊 Dashboard Admin
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Total Utilisateurs" value={stats?.totalUsers} color="text-green-600" />
        <Card title="Collecteurs" value={stats?.totalCollectors} color="text-blue-600" />
        <Card title="Total Alertes" value={stats?.totalAlerts} color="text-purple-600" />
        <Card title="Envoyées" value={stats?.sentAlerts} color="text-blue-700" />
        <Card title="En cours" value={stats?.inProgressAlerts} color="text-yellow-600" />
        <Card title="Traitées" value={stats?.treatedAlerts} color="text-green-700" />
      </div>

      {/* Recent Alerts */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-6">🚨 5 Dernières Alertes</h2>

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
            {recentAlerts.map((alert) => (
              <tr key={alert.id} className="border-b hover:bg-gray-50 transition">
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
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <h3 className="text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value ?? 0}</p>
    </div>
  );
}

export default Dashboard;