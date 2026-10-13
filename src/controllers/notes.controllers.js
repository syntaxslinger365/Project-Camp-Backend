import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/API_response.js";
import { ApiError } from "../utils/Api_Error.js";
import { asyncHandler } from "../utils/async-handeler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/Constant.js";

import { ProjectNote } from "../models/note.models.js";

// 1. Get all notes of a project
const getAllNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    // Check whether the project exists
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Fetch all notes belonging to this project
    const notes = await ProjectNote.find({
        project: projectId,
    })
        .populate("createdBy", "username fullName avatar")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(200, notes, "Project notes fetched successfully"),
        );
});

// 2. Create a note
const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    // Check whether the project exists
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Create the note
    const note = await ProjectNote.create({
        project: projectId,
        createdBy: req.user._id,
        content,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, note, "Note created successfully"));
});

// 3. Get a specific note
const getNoteById = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;

    // Check whether the project exists
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Find the note within the specified project
    const note = await ProjectNote.findOne({
        _id: noteId,
        project: projectId,
    }).populate("createdBy", "username fullName avatar");

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note fetched successfully"));
});

// 4. Update a note
const updateNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;
    const { content } = req.body;

    // Check whether the project exists
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Find the note within the specified project
    const note = await ProjectNote.findOne({
        _id: noteId,
        project: projectId,
    });

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // Update note content
    if (content !== undefined) {
        note.content = content;
    }

    await note.save();

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note updated successfully"));
});

// 5. Delete a note
const deleteNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params;

    // Check whether the project exists
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Find and delete the note within the specified project
    const note = await ProjectNote.findOneAndDelete({
        _id: noteId,
        project: projectId,
    });

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note deleted successfully"));
});

export { getAllNotes, createNote, getNoteById, updateNote, deleteNote };
