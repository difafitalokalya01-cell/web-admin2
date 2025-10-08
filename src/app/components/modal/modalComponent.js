export default function ModalBoxDataUsers({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Detail Pengguna</h2>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">ID:</span> {user.id}</p>
          <p><span className="font-semibold">Username:</span> {user.username}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Nomor HP:</span> {user.phone}</p>
          <p><span className="font-semibold">Kategori:</span> {user.category}</p>
        </div>
      </div>
    </div>
  );
}
