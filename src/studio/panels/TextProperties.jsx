import useEditorStore from '../../stores/useEditorStore'
import DEFAULT_FONTS from '../../lib/defaultFonts'

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

    // --- Effect helpers ---
    const getEffect = (type) => (text.effects || []).find((e) => e.type === type)
    const updateEffect = (type, updates, defaults = {}) => {
        const effects = [...(text.effects || [])]
        const idx = effects.findIndex((e) => e.type === type)
        if (idx >= 0) {
            effects[idx] = { ...effects[idx], ...updates }
        } else {
            effects.push({ type, ...defaults, ...updates })
        }
        updateLayerText(layer.id, { effects })
    }
    const removeEffect = (type) => {
        const effects = (text.effects || []).filter((e) => e.type !== type)
        updateLayerText(layer.id, { effects })
    }

    const shadowEffect = getEffect('shadow')
    const outlineEffect = getEffect('outline')
    const glowEffect = getEffect('glow')

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

            {/* ===== TEXT EFFECTS ===== */}
            <div>
                <label className="label-text mb-3">Effects</label>

                {/* Shadow */}
                <EffectToggle
                    label="Shadow"
                    active={!!shadowEffect}
                    onToggle={(on) => on ? updateEffect('shadow', {}, { color: 'rgba(0,0,0,0.3)', offsetX: 2, offsetY: 2, blur: 4 }) : removeEffect('shadow')}
                >
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={shadowEffect?.color?.startsWith('rgba') ? '#000000' : (shadowEffect?.color || '#000000')}
                            onChange={(e) => updateEffect('shadow', { color: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer border border-surface-300"
                        />
                        <div className="grid grid-cols-3 gap-1 flex-1">
                            <input type="number" value={shadowEffect?.offsetX ?? 2} onChange={(e) => updateEffect('shadow', { offsetX: parseInt(e.target.value) })} className="input-base text-center" title="X offset" />
                            <input type="number" value={shadowEffect?.offsetY ?? 2} onChange={(e) => updateEffect('shadow', { offsetY: parseInt(e.target.value) })} className="input-base text-center" title="Y offset" />
                            <input type="number" value={shadowEffect?.blur ?? 4} onChange={(e) => updateEffect('shadow', { blur: parseInt(e.target.value) })} className="input-base text-center" title="Blur" min={0} />
                        </div>
                    </div>
                    <p className="text-[10px] text-surface-400 flex justify-between px-9">
                        <span>X</span><span>Y</span><span>Blur</span>
                    </p>
                </EffectToggle>

                {/* Outline */}
                <EffectToggle
                    label="Outline"
                    active={!!outlineEffect}
                    onToggle={(on) => on ? updateEffect('outline', {}, { color: '#000000', width: 1 }) : removeEffect('outline')}
                >
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={outlineEffect?.color || '#000000'}
                            onChange={(e) => updateEffect('outline', { color: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer border border-surface-300"
                        />
                        <div className="flex-1">
                            <input
                                type="number"
                                value={outlineEffect?.width ?? 1}
                                onChange={(e) => updateEffect('outline', { width: Math.max(0, parseInt(e.target.value) || 0) })}
                                className="input-base"
                                min={0}
                                max={10}
                                step={1}
                            />
                        </div>
                    </div>
                    <p className="text-[10px] text-surface-400 flex justify-between px-9">
                        <span>Color</span><span>Width (px)</span>
                    </p>
                </EffectToggle>

                {/* Glow */}
                <EffectToggle
                    label="Glow"
                    active={!!glowEffect}
                    onToggle={(on) => on ? updateEffect('glow', {}, { color: '#ffffff', blur: 10 }) : removeEffect('glow')}
                >
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={glowEffect?.color || '#ffffff'}
                            onChange={(e) => updateEffect('glow', { color: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer border border-surface-300"
                        />
                        <div className="flex-1">
                            <input
                                type="number"
                                value={glowEffect?.blur ?? 10}
                                onChange={(e) => updateEffect('glow', { blur: Math.max(0, parseInt(e.target.value) || 0) })}
                                className="input-base"
                                min={0}
                                max={50}
                                step={1}
                            />
                        </div>
                    </div>
                    <p className="text-[10px] text-surface-400 flex justify-between px-9">
                        <span>Color</span><span>Blur (px)</span>
                    </p>
                </EffectToggle>
            </div>
        </div>
    )
}

/**
 * EffectToggle — Reusable toggle card for a text effect.
 */
function EffectToggle({ label, active, onToggle, children }) {
    return (
        <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-surface-700">{label}</span>
                <button
                    onClick={() => onToggle(!active)}
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full transition-colors ${active ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-400 hover:bg-surface-200'
                        }`}
                >
                    {active ? 'ON' : 'OFF'}
                </button>
            </div>
            {active && (
                <div className="space-y-1.5 pl-1 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    )
}

export default TextProperties
