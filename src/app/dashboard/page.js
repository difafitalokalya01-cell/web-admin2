import Header from "../components/layouts/header";
import Beranda from "./content";


export default function Dashboard() {
    return (
        <section className="w-full min-h-screen">
            <Header/>
            <Beranda/>
            <div className="w-full">
                
            </div>
        </section>
    )
}