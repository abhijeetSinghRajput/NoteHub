import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useNoteStore = create((set, get) => ({
  // BOOLEANS
  isCollectionsLoading: false,
  isCreatingCollection: false,
  isDeletingCollection: false,
  isCreatingNote: false,
  selectedNote: null,
  isContentLoading: false,
  isContentUploading: false,
  noteNotFound: false,
  setNoteNotFound: false,

  collections: [],
  notesContent: {
    //noteId : 'content'
  },

  getNoteContent: async (noteId) => {
    const { notesContent } = get();
    if (noteId in notesContent) {
      return notesContent[noteId] || "";
    }

    // ondemand loading.
    set({ isContentLoading: true });
    try {
      const res = await axiosInstance.get(`note/${noteId}`);
      const { content } = res.data.note;
      set({
        notesContent: {
          ...notesContent,
          [noteId]: content,
        },
      });

      set({ noteNotFound: false });
      return content || "";
    } catch (error) {
      console.error("Error fetching note content", error);
      console.log("not found");
      set({ noteNotFound: true });
      return null;
    } finally {
      set({ isContentLoading: false });
    }
  },
  getNoteName: (noteId) => {
    const { collections } = get();
    for (const collection of collections) {
      const note = collection.notes.find((note) => note._id === noteId);
      if (note) {
        set({ noteNotFound: false });
        return note.name;
      }
    }
    set({ noteNotFound: true });
    console.log("not found");
    return null;
  },

  updateContent: async (data) => {
    set({ isContentUploading: true });
    try {
      const now = new Date();
      const offsetMinutes = now.getTimezoneOffset();

      const res = await axiosInstance.put('/note/', {
        ...data,
        userLocalDateTime: now.toISOString(),
        offsetMinutes
      });
      
      const { note, message } = res.data;
      set((state) => ({
        notesContent: {
          ...state.notesContent,
          [note._id]: note.content,
        },
      }));
      toast.success(message);
    } catch (error) {
      console.log("Error in updating content", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isContentUploading: false });
    }
  },

  setselectedNote: (noteId) => {
    set({ selectedNote: noteId });
  },

  // ======= Utility methods for collections =======

  insertNoteInCollection: (collectionId, note) => {
    console.log(get().collections);
    
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection._id === collectionId
          ? { ...collection, notes: [...collection.notes, note] }
          : collection
      ),
    }));
  },

  deleteNoteFromCollection: (noteId) => {
    set((state) => ({
      collections: state.collections.map((collection) => ({
        ...collection,
        notes: collection.notes.filter((note) => note._id !== noteId),
      })),
    }));
  },

  replaceNoteFromCollection: (updatedNote) => {
    set((state) => ({
      collections: state.collections.map((collection) => ({
        ...collection,
        notes: collection.notes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        ),
      })),
    }));
  },

  // ======= Utility methods for collections =======

  createCollection: async (data) => {
    set({ isCreatingCollection: true });
    try {
      const res = await axiosInstance.post("/collection", data);
      const { collection, message } = res.data;
      set((state) => ({
        collections: [...state.collections, collection],
      }));
      toast.success(message);
      return collection;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isCreatingCollection: false });
    }
  },

  deleteCollection: async (collectionId) => {
    set({ isDeletingCollection: true });
    try {
      const res = await axiosInstance.delete(`/collection/${collectionId}`);
      set((state) => ({
        collections: state.collections.filter(
          (collection) => collection._id !== collectionId
        ),
      }));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isDeletingCollection: false });
    }
  },

  getHierarchy: async () => {
    set({ isCollectionsLoading: true });
    try {
      const res = await axiosInstance.get("collection/hierarchy");
      const { collections } = res.data;
      set({ collections });

      // count no of notes
      const notesLength = collections.map((c) => c.notes.length);
      localStorage.setItem("notesLength", JSON.stringify(notesLength));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isCollectionsLoading: false });
    }
  },

  renameCollection: async (data) => {
    try {
      const res = await axiosInstance.put("collection/", data);
      const { collection, message } = res.data;
      set((state) => ({
        collections: state.collections.map((c) => {
          if (c.id === collection._id) {
            return {
              ...c,
              name: collection.name,
              updatedAt: collection.updatedAt,
            };
          }
          return c;
        }),
      }));

      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  createNote: async (data) => {
    //data:{name, collectionId }

    set({ isCreatingNote: true });
    const { collectionId } = data;
    try {
      const res = await axiosInstance.post("note/", data);
      const { note, message } = res.data;

      // Add note to the appropriate collection
      get().insertNoteInCollection(collectionId, note);

      toast.success(message);
      return note._id;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      return null;
    } finally {
      set({ isCreatingNote: false });
    }
  },

  deleteNote: async (noteId) => {
    try {
      const res = await axiosInstance.delete(`note/${noteId}`);

      // Remove the deleted note
      get().deleteNoteFromCollection(noteId);

      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  renameNote: async (data) => {
    try {
      const res = await axiosInstance.put("note/rename", data);
      const { note: updatedNote, message } = res.data;

      // Replace note with updated note
      get().replaceNoteFromCollection(updatedNote);

      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  moveTo: async (data) => {
    try {
      const res = await axiosInstance.post("/note/move-to", data);
      const { note: updatedNote, message } = res.data;

      // Remove the note from the old collection and add it to the new collection
      get().deleteNoteFromCollection(updatedNote._id);
      get().insertNoteInCollection(updatedNote.collectionId, updatedNote);

      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
}));
