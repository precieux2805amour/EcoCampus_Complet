import { useState } from "react";
import { createUser } from "../../services/user.service";
import { useNavigate } from "react-router-dom";

function AdminCreateUser() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    tel: "",
    password: "",
    statut: "user"
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createUser(form);

      alert("Utilisateur créé avec succès 🎉");

      navigate("/admin/users");

    } catch (error) {

      console.error(error);
      alert("Erreur création utilisateur");

    }

  };

  return (

    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">

      <h1 className="text-2xl font-bold mb-6">
        ➕ Créer un nouvel utilisateur
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NOM */}

        <div>

          <label className="block mb-1 font-semibold">
            Nom
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />

        </div>

        {/* PRENOM */}

        <div>

          <label className="block mb-1 font-semibold">
            Prénom
          </label>

          <input
            type="text"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />

        </div>

        {/* TELEPHONE */}

        <div>

          <label className="block mb-1 font-semibold">
            Téléphone
          </label>

          <input
            type="text"
            name="tel"
            value={form.tel}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />

        </div>

        {/* PASSWORD */}

        <div>

          <label className="block mb-1 font-semibold">
            Mot de passe
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />

        </div>

        {/* ROLE */}

        <div>

          <label className="block mb-1 font-semibold">
            Type d'utilisateur
          </label>

          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >

            <option value="user">
              Utilisateur
            </option>

            <option value="collector">
              Collecteur
            </option>

            <option value="admin">
              Administrateur
            </option>

          </select>

        </div>

        {/* BUTTON */}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Créer le compte
        </button>

      </form>

    </div>

  );

}

export default AdminCreateUser;