import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/API_response.js";
import { ApiError } from "../utils/Api_Error.js";
import { asyncHandler } from "../utils/async-handeler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/Constant.js";

const getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const tasks = await Task.find({
        project: new mongoose.Types.ObjectId(projectId),
    }).populate("assignedTo", "avatar username fullName");

    return res
        .status(201)
        .json(new ApiResponse(201, tasks, "Task fetched successfully"));
});
const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body;
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const files = req.files || [];
    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size,
        };
    });

    const task = await Task.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assignedTo: assignedTo
            ? new mongoose.Types.ObjectId(assignedTo)
            : undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id),
        attachments,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task created successfully"));
});
const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdBy",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            createdBy: {
                                $arrayElemAt: ["$createdBy", 0],
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                assignedTo: {
                    $arrayElemAt: ["$assignedTo", 0],
                },
            },
        },
    ]);

    if (!task || task.length == 0) {
        throw new ApiError(404, "Task not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

// 1. Update Task
const updateTask = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params;
    const { title, description, assignedTo, status } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const task = await Task.findOne({
        _id: taskId,
        project: projectId,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    if (assignedTo !== undefined) {
        if (assignedTo === null || assignedTo === "") {
            task.assignedTo = undefined;
        } else {
            const user = await User.findById(assignedTo);

            if (!user) {
                throw new ApiError(404, "Assigned user not found");
            }

            task.assignedTo = assignedTo;
        }
    }

    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task updated successfully"));
});

// 2. Delete Task
const deleteTask = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const task = await Task.findOneAndDelete({
        _id: taskId,
        project: projectId,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Delete subtasks associated with this task.
    await Subtask.deleteMany({ task: taskId });

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task deleted successfully"));
});

// 3. Create Subtask
const createSubTask = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params;
    const { title, description, assignedTo } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const task = await Task.findOne({
        _id: taskId,
        project: projectId,
    });

    if (!task) {
        throw new ApiError(404, "Task not found in this project");
    }

    if (assignedTo) {
        const user = await User.findById(assignedTo);

        if (!user) {
            throw new ApiError(404, "Assigned user not found");
        }
    }

    const subtask = await Subtask.create({
        task: taskId,
        title,
        description,
        assignedTo: assignedTo || undefined,
        createdBy: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

// 4. Update Subtask
const updateSubTask = asyncHandler(async (req, res) => {
    const { projectId, subTaskId } = req.params;
    const { title, description, assignedTo, isCompleted } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const subtask = await Subtask.findById(subTaskId);

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    const task = await Task.findOne({
        _id: subtask.task,
        project: projectId,
    });

    if (!task) {
        throw new ApiError(404, "Subtask does not belong to this project");
    }

    if (title !== undefined) subtask.title = title;
    if (description !== undefined) subtask.description = description;

    if (assignedTo !== undefined) {
        if (assignedTo === null || assignedTo === "") {
            subtask.assignedTo = undefined;
        } else {
            const user = await User.findById(assignedTo);

            if (!user) {
                throw new ApiError(404, "Assigned user not found");
            }

            subtask.assignedTo = assignedTo;
        }
    }

    if (isCompleted !== undefined) {
        subtask.isCompleted = isCompleted;
    }

    await subtask.save();

    return res
        .status(200)
        .json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});

// 5. Delete Subtask
const deleteSubTask = asyncHandler(async (req, res) => {
    const { projectId, subTaskId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const subtask = await Subtask.findById(subTaskId);

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    const task = await Task.findOne({
        _id: subtask.task,
        project: projectId,
    });

    if (!task) {
        throw new ApiError(404, "Subtask does not belong to this project");
    }

    await Subtask.findByIdAndDelete(subTaskId);

    return res
        .status(200)
        .json(new ApiResponse(200, subtask, "Subtask deleted successfully"));
});

export {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask,
};
