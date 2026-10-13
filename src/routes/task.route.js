import { Router } from "express";
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask,
} from "../controllers/task.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
    getAllTasksValidator,
    createTaskValidator,
    getTaskByIdValidator,
    updateTaskValidator,
    deleteTaskValidator,
    createSubTaskValidator,
    updateSubTaskValidator,
    deleteSubTaskValidator,
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
    .get(getAllTasksValidator(), validate, getTasks)
    .post(createTaskValidator(), validate, createTask);

router
    .route("/:projectId/t/:taskId")
    .get(getTaskByIdValidator(), validate, getTaskById)
    .put(updateTaskValidator(), validate, updateTask)
    .delete(deleteTaskValidator(), validate, deleteTask);

router
    .route("/:projectId/t/:taskId/subtasks")
    .post(createSubTaskValidator(), validate, createSubTask);

router
    .route("/:projectId/st/:subTaskId")
    .put(updateSubTaskValidator(), validate, updateSubTask)
    .delete(deleteSubTaskValidator(), validate, deleteSubTask);

    
export default router;