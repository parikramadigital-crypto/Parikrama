import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 text-xl font-bold text-[#2563eb]">Admin Panel</div>

      <nav className="px-4 space-y-2">
        <Link
          to="/admin/dashboard"
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/states"
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
        >
          States
        </Link>
        <Link
          to="/admin/cities"
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
        >
          Cities
        </Link>
        <Link
          to="/admin/places"
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
        >
          Places
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
