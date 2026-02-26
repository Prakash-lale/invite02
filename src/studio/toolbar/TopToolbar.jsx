import { FiChevronLeft, FiSave, FiEye, FiEyeOff, FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut, FiCheck, FiDownload } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react'
import useEditorStore from '../../stores/useEditorStore'
import useFormFieldStore from '../../stores/useFormFieldStore'
import templateStorage from '../../lib/templateStorage'
import { generateId } from '../../lib/utils'
import { exportCanvas, generateThumbnail } from '../../lib/exportCanvas'

/**
 * TopToolbar — Top bar wired to Zustand + save functionality.
 */
function TopToolbar() {
    const navigate = useNavigate()
    const { id } = useParams()

    const templateName = useEditorStore((s) => s.templateName)
    const setTemplateName = useEditorStore((s) => s.setTemplateName)
    const zoom = useEditorStore((s) => s.zoom)
    const zoomIn = useEditorStore((s) => s.zoomIn)
    const zoomOut = useEditorStore((s) => s.zoomOut)
    const zoomFit = useEditorStore((s) => s.zoomFit)
    const undo = useEditorStore((s) => s.undo)
    const redo = useEditorStore((s) => s.redo)
    const canUndo = useEditorStore((s) => s.canUndo)
    const canRedo = useEditorStore((s) => s.canRedo)
    const isPreviewMode = useEditorStore((s) => s.isPreviewMode)
    const togglePreviewMode = useEditorStore((s) => s.togglePreviewMode)
    const getTemplateJSON = useEditorStore((s) => s.getTemplateJSON)
    const templateId = useEditorStore((s) => s.templateId)

    const formFields = useFormFieldStore((s) => s.formFields)

    const [saveStatus, setSaveStatus] = useState(null)

    const handleSave = useCallback(async () => {
        setSaveStatus('saving')

        const template = getTemplateJSON()
        template.formFields = formFields

        // Generate thumbnail from the canvas
        const canvasSurface = document.querySelector('.studio-canvas-surface')
        if (canvasSurface) {
            template.thumbnailUrl = await generateThumbnail(canvasSurface)
        }

        // If editing an existing template, keep the ID
        if (id && id !== 'new') {
            template.id = id
        } else if (!templateId) {
            template.id = generateId()
            useEditorStore.setState({ templateId: template.id })
        }

        const saved = templateStorage.save(template)
        setSaveStatus('saved')

        // If it was a new template, update the URL
        if (id === 'new') {
            navigate(`/studio/${saved.id}`, { replace: true })
        }

        setTimeout(() => setSaveStatus(null), 2000)
    }, [getTemplateJSON, formFields, id, templateId, navigate])

    // Register Ctrl+S
    useEffect(() => {
        const handler = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()
                handleSave()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [handleSave])

    return (
        <div className="studio-toolbar flex items-center justify-between px-3 bg-white border-b border-surface-200">
            {/* Left Section */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate('/studio')}
                    className="btn btn-ghost btn-icon"
                    title="Back to Studio"
                >
                    <FiChevronLeft size={18} />
                </button>
                <div className="w-px h-6 bg-surface-200 mx-1" />
                <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm font-medium text-surface-800 w-48 px-2 py-1 rounded hover:bg-surface-100 focus:bg-surface-100 focus:ring-1 focus:ring-brand-500"
                    placeholder="Template name"
                />
            </div>

            {/* Center Section — Undo/Redo + Zoom */}
            <div className="flex items-center gap-1">
                <button
                    onClick={undo}
                    className="btn btn-ghost btn-icon"
                    title="Undo (Ctrl+Z)"
                    disabled={!canUndo()}
                >
                    <FiRotateCcw size={16} />
                </button>
                <button
                    onClick={redo}
                    className="btn btn-ghost btn-icon"
                    title="Redo (Ctrl+Shift+Z)"
                    disabled={!canRedo()}
                >
                    <FiRotateCw size={16} />
                </button>
                <div className="w-px h-6 bg-surface-200 mx-2" />
                <button onClick={zoomOut} className="btn btn-ghost btn-icon" title="Zoom Out">
                    <FiZoomOut size={16} />
                </button>
                <button
                    onClick={zoomFit}
                    className="text-xs text-surface-600 font-medium w-12 text-center hover:text-brand-600 cursor-pointer"
                    title="Reset Zoom"
                >
                    {Math.round(zoom * 100)}%
                </button>
                <button onClick={zoomIn} className="btn btn-ghost btn-icon" title="Zoom In">
                    <FiZoomIn size={16} />
                </button>
            </div>

            {/* Right Section — Preview + Export + Save */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => {
                        if (!isPreviewMode && formFields.length > 0) {
                            // Auto-fill sample data from form fields when entering preview
                            const sampleData = {}
                            formFields.forEach((field) => {
                                if (field.defaultValue) {
                                    sampleData[field.id] = field.defaultValue
                                } else {
                                    // Generate sensible sample based on label
                                    const label = (field.label || '').toLowerCase()
                                    if (label.includes('name')) sampleData[field.id] = 'Priya Sharma'
                                    else if (label.includes('date')) sampleData[field.id] = '15 March 2026'
                                    else if (label.includes('time')) sampleData[field.id] = '7:00 PM'
                                    else if (label.includes('venue') || label.includes('location')) sampleData[field.id] = 'The Grand Palace, Mumbai'
                                    else if (label.includes('phone') || label.includes('mobile')) sampleData[field.id] = '+91 98765 43210'
                                    else if (label.includes('email')) sampleData[field.id] = 'priya@example.com'
                                    else if (label.includes('rsvp')) sampleData[field.id] = 'rsvp@example.com'
                                    else sampleData[field.id] = field.placeholder || `Sample ${field.label}`
                                }
                            })
                            useEditorStore.getState().setPreviewData(sampleData)
                        }
                        togglePreviewMode()
                    }}
                    className={`btn text-xs ${isPreviewMode ? 'btn-primary' : 'btn-secondary'}`}
                    title="Toggle Preview"
                >
                    {isPreviewMode ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    {isPreviewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                    onClick={async () => {
                        const el = document.querySelector('.studio-canvas-surface')
                        if (el) {
                            try {
                                await exportCanvas(el, { filename: templateName || 'invitation', format: 'png', scale: 2 })
                            } catch (err) {
                                console.error('Export failed:', err)
                            }
                        }
                    }}
                    className="btn btn-secondary text-xs"
                    title="Export PNG"
                >
                    <FiDownload size={14} />
                    Export
                </button>
                <button
                    onClick={handleSave}
                    className={`btn text-xs ${saveStatus === 'saved' ? 'bg-green-600 text-white' : 'btn-primary'}`}
                    title="Save (Ctrl+S)"
                >
                    {saveStatus === 'saved' ? <FiCheck size={14} /> : <FiSave size={14} />}
                    {saveStatus === 'saved' ? 'Saved!' : 'Save'}
                </button>
            </div>
        </div>
    )
}

export default TopToolbar

