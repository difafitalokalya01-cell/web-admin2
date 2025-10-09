import ContentUserPage from "./components/content"

export default function UserPage() {
      const data = [
        { id: 1, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 2, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 3, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 4, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 5, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 6, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 7, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 8, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 9, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 10, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 11, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 12, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 13, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 14, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 15, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 16, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 17, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 18, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 19, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 20, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 21, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 22, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 23, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 24, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 25, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 26, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 27, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 28, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 29, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 30, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 31, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 32, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 33, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 34, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 35, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 36, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 37, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 38, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 39, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 40, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 41, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 42, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 43, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 44, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 45, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 46, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 47, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 48, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 49, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 50, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 51, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 52, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 53, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },   { id: 1, username: "muh_yusri", email: "yusri@email.com", phone: "08123456789", terakhirLogin: '11:00:3401/05/2025', category: "Clasic", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 54, username: "indri", email: "indri@email.com", phone: "08234567890", terakhirLogin: '11:00:3401/05/2025', category: "Gold", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
        { id: 55, username: "rina_dev", email: "rina@email.com", phone: "08311122233", terakhirLogin: '11:00:3401/05/2025', category: "Silver", images: '', tanggalDaftar: '11/12/2025', bankAccount: '123456789' },
    
      ];
    

    return (
        <section className="h-full">
            <ContentUserPage dataUsers={data}/>
        </section>
    )
}