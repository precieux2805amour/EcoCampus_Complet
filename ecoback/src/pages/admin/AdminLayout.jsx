import { Outlet, useNavigate, useLocation } from "react-router-dom";

function AdminLayout() {

  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Utilisateurs", path: "/admin/users", icon: "👥" },
    { name: "Créer utilisateur", path: "/admin/create-user", icon: "➕" },
    { name: "Alertes", path: "/admin/alerts", icon: "🚨" },
    { name: "Déconnexion", path: "logout", icon: "🚪" },
  ];

  const handleLogout = () => {

    const confirmLogout = window.confirm("Voulez-vous vous déconnecter ?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/", { replace: true });

  };

  const handleMenuClick = (item) => {

    if (item.path === "logout") {
      handleLogout();
    } else {
      navigate(item.path);
    }

  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <aside className="w-64 bg-green-700 text-white p-6">

        <h2 className="text-2xl font-bold mb-10">
          EcoBack
        </h2>

        <nav className="space-y-4">

          {menu.map((item) => (

            <div
              key={item.name}
              onClick={() => handleMenuClick(item)}
              className={`p-2 rounded cursor-pointer transition ${
                location.pathname.includes(item.path)
                  ? "bg-green-600"
                  : "hover:bg-green-600"
              }`}
            >

              {item.icon} {item.name}

            </div>

          ))}

        </nav>

      </aside>

      {/* Content */}

      <main className="flex-1 p-10">

        <Outlet />

      </main>

    </div>

  );

}

export default AdminLayout;