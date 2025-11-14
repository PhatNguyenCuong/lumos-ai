/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: Resume management
 */

/**
 * @swagger
 * /api/resume:
 *   get:
 *     summary: Get all resumes
 *     tags: [Resumes]
 *     responses:
 *       200:
 *         description: List of resumes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resume'
 *   post:
 *     summary: Create a new resume
 *     tags: [Resumes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resume'
 *     responses:
 *       201:
 *         description: Resume created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *
 * /api/resume/{id}:
 *   get:
 *     summary: Get a resume by ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Resume data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       404:
 *         description: Resume not found
 *   put:
 *     summary: Update a resume by ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Resume ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resume'
 *     responses:
 *       200:
 *         description: Resume updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       404:
 *         description: Resume not found
 *   delete:
 *     summary: Delete a resume by ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Resume ID
 *     responses:
 *       204:
 *         description: Resume deleted
 *       404:
 *         description: Resume not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Resume:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the resume
 *         name:
 *           type: string
 *           description: Candidate's full name
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         summary:
 *           type: string
 *         education:
 *           type: array
 *           items:
 *             type: string
 *         experience:
 *           type: array
 *           items:
 *             type: string
 *         certifications:
 *           type: array
 *           items:
 *             type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: List of skills
 *         projects:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               period:
 *                 type: string
 *               team_size:
 *                 type: integer
 *               customer:
 *                 type: string
 *               summary:
 *                 type: string
 *               position:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items: { type: string }
 *               programming_languages:
 *                 type: array
 *                 items: { type: string }
 *       required:
 *         - name
 *         - email
 *         - phone
 */

const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");

// Routes
router.get("/", resumeController.getAllResumes);
router.get("/:id", resumeController.getResumeById);
router.post("/", resumeController.createResume);
router.put("/:id", resumeController.updateResume);
router.delete("/:id", resumeController.deleteResume);

module.exports = router;
