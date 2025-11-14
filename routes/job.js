/**
 * @swagger
 * tags:
 *   name: Job
 *   description: API quản lý thông tin công việc
 */

/**
 * @swagger
 * /api/job:
 *   get:
 *     summary: Lấy danh sách tất cả công việc
 *     tags: [Job]
 *     responses:
 *       200:
 *         description: Danh sách công việc hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */

/**
 * @swagger
 * /api/job/{id}:
 *   get:
 *     summary: Lấy chi tiết công việc theo ID
 *     tags: [Job]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của công việc
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Không tìm thấy công việc
 */

/**
 * @swagger
 * /api/job:
 *   post:
 *     summary: Tạo mới một công việc
 *     tags: [Job]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *     responses:
 *       201:
 *         description: Tạo công việc thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 */

/**
 * @swagger
 * /api/job/{id}:
 *   put:
 *     summary: Cập nhật thông tin công việc
 *     tags: [Job]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 */

/**
 * @swagger
 * /api/job/{id}:
 *   delete:
 *     summary: Xoá công việc theo ID
 *     tags: [Job]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Xoá thành công
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         job_title: { type: string }
 *         location: { type: string }
 *         department: { type: string }
 *         reports_to: { type: string }
 *         employment_type: { type: string }
 *         about_us: { type: string }
 *         job_description: { type: string }
 *         key_responsibilities: { type: string }
 *         qualifications: { type: string }
 *         preferred_qualifications: { type: string }
 *         benefits: { type: string }
 *         application_instructions: { type: string }
 *         equal_opportunity_statement: { type: string }
 *         created_at: { type: string }
 *     JobInput:
 *       type: object
 *       required:
 *         - job_title
 *         - location
 *         - department
 *         - reports_to
 *         - employment_type
 *       properties:
 *         job_title: { type: string }
 *         location: { type: string }
 *         department: { type: string }
 *         reports_to: { type: string }
 *         employment_type: { type: string }
 *         about_us: { type: string }
 *         job_description: { type: string }
 *         key_responsibilities: { type: string }
 *         qualifications: { type: string }
 *         preferred_qualifications: { type: string }
 *         benefits: { type: string }
 *         application_instructions: { type: string }
 *         equal_opportunity_statement: { type: string }
 */

const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);
router.post("/", jobController.createJob);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);

module.exports = router;
