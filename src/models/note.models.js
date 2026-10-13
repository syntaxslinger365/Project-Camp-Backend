import mongoose, { Schema } from "mongoose";

const projectNoteSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            red: "Project",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            red: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const ProjectNote = mongoose.model("ProjectNote", projectNoteSchema);
