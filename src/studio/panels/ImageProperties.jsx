import useEditorStore from '../../stores/useEditorStore'

/**
 * ImageProperties — Right panel controls for a selected image layer.
 */
function ImageProperties() {
    const selectedLayerId = useEditorStore((s) => s.selectedLayerId)
    const layers = useEditorStore((s) => s.layers)
    const updateLayer = useEditorStore((s) => s.updateLayer)
    const updateLayerImage = useEditorStore((s) => s.updateLayerImage)

    const layer = layers.find((l) => l.id === selectedLayerId)
    if (!layer || layer.type !== 'image') return null

    const image = layer.image

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            updateLayerImage(layer.id, { src: ev.target.result })
        }
        reader.readAsDataURL(file)
    }

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

            {/* Image Source */}
            <div>
                <label className="label-text">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-surface-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-surface-200 file:text-surface-700 hover:file:bg-surface-300 cursor-pointer w-full"
                />
                {image.src && (
                    <div className="mt-2 rounded overflow-hidden border border-surface-200">
                        <img src={image.src} alt="Layer preview" className="w-full h-24 object-cover" />
                    </div>
                )}
            </div>

            {/* Object Fit */}
            <div>
                <label className="label-text">Fit Mode</label>
                <div className="flex gap-1">
                    {['cover', 'contain', 'fill'].map((fit) => (
                        <button
                            key={fit}
                            onClick={() => updateLayerImage(layer.id, { objectFit: fit })}
                            className={`btn text-xs flex-1 capitalize ${image.objectFit === fit ? 'btn-primary' : 'btn-secondary'
                                }`}
                        >
                            {fit}
                        </button>
                    ))}
                </div>
            </div>

            {/* Border Radius */}
            <div>
                <label className="label-text">Corner Radius: {image.borderRadius}px</label>
                <input
                    type="range"
                    value={image.borderRadius}
                    onChange={(e) => updateLayerImage(layer.id, { borderRadius: parseInt(e.target.value) })}
                    min={0}
                    max={200}
                    className="w-full"
                />
            </div>
        </div>
    )
}

export default ImageProperties
