export default function ModalBoxDisplay({onClose}) {
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <h1>this modal display</h1>
        </div>
    )
}