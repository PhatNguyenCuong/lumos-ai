// scripts/updateFarmImages.js
const db = require("../config/db");

const imageUrl =
  "https://cdn.ohiomagazine.com/sitefinity/images/default-source/articles/2021/july-august-2021/farms-slate-run-farm-sheep-credit-megan-leigh-barnard.jpg?sfvrsn=59d8a238_8";

(async () => {
  const result = await db.query("UPDATE farm SET image_url = $1", [imageUrl]);
  console.log(`✅ Đã cập nhật ảnh cho ${result.rowCount} farm.`);
  process.exit();
})();
