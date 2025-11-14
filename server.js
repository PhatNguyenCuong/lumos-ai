const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
// const farmRoutes = require("./routes/farm");
const jobRoutes = require("./routes/job");
const resumeRoutes = require("./routes/resume");
const matchRoutes = require("./routes/match");
const facematchRoutes = require("./routes/facematch");
const uploadRoutes = require("./routes/upload");

// app.use("/api/farm", farmRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/facematch", facematchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FarmTrack Server running at http://localhost:${PORT}`);
  console.log(`Swagger available at http://localhost:${PORT}/api-docs`);
});
