// File: api/get.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://tabrita556_db_user:Nh4eCvNTq5hqazhL@cluster0.vvtd9vq.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

export default async function handler(req, res) {
    // Biar Android bisa nge-fetch datanya tanpa diblokir CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        await client.connect();
        const database = client.db("RayMarketDB");
        const collection = database.collection("Notifications");

        // Cari 1 pesan paling baru yang dikirim untuk "all" (semua user)
        const latestNotif = await collection.find({ to_user: "all" })
                                          .sort({ created_at: -1 })
                                          .limit(1)
                                          .toArray();

        if (latestNotif.length > 0) {
            res.status(200).json({ success: true, data: latestNotif[0] });
        } else {
            res.status(200).json({ success: true, data: null });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "Gagal ambil data" });
    } finally {
        await client.close();
    }
}
