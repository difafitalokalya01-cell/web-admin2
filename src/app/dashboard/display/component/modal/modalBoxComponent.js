export default function ModalBoxDisplayComponent({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white shadow rounded-md w-96 relative">
        <button
        onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center active:scale-95 justify-center rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Tutup modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
