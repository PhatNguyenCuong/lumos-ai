const JobModel = require("../models/jobModel");

const JobController = {
  // GET /jobs
  getAllJobs: async (req, res) => {
    try {
      const result = await JobModel.getAll();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error getting all jobs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET /jobs/:id
  getJobById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await JobModel.getById(id);
      if (result.rows?.length === 0) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(`Error getting job with ID ${id}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // POST /jobs
  createJob: async (req, res) => {
    try {
      console.log("req.body", req.body);
      const newJob = await JobModel.create({
        ...req.body,
        qualifications: req.body.required_qualifications,
        preferred_qualifications: req.body.desired_skills,
        application_instructions: req.body.how_to_apply,
      });
      res.status(201).json(newJob.rows[0]);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // PUT /jobs/:id
  updateJob: async (req, res) => {
    const { id } = req.params;
    const updateFields = {
      ...req.body,
    };

    if (req.body.required_qualifications) {
      updateFields.qualifications = req.body.required_qualifications;
    }
    if (req.body.desired_skills) {
      updateFields.preferred_qualifications = req.body.desired_skills;
    }
    if (req.body.how_to_apply) {
      updateFields.application_instructions = req.body.how_to_apply;
    }

    if (Object.keys(updateFields)?.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    try {
      const result = await JobModel.update(id, updateFields);
      if (!result || result.rows?.length === 0) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(`Error updating job with ID ${id}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // DELETE /jobs/:id
  deleteJob: async (req, res) => {
    const { id } = req.params;
    try {
      await JobModel.delete(id);
      res.status(204).send(); // No content
    } catch (error) {
      console.error(`Error deleting job with ID ${id}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = JobController;
