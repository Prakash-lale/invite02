import useEditorStore from '../../stores/useEditorStore'

/**
 * Canvas — The central workspace where the invitation template is rendered.
 * Renders the canvas with configured size/background and all visible layers.
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

    const { width, height, background } = canvas

    // Build background style
    const getBackgroundStyle = () => {
        switch (background.type) {
            case 'gradient':
                return {
                    background: `linear-gradient(${background.gradient.angle}deg, ${background.gradient.stops[0]}, ${background.gradient.stops[1]})`,
                }
            case 'image':
                const imgSrc = background.imageData || background.imageUrl
                return imgSrc
                    ? { backgroundImage: `url(${imgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { backgroundColor: background.color }
            case 'solid':
            default:
                return { backgroundColor: background.color }
        }
    }

    // Resolve bindings in text for preview mode
    const resolveText = (text) => {
        if (!isPreviewMode || !text) return text
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return previewData[key] !== undefined ? previewData[key] : match
        })
    }

    // Build text effect styles
    const getTextEffectStyles = (effects) => {
        if (!effects || effects.length === 0) return {}
        const styles = {}
        for (const effect of effects) {
            switch (effect.type) {
                case 'shadow':
                    styles.textShadow = `${effect.offsetX || 2}px ${effect.offsetY || 2}px ${effect.blur || 4}px ${effect.color || 'rgba(0,0,0,0.3)'}`
                    break
                case 'outline':
                    styles.WebkitTextStroke = `${effect.width || 1}px ${effect.color || '#000'}`
                    break
                case 'glow':
                    styles.textShadow = `0 0 ${effect.blur || 10}px ${effect.color || '#fff'}, 0 0 ${(effect.blur || 10) * 2}px ${effect.color || '#fff'}`
                    break
            }
        }
        return styles
    }

    // Render a single layer on the canvas
    const renderLayer = (layer) => {
        if (!layer.visible) return null

        const baseStyle = {
            position: 'absolute',
            left: layer.position.x,
            top: layer.position.y,
            width: layer.dimensions.width,
            height: layer.dimensions.height,
            transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
            opacity: layer.opacity,
            cursor: layer.locked ? 'default' : 'move',
            outline: selectedLayerId === layer.id && !isPreviewMode ? '2px solid var(--color-brand-500)' : 'none',
            outlineOffset: '1px',
            zIndex: layers.indexOf(layer),
            pointerEvents: isPreviewMode ? 'none' : 'auto',
        }

        const handleClick = (e) => {
            e.stopPropagation()
            if (!layer.locked && !isPreviewMode) {
                selectLayer(layer.id)
            }
        }

        switch (layer.type) {
            case 'text': {
                const textStyle = {
                    ...baseStyle,
                    fontFamily: layer.text.fontFamily,
                    fontSize: layer.text.fontSize,
                    fontWeight: layer.text.fontWeight,
                    fontStyle: layer.text.fontStyle,
                    color: layer.text.color,
                    textAlign: layer.text.textAlign,
                    letterSpacing: layer.text.letterSpacing ? `${layer.text.letterSpacing}px` : undefined,
                    lineHeight: layer.text.lineHeight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                        layer.text.textAlign === 'center' ? 'center' :
                            layer.text.textAlign === 'right' ? 'flex-end' : 'flex-start',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    ...getTextEffectStyles(layer.text.effects),
                }
                return (
                    <div
                        key={layer.id}
                        style={textStyle}
                        onClick={handleClick}
                    >
                        {resolveText(layer.text.content)}
                    </div>
                )
            }

            case 'image': {
                return (
                    <div
                        key={layer.id}
                        style={baseStyle}
                        onClick={handleClick}
                    >
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
                return <div key={layer.id} style={shapeStyle} onClick={handleClick} />
            }

            default:
                return null
        }
    }

    return (
        <div
            className="studio-canvas-area flex items-center justify-center overflow-auto relative"
            style={{ backgroundColor: '#e9ecef' }}
            onClick={deselectLayer}
        >
            {/* Canvas container — scaled by zoom */}
            <div
                style={{
                    width: width * zoom,
                    height: height * zoom,
                    position: 'relative',
                    flexShrink: 0,
                }}
            >
                {/* Canvas surface */}
                <div
                    style={{
                        width: width,
                        height: height,
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
                        ...getBackgroundStyle(),
                    }}
                >
                    {/* Render all layers */}
                    {layers.map((layer) => renderLayer(layer))}
                </div>
            </div>
        </div>
    )
}

export default Canvas
