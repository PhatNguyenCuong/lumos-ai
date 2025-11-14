const db = require("../config/db");

const ResumeModel = {
  // Get all resumes
  getAll: async () => await db.query("SELECT * FROM resume"),

  // Get resume by ID
  getById: async (id) =>
    await db.query("SELECT * FROM resume WHERE id = $1", [id]),

  // Create a new resume
  create: async ({
    name,
    email,
    phone,
    summary,
    education,
    experience,
    certifications,
    skills,
    projects,
  }) =>
    await db.query(
      `INSERT INTO resume (
      name,
      email,
      phone,
      summary,
      education,
      experience,
      certifications,
      skills,
      projects
    ) VALUES (
      $1, $2, $3, $4, 
      $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, 
      $9::jsonb
    )
    RETURNING *`,
      [
        name || "",
        email || "",
        phone || "",
        summary || "",
        JSON.stringify(education),
        JSON.stringify(experience),
        JSON.stringify(certifications),
        JSON.stringify(skills),
        JSON.stringify(projects),
      ]
    ),

  // Update resume
  update: async (id, updateFields) => {
    const keys = Object.keys(updateFields);
    const values = Object.values(updateFields);

    if (keys?.length === 0) return null;

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

    const query = `UPDATE resume SET ${setClause} WHERE id = $${
      keys?.length + 1
    } RETURNING *`;

    const transformedValues = values.map((val) =>
      typeof val === "object" ? JSON.stringify(val) : val
    );

    return await db.query(query, [...transformedValues, id]);
  },

  // Delete resume
  delete: async (id) =>
    await db.query("DELETE FROM resume WHERE id = $1", [id]),
};

module.exports = ResumeModel;
