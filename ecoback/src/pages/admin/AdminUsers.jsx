import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listUsers } from "../../services/user.service";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {

    try {

      const res = await listUsers();
      console.log("DATA USERS :", res.data);
      setUsers(res.data);

    } catch (error) {

      console.error("Erreur récupération users :", error);

    }

  };

  useEffect(() => {

    fetchUsers();

  }, []);

  const goToDetail = (user) => {

    navigate(`/admin/users/${user.id}`, {
      state: { user },
    });

  };

  // =========================
  // couleur des rôles
  // =========================

  const getRoleColor = (role) => {

    switch (role) {

      case "admin":
        return "bg-purple-100 text-purple-700";

      case "collector":
        return "bg-blue-100 text-blue-700";

      case "user":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };

  // =========================
  // couleur actif
  // =========================

  const getActiveColor = (isActive) => {

    return isActive
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  };

  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">
        👥 Liste des utilisateurs
      </h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-200">

            <tr>

              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Prénom</th>
              <th className="p-3 text-left">Téléphone</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actif</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                onClick={() => goToDetail(user)}
                className="border-b hover:bg-gray-100 cursor-pointer"
              >

                <td className="p-3">
                  {user.name}
                </td>

                <td className="p-3">
                  {user.surname}
                </td>

                <td className="p-3">
                  {user.tel}
                </td>

                {/* ROLE */}

                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.statut)}`}
                  >
                    {user.statut}
                  </span>

                </td>

                {/* ACTIF */}

                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getActiveColor(user.isActive)}`}
                  >
                    {user.isActive ? "Actif" : "Inactif"}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {users.length === 0 && (

          <p className="p-6 text-center text-gray-500">
            Aucun utilisateur trouvé
          </p>

        )}

      </div>

    </div>

  );

}

export default AdminUsers;