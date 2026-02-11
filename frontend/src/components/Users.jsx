import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/auth/users",
        { withCredentials: true }
      );

      setUsers(res.data);

    } catch (error) {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-5">

      <h2 className="text-xl font-bold mb-4">
        Registered Users
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">

          {users.map(user => (
            <li
              key={user.id}
              className="border p-3 rounded flex justify-between"
            >
              <span>{user.email}</span>
              <span className="text-sm text-gray-500">
                {user.role}
              </span>
            </li>
          ))}

        </ul>
      )}

    </div>
  );
};

export default Users;
