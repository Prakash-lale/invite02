import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TopToolbar from './toolbar/TopToolbar'
import SidebarShell from './panels/SidebarShell'
import PropertyPanel from './panels/PropertyPanel'
import Canvas from './canvas/Canvas'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import useEditorStore from '../stores/useEditorStore'
import templateStorage from '../lib/templateStorage'

/**
 * TemplateEditor — Main editor page.
 * Loads existing template from localStorage or starts fresh.
 * Form fields are now part of text layer data — no separate store needed.
 */
function TemplateEditor() {
    useKeyboardShortcuts()
    const { id } = useParams()
    const loadTemplateJSON = useEditorStore((s) => s.loadTemplateJSON)
    const resetEditor = useEditorStore((s) => s.resetEditor)

    // Load template when editing an existing one
    useEffect(() => {
        if (id && id !== 'new') {
            const template = templateStorage.getById(id)
            if (template) {
                loadTemplateJSON(template)
            }
        } else {
            resetEditor()
        }
    }, [id])

    return (
        <div className="studio-layout">
            <TopToolbar />
            <SidebarShell />
            <Canvas />
            <PropertyPanel />
        </div>
    )
}

export default TemplateEditor
