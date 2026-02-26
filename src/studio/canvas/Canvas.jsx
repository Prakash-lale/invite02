import { useRef, useCallback, useState, useEffect } from 'react'
import Moveable from 'react-moveable'
import useEditorStore from '../../stores/useEditorStore'

/**
 * Canvas — The central workspace where the invitation template is rendered.
 * Integrates react-moveable for on-canvas drag, resize, and rotate of layers.
 */
function Canvas() {
    const canvas = useEditorStore((s) => s.canvas)
    const zoom = useEditorStore((s) => s.zoom)
    const layers = useEditorStore((s) => s.layers)
    const selectedLayerId = useEditorStore((s) => s.selectedLayerId)
    const selectLayer = useEditorStore((s) => s.selectLayer)
    const deselectLayer = useEditorStore((s) => s.deselectLayer)
    const updateLayer = useEditorStore((s) => s.updateLayer)
    const isPreviewMode = useEditorStore((s) => s.isPreviewMode)
    const previewData = useEditorStore((s) => s.previewData)
    const _pushHistory = useEditorStore((s) => s._pushHistory)
    const setZoom = useEditorStore((s) => s.setZoom)
    const updateLayerText = useEditorStore((s) => s.updateLayerText)

    const canvasRef = useRef(null)
    const wrapperRef = useRef(null)
    const moveableRef = useRef(null)

    // Inline text editing state
    const [editingLayerId, setEditingLayerId] = useState(null)

    const selectedLayer = layers.find((l) => l.id === selectedLayerId)

    const { width, height, background } = canvas

    // Build background style
    const getBackgroundStyle = () => {
        switch (background.type) {
            case 'gradient':
                return {
                    background: `linear-gradient(${background.gradient.angle}deg, ${background.gradient.stops[0]}, ${background.gradient.stops[1]})`,
                }
            case 'image': {
                const imgSrc = background.imageData || background.imageUrl
                return imgSrc
                    ? { backgroundImage: `url(${imgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { backgroundColor: background.color }
            }
            case 'solid':
            default:
                return { backgroundColor: background.color }
        }
    }



    // Handle double-click on text to start inline editing
    const handleTextDoubleClick = useCallback((e, layerId) => {
        e.stopPropagation()
        if (isPreviewMode) return
        const layer = layers.find((l) => l.id === layerId)
        if (layer && !layer.locked && layer.type === 'text') {
            selectLayer(layerId)
            setEditingLayerId(layerId)
        }
    }, [layers, isPreviewMode, selectLayer])

    // Finish inline editing
    const handleTextBlur = useCallback((e, layerId) => {
        const newContent = e.target.innerText
        if (newContent !== undefined) {
            _pushHistory()
            updateLayerText(layerId, { content: newContent })
        }
        setEditingLayerId(null)
    }, [_pushHistory, updateLayerText])

    // Cancel editing when clicking outside
    useEffect(() => {
        if (editingLayerId && !selectedLayerId) {
            setEditingLayerId(null)
        }
    }, [selectedLayerId, editingLayerId])

    // Ctrl+Scroll zoom
    useEffect(() => {
        const wrapper = wrapperRef.current
        if (!wrapper) return
        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                const delta = e.deltaY > 0 ? -0.05 : 0.05
                const currentZoom = useEditorStore.getState().zoom
                setZoom(currentZoom + delta)
            }
        }
        wrapper.addEventListener('wheel', handleWheel, { passive: false })
        return () => wrapper.removeEventListener('wheel', handleWheel)
    }, [setZoom])

    // Build text effect styles
    const getTextEffectStyles = (effects) => {
        if (!effects || effects.length === 0) return {}
        const styles = {}
        const textShadows = []
        for (const effect of effects) {
            switch (effect.type) {
                case 'shadow':
                    textShadows.push(`${effect.offsetX || 2}px ${effect.offsetY || 2}px ${effect.blur || 4}px ${effect.color || 'rgba(0,0,0,0.3)'}`)
                    break
                case 'outline':
                    styles.WebkitTextStroke = `${effect.width || 1}px ${effect.color || '#000'}`
                    break
                case 'glow':
                    textShadows.push(`0 0 ${effect.blur || 10}px ${effect.color || '#fff'}`, `0 0 ${(effect.blur || 10) * 2}px ${effect.color || '#fff'}`)
                    break
            }
        }
        if (textShadows.length > 0) {
            styles.textShadow = textShadows.join(', ')
        }
        return styles
    }

    // Handle layer click → select
    const handleLayerClick = useCallback((e, layerId) => {
        e.stopPropagation()
        const layer = layers.find((l) => l.id === layerId)
        if (layer && !layer.locked && !isPreviewMode) {
            selectLayer(layerId)
        }
    }, [layers, isPreviewMode, selectLayer])

    // Render a single layer on the canvas
    const renderLayer = (layer) => {
        if (!layer.visible) return null

        // Use left/top for positioning, transform only for rotation
        const baseStyle = {
            position: 'absolute',
            left: layer.position.x,
            top: layer.position.y,
            width: layer.dimensions.width,
            height: layer.dimensions.height,
            transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
            opacity: layer.opacity,
            cursor: layer.locked ? 'default' : 'move',
            zIndex: layers.indexOf(layer) + 1,
            pointerEvents: isPreviewMode ? 'none' : 'auto',
        }

        switch (layer.type) {
            case 'text': {
                const textStyle = {
                    ...baseStyle,
                    // Auto height so bounding box hugs text tightly
                    height: 'auto',
                    minHeight: 20,
                    fontFamily: layer.text.fontFamily,
                    fontSize: layer.text.fontSize,
                    fontWeight: layer.text.fontWeight,
                    fontStyle: layer.text.fontStyle,
                    color: layer.text.color,
                    textAlign: layer.text.textAlign,
                    letterSpacing: layer.text.letterSpacing ? `${layer.text.letterSpacing}px` : undefined,
                    lineHeight: layer.text.lineHeight,
                    padding: '4px 2px',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    ...getTextEffectStyles(layer.text.effects),
                }
                const isEditing = editingLayerId === layer.id && !isPreviewMode
                return (
                    <div
                        key={layer.id}
                        data-layer-id={layer.id}
                        className={`studio-layer ${isEditing ? 'studio-layer-editing' : ''}`}
                        style={{
                            ...textStyle,
                            outline: isEditing ? '2px solid var(--color-brand-400)' : undefined,
                            cursor: isEditing ? 'text' : (layer.locked ? 'default' : 'move'),
                        }}
                        onMouseDown={(e) => {
                            if (!isEditing) handleLayerClick(e, layer.id)
                        }}
                        onDoubleClick={(e) => handleTextDoubleClick(e, layer.id)}
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                            if (isEditing) handleTextBlur(e, layer.id)
                        }}
                        onKeyDown={(e) => {
                            if (isEditing) {
                                e.stopPropagation() // Prevent keyboard shortcuts
                                if (e.key === 'Escape') {
                                    e.target.blur()
                                }
                            }
                        }}
                    >
                        {layer.text.content}
                        {/* Form field indicator (edit mode only) */}
                        {layer.text.isFormField && !isPreviewMode && !isEditing && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    fontSize: '10px',
                                    background: 'var(--color-brand-500)',
                                    color: 'white',
                                    borderRadius: '4px',
                                    padding: '1px 4px',
                                    lineHeight: '14px',
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 600,
                                    pointerEvents: 'none',
                                }}
                            >
                                Field
                            </span>
                        )}
                    </div>
                )
            }

            case 'image': {
                const imgFilters = layer.image.filters || {}
                // Build CSS filter string
                const filterParts = []
                if (imgFilters.shadowEnabled) {
                    const sx = imgFilters.shadowX ?? 4
                    const sy = imgFilters.shadowY ?? 4
                    const sb = imgFilters.shadowBlur ?? 8
                    const sc = imgFilters.shadowColor ?? '#000000'
                    filterParts.push(`drop-shadow(${sx}px ${sy}px ${sb}px ${sc})`)
                }
                if (imgFilters.brightness != null && imgFilters.brightness !== 100) {
                    filterParts.push(`brightness(${imgFilters.brightness}%)`)
                }
                if (imgFilters.contrast != null && imgFilters.contrast !== 100) {
                    filterParts.push(`contrast(${imgFilters.contrast}%)`)
                }
                if (imgFilters.blur) {
                    filterParts.push(`blur(${imgFilters.blur}px)`)
                }

                // Flip via scaleX/scaleY
                const scaleX = imgFilters.flipH ? -1 : 1
                const scaleY = imgFilters.flipV ? -1 : 1
                const hasFlip = scaleX !== 1 || scaleY !== 1

                const imgContainerStyle = {
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    filter: filterParts.length > 0 ? filterParts.join(' ') : undefined,
                    transform: hasFlip ? `scaleX(${scaleX}) scaleY(${scaleY})` : undefined,
                }

                return (
                    <div
                        key={layer.id}
                        data-layer-id={layer.id}
                        className="studio-layer"
                        style={baseStyle}
                        onMouseDown={(e) => handleLayerClick(e, layer.id)}
                    >
                        <div style={imgContainerStyle}>
                            {layer.image.src ? (
                                <img
                                    src={layer.image.src}
                                    alt={layer.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: layer.image.objectFit,
                                        borderRadius: layer.image.borderRadius,
                                        pointerEvents: 'none',
                                    }}
                                    draggable={false}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'var(--color-surface-200)',
                                        borderRadius: layer.image.borderRadius,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        color: 'var(--color-surface-500)',
                                    }}
                                >
                                    No image
                                </div>
                            )}
                            {/* Color tint overlay */}
                            {imgFilters.tintEnabled && imgFilters.tintColor && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: imgFilters.tintColor,
                                        opacity: imgFilters.tintIntensity ?? 1,
                                        mixBlendMode: 'multiply',
                                        borderRadius: layer.image.borderRadius,
                                        pointerEvents: 'none',
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )
            }

            case 'shape': {
                const shapeStyle = {
                    ...baseStyle,
                    backgroundColor: layer.shape.fill,
                    border: layer.shape.strokeWidth ? `${layer.shape.strokeWidth}px solid ${layer.shape.stroke}` : 'none',
                    borderRadius: layer.shape.shapeType === 'circle' ? '50%' : layer.shape.borderRadius,
                }
                return (
                    <div
                        key={layer.id}
                        data-layer-id={layer.id}
                        className="studio-layer"
                        style={shapeStyle}
                        onMouseDown={(e) => handleLayerClick(e, layer.id)}
                    />
                )
            }

            default:
                return null
        }
    }

    // Get the DOM target for Moveable
    const getTargetEl = () => {
        if (!selectedLayerId || !canvasRef.current) return null
        return canvasRef.current.querySelector(`[data-layer-id="${selectedLayerId}"]`)
    }

    const targetEl = getTargetEl()

    return (
        <div
            ref={wrapperRef}
            className="studio-canvas-area"
            style={{ backgroundColor: '#e9ecef' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    deselectLayer()
                }
            }}
        >
            {/* Canvas container — scaled by zoom */}
            <div
                style={{
                    width: width * zoom,
                    height: height * zoom,
                    position: 'relative',
                    flexShrink: 0,
                    margin: 'auto',
                }}
            >
                {/* Canvas surface */}
                <div
                    ref={canvasRef}
                    className="studio-canvas-surface"
                    style={{
                        width: width,
                        height: height,
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                        ...getBackgroundStyle(),
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            deselectLayer()
                        }
                    }}
                >
                    {/* Render all layers */}
                    {layers.map((layer) => renderLayer(layer))}
                </div>
            </div>

            {/* Moveable — Interactive handles for selected layer (hidden during inline text editing) */}
            {targetEl && selectedLayer && !selectedLayer.locked && !isPreviewMode && !editingLayerId && (
                <Moveable
                    ref={moveableRef}
                    target={targetEl}

                    /* Features */
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    snappable={true}

                    /* Appearance */
                    edge={false}
                    throttleDrag={0}
                    throttleResize={0}
                    throttleRotate={1}
                    renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
                    rotationPosition="bottom"

                    /* Snapping */
                    snapDirections={{ top: true, left: true, bottom: true, right: true, center: true, middle: true }}
                    elementSnapDirections={{ top: true, left: true, bottom: true, right: true, center: true, middle: true }}
                    snapThreshold={5}
                    isDisplaySnapDigit={true}
                    snapGap={true}
                    snapElement={true}
                    snapCenter={true}
                    horizontalGuidelines={[0, height / 2, height]}
                    verticalGuidelines={[0, width / 2, width]}
                    elementGuidelines={
                        layers
                            .filter((l) => l.id !== selectedLayerId && l.visible)
                            .map((l) => canvasRef.current?.querySelector(`[data-layer-id="${l.id}"]`))
                            .filter(Boolean)
                    }

                    /* Drag handlers — use left/top coordinates */
                    onDragStart={() => { _pushHistory() }}
                    onDrag={(e) => {
                        e.target.style.left = `${e.left}px`
                        e.target.style.top = `${e.top}px`
                    }}
                    onDragEnd={(e) => {
                        if (!selectedLayerId) return
                        updateLayer(selectedLayerId, {
                            position: {
                                x: parseFloat(e.target.style.left) || 0,
                                y: parseFloat(e.target.style.top) || 0,
                            },
                        })
                    }}

                    /* Resize handlers — text layers scale font, non-text resize freely */
                    onResizeStart={(e) => {
                        _pushHistory()
                        if (selectedLayer?.type === 'text') {
                            e.target.__origW = selectedLayer.dimensions.width
                            e.target.__origFontSize = selectedLayer.text.fontSize
                        }
                    }}
                    onResize={(e) => {
                        const isText = selectedLayer?.type === 'text'

                        e.target.style.width = `${e.width}px`
                        e.target.style.left = `${e.drag.left}px`
                        e.target.style.top = `${e.drag.top}px`

                        if (isText && e.target.__origW) {
                            // Text: scale font proportionally, keep height auto
                            const scale = e.width / e.target.__origW
                            const newSize = Math.max(8, Math.round(e.target.__origFontSize * scale))
                            e.target.style.fontSize = `${newSize}px`
                            e.target.style.height = 'auto'
                        } else {
                            // Non-text: resize height normally
                            e.target.style.height = `${e.height}px`
                        }
                    }}
                    onResizeEnd={(e) => {
                        if (!selectedLayerId) return
                        const isText = selectedLayer?.type === 'text'

                        const newWidth = Math.round(parseFloat(e.target.style.width) || selectedLayer.dimensions.width)
                        const pos = {
                            x: parseFloat(e.target.style.left) || 0,
                            y: parseFloat(e.target.style.top) || 0,
                        }

                        if (isText && e.target.__origW) {
                            const scale = newWidth / e.target.__origW
                            const newFontSize = Math.max(8, Math.round(e.target.__origFontSize * scale))
                            // Get actual rendered height after font scale
                            const renderedHeight = e.target.getBoundingClientRect().height / (document.querySelector('.studio-canvas-surface')?.getBoundingClientRect().width / selectedLayer.dimensions?.width || 1)

                            updateLayer(selectedLayerId, {
                                dimensions: { width: newWidth, height: Math.round(e.target.offsetHeight) },
                                position: pos,
                            })
                            useEditorStore.getState().updateLayerText(selectedLayerId, { fontSize: newFontSize })

                            delete e.target.__origW
                            delete e.target.__origFontSize
                        } else {
                            updateLayer(selectedLayerId, {
                                dimensions: {
                                    width: newWidth,
                                    height: Math.round(parseFloat(e.target.style.height) || selectedLayer.dimensions.height),
                                },
                                position: pos,
                            })
                        }
                    }}
                    /* Rotate handlers */
                    onRotateStart={() => { _pushHistory() }}
                    onRotate={(e) => {
                        e.target.style.transform = `rotate(${e.rotation}deg)`
                        // Update store in real-time so property panel syncs
                        if (selectedLayerId) {
                            const rounded = Math.round(e.rotation * 10) / 10
                            useEditorStore.setState((s) => ({
                                layers: s.layers.map((l) =>
                                    l.id === selectedLayerId
                                        ? { ...l, rotation: rounded }
                                        : l
                                ),
                            }))
                        }
                    }}
                    onRotateEnd={() => {}}
                />
            )}
        </div>
    )
}

export default Canvas
