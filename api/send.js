const { MongoClient } = require('mongodb');

// Koneksi ke MongoDB lu
const uri = "mongodb+srv://tabrita556_db_user:Nh4eCvNTq5hqazhL@cluster0.vvtd9vq.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

export default async function handler(req, res) {
    // Cek biar cuma bisa diakses lewat metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, judul, pesan } = req.body;

        await client.connect();
        const database = client.db("RayMarketDB"); // Nama Database
        const collection = database.collection("Notifications"); // Nama Tabel

        // Masukin data notifikasi ke database
        const result = await collection.insertOne({
            to_user: username,
            title: judul,
            message: pesan,
            is_read: false, // Default belum dibaca biar bisa ditangkap Android
            created_at: new Date()
        });

        res.status(200).json({ success: true, message: "Notifikasi terkirim!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Gagal kirim notif" });
    } finally {
        await client.close();
    }
}
