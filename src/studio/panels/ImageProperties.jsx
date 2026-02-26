import { FiRotateCw } from 'react-icons/fi'
import useEditorStore from '../../stores/useEditorStore'

/**
 * ImageProperties — Right panel controls for a selected image layer.
 * Includes color tint, drop shadow, flip, and CSS filter controls
 * for decorative SVG elements and uploaded images.
 */
function ImageProperties() {
    const selectedLayerId = useEditorStore((s) => s.selectedLayerId)
    const layers = useEditorStore((s) => s.layers)
    const updateLayer = useEditorStore((s) => s.updateLayer)
    const updateLayerImage = useEditorStore((s) => s.updateLayerImage)

    const layer = layers.find((l) => l.id === selectedLayerId)
    if (!layer || layer.type !== 'image') return null

    const image = layer.image
    const filters = image.filters || {}
    const isSvg = image.src?.includes('data:image/svg')

    const updateFilters = (updates) => {
        updateLayerImage(layer.id, {
            filters: { ...filters, ...updates },
        })
    }

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

            {/* Color Tint (especially useful for SVG elements) */}
            <div>
                <label className="label-text">Color Tint</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="checkbox"
                        checked={!!filters.tintEnabled}
                        onChange={(e) => updateFilters({ tintEnabled: e.target.checked })}
                        className="w-3.5 h-3.5 rounded"
                    />
                    <input
                        type="color"
                        value={filters.tintColor || '#000000'}
                        onChange={(e) => updateFilters({ tintColor: e.target.value, tintEnabled: true })}
                        className="w-8 h-8 rounded cursor-pointer border border-surface-300"
                        disabled={!filters.tintEnabled}
                    />
                    <input
                        type="text"
                        value={filters.tintColor || '#000000'}
                        onChange={(e) => updateFilters({ tintColor: e.target.value })}
                        className="input-base flex-1 text-xs"
                        disabled={!filters.tintEnabled}
                        placeholder="#000000"
                    />
                </div>
                {filters.tintEnabled && (
                    <div className="mt-2">
                        <span className="text-[10px] text-surface-500">Intensity: {Math.round((filters.tintIntensity ?? 1) * 100)}%</span>
                        <input
                            type="range"
                            value={filters.tintIntensity ?? 1}
                            onChange={(e) => updateFilters({ tintIntensity: parseFloat(e.target.value) })}
                            min={0}
                            max={1}
                            step={0.05}
                            className="w-full"
                        />
                    </div>
                )}
            </div>

            {/* Drop Shadow */}
            <div>
                <label className="label-text">Drop Shadow</label>
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        checked={!!filters.shadowEnabled}
                        onChange={(e) => updateFilters({ shadowEnabled: e.target.checked })}
                        className="w-3.5 h-3.5 rounded"
                    />
                    <span className="text-[10px] text-surface-500">{filters.shadowEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                {filters.shadowEnabled && (
                    <div className="space-y-2 pl-1">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-[10px] text-surface-500">X Offset</span>
                                <input
                                    type="number"
                                    value={filters.shadowX ?? 4}
                                    onChange={(e) => updateFilters({ shadowX: parseInt(e.target.value) || 0 })}
                                    className="input-base"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-surface-500">Y Offset</span>
                                <input
                                    type="number"
                                    value={filters.shadowY ?? 4}
                                    onChange={(e) => updateFilters({ shadowY: parseInt(e.target.value) || 0 })}
                                    className="input-base"
                                />
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] text-surface-500">Blur: {filters.shadowBlur ?? 8}px</span>
                            <input
                                type="range"
                                value={filters.shadowBlur ?? 8}
                                onChange={(e) => updateFilters({ shadowBlur: parseInt(e.target.value) })}
                                min={0}
                                max={50}
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <span className="text-[10px] text-surface-500">Color</span>
                            <input
                                type="color"
                                value={filters.shadowColor ?? '#000000'}
                                onChange={(e) => updateFilters({ shadowColor: e.target.value })}
                                className="w-7 h-7 rounded cursor-pointer border border-surface-300"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="h-px bg-surface-200" />

            {/* Flip Controls */}
            <div>
                <label className="label-text">Flip</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => updateFilters({ flipH: !filters.flipH })}
                        className={`btn text-xs flex-1 ${filters.flipH ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        ↔ Horizontal
                    </button>
                    <button
                        onClick={() => updateFilters({ flipV: !filters.flipV })}
                        className={`btn text-xs flex-1 ${filters.flipV ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        ↕ Vertical
                    </button>
                </div>
            </div>

            {/* Brightness & Contrast */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="label-text">Brightness: {Math.round((filters.brightness ?? 100))}%</label>
                    <input
                        type="range"
                        value={filters.brightness ?? 100}
                        onChange={(e) => updateFilters({ brightness: parseInt(e.target.value) })}
                        min={0}
                        max={200}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="label-text">Contrast: {Math.round((filters.contrast ?? 100))}%</label>
                    <input
                        type="range"
                        value={filters.contrast ?? 100}
                        onChange={(e) => updateFilters({ contrast: parseInt(e.target.value) })}
                        min={0}
                        max={200}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Blur */}
            <div>
                <label className="label-text">Blur: {filters.blur ?? 0}px</label>
                <input
                    type="range"
                    value={filters.blur ?? 0}
                    onChange={(e) => updateFilters({ blur: parseInt(e.target.value) })}
                    min={0}
                    max={20}
                    className="w-full"
                />
            </div>

            {/* Reset Filters */}
            {Object.keys(filters).length > 0 && (
                <button
                    onClick={() => updateLayerImage(layer.id, { filters: {} })}
                    className="btn btn-ghost text-xs w-full gap-1 text-surface-500"
                >
                    <FiRotateCw size={12} /> Reset All Effects
                </button>
            )}

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
