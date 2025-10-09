import adminIcon from "@/assets/icons/loginIcons/human-white.png";
import Image from "next/image";

export default function Home() {
  return (
    <section className="flex justify-center items-center bg-gradient-to-b from-blue-200 to-blue-100 min-h-screen">
      <div className="flex w-[50rem] h-[30rem] bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="w-1/2 bg-blue-500 flex flex-col items-center justify-center text-white p-6">
          <Image
            src={adminIcon}
            alt="Admin Icon"
            className="w-24 h-24 mb-4"
            priority
          />
          <h3 className="text-2xl font-bold mb-2">Admin Panel</h3>
          <p className="text-sm opacity-80 text-center">
            ifdaefheushgfesrghsroghsrhgoirsgjorsg
          </p>
        </div>

        <div className="w-1/2 flex flex-col justify-center p-10">
          <h1 className="text-3xl font-bold text-gray-700 text-center mb-6">
            Login
          </h1>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Email"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md py-2 font-semibold hover:bg-blue-600 transition"
            >
              Masuk
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Lupa password?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Reset di sini
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
