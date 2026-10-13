import { body, param } from "express-validator";
import { AvailableUserRole,AvailableTaskStatus } from "../utils/Constant.js";
const userRegistrationValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is requered")
            .isEmail()
            .withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username required ")
            .isLowercase()
            .withMessage("Username must be in lowercase")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 character long "),
        body("password").trim().notEmpty().withMessage("Password is requred"),
        body("fullname").optional().trim(),
    ];
};

const userLoginValidator = () => {
    return [
        body("email").optional().isEmail().withMessage("Email is invalid "),
        body("password").trim().notEmpty().withMessage("Password is required "),
    ];
};

const userChangeCurrentPasswordValidators = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required"),
        body("newPassword").notEmpty().withMessage("New password is required"),
    ];
};

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
    ];
};

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword ").notEmpty().withMessage("Password is required"),
    ];
};

const createProjectValidator = () => {
    return [
        body("name").notEmpty().withMessage("Name is required"),
        body("description").optional(),
    ];
};
const addMembertoProjectValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("role")
            .notEmpty()
            .withMessage("Role is required")
            .isIn(AvailableUserRole)
            .withMessage("Role is invalid"),
    ];
};
// Reusable MongoDB ObjectId validator
const validateObjectId = (field, message) => {
    return param(field).isMongoId().withMessage(message);
};

// 1. Get all tasks of a project
const getAllTasksValidator = () => {
    return [validateObjectId("projectId", "Invalid project ID")];
};

// 2. Create a task
const createTaskValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),

        body("title").trim().notEmpty().withMessage("Task title is required"),

        body("description")
            .optional()
            .isString()
            .withMessage("Description must be a string"),

        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Invalid assigned user ID"),

        body("status")
            .optional()
            .isIn(AvailableTaskStatus)
            .withMessage("Invalid task status"),

        body("attachments")
            .optional()
            .isArray()
            .withMessage("Attachments must be an array"),

        body("attachments.*.url")
            .optional()
            .isString()
            .withMessage("Attachment URL must be a string"),

        body("attachments.*.mimetype")
            .optional()
            .isString()
            .withMessage("Attachment mimetype must be a string"),

        body("attachments.*.size")
            .optional()
            .isNumeric()
            .withMessage("Attachment size must be numeric"),
    ];
};

// 3. Get task details
const getTaskByIdValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),
        validateObjectId("taskId", "Invalid task ID"),
    ];
};

// 4. Update a task
const updateTaskValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),
        validateObjectId("taskId", "Invalid task ID"),

        body("title")
            .optional()
            .isString()
            .withMessage("Task title must be a string")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("Task title cannot be empty"),

        body("description")
            .optional()
            .isString()
            .withMessage("Description must be a string"),

        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Invalid assigned user ID"),

        body("status")
            .optional()
            .isIn(AvailableTaskStatus)
            .withMessage("Invalid task status"),

        body("attachments")
            .optional()
            .isArray()
            .withMessage("Attachments must be an array"),

        body("attachments.*.url")
            .optional()
            .isString()
            .withMessage("Attachment URL must be a string"),

        body("attachments.*.mimetype")
            .optional()
            .isString()
            .withMessage("Attachment mimetype must be a string"),

        body("attachments.*.size")
            .optional()
            .isNumeric()
            .withMessage("Attachment size must be numeric"),
    ];
};

// 5. Delete a task
const deleteTaskValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),
        validateObjectId("taskId", "Invalid task ID"),
    ];
};

// 6. Create a subtask
const createSubTaskValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),
        validateObjectId("taskId", "Invalid task ID"),

        body("title")
            .trim()
            .notEmpty()
            .withMessage("Subtask title is required"),

        body("description")
            .optional()
            .isString()
            .withMessage("Description must be a string"),

        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Invalid assigned user ID"),

        body("status")
            .optional()
            .isIn(AvailableTaskStatus)
            .withMessage("Invalid subtask status"),
    ];
};

// 7. Update a subtask
const updateSubTaskValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),
        validateObjectId("subTaskId", "Invalid subtask ID"),

        body("title")
            .optional()
            .isString()
            .withMessage("Subtask title must be a string")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("Subtask title cannot be empty"),

        body("description")
            .optional()
            .isString()
            .withMessage("Description must be a string"),

        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Invalid assigned user ID"),

        body("status")
            .optional()
            .isIn(AvailableTaskStatus)
            .withMessage("Invalid subtask status"),
    ];
};

// 8. Delete a subtask
const deleteSubTaskValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),
        validateObjectId("subTaskId", "Invalid subtask ID"),
    ];
};

// 1. Get all notes of a project
const getAllNotesValidator = () => {
    return [validateObjectId("projectId", "Invalid project ID")];
};

// 2. Create a note
const createNoteValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),

        body("content")
            .isString()
            .withMessage("Note content must be a string")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("Note content is required"),
    ];
};

// 3. Get a specific note
const getNoteByIdValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),
        validateObjectId("noteId", "Invalid note ID"),
    ];
};

// 4. Update a note
const updateNoteValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),
        validateObjectId("noteId", "Invalid note ID"),

        body("content")
            .isString()
            .withMessage("Note content must be a string")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("Note content cannot be empty"),
    ];
};

// 5. Delete a note
const deleteNoteValidator = () => {
    return [
        validateObjectId("projectId", "Invalid project ID"),
        validateObjectId("noteId", "Invalid note ID"),
    ];
};

export {
    userRegistrationValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidators,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMembertoProjectValidator,
    getAllTasksValidator,
    createTaskValidator,
    getTaskByIdValidator,
    updateTaskValidator,
    deleteTaskValidator,
    createSubTaskValidator,
    updateSubTaskValidator,
    deleteSubTaskValidator,
    getAllNotesValidator,
    createNoteValidator,
    getNoteByIdValidator,
    updateNoteValidator,
    deleteNoteValidator,
};
