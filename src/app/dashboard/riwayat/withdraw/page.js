import ModalContentWithdraw from "./compnent/content";

const dataUserWithdraw = [
    {
        id: 1,
        name: 'muhammad yusri',
        email: 'yusri@gmial.com',
        jmlhWithdraw: '200000',
        status: 'sukses'
    }
]

export default function WithdrawHistoriPage() {
    return (
        <section className="w-full min-h-screen">
            <ModalContentWithdraw dataUsers={dataUserWithdraw}/>
        </section>
    )
}