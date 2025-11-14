// scripts/seedFarms.js
const db = require("../config/db");

const farms = [
  { name: "Green Valley", location: "Da Lat", size: 40 },
  { name: "Sunny Fields", location: "Can Tho", size: 35 },
  { name: "Highland Roots", location: "Gia Lai", size: 50 },
  { name: "Mekong Garden", location: "Vinh Long", size: 20 },
  { name: "Urban Growers", location: "Thu Duc, HCMC", size: 15 },
  { name: "Eco Harvest", location: "Ben Tre", size: 28 },
  { name: "Golden Soil", location: "Long An", size: 22 },
  { name: "Fresh Horizon", location: "Tay Ninh", size: 32 },
  { name: "Nguyen Farm", location: "Binh Hoa, HCMC", size: 25 },
  { name: "Lotus Creek", location: "Dong Nai", size: 45 },
];

(async () => {
  for (const farm of farms) {
    await db.query(
      "INSERT INTO farm (name, location, size) VALUES ($1, $2, $3)",
      [farm.name, farm.location, farm.size]
    );
    console.log(`✅ Inserted: ${farm.name}`);
  }
  console.log("🚜 Tất cả dữ liệu farm đã được thêm!");
  process.exit();
})();
