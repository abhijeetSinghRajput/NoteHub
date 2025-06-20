import mongoose from "mongoose";
import Note from "../model/note.model.js";
import { addContribution } from "../services/contribution.service.js";

export const createNote = async (req, res) => {
    const { name, collectionId } = req.body;
    const { user } = req;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    try {
        const note = await Note.create({ name, collectionId, userId: user._id });
        res.status(201).json({ message: "note created successfully", note })
    } catch (error) {
        console.log("Error in createNote controller\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteNote = async (req, res) => {
    const { _id } = req.params;
    if (!_id) {
        res.status(400).json({ message: "Note_id not provided" });
    }
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid note_id format" });
    }

    try {
        await Note.findByIdAndDelete(_id);
        res.status(200).json({ message: `Note: ${Note.name} Deleted successfully` });
    } catch (error) {
        console.log("Error in deleteNote controller\n", Error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getNote = async (req, res) => {
    const { _id } = req.params;
    const { user } = req;
    if (!_id) {
        return res.status(400).json({ message: "note_id not provided" });
    }
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid note_id format" });
    }

    try {
        const note = await Note.findById({_id, userId: user._id});
        if (!note) {
            return res.status(404).json({ message: `note not found with id ${_id}` });
        }
        res.status(200).json({ note })
    } catch (error) {
        console.log("Error in getNote controller.\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getNotes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { user } = req;

    try {
        const notes = await Note.find({userId: user._id})
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-content');

        res.status(200).json({ notes });
    } catch (error) {
        console.log("Error in getNotes controller.\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateContent = async (req, res) => {
    const { content, noteId, userLocalDateTime, offsetMinutes } = req.body;
    const { user } = req;
    try {
        const note = await Note.findById(noteId);
        if(!note) return res.status(404).json({ message: `note not found with id ${noteId}` });
        note.content = content;
        await note.save();
        const result = await addContribution(user.userName, userLocalDateTime, offsetMinutes);
        console.log(result);
        res.status(200).json({ message: "Notes updated successfully.", note });
    } catch (error) {
        console.log("Error in updateContent controller.\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const renameNote = async (req, res) => {
    const { noteId, newName } = req.body;
    if (!noteId || !newName) {
        return res.status(400).json({ message: "noteId and newName are required." });
    }
    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: `note not found with id ${_id}` });
        }

        note.name = newName;
        await note.save();
        res.status(200).json({ message: "note renamed successfully.", note });
    } catch (error) {
        console.log("Error in renameNote controller.\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const moveTo = async (req, res) => {
    const { noteId, collectionId } = req.body;
    if (!noteId) {
        return res.status(400).json({ message: "noteId not provided." });
    }
    if (!collectionId) {
        return res.status(400).json({ message: "collectionId not provided." });
    }

    try {
        const note = await Note.findById(noteId);
        note.collectionId = collectionId;
        note.save();
        res.status(200).json({ message: "note move to new collection.", note });
    } catch (error) {
        console.log("Error in moveTo note controller.\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
