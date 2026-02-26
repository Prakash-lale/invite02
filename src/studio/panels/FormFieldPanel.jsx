import { FiList, FiToggleLeft, FiToggleRight, FiType } from 'react-icons/fi'
import useEditorStore from '../../stores/useEditorStore'

const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'date', label: 'Date' },
    { value: 'time', label: 'Time' },
    { value: 'select', label: 'Dropdown' },
    { value: 'number', label: 'Number' },
    { value: 'tel', label: 'Phone' },
    { value: 'url', label: 'URL' },
]

/**
 * FormFieldPanel — Lists all text layers on the canvas.
 * Each text layer can be toggled as a "form field" that end users can fill on the storefront.
 * The text content IS the default/sample value — no {{binding}} syntax needed.
 */
function FormFieldPanel() {
    const layers = useEditorStore((s) => s.layers)
    const updateLayerText = useEditorStore((s) => s.updateLayerText)
    const selectLayer = useEditorStore((s) => s.selectLayer)

    const textLayers = layers.filter((l) => l.type === 'text')
    const formFieldCount = textLayers.filter((l) => l.text.isFormField).length

    if (textLayers.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FiList size={14} className="text-surface-600" />
                    <span className="text-xs font-semibold text-surface-700 uppercase tracking-wide">Form Fields</span>
                </div>
                <div className="text-center py-8">
                    <FiType size={24} className="text-surface-300 mx-auto mb-2" />
                    <p className="text-xs text-surface-400">Add text layers on the canvas first</p>
                    <p className="text-[10px] text-surface-400 mt-1">Then toggle them as form fields here</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiList size={14} className="text-surface-600" />
                    <span className="text-xs font-semibold text-surface-700 uppercase tracking-wide">Form Fields</span>
                </div>
                <span className="text-[10px] text-surface-400 font-medium">
                    {formFieldCount} of {textLayers.length}
                </span>
            </div>

            <p className="text-[10px] text-surface-500 leading-relaxed">
                Toggle text layers as form fields. Users will be able to customize these when using the template.
            </p>

            {/* Text Layer List */}
            <div className="space-y-2">
                {textLayers.map((layer) => {
                    const text = layer.text
                    const isActive = text.isFormField

                    return (
                        <div
                            key={layer.id}
                            className={`border rounded-lg p-3 transition-all ${
                                isActive
                                    ? 'border-brand-300 bg-brand-50/50'
                                    : 'border-surface-200 bg-surface-50 hover:border-surface-300'
                            }`}
                        >
                            {/* Row 1: Text preview + Toggle */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => selectLayer(layer.id)}
                                    className="flex-1 text-left truncate text-xs text-surface-700 font-medium hover:text-brand-600 transition-colors"
                                    title={`Select "${text.content}" on canvas`}
                                >
                                    {text.content || 'Empty text'}
                                </button>
                                <button
                                    onClick={() => updateLayerText(layer.id, { isFormField: !isActive })}
                                    className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full transition-all ${
                                        isActive
                                            ? 'bg-brand-500 text-white'
                                            : 'bg-surface-200 text-surface-500 hover:bg-surface-300'
                                    }`}
                                    title={isActive ? 'Remove as form field' : 'Make form field'}
                                >
                                    {isActive ? <FiToggleRight size={12} /> : <FiToggleLeft size={12} />}
                                    {isActive ? 'ON' : 'OFF'}
                                </button>
                            </div>

                            {/* Row 2: Form field settings (visible only when active) */}
                            {isActive && (
                                <div className="mt-3 space-y-2 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="text-[9px] text-surface-400 font-medium uppercase">Label</span>
                                            <input
                                                type="text"
                                                value={text.formFieldLabel || ''}
                                                onChange={(e) => updateLayerText(layer.id, { formFieldLabel: e.target.value })}
                                                className="input-base text-xs"
                                                placeholder={text.content || 'Field label'}
                                            />
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-surface-400 font-medium uppercase">Type</span>
                                            <select
                                                value={text.formFieldType || 'text'}
                                                onChange={(e) => updateLayerText(layer.id, { formFieldType: e.target.value })}
                                                className="input-base text-xs"
                                            >
                                                {FIELD_TYPES.map((t) => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={text.formFieldRequired || false}
                                            onChange={(e) => updateLayerText(layer.id, { formFieldRequired: e.target.checked })}
                                            className="rounded border-surface-300"
                                        />
                                        <span className="text-xs text-surface-600">Required</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FormFieldPanel
