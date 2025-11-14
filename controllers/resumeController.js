const ResumeModel = require("../models/resumeModel");

const ResumeController = {
  // GET /resume
  getAllResumes: async (req, res) => {
    try {
      const result = await ResumeModel.getAll();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error getting all resumes:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET /resume/:id
  getResumeById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await ResumeModel.getById(id);
      if (result.rows?.length === 0) {
        return res.status(404).json({ error: "Resume not found" });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(`Error getting resume with ID ${id}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // POST /resume
  createResume: async (req, res) => {
    try {
      const newResume = await ResumeModel.create(req.body);
      res.status(201).json(newResume.rows[0]);
    } catch (error) {
      console.error("Error creating resume:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // PUT /resume/:id
  updateResume: async (req, res) => {
    const { id } = req.params;
    const updateFields = { ...req.body };

    if (Object.keys(updateFields)?.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    try {
      const result = await ResumeModel.update(id, updateFields);
      if (!result || result.rows?.length === 0) {
        return res.status(404).json({ error: "Resume not found" });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(`Error updating resume with ID ${id}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // DELETE /resume/:id
  deleteResume: async (req, res) => {
    const { id } = req.params;
    try {
      await ResumeModel.delete(id);
      res.status(204).send(); // No content
    } catch (error) {
      console.error(`Error deleting resume with ID ${id}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = ResumeController;
