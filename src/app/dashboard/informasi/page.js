import ContentTaskPage from "./component/content";

export default function InformationsPages() {

    const data = [
        {id: 1, userName: 'jhonedoe', email: 'jhondoe@gmail.com', waktuPermintaan: '10.00-12/052025', tugasKe: '10', status: 'belum selesai', informasi: 'Permintaan Tugas'},
        {id: 2, userName: 'Denis kontol', email: 'denis@gmial.com', waktuPermintaan: '10.00-12/052025', tugasKe: '15', status: 'diproses', informasi: 'Permintaan Withdraw'},
        {id: 3, userName: 'Bujang', email: 'Bujang@gmail.com', waktuPermintaan: '10.00-12/052025', tugasKe: '20', status: 'berhasil', informasi: 'Permintaan Deposit'}
    ];

    return (
        <section className="w-full">
            <ContentTaskPage dataUsersTask={data}/>
        </section>
    )
}