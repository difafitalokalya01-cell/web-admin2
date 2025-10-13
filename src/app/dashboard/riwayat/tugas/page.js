import ModalTaskContent from "./component.js/content";

const dataUserTask = [
    {
        id: 1,
        name: 'muhammad yusri',
        email: 'yusri@gmail.com',
        keterangan: 'tugas ke',
        statusTugas: 'belum selesai'
    }
]

export default function TasktHistoriPage() {
    return (
        <section className="w-full min-h-screen">
            <ModalTaskContent dataUsers={dataUserTask}/>
        </section>
    )
}