import { Router } from "express";

import {
    getAllNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
} from "../controllers/notes.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
    getAllNotesValidator,
    createNoteValidator,
    getNoteByIdValidator,
    updateNoteValidator,
    deleteNoteValidator,
} from "../validators/index.js";
import {
    verifyJWT,
    validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/Constant.js";
import { ProjectMember } from "../models/projectmember.models.js";
const router = Router();
router.use(verifyJWT);

router
    .route("/:projectId")
    .get(getAllNotesValidator(), validate, getAllNotes)
    .post(createNoteValidator(), validate, createNote);

router
    .route("/:projectId/n/:noteId")
    .get(getNoteByIdValidator(), validate, getNoteById)
    .put(updateNoteValidator(), validate, updateNote)
    .delete(deleteNoteValidator(), validate, deleteNote);

export default router;
