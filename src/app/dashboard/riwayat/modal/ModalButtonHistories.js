export default function ModalButton({onClick, children, className='', type=''}) {
    return (
        <div className="">
            <button
            onClick={onClick}
            type={type}
            className={`px-4 py-1 rounded-md font-medium transition text-white hover:bg-gradient-to-l from-blue-400 to-blue-200 active:scale-95 ${className}`}>
                {children}
            </button>
        </div>
    )
}