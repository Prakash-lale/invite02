import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FiLayers, FiGrid, FiType, FiUpload, FiImage,
    FiEye, FiEyeOff, FiLock, FiUnlock, FiTrash2,
    FiCopy, FiChevronUp, FiChevronDown, FiSquare,
    FiSearch, FiPlus, FiLayout
} from 'react-icons/fi'
import useEditorStore from '../../stores/useEditorStore'
import useFormFieldStore from '../../stores/useFormFieldStore'
import templateStorage from '../../lib/templateStorage'
import AssetLibrary from './AssetLibrary'

/**
 * SidebarShell — Canva-style left sidebar with icon rail + expandable panel.
 */
function SidebarShell() {
    const [activePanel, setActivePanel] = useState('layers')

    const togglePanel = (panelId) => {
        setActivePanel((prev) => prev === panelId ? null : panelId)
    }

    const isCollapsed = activePanel === null

    const tools = [
        { id: 'templates', icon: FiLayout, label: 'Templates' },
        { id: 'layers', icon: FiLayers, label: 'Layers' },
        { id: 'elements', icon: FiGrid, label: 'Elements' },
        { id: 'text', icon: FiType, label: 'Text' },
        { id: 'uploads', icon: FiUpload, label: 'Uploads' },
        { id: 'background', icon: FiImage, label: 'Background' },
    ]

    return (
        <>
            {/* Icon Rail */}
            <div className="sidebar-rail">
                {tools.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        className={`sidebar-rail-btn ${activePanel === id ? 'active' : ''}`}
                        onClick={() => togglePanel(id)}
                        title={label}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            {/* Expandable Panel */}
            <div className={`studio-left-panel bg-white border-r border-surface-200 flex flex-col ${isCollapsed ? 'overflow-hidden' : 'overflow-hidden'}`}
                style={{ width: isCollapsed ? 0 : undefined }}
            >
                {!isCollapsed && (
                    <>
                        {/* Panel Header */}
                        <div className="px-4 py-3 border-b border-surface-200 flex-shrink-0">
                            <h3 className="text-xs font-semibold text-surface-700 uppercase tracking-wide">
                                {tools.find(t => t.id === activePanel)?.label}
                            </h3>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto">
                            {activePanel === 'templates' && <TemplatesPanel />}
                            {activePanel === 'layers' && <LayersPanel />}
                            {activePanel === 'elements' && <div className="px-3 py-3"><AssetLibrary /></div>}
                            {activePanel === 'text' && <TextPresetsPanel />}
                            {activePanel === 'uploads' && <UploadsPanel />}
                            {activePanel === 'background' && <BackgroundPanel />}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

// ============================================================
// LAYERS PANEL (extracted from old LayerPanel)
// ============================================================
function LayersPanel() {
    const layers = useEditorStore((s) => s.layers)
    const selectedLayerId = useEditorStore((s) => s.selectedLayerId)
    const addLayer = useEditorStore((s) => s.addLayer)
    const removeLayer = useEditorStore((s) => s.removeLayer)
    const selectLayer = useEditorStore((s) => s.selectLayer)
    const toggleLayerVisibility = useEditorStore((s) => s.toggleLayerVisibility)
    const toggleLayerLock = useEditorStore((s) => s.toggleLayerLock)
    const duplicateLayer = useEditorStore((s) => s.duplicateLayer)
    const renameLayer = useEditorStore((s) => s.renameLayer)
    const moveLayerUp = useEditorStore((s) => s.moveLayerUp)
    const moveLayerDown = useEditorStore((s) => s.moveLayerDown)
    const reorderLayers = useEditorStore((s) => s.reorderLayers)

    const [editingName, setEditingName] = useState(null)
    const [tempName, setTempName] = useState('')
    const [dragOverIndex, setDragOverIndex] = useState(null)
    const [dragIndex, setDragIndex] = useState(null)

    const getTypeIcon = (type) => {
        switch (type) {
            case 'text': return <FiType size={12} />
            case 'image': return <FiImage size={12} />
            case 'shape': return <FiSquare size={12} />
            default: return <FiLayers size={12} />
        }
    }

    const startRename = (layer) => {
        setEditingName(layer.id)
        setTempName(layer.name)
    }

    const finishRename = (id) => {
        if (tempName.trim()) renameLayer(id, tempName.trim())
        setEditingName(null)
    }

    // Reversed layers for display (top layer = first in list)
    const reversedLayers = [...layers].reverse()

    // Drag handlers — work with reversed display indices, convert to real indices for store
    const handleDragStart = (e, displayIndex) => {
        setDragIndex(displayIndex)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', displayIndex.toString())
        // Make drag image slightly transparent
        if (e.target) e.target.style.opacity = '0.5'
    }

    const handleDragEnd = (e) => {
        if (e.target) e.target.style.opacity = '1'
        setDragIndex(null)
        setDragOverIndex(null)
    }

    const handleDragOver = (e, displayIndex) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (displayIndex !== dragIndex) {
            setDragOverIndex(displayIndex)
        }
    }

    const handleDragLeave = () => {
        setDragOverIndex(null)
    }

    const handleDrop = (e, toDisplayIndex) => {
        e.preventDefault()
        const fromDisplayIndex = dragIndex
        if (fromDisplayIndex === null || fromDisplayIndex === toDisplayIndex) {
            setDragIndex(null)
            setDragOverIndex(null)
            return
        }
        // Convert display indices (reversed) to real layer array indices
        const lastIdx = layers.length - 1
        const fromRealIndex = lastIdx - fromDisplayIndex
        const toRealIndex = lastIdx - toDisplayIndex
        reorderLayers(fromRealIndex, toRealIndex)
        setDragIndex(null)
        setDragOverIndex(null)
    }

    return (
        <div className="flex flex-col h-full">
            {/* Add Layer Buttons */}
            <div className="flex gap-1 px-3 py-2 border-b border-surface-100 flex-shrink-0">
                <button onClick={() => addLayer('text')} className="btn btn-ghost text-xs flex-1 gap-1" title="Add Text">
                    <FiType size={13} /> Text
                </button>
                <button onClick={() => addLayer('image')} className="btn btn-ghost text-xs flex-1 gap-1" title="Add Image">
                    <FiImage size={13} /> Image
                </button>
                <button onClick={() => addLayer('shape')} className="btn btn-ghost text-xs flex-1 gap-1" title="Add Shape">
                    <FiSquare size={13} /> Shape
                </button>
            </div>

            {/* Layer List */}
            <div className="flex-1 overflow-y-auto px-2 py-1">
                {reversedLayers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <FiLayers size={24} className="text-surface-300 mb-2" />
                        <p className="text-xs text-surface-400">No layers yet</p>
                        <p className="text-xs text-surface-400 mt-1">Add a text, image, or shape layer</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-0.5">
                        {reversedLayers.map((layer, displayIndex) => {
                            const isSelected = selectedLayerId === layer.id
                            const isDragOver = dragOverIndex === displayIndex && dragIndex !== displayIndex
                            return (
                                <div
                                    key={layer.id}
                                    draggable={editingName !== layer.id}
                                    onDragStart={(e) => handleDragStart(e, displayIndex)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => handleDragOver(e, displayIndex)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, displayIndex)}
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-grab group transition-colors ${isSelected
                                        ? 'bg-brand-50 border border-brand-200'
                                        : 'hover:bg-surface-50 border border-transparent'
                                        } ${isDragOver ? 'border-t-2 !border-t-brand-400' : ''}`}
                                    onClick={() => selectLayer(layer.id)}
                                    style={{ opacity: layer.visible ? 1 : 0.5 }}
                                >
                                    {/* Drag handle */}
                                    <span className="flex-shrink-0 text-surface-300 cursor-grab" title="Drag to reorder">
                                        ⠿
                                    </span>
                                    <span className={`flex-shrink-0 ${isSelected ? 'text-brand-600' : 'text-surface-500'}`}>
                                        {getTypeIcon(layer.type)}
                                    </span>

                                    {editingName === layer.id ? (
                                        <input
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            onBlur={() => finishRename(layer.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') finishRename(layer.id)
                                                if (e.key === 'Escape') setEditingName(null)
                                            }}
                                            className="text-xs bg-white border border-brand-300 rounded px-1 py-0.5 flex-1 min-w-0 outline-none"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span
                                            className="text-xs text-surface-800 flex-1 truncate min-w-0"
                                            onDoubleClick={(e) => { e.stopPropagation(); startRename(layer) }}
                                        >
                                            {layer.name}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <button onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id) }} className="p-0.5 rounded hover:bg-surface-200 text-surface-500" title={layer.visible ? 'Hide' : 'Show'}>{layer.visible ? <FiEye size={11} /> : <FiEyeOff size={11} />}</button>
                                        <button onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id) }} className="p-0.5 rounded hover:bg-surface-200 text-surface-500" title={layer.locked ? 'Unlock' : 'Lock'}>{layer.locked ? <FiLock size={11} /> : <FiUnlock size={11} />}</button>
                                        <button onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id) }} className="p-0.5 rounded hover:bg-surface-200 text-surface-500" title="Duplicate"><FiCopy size={11} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); removeLayer(layer.id) }} className="p-0.5 rounded hover:bg-surface-200 text-danger" title="Delete"><FiTrash2 size={11} /></button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

// ============================================================
// TEXT PRESETS PANEL
// ============================================================
function TextPresetsPanel() {
    const addLayer = useEditorStore((s) => s.addLayer)
    const layers = useEditorStore((s) => s.layers)
    const updateLayerText = useEditorStore((s) => s.updateLayerText)

    const presets = [
        { label: 'Add a heading', fontSize: 48, fontWeight: 'bold', preview: 'text-2xl font-bold' },
        { label: 'Add a subheading', fontSize: 32, fontWeight: 'normal', preview: 'text-lg font-medium' },
        { label: 'Add body text', fontSize: 18, fontWeight: 'normal', preview: 'text-sm' },
        { label: 'Add caption', fontSize: 14, fontWeight: 'normal', preview: 'text-xs text-surface-500' },
    ]

    const addTextPreset = (preset) => {
        addLayer('text')
        // Update the just-added layer
        setTimeout(() => {
            const state = useEditorStore.getState()
            const latest = state.layers[state.layers.length - 1]
            if (latest && latest.type === 'text') {
                state.updateLayerText(latest.id, {
                    content: preset.label === 'Add a heading' ? 'Your Heading' :
                        preset.label === 'Add a subheading' ? 'Your Subheading' :
                            preset.label === 'Add caption' ? 'Caption text' :
                                'Start typing your text here',
                    fontSize: preset.fontSize,
                    fontWeight: preset.fontWeight,
                })
            }
        }, 50)
    }

    return (
        <div className="px-3 py-3 space-y-2">
            <p className="text-xs text-surface-500 mb-3">Click to add text to your design</p>
            {presets.map((preset) => (
                <button
                    key={preset.label}
                    onClick={() => addTextPreset(preset)}
                    className="w-full text-left px-3 py-3 rounded-lg border border-surface-200 hover:border-brand-300 hover:bg-brand-50 transition-all group"
                >
                    <span className={`${preset.preview} text-surface-800 group-hover:text-brand-700 transition-colors`}>
                        {preset.label}
                    </span>
                </button>
            ))}
        </div>
    )
}

// ============================================================
// UPLOADS PANEL — with persistent gallery
// ============================================================
const UPLOADS_KEY = 'dmi_uploads'

function getStoredUploads() {
    try {
        return JSON.parse(localStorage.getItem(UPLOADS_KEY) || '[]')
    } catch { return [] }
}

function saveStoredUploads(uploads) {
    try {
        localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads))
    } catch (e) {
        // localStorage may be full — silently fail
        console.warn('Upload storage full:', e)
    }
}

function UploadsPanel() {
    const [uploads, setUploads] = useState(() => getStoredUploads())

    const addImageToCanvas = (dataUrl) => {
        const state = useEditorStore.getState()
        state._pushHistory()
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
        useEditorStore.setState((s) => ({
            layers: [...s.layers, {
                id,
                type: 'image',
                name: 'Uploaded Image',
                visible: true,
                locked: false,
                position: { x: 100, y: 100 },
                dimensions: { width: 300, height: 300 },
                rotation: 0,
                opacity: 1,
                image: { src: dataUrl, objectFit: 'contain', borderRadius: 0 },
            }],
            selectedLayerId: id,
        }))
    }

    const handleUpload = (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = (ev) => {
                const dataUrl = ev.target.result
                const newUpload = {
                    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                    name: file.name,
                    dataUrl,
                    uploadedAt: new Date().toISOString(),
                }
                setUploads((prev) => {
                    const updated = [newUpload, ...prev]
                    saveStoredUploads(updated)
                    return updated
                })
                // Also add to canvas immediately
                addImageToCanvas(dataUrl)
            }
            reader.readAsDataURL(file)
        })
        // Reset the input so the same file can be re-uploaded
        e.target.value = ''
    }

    const handleDelete = (e, uploadId) => {
        e.stopPropagation()
        setUploads((prev) => {
            const updated = prev.filter((u) => u.id !== uploadId)
            saveStoredUploads(updated)
            return updated
        })
    }

    return (
        <div className="px-3 py-3 space-y-4">
            {/* Upload Area */}
            <div
                className="border-2 border-dashed border-surface-300 rounded-lg p-5 text-center hover:border-brand-400 hover:bg-brand-50/30 transition-all cursor-pointer"
                onClick={() => document.getElementById('sidebar-upload-input').click()}
            >
                <FiUpload size={22} className="mx-auto text-surface-400 mb-1.5" />
                <p className="text-xs font-medium text-surface-600">Upload images</p>
                <p className="text-[10px] text-surface-400 mt-0.5">JPG, PNG, SVG, GIF</p>
            </div>
            <input
                id="sidebar-upload-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
            />

            {/* Gallery */}
            {uploads.length > 0 && (
                <>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wide">
                            Your Uploads ({uploads.length})
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                        {uploads.map((upload) => (
                            <div
                                key={upload.id}
                                className="relative aspect-square rounded-lg border border-surface-200 hover:border-brand-300 overflow-hidden cursor-pointer group transition-all hover:shadow-md"
                                onClick={() => addImageToCanvas(upload.dataUrl)}
                                title={`Click to add: ${upload.name}`}
                            >
                                <img
                                    src={upload.dataUrl}
                                    alt={upload.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                    <FiPlus size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                                </div>
                                {/* Delete button */}
                                <button
                                    onClick={(e) => handleDelete(e, upload.id)}
                                    className="absolute top-1 right-1 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    title="Remove"
                                >
                                    <FiTrash2 size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {uploads.length === 0 && (
                <p className="text-[10px] text-surface-400 text-center">
                    Uploaded images will appear here for easy reuse.
                </p>
            )}
        </div>
    )
}

// ============================================================
// BACKGROUND PANEL
// ============================================================
const QUICK_GRADIENTS = [
    // Warm
    { name: 'Sunrise', stops: ['#FF512F', '#F09819'], angle: 135 },
    { name: 'Peach', stops: ['#FFD194', '#D1913C'], angle: 135 },
    { name: 'Mango', stops: ['#FFE259', '#FFA751'], angle: 135 },
    { name: 'Coral Blush', stops: ['#ee9ca7', '#ffdde1'], angle: 135 },
    // Cool
    { name: 'Ocean', stops: ['#2193b0', '#6dd5ed'], angle: 135 },
    { name: 'Sky Blue', stops: ['#89CFF0', '#E0F7FA'], angle: 180 },
    { name: 'Cool Mint', stops: ['#00B4DB', '#0083B0'], angle: 135 },
    { name: 'Deep Sea', stops: ['#1a2980', '#26d0ce'], angle: 135 },
    // Pastel
    { name: 'Cotton Candy', stops: ['#FFDEE9', '#B5FFFC'], angle: 135 },
    { name: 'Lavender Mist', stops: ['#E8D5F5', '#F3E7E9'], angle: 135 },
    { name: 'Soft Peach', stops: ['#FFF1EB', '#ACE0F9'], angle: 135 },
    { name: 'Morning Dew', stops: ['#E8F5E9', '#FFF9C4'], angle: 135 },
    // Jewel
    { name: 'Royal Purple', stops: ['#8E2DE2', '#4A00E0'], angle: 135 },
    { name: 'Emerald', stops: ['#11998e', '#38ef7d'], angle: 135 },
    { name: 'Ruby', stops: ['#C0392B', '#8E44AD'], angle: 135 },
    { name: 'Sapphire', stops: ['#0F2027', '#2C5364'], angle: 135 },
    // Dark & Moody
    { name: 'Midnight', stops: ['#0f0c29', '#302b63'], angle: 135 },
    { name: 'Dark Night', stops: ['#232526', '#414345'], angle: 180 },
    { name: 'Charcoal', stops: ['#2C3E50', '#4CA1AF'], angle: 135 },
    { name: 'Deep Space', stops: ['#000428', '#004e92'], angle: 135 },
    // Neutrals
    { name: 'Silver', stops: ['#BDC3C7', '#FFFFFF'], angle: 180 },
    { name: 'Warm Gray', stops: ['#F5F5F5', '#E0E0E0'], angle: 180 },
    // Indian / Festive
    { name: 'Saffron Gold', stops: ['#FF9933', '#FFD700'], angle: 135 },
    { name: 'Festive Red', stops: ['#C0392B', '#E74C3C'], angle: 135 },
]

function BackgroundPanel() {
    const canvas = useEditorStore((s) => s.canvas)
    const setCanvasBackground = useEditorStore((s) => s.setCanvasBackground)

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            setCanvasBackground({ type: 'image', imageData: ev.target.result })
        }
        reader.readAsDataURL(file)
    }

    const QUICK_COLORS = [
        '#FFFFFF', '#F8F9FA', '#FFF3E0', '#FFF8E1',
        '#E8F5E9', '#E3F2FD', '#F3E5F5', '#FCE4EC',
        '#212529', '#495057', '#1A237E', '#4A148C',
    ]

    return (
        <div className="px-3 py-3 space-y-4">
            {/* Background Type */}
            <div>
                <label className="label-text">Type</label>
                <div className="flex gap-1">
                    {['solid', 'gradient', 'image'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setCanvasBackground({ type })}
                            className={`btn text-xs flex-1 capitalize ${canvas.background.type === type ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Colors */}
            {canvas.background.type === 'solid' && (
                <div>
                    <label className="label-text">Color</label>
                    <div className="grid grid-cols-6 gap-1.5 mb-2">
                        {QUICK_COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => setCanvasBackground({ color })}
                                className={`w-full aspect-square rounded-md border-2 transition-all ${canvas.background.color === color ? 'border-brand-500 scale-110' : 'border-surface-200 hover:border-surface-400'}`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={canvas.background.color}
                            onChange={(e) => setCanvasBackground({ color: e.target.value })}
                            className="w-9 h-9 rounded cursor-pointer border border-surface-300"
                        />
                        <input
                            type="text"
                            value={canvas.background.color}
                            onChange={(e) => setCanvasBackground({ color: e.target.value })}
                            className="input-base flex-1"
                        />
                    </div>
                </div>
            )}

            {/* Gradient */}
            {canvas.background.type === 'gradient' && (
                <div className="space-y-3">
                    <label className="label-text">Presets</label>
                    <div className="grid grid-cols-4 gap-1.5">
                        {QUICK_GRADIENTS.map((g, i) => (
                            <button
                                key={i}
                                onClick={() => setCanvasBackground({
                                    gradient: { type: 'linear', angle: g.angle, stops: g.stops },
                                })}
                                className="w-full aspect-square rounded-md border-2 transition-all hover:scale-105 hover:shadow-md border-surface-200 hover:border-brand-400"
                                style={{
                                    background: `linear-gradient(${g.angle}deg, ${g.stops[0]}, ${g.stops[1]})`,
                                }}
                                title={g.name}
                            />
                        ))}
                    </div>

                    <div className="h-px bg-surface-200" />

                    <label className="label-text">Custom</label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <span className="text-[10px] text-surface-500">Start</span>
                            <input
                                type="color"
                                value={canvas.background.gradient.stops[0]}
                                onChange={(e) => setCanvasBackground({
                                    gradient: {
                                        ...canvas.background.gradient,
                                        stops: [e.target.value, canvas.background.gradient.stops[1]],
                                    },
                                })}
                                className="w-full h-8 rounded cursor-pointer border border-surface-300"
                            />
                        </div>
                        <div className="flex-1">
                            <span className="text-[10px] text-surface-500">End</span>
                            <input
                                type="color"
                                value={canvas.background.gradient.stops[1]}
                                onChange={(e) => setCanvasBackground({
                                    gradient: {
                                        ...canvas.background.gradient,
                                        stops: [canvas.background.gradient.stops[0], e.target.value],
                                    },
                                })}
                                className="w-full h-8 rounded cursor-pointer border border-surface-300"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label-text">Angle: {canvas.background.gradient.angle}°</label>
                        <input
                            type="range"
                            value={canvas.background.gradient.angle}
                            onChange={(e) => setCanvasBackground({
                                gradient: { ...canvas.background.gradient, angle: parseInt(e.target.value) },
                            })}
                            className="w-full"
                            min={0}
                            max={360}
                        />
                    </div>
                </div>
            )}

            {/* Image */}
            {canvas.background.type === 'image' && (
                <div>
                    <label className="label-text">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="text-xs text-surface-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-surface-200 file:text-surface-700 hover:file:bg-surface-300 cursor-pointer"
                    />
                    {(canvas.background.imageData || canvas.background.imageUrl) && (
                        <div className="mt-2 rounded overflow-hidden border border-surface-200">
                            <img
                                src={canvas.background.imageData || canvas.background.imageUrl}
                                alt="Background preview"
                                className="w-full h-24 object-cover"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ============================================================
// TEMPLATES PANEL — Browse & load saved templates
// ============================================================
function TemplatesPanel() {
    const navigate = useNavigate()
    const loadTemplateJSON = useEditorStore((s) => s.loadTemplateJSON)
    const setFormFields = useFormFieldStore((s) => s.setFormFields)

    const [templates, setTemplates] = useState([])
    const [search, setSearch] = useState('')
    const [occasion, setOccasion] = useState('all')

    useEffect(() => {
        setTemplates(templateStorage.getAll().filter((t) => t.status !== 'archived'))
    }, [])

    const OCCASIONS = [
        'all', 'wedding', 'birthday', 'engagement', 'baby-shower',
        'anniversary', 'housewarming', 'mundan', 'thread-ceremony',
        'retirement', 'puja', 'other',
    ]

    const filtered = templates.filter((t) => {
        const matchOccasion = occasion === 'all' || t.occasion === occasion
        if (!search) return matchOccasion
        const q = search.toLowerCase()
        const matchName = (t.name || '').toLowerCase().includes(q)
        const matchTags = (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
        const matchOcc = (t.occasion || '').toLowerCase().includes(q)
        return matchOccasion && (matchName || matchTags || matchOcc)
    })

    const handleLoad = (template) => {
        if (window.confirm(`Load "${template.name}"? This will replace your current design.`)) {
            loadTemplateJSON(template)
            setFormFields(template.formFields || [])
        }
    }

    return (
        <div className="px-3 py-3 space-y-3">
            {/* Search */}
            <div className="relative">
                <FiSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search templates…"
                    className="input-base pl-8"
                />
            </div>

            {/* Occasion Filter */}
            <div className="flex flex-wrap gap-1">
                {OCCASIONS.map((occ) => (
                    <button
                        key={occ}
                        onClick={() => setOccasion(occ)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full capitalize transition-all ${occasion === occ
                                ? 'bg-brand-100 text-brand-700'
                                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                            }`}
                    >
                        {occ === 'all' ? 'All' : occ.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Template Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-8">
                    <FiLayout size={24} className="mx-auto text-surface-300 mb-2" />
                    <p className="text-xs text-surface-400">
                        {templates.length === 0 ? 'No saved templates yet' : 'No templates match your search'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    {filtered.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleLoad(template)}
                            className="text-left rounded-lg border border-surface-200 hover:border-brand-300 hover:shadow-md transition-all group overflow-hidden"
                        >
                            {/* Preview thumbnail */}
                            <div
                                className="aspect-square w-full flex items-center justify-center relative overflow-hidden rounded-t-lg bg-surface-100"
                                style={{
                                    backgroundColor: template.canvas?.background?.color || '#f5f5f5',
                                    ...(template.canvas?.background?.type === 'gradient' && template.canvas?.background?.gradient
                                        ? {
                                            background: `linear-gradient(${template.canvas.background.gradient.angle || 135}deg, ${template.canvas.background.gradient.stops?.[0] || '#fff'}, ${template.canvas.background.gradient.stops?.[1] || '#eee'})`,
                                        }
                                        : {}),
                                }}
                            >
                                {template.thumbnailUrl ? (
                                    <img
                                        src={template.thumbnailUrl}
                                        alt={template.name || 'Template'}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-[9px] text-surface-400">
                                        {template.layers?.length || 0} layers
                                    </span>
                                )}
                                {template.occasion && (
                                    <span className="absolute top-1 left-1 text-[8px] bg-black/30 text-white px-1.5 py-0.5 rounded-full capitalize">
                                        {template.occasion.replace('-', ' ')}
                                    </span>
                                )}
                            </div>
                            {/* Name */}
                            <div className="px-2 py-1.5">
                                <p className="text-[10px] font-medium text-surface-700 truncate group-hover:text-brand-700 transition-colors">
                                    {template.name || 'Untitled'}
                                </p>
                                {template.tags?.length > 0 && (
                                    <p className="text-[8px] text-surface-400 truncate mt-0.5">
                                        {template.tags.slice(0, 3).join(', ')}
                                    </p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SidebarShell
