import {
    FiAlignLeft, FiAlignCenter, FiAlignRight,
    FiArrowUp, FiArrowDown, FiMinus,
} from 'react-icons/fi'
import useEditorStore from '../../stores/useEditorStore'

/**
 * AlignmentTools — Align selected layer to canvas edges/center.
 * Shows when a layer is selected. Aligns relative to canvas bounds.
 */
function AlignmentTools() {
    const selectedLayerId = useEditorStore((s) => s.selectedLayerId)
    const layers = useEditorStore((s) => s.layers)
    const canvas = useEditorStore((s) => s.canvas)
    const updateLayer = useEditorStore((s) => s.updateLayer)

    const layer = layers.find((l) => l.id === selectedLayerId)
    if (!layer) return null

    const cw = canvas.width
    const ch = canvas.height
    const lw = layer.dimensions.width
    const lh = layer.dimensions.height

    const align = (position) => {
        updateLayer(layer.id, { position: { ...layer.position, ...position } })
    }

    const actions = [
        { icon: FiAlignLeft, title: 'Align Left', fn: () => align({ x: 0 }) },
        { icon: FiAlignCenter, title: 'Center Horizontally', fn: () => align({ x: Math.round((cw - lw) / 2) }) },
        { icon: FiAlignRight, title: 'Align Right', fn: () => align({ x: cw - lw }) },
        { icon: FiArrowUp, title: 'Align Top', fn: () => align({ y: 0 }) },
        { icon: FiMinus, title: 'Center Vertically', fn: () => align({ y: Math.round((ch - lh) / 2) }) },
        { icon: FiArrowDown, title: 'Align Bottom', fn: () => align({ y: ch - lh }) },
    ]

    return (
        <div>
            <label className="label-text">Align to Canvas</label>
            <div className="grid grid-cols-6 gap-1">
                {actions.map(({ icon: Icon, title, fn }) => (
                    <button
                        key={title}
                        onClick={fn}
                        className="btn btn-ghost btn-icon flex items-center justify-center"
                        title={title}
                    >
                        <Icon size={14} />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default AlignmentTools
