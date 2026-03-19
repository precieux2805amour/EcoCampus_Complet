import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.service";

function Login() {
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ tel, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.statut);

      // 🔥 IMPORTANT
      navigate("/admin/dashboard");

    } catch (error) {
      console.log(error);
      alert("Erreur de connexion");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded">
        <h2 className="text-2xl mb-4">Connexion Admin</h2>

        <input
          type="text"
          placeholder="Téléphone"
          className="border p-2 w-full mb-3"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-600 text-white p-2 w-full"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;