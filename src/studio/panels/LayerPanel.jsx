import { FiType, FiImage, FiSquare, FiLayers, FiEye, FiEyeOff, FiLock, FiUnlock, FiTrash2, FiCopy, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import useEditorStore from '../../stores/useEditorStore'
import { useState } from 'react'

/**
 * LayerPanel — Left sidebar showing the layer stack with controls.
 */
function LayerPanel() {
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

    const [editingName, setEditingName] = useState(null)
    const [tempName, setTempName] = useState('')

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
        if (tempName.trim()) {
            renameLayer(id, tempName.trim())
        }
        setEditingName(null)
    }

    // Render layers in reverse order (top layers first in the panel)
    const reversedLayers = [...layers].reverse()

    return (
        <div className="studio-left-panel bg-white border-r border-surface-200 flex flex-col overflow-hidden">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200">
                <div className="flex items-center gap-2">
                    <FiLayers size={14} className="text-surface-600" />
                    <span className="text-xs font-semibold text-surface-700 uppercase tracking-wide">Layers</span>
                </div>
                <span className="text-xs text-surface-400">{layers.length}</span>
            </div>

            {/* Add Layer Buttons */}
            <div className="flex gap-1 px-3 py-2 border-b border-surface-100">
                <button onClick={() => addLayer('text')} className="btn btn-ghost text-xs flex-1 gap-1" title="Add Text Layer">
                    <FiType size={13} />
                    Text
                </button>
                <button onClick={() => addLayer('image')} className="btn btn-ghost text-xs flex-1 gap-1" title="Add Image Layer">
                    <FiImage size={13} />
                    Image
                </button>
                <button onClick={() => addLayer('shape')} className="btn btn-ghost text-xs flex-1 gap-1" title="Add Shape Layer">
                    <FiSquare size={13} />
                    Shape
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
                        {reversedLayers.map((layer) => {
                            const isSelected = selectedLayerId === layer.id
                            return (
                                <div
                                    key={layer.id}
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer group transition-colors ${isSelected
                                            ? 'bg-brand-50 border border-brand-200'
                                            : 'hover:bg-surface-50 border border-transparent'
                                        }`}
                                    onClick={() => selectLayer(layer.id)}
                                    style={{ opacity: layer.visible ? 1 : 0.5 }}
                                >
                                    {/* Type Icon */}
                                    <span className={`flex-shrink-0 ${isSelected ? 'text-brand-600' : 'text-surface-500'}`}>
                                        {getTypeIcon(layer.type)}
                                    </span>

                                    {/* Layer Name */}
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
                                            onDoubleClick={(e) => {
                                                e.stopPropagation()
                                                startRename(layer)
                                            }}
                                        >
                                            {layer.name}
                                        </span>
                                    )}

                                    {/* Layer Actions */}
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveLayerUp(layer.id) }}
                                            className="p-0.5 rounded hover:bg-surface-200 text-surface-500"
                                            title="Move Up"
                                        >
                                            <FiChevronUp size={11} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveLayerDown(layer.id) }}
                                            className="p-0.5 rounded hover:bg-surface-200 text-surface-500"
                                            title="Move Down"
                                        >
                                            <FiChevronDown size={11} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id) }}
                                            className="p-0.5 rounded hover:bg-surface-200 text-surface-500"
                                            title={layer.visible ? 'Hide' : 'Show'}
                                        >
                                            {layer.visible ? <FiEye size={11} /> : <FiEyeOff size={11} />}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id) }}
                                            className="p-0.5 rounded hover:bg-surface-200 text-surface-500"
                                            title={layer.locked ? 'Unlock' : 'Lock'}
                                        >
                                            {layer.locked ? <FiLock size={11} /> : <FiUnlock size={11} />}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id) }}
                                            className="p-0.5 rounded hover:bg-surface-200 text-surface-500"
                                            title="Duplicate"
                                        >
                                            <FiCopy size={11} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeLayer(layer.id) }}
                                            className="p-0.5 rounded hover:bg-surface-200 text-danger"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={11} />
                                        </button>
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

export default LayerPanel
