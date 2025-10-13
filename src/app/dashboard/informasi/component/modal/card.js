export default function ModalBoxTaskComponent({ user, onClose, onDeleteClick }) {
    return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <h2 id="modal-title" className="text-xl font-bold">Detail Pengguna</h2>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center active:scale-95 justify-center rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Tutup modal"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        <div className="p-5">
          <div className="flex flex-col items-center md:flex-row gap-5">
            <div className="flex-grow space-y-3 text-sm">
              <InfoRow label="ID" value={user.id} />
              <InfoRow label="Username" value={user.username} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Kategori" value={user.waktuPermintaan || '—'} />
              <InfoRow label="Tugas ke" value={user.tugasKe || '—'} />
              <InfoRow label="Status" value={user.status || '—'} />
            </div>

            <div className="flex-shrink-0 flex justify-center">
              <img
                src={user.images || ''}
                alt={`${user.username} avatar`}
                className="h-20 w-20 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-avatar.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    )
    
    function InfoRow({ label, value }) {
    return (
    <p className="text-gray-700">
        <span className="font-medium text-gray-900">{label}:</span>{' '}
        <span className="text-gray-600">{value}</span>
    </p>
    );
    }
}