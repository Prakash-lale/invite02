import CANVAS_PRESETS from '../../lib/canvasPresets'
import useEditorStore from '../../stores/useEditorStore'

/**
 * CanvasProperties — Controls for canvas size and background.
 * Shown in the right panel when no layer is selected.
 */
function CanvasProperties() {
    const canvas = useEditorStore((s) => s.canvas)
    const setCanvas = useEditorStore((s) => s.setCanvas)
    const setCanvasBackground = useEditorStore((s) => s.setCanvasBackground)

    const handlePresetChange = (e) => {
        const preset = CANVAS_PRESETS.find((p) => p.id === e.target.value)
        if (preset && preset.id !== 'custom') {
            setCanvas({ width: preset.width, height: preset.height, preset: preset.id })
        } else {
            setCanvas({ preset: 'custom' })
        }
    }

    const handleBgTypeChange = (type) => {
        setCanvasBackground({ type })
    }

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            setCanvasBackground({ type: 'image', imageData: ev.target.result })
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="space-y-5">
            {/* Canvas Size */}
            <div>
                <label className="label-text">Canvas Size</label>
                <select
                    value={canvas.preset}
                    onChange={handlePresetChange}
                    className="input-base"
                >
                    {CANVAS_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} {p.id !== 'custom' ? `(${p.width}×${p.height})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* Custom Dimensions */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="label-text">Width</label>
                    <input
                        type="number"
                        value={canvas.width}
                        onChange={(e) => setCanvas({ width: parseInt(e.target.value) || 100, preset: 'custom' })}
                        className="input-base"
                        min={100}
                        max={5000}
                    />
                </div>
                <div className="flex-1">
                    <label className="label-text">Height</label>
                    <input
                        type="number"
                        value={canvas.height}
                        onChange={(e) => setCanvas({ height: parseInt(e.target.value) || 100, preset: 'custom' })}
                        className="input-base"
                        min={100}
                        max={5000}
                    />
                </div>
            </div>

            {/* Background Type */}
            <div>
                <label className="label-text">Background</label>
                <div className="flex gap-1 mb-3">
                    {['solid', 'gradient', 'image'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleBgTypeChange(type)}
                            className={`btn text-xs flex-1 capitalize ${canvas.background.type === type ? 'btn-primary' : 'btn-secondary'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Solid Color */}
                {canvas.background.type === 'solid' && (
                    <div>
                        <label className="label-text">Color</label>
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
                                placeholder="#FFFFFF"
                            />
                        </div>
                    </div>
                )}

                {/* Gradient */}
                {canvas.background.type === 'gradient' && (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="label-text">Start</label>
                                <input
                                    type="color"
                                    value={canvas.background.gradient.stops[0]}
                                    onChange={(e) =>
                                        setCanvasBackground({
                                            gradient: {
                                                ...canvas.background.gradient,
                                                stops: [e.target.value, canvas.background.gradient.stops[1]],
                                            },
                                        })
                                    }
                                    className="w-full h-8 rounded cursor-pointer border border-surface-300"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="label-text">End</label>
                                <input
                                    type="color"
                                    value={canvas.background.gradient.stops[1]}
                                    onChange={(e) =>
                                        setCanvasBackground({
                                            gradient: {
                                                ...canvas.background.gradient,
                                                stops: [canvas.background.gradient.stops[0], e.target.value],
                                            },
                                        })
                                    }
                                    className="w-full h-8 rounded cursor-pointer border border-surface-300"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label-text">Angle: {canvas.background.gradient.angle}°</label>
                            <input
                                type="range"
                                value={canvas.background.gradient.angle}
                                onChange={(e) =>
                                    setCanvasBackground({
                                        gradient: { ...canvas.background.gradient, angle: parseInt(e.target.value) },
                                    })
                                }
                                className="w-full"
                                min={0}
                                max={360}
                            />
                        </div>
                    </div>
                )}

                {/* Image Upload */}
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
        </div>
    )
}

export default CanvasProperties
