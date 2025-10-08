export default function Header() {
  return (
    <>
      <div className="w-full h-[50px] lg:hidden"></div>
      <header className="w-full bg-white rounded-lg px-4 py-3 lg:flex items-center justify-between shadow hidden">
        <form className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-sm shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
          <input
            type="search"
            name="input-search"
            placeholder="Cari sesuatu..."
            className="ml-3 w-full outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
          />
        </form>

        <div className="ml-4 flex items-center space-x-3">
          <img
            src="/path/to/profile.jpg"
            alt="User profile"
            className="w-10 h-10 rounded-full bg-white object-cover border-2 border-white"
          />
        </div>
      </header>
    </>
  );
}
