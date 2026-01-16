import { useState, useRef, useEffect } from "react";
import { Trash, PencilSimple, Gear } from "@phosphor-icons/react";
import WorkspaceTemplate from "@/models/workspaceTemplate";
import showToast from "@/utils/toast";
import TemplatePreviewModal from "../TemplatePreviewModal";

export default function TemplateRow({ template, removeTemplate, updateTemplate }) {
    const [showSettings, setShowSettings] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(template);

    // Inline editing state
    const [editingName, setEditingName] = useState(false);
    const [editingDesc, setEditingDesc] = useState(false);
    const [nameValue, setNameValue] = useState(currentTemplate.name);
    const [descValue, setDescValue] = useState(currentTemplate.description || "");
    const [saving, setSaving] = useState(false);

    const nameInputRef = useRef(null);
    const descInputRef = useRef(null);

    useEffect(() => {
        if (editingName && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [editingName]);

    useEffect(() => {
        if (editingDesc && descInputRef.current) {
            descInputRef.current.focus();
            descInputRef.current.select();
        }
    }, [editingDesc]);

    const handleDelete = async () => {
        if (
            !window.confirm(
                `Are you sure you want to delete the template "${currentTemplate.name}"?\n\nThis action is irreversible.`
            )
        ) {
            return;
        }

        setDeleting(true);
        const success = await WorkspaceTemplate.delete(currentTemplate.id);
        if (success) {
            showToast("Template deleted successfully", "success", { clear: true });
            removeTemplate(currentTemplate.id);
        } else {
            showToast("Failed to delete template", "error", { clear: true });
        }
        setDeleting(false);
    };

    const handleUpdate = (updatedTemplate) => {
        setCurrentTemplate(updatedTemplate);
        if (updateTemplate) updateTemplate(updatedTemplate);
    };

    const saveNameOrDesc = async (field) => {
        const value = field === "name" ? nameValue : descValue;
        const originalValue = field === "name" ? currentTemplate.name : (currentTemplate.description || "");

        if (field === "name" && !value.trim()) {
            showToast("Template name is required", "error");
            setNameValue(currentTemplate.name);
            setEditingName(false);
            return;
        }

        if (value === originalValue) {
            setEditingName(false);
            setEditingDesc(false);
            return;
        }

        setSaving(true);
        const updateData = field === "name"
            ? { name: value }
            : { description: value };

        const { template: updatedTemplate, message } = await WorkspaceTemplate.update(
            currentTemplate.id,
            updateData
        );

        if (updatedTemplate) {
            handleUpdate(updatedTemplate);
            showToast("Template updated", "success", { clear: true });
        } else {
            showToast(`Error: ${message}`, "error", { clear: true });
            // Reset to original
            if (field === "name") setNameValue(currentTemplate.name);
            else setDescValue(currentTemplate.description || "");
        }

        setSaving(false);
        setEditingName(false);
        setEditingDesc(false);
    };

    const handleKeyDown = (e, field) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveNameOrDesc(field);
        } else if (e.key === "Escape") {
            if (field === "name") {
                setNameValue(currentTemplate.name);
                setEditingName(false);
            } else {
                setDescValue(currentTemplate.description || "");
                setEditingDesc(false);
            }
        }
    };

    return (
        <>
            <tr className="bg-transparent text-theme-text-primary text-opacity-80 text-xs font-medium border-b border-theme-modal-border h-10">
                {/* Name column with inline edit */}
                <td className="px-6 whitespace-nowrap">
                    {editingName ? (
                        <div className="flex items-center gap-x-1">
                            <input
                                ref={nameInputRef}
                                type="text"
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "name")}
                                onBlur={() => saveNameOrDesc("name")}
                                disabled={saving}
                                className="bg-theme-settings-input-bg text-theme-text-primary text-xs rounded px-2 py-1 outline-none focus:outline-primary-button w-40"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-2 group">
                            <span className="font-semibold">{currentTemplate.name}</span>
                            <button
                                onClick={() => setEditingName(true)}
                                className="opacity-0 group-hover:opacity-100 text-theme-text-primary/50 hover:text-theme-text-primary transition-opacity"
                                title="Edit name"
                            >
                                <PencilSimple size={14} />
                            </button>
                        </div>
                    )}
                </td>

                {/* Description column with inline edit */}
                <td className="px-6">
                    {editingDesc ? (
                        <div className="flex items-center gap-x-1">
                            <input
                                ref={descInputRef}
                                type="text"
                                value={descValue}
                                onChange={(e) => setDescValue(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "description")}
                                onBlur={() => saveNameOrDesc("description")}
                                disabled={saving}
                                placeholder="No description"
                                className="bg-theme-settings-input-bg text-theme-text-primary text-xs rounded px-2 py-1 outline-none focus:outline-primary-button w-48"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-2 group">
                            {currentTemplate.description ? (
                                <span>{currentTemplate.description}</span>
                            ) : (
                                <span className="italic opacity-50">No description</span>
                            )}
                            <button
                                onClick={() => setEditingDesc(true)}
                                className="opacity-0 group-hover:opacity-100 text-theme-text-primary/50 hover:text-theme-text-primary transition-opacity"
                                title="Edit description"
                            >
                                <PencilSimple size={14} />
                            </button>
                        </div>
                    )}
                </td>

                <td className="px-6">{currentTemplate.createdAt}</td>

                <td className="px-6 flex items-center gap-x-4 h-full mt-1">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="text-xs font-medium text-blue-300 rounded-lg hover:text-white hover:text-opacity-60 hover:underline flex items-center gap-x-1"
                    >
                        <Gear size={14} />
                        Settings
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="text-xs font-medium text-theme-text-primary/80 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-theme-sidebar-item-hover disabled:opacity-50"
                    >
                        <Trash className="h-5 w-5" />
                    </button>
                </td>
            </tr>

            {showSettings && (
                <TemplatePreviewModal
                    template={currentTemplate}
                    onClose={() => setShowSettings(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
}
