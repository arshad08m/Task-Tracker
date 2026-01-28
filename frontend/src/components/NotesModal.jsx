import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Trash2, Save, Upload, Download, FileText, Image } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';
import apiService from '../services/api';
import toast from 'react-hot-toast';

/**
 * NotesModal Component
 * Modal for viewing, adding, editing, and deleting notes with file attachments
 */
const NotesModal = ({ isOpen, onClose, task, onAddNote, onUpdateNote, onDeleteNote, onRefresh }) => {
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingNoteId, setUploadingNoteId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      await onAddNote(task.id, newNote);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const handleStartEdit = (note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleSaveEdit = async (noteId) => {
    if (editingContent.trim()) {
      await onUpdateNote(noteId, editingContent);
      setEditingNoteId(null);
      setEditingContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  const handleFileUpload = async (noteId, file) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadingNoteId(noteId);
      await apiService.uploadAttachment(noteId, file);
      toast.success('File uploaded successfully!');
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload file');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadingNoteId(null);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await apiService.deleteAttachment(attachmentId);
      toast.success('Attachment deleted successfully!');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete attachment');
      console.error('Delete error:', error);
    }
  };

  const handleDownloadAttachment = (attachment) => {
    apiService.downloadAttachment(attachment.id, attachment.filename);
  };

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Task Notes</h2>
              <p className="text-gray-600 text-sm">{task.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {task.notes && task.notes.length > 0 ? (
              task.notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  {editingNoteId === note.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="input-field resize-none"
                        rows="3"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="btn-primary text-sm py-1 px-3 flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-secondary text-sm py-1 px-3"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-gray-700 flex-1">{note.content}</p>
                        <div className="flex gap-1 ml-3">
                          <button
                            onClick={() => handleStartEdit(note)}
                            className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                            title="Edit note"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        {formatDateTime(note.created_at)}
                      </p>

                      {/* Attachments Section */}
                      {note.attachments && note.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Attachments</p>
                          <div className="space-y-2">
                            {note.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-sm"
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  {attachment.file_type === 'pdf' ? (
                                    <FileText className="w-4 h-4 text-red-600" />
                                  ) : (
                                    <Image className="w-4 h-4 text-blue-600" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-700 truncate">{attachment.filename}</p>
                                    <p className="text-xs text-gray-500">
                                      {(attachment.file_size / 1024).toFixed(2)} KB
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-1 ml-2">
                                  <button
                                    onClick={() => handleDownloadAttachment(attachment)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAttachment(attachment.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                    title="Delete attachment"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload Attachment Button */}
                      {uploadingNoteId !== note.id && (
                        <div className="mt-3">
                          <input
                            type="file"
                            id={`file-upload-${note.id}`}
                            onChange={(e) => handleFileUpload(note.id, e.target.files[0])}
                            accept="application/pdf,image/*"
                            className="hidden"
                            disabled={isUploading}
                          />
                          <label
                            htmlFor={`file-upload-${note.id}`}
                            className="text-xs font-medium text-primary-600 hover:text-primary-700 cursor-pointer flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            Attach file (PDF or image)
                          </label>
                        </div>
                      )}

                      {/* Uploading Indicator */}
                      {uploadingNoteId === note.id && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-primary-600">
                          <div className="animate-spin">
                            <Upload className="w-4 h-4" />
                          </div>
                          Uploading...
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">No notes yet</p>
                <p className="text-sm mt-1">Add your first note below</p>
              </div>
            )}
          </div>

          {/* Add Note Section */}
          <div className="border-t p-6">
            {isAdding ? (
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="input-field resize-none"
                  rows="3"
                  placeholder="Write a note..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Add Note
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setNewNote('');
                    }}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Note
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotesModal;
