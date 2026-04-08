const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://tabrita556_db_user:Nh4eCvNTq5hqazhL@cluster0.vvtd9vq.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

module.exports = async function(req, res) {
    // 1. SETUP CORS BIAR GAK DIBLOKIR BROWSER
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight request dari browser
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Harus pakai POST bro!' });
    }

    try {
        const { username, judul, pesan } = req.body;

        await client.connect();
        const database = client.db("RayMarketDB"); // Pastikan nama DB bener
        const collection = database.collection("Notifications"); // Pastikan nama tabel bener

        // 2. INSERT KE DATABASE
        const result = await collection.insertOne({
            to_user: username || "all",
            title: judul,
            message: pesan,
            is_read: false,
            created_at: new Date()
        });

        res.status(200).json({ success: true, message: "Mantap, masuk ke Database!", data: result });
    } catch (error) {
        console.error("Error MongoDB:", error);
        res.status(500).json({ success: false, error: "Gagal nyimpen: " + error.message });
    } finally {
        await client.close();
    }
};
