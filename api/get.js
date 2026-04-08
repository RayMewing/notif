const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://tabrita556_db_user:Nh4eCvNTq5hqazhL@cluster0.vvtd9vq.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

module.exports = async function(req, res) {
    // SETUP CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await client.connect();
        const database = client.db("RayMarketDB");
        const collection = database.collection("Notifications");

        // Ambil 1 pesan terbaru untuk semua orang
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
        res.status(500).json({ success: false, error: "Gagal ambil: " + error.message });
    } finally {
        await client.close();
    }
};
