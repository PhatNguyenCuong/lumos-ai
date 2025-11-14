const db = require("../config/db");

const JobModel = {
  // Get all jobs
  getAll: async () => await db.query("SELECT * FROM job"),

  // Get job by ID
  getById: async (id) =>
    await db.query("SELECT * FROM job WHERE id = $1", [id]),

  // Create a new job
  create: async ({
    job_title,
    location,
    department,
    reports_to,
    employment_type,
    about_us,
    job_description,
    key_responsibilities,
    qualifications,
    preferred_qualifications,
    benefits,
    application_instructions,
    equal_opportunity_statement,
  }) =>
    await db.query(
      `INSERT INTO job (
        job_title, location, department, reports_to, employment_type,
        about_us, job_description, key_responsibilities, qualifications,
        preferred_qualifications, benefits, application_instructions,
        equal_opportunity_statement
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13
      ) RETURNING *`,
      [
        job_title,
        location,
        department,
        reports_to,
        employment_type,
        about_us,
        job_description,
        key_responsibilities,
        qualifications,
        preferred_qualifications,
        benefits,
        application_instructions,
        equal_opportunity_statement,
      ]
    ),

  // ⚡ Dynamic update for partial fields
  update: async (id, updateFields) => {
    const keys = Object.keys(updateFields);
    const values = Object.values(updateFields);

    if (keys.length === 0) return null;

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE job SET ${setClause} WHERE id = $${
      keys.length + 1
    } RETURNING *`;

    return await db.query(query, [...values, id]);
  },

  // Delete a job
  delete: async (id) => await db.query("DELETE FROM job WHERE id = $1", [id]),
};

module.exports = JobModel;
