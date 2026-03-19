const bcrypt = require('bcryptjs');

(async () => {
  const adminHash = await bcrypt.hash("Admin123@", 10);
  const collectorHash = await bcrypt.hash("Collector123@", 10);

  console.log("Admin hash:", adminHash);
  console.log("Collector hash:", collectorHash);
})();