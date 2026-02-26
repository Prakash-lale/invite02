import useEditorStore from '../../stores/useEditorStore'

/**
 * ShapeProperties — Right panel controls for a selected shape layer.
 */
function ShapeProperties() {
    const selectedLayerId = useEditorStore((s) => s.selectedLayerId)
    const layers = useEditorStore((s) => s.layers)
    const updateLayer = useEditorStore((s) => s.updateLayer)
    const updateLayerShape = useEditorStore((s) => s.updateLayerShape)

    const layer = layers.find((l) => l.id === selectedLayerId)
    if (!layer || layer.type !== 'shape') return null

    const shape = layer.shape

    return (
        <div className="space-y-4">
            {/* Position & Size */}
            <div>
                <label className="label-text">Position & Size</label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <span className="text-[10px] text-surface-500">X</span>
                        <input
                            type="number"
                            value={Math.round(layer.position.x)}
                            onChange={(e) => updateLayer(layer.id, { position: { ...layer.position, x: parseInt(e.target.value) || 0 } })}
                            className="input-base"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-surface-500">Y</span>
                        <input
                            type="number"
                            value={Math.round(layer.position.y)}
                            onChange={(e) => updateLayer(layer.id, { position: { ...layer.position, y: parseInt(e.target.value) || 0 } })}
                            className="input-base"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-surface-500">W</span>
                        <input
                            type="number"
                            value={Math.round(layer.dimensions.width)}
                            onChange={(e) => updateLayer(layer.id, { dimensions: { ...layer.dimensions, width: parseInt(e.target.value) || 50 } })}
                            className="input-base"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-surface-500">H</span>
                        <input
                            type="number"
                            value={Math.round(layer.dimensions.height)}
                            onChange={(e) => updateLayer(layer.id, { dimensions: { ...layer.dimensions, height: parseInt(e.target.value) || 50 } })}
                            className="input-base"
                        />
                    </div>
                </div>
            </div>

            {/* Rotation & Opacity */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="label-text">Rotation</label>
                    <input
                        type="number"
                        value={layer.rotation}
                        onChange={(e) => updateLayer(layer.id, { rotation: parseFloat(e.target.value) || 0 })}
                        className="input-base"
                    />
                </div>
                <div>
                    <label className="label-text">Opacity</label>
                    <input
                        type="range"
                        value={layer.opacity}
                        onChange={(e) => updateLayer(layer.id, { opacity: parseFloat(e.target.value) })}
                        min={0}
                        max={1}
                        step={0.05}
                        className="w-full mt-1.5"
                    />
                </div>
            </div>

            <div className="h-px bg-surface-200" />

            {/* Shape Type */}
            <div>
                <label className="label-text">Shape Type</label>
                <div className="flex gap-1">
                    {[
                        { id: 'rectangle', label: '▬ Rect' },
                        { id: 'circle', label: '● Circle' },
                        { id: 'rounded', label: '▢ Rounded' },
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => {
                                const updates = { shapeType: type.id }
                                if (type.id === 'rounded') updates.borderRadius = 20
                                if (type.id === 'rectangle') updates.borderRadius = 0
                                updateLayerShape(layer.id, updates)
                            }}
                            className={`btn text-xs flex-1 ${shape.shapeType === type.id ? 'btn-primary' : 'btn-secondary'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Fill Color */}
            <div>
                <label className="label-text">Fill Color</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="color"
                        value={shape.fill === 'transparent' ? '#000000' : shape.fill}
                        onChange={(e) => updateLayerShape(layer.id, { fill: e.target.value })}
                        className="w-9 h-9 rounded cursor-pointer border border-surface-300"
                    />
                    <input
                        type="text"
                        value={shape.fill}
                        onChange={(e) => updateLayerShape(layer.id, { fill: e.target.value })}
                        className="input-base flex-1"
                    />
                    <button
                        onClick={() => updateLayerShape(layer.id, { fill: 'transparent' })}
                        className={`btn btn-ghost text-xs ${shape.fill === 'transparent' ? 'text-brand-600' : ''}`}
                        title="No fill"
                    >
                        ⊘
                    </button>
                </div>
            </div>

            {/* Stroke */}
            <div>
                <label className="label-text">Stroke</label>
                <div className="flex gap-2 items-center mb-2">
                    <input
                        type="color"
                        value={shape.stroke === 'transparent' ? '#000000' : shape.stroke}
                        onChange={(e) => updateLayerShape(layer.id, { stroke: e.target.value, strokeWidth: shape.strokeWidth || 2 })}
                        className="w-9 h-9 rounded cursor-pointer border border-surface-300"
                    />
                    <input
                        type="text"
                        value={shape.stroke}
                        onChange={(e) => updateLayerShape(layer.id, { stroke: e.target.value })}
                        className="input-base flex-1"
                    />
                </div>
                <div>
                    <label className="label-text">Stroke Width: {shape.strokeWidth}px</label>
                    <input
                        type="range"
                        value={shape.strokeWidth}
                        onChange={(e) => updateLayerShape(layer.id, { strokeWidth: parseInt(e.target.value) })}
                        min={0}
                        max={20}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Border Radius */}
            {shape.shapeType !== 'circle' && (
                <div>
                    <label className="label-text">Corner Radius: {shape.borderRadius}px</label>
                    <input
                        type="range"
                        value={shape.borderRadius}
                        onChange={(e) => updateLayerShape(layer.id, { borderRadius: parseInt(e.target.value) })}
                        min={0}
                        max={200}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    )
}

export default ShapeProperties
