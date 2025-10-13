import ModalContentDeposit from "./component/content";

export default function DepositHistoriPage() {

    const dataUserDeposit = [
        {
            id: 1,
            name: 'muhammad yusri',
            email: 'yusri@gmail.com',
            jmlhDeposit: 200000,
            statusDeposit: 'berhasil',
        }
    ]


    return (
        <section className="w-full min-h-screen">
            <ModalContentDeposit dataUsers={dataUserDeposit}/>
        </section>
    )
}