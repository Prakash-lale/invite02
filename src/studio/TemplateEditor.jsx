import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TopToolbar from './toolbar/TopToolbar'
import LayerPanel from './panels/LayerPanel'
import PropertyPanel from './panels/PropertyPanel'
import Canvas from './canvas/Canvas'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import useEditorStore from '../stores/useEditorStore'
import useFormFieldStore from '../stores/useFormFieldStore'
import templateStorage from '../lib/templateStorage'

/**
 * TemplateEditor — Main editor page.
 * Loads existing template from localStorage or starts fresh.
 */
function TemplateEditor() {
    useKeyboardShortcuts()
    const { id } = useParams()
    const loadTemplateJSON = useEditorStore((s) => s.loadTemplateJSON)
    const resetEditor = useEditorStore((s) => s.resetEditor)
    const setFormFields = useFormFieldStore((s) => s.setFormFields)
    const resetFields = useFormFieldStore((s) => s.resetFields)

    // Load template when editing an existing one
    useEffect(() => {
        if (id && id !== 'new') {
            const template = templateStorage.getById(id)
            if (template) {
                loadTemplateJSON(template)
                setFormFields(template.formFields || [])
            }
        } else {
            resetEditor()
            resetFields()
        }
    }, [id])

    return (
        <div className="studio-layout">
            <TopToolbar />
            <LayerPanel />
            <Canvas />
            <PropertyPanel />
        </div>
    )
}

export default TemplateEditor
