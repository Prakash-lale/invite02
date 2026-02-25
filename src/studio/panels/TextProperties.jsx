import useEditorStore from '../../stores/useEditorStore'
import DEFAULT_FONTS from '../../lib/defaultFonts'
import { useState } from 'react'

/**
 * TextProperties — Right panel controls for a selected text layer.
 */
function TextProperties() {
    const selectedLayerId = useEditorStore((s) => s.selectedLayerId)
    const layers = useEditorStore((s) => s.layers)
    const updateLayer = useEditorStore((s) => s.updateLayer)
    const updateLayerText = useEditorStore((s) => s.updateLayerText)

    const layer = layers.find((l) => l.id === selectedLayerId)
    if (!layer || layer.type !== 'text') return null

    const text = layer.text
    const hasBinding = text.content && text.content.includes('{{')

    // Shadow effect helpers
    const shadowEffect = text.effects?.find((e) => e.type === 'shadow')
    const [showShadow, setShowShadow] = useState(!!shadowEffect)

    const updateShadow = (updates) => {
        const effects = [...(text.effects || [])]
        const idx = effects.findIndex((e) => e.type === 'shadow')
        if (idx >= 0) {
            effects[idx] = { ...effects[idx], ...updates }
        } else {
            effects.push({ type: 'shadow', color: 'rgba(0,0,0,0.3)', offsetX: 2, offsetY: 2, blur: 4, ...updates })
        }
        updateLayerText(layer.id, { effects })
    }

    const removeShadow = () => {
        const effects = (text.effects || []).filter((e) => e.type !== 'shadow')
        updateLayerText(layer.id, { effects })
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
                            onChange={(e) => updateLayer(layer.id, { dimensions: { ...layer.dimensions, height: parseInt(e.target.value) || 20 } })}
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
                        step={1}
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

            {/* Text Content */}
            <div>
                <label className="label-text">
                    Text Content
                    {hasBinding && (
                        <span className="ml-2 text-[9px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full font-medium normal-case">
                            Dynamic
                        </span>
                    )}
                </label>
                <textarea
                    value={text.content}
                    onChange={(e) => updateLayerText(layer.id, { content: e.target.value })}
                    className="input-base min-h-[60px] resize-y"
                    placeholder='Enter text or use {{fieldName}} for dynamic binding'
                    rows={2}
                />
                {hasBinding && (
                    <p className="text-[10px] text-surface-500 mt-1">
                        {'Use {{fieldName}} syntax to create dynamic text bindings'}
                    </p>
                )}
            </div>

            {/* Font Family */}
            <div>
                <label className="label-text">Font</label>
                <select
                    value={text.fontFamily}
                    onChange={(e) => updateLayerText(layer.id, { fontFamily: e.target.value })}
                    className="input-base"
                >
                    {DEFAULT_FONTS.map((f) => (
                        <option key={f.name} value={f.name} style={{ fontFamily: f.name }}>
                            {f.name} — {f.category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="label-text">Size</label>
                    <input
                        type="number"
                        value={text.fontSize}
                        onChange={(e) => updateLayerText(layer.id, { fontSize: parseInt(e.target.value) || 12 })}
                        className="input-base"
                        min={8}
                        max={200}
                    />
                </div>
                <div>
                    <label className="label-text">Style</label>
                    <div className="flex gap-1">
                        <button
                            onClick={() => updateLayerText(layer.id, { fontWeight: text.fontWeight === 'bold' ? 'normal' : 'bold' })}
                            className={`btn btn-icon text-xs font-bold ${text.fontWeight === 'bold' ? 'bg-brand-100 text-brand-700' : 'btn-ghost'}`}
                            title="Bold"
                        >
                            B
                        </button>
                        <button
                            onClick={() => updateLayerText(layer.id, { fontStyle: text.fontStyle === 'italic' ? 'normal' : 'italic' })}
                            className={`btn btn-icon text-xs italic ${text.fontStyle === 'italic' ? 'bg-brand-100 text-brand-700' : 'btn-ghost'}`}
                            title="Italic"
                        >
                            I
                        </button>
                    </div>
                </div>
            </div>

            {/* Text Color */}
            <div>
                <label className="label-text">Color</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="color"
                        value={text.color}
                        onChange={(e) => updateLayerText(layer.id, { color: e.target.value })}
                        className="w-9 h-9 rounded cursor-pointer border border-surface-300"
                    />
                    <input
                        type="text"
                        value={text.color}
                        onChange={(e) => updateLayerText(layer.id, { color: e.target.value })}
                        className="input-base flex-1"
                    />
                </div>
            </div>

            {/* Text Alignment */}
            <div>
                <label className="label-text">Alignment</label>
                <div className="flex gap-1">
                    {['left', 'center', 'right', 'justify'].map((align) => (
                        <button
                            key={align}
                            onClick={() => updateLayerText(layer.id, { textAlign: align })}
                            className={`btn btn-icon text-xs flex-1 capitalize ${text.textAlign === align ? 'bg-brand-100 text-brand-700' : 'btn-ghost'
                                }`}
                            title={`Align ${align}`}
                        >
                            {align[0].toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Letter Spacing & Line Height */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="label-text">Spacing</label>
                    <input
                        type="number"
                        value={text.letterSpacing}
                        onChange={(e) => updateLayerText(layer.id, { letterSpacing: parseFloat(e.target.value) || 0 })}
                        className="input-base"
                        step={0.5}
                        min={-5}
                        max={20}
                    />
                </div>
                <div>
                    <label className="label-text">Line Height</label>
                    <input
                        type="number"
                        value={text.lineHeight}
                        onChange={(e) => updateLayerText(layer.id, { lineHeight: parseFloat(e.target.value) || 1 })}
                        className="input-base"
                        step={0.1}
                        min={0.5}
                        max={3}
                    />
                </div>
            </div>

            <div className="h-px bg-surface-200" />

            {/* Shadow Effect */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="label-text mb-0">Shadow</label>
                    <button
                        onClick={() => {
                            if (showShadow) { removeShadow(); setShowShadow(false) }
                            else { updateShadow({}); setShowShadow(true) }
                        }}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded ${showShadow ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-500'}`}
                    >
                        {showShadow ? 'ON' : 'OFF'}
                    </button>
                </div>
                {showShadow && (
                    <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={shadowEffect?.color || '#000000'}
                                onChange={(e) => updateShadow({ color: e.target.value })}
                                className="w-7 h-7 rounded cursor-pointer border border-surface-300"
                            />
                            <div className="grid grid-cols-3 gap-1 flex-1">
                                <input type="number" value={shadowEffect?.offsetX || 2} onChange={(e) => updateShadow({ offsetX: parseInt(e.target.value) })} className="input-base text-center" title="X" />
                                <input type="number" value={shadowEffect?.offsetY || 2} onChange={(e) => updateShadow({ offsetY: parseInt(e.target.value) })} className="input-base text-center" title="Y" />
                                <input type="number" value={shadowEffect?.blur || 4} onChange={(e) => updateShadow({ blur: parseInt(e.target.value) })} className="input-base text-center" title="Blur" />
                            </div>
                        </div>
                        <p className="text-[10px] text-surface-400 flex justify-between px-9">
                            <span>X</span><span>Y</span><span>Blur</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TextProperties
