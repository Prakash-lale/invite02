import { useEffect } from 'react'
import useEditorStore from '../stores/useEditorStore'

/**
 * useKeyboardShortcuts — Global keyboard shortcut handler for the Studio.
 * Call this hook in the TemplateEditor component.
 */
function useKeyboardShortcuts() {
    const undo = useEditorStore((s) => s.undo)
    const redo = useEditorStore((s) => s.redo)
    const selectedLayerId = useEditorStore((s) => s.selectedLayerId)
    const removeLayer = useEditorStore((s) => s.removeLayer)
    const duplicateLayer = useEditorStore((s) => s.duplicateLayer)
    const updateLayer = useEditorStore((s) => s.updateLayer)
    const layers = useEditorStore((s) => s.layers)
    const deselectLayer = useEditorStore((s) => s.deselectLayer)

    useEffect(() => {
        const handler = (e) => {
            const tag = e.target.tagName
            const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable

            // Ctrl+Z — Undo
            if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
                e.preventDefault()
                undo()
                return
            }

            // Ctrl+Shift+Z — Redo
            if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
                e.preventDefault()
                redo()
                return
            }

            // Don't intercept shortcuts when typing in inputs
            if (isInput) return

            // Delete / Backspace — Remove selected layer
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId) {
                e.preventDefault()
                removeLayer(selectedLayerId)
                return
            }

            // Ctrl+D — Duplicate selected layer
            if (e.ctrlKey && e.key === 'd' && selectedLayerId) {
                e.preventDefault()
                duplicateLayer(selectedLayerId)
                return
            }

            // Escape — Deselect
            if (e.key === 'Escape') {
                deselectLayer()
                return
            }

            // Arrow keys — Nudge selected layer
            if (selectedLayerId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault()
                const layer = layers.find((l) => l.id === selectedLayerId)
                if (!layer || layer.locked) return
                const step = e.shiftKey ? 10 : 1
                const delta = {
                    ArrowUp: { x: 0, y: -step },
                    ArrowDown: { x: 0, y: step },
                    ArrowLeft: { x: -step, y: 0 },
                    ArrowRight: { x: step, y: 0 },
                }[e.key]
                updateLayer(selectedLayerId, {
                    position: {
                        x: layer.position.x + delta.x,
                        y: layer.position.y + delta.y,
                    },
                })
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [undo, redo, selectedLayerId, removeLayer, duplicateLayer, updateLayer, layers, deselectLayer])
}

export default useKeyboardShortcuts
