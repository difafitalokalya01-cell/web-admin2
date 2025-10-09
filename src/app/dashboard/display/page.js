import Header from "@/app/components/layouts/header";
import ContentDisplayPage from "./component/modal/content";

export default function ContactPages() {
    return (
        <section className="w-full min-h-screen">
            <Header/>
            <div className="w-full py-2">
                <ContentDisplayPage/>
            </div>
        </section>
    )
}