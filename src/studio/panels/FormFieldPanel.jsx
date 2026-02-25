import { FiPlus, FiTrash2, FiList, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import useFormFieldStore from '../../stores/useFormFieldStore'

const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'date', label: 'Date' },
    { value: 'time', label: 'Time' },
    { value: 'select', label: 'Dropdown' },
    { value: 'number', label: 'Number' },
    { value: 'tel', label: 'Phone' },
    { value: 'url', label: 'URL' },
    { value: 'file', label: 'File Upload' },
]

/**
 * FormFieldPanel — Defines the form fields that end users will see.
 * Each field's ID must match a {{binding}} in a text layer.
 */
function FormFieldPanel() {
    const formFields = useFormFieldStore((s) => s.formFields)
    const addField = useFormFieldStore((s) => s.addField)
    const removeField = useFormFieldStore((s) => s.removeField)
    const updateField = useFormFieldStore((s) => s.updateField)
    const reorderFields = useFormFieldStore((s) => s.reorderFields)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiList size={14} className="text-surface-600" />
                    <span className="text-xs font-semibold text-surface-700 uppercase tracking-wide">Form Fields</span>
                </div>
                <span className="text-xs text-surface-400">{formFields.length}</span>
            </div>

            <p className="text-[10px] text-surface-500 leading-relaxed">
                Define the fields that end users will fill out. Set the <strong>Field ID</strong> to match your <code className="bg-surface-100 px-1 rounded">{'{{binding}}'}</code> in text layers.
            </p>

            {/* Field List */}
            {formFields.length === 0 ? (
                <div className="text-center py-6">
                    <FiList size={20} className="text-surface-300 mx-auto mb-2" />
                    <p className="text-xs text-surface-400">No form fields defined</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {formFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="border border-surface-200 rounded-lg p-3 space-y-2 bg-surface-50"
                        >
                            {/* Row 1: ID + Type + Actions */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={field.id}
                                    onChange={(e) => updateField(field.id, { id: e.target.value.replace(/\s/g, '_') })}
                                    className="input-base flex-1 font-mono text-xs"
                                    placeholder="fieldId"
                                    title="Field ID — must match {{fieldId}} in text layers"
                                />
                                <select
                                    value={field.type}
                                    onChange={(e) => updateField(field.id, { type: e.target.value })}
                                    className="input-base w-24 text-xs"
                                >
                                    {FIELD_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                                <div className="flex gap-0.5">
                                    <button
                                        onClick={() => index > 0 && reorderFields(index, index - 1)}
                                        className="p-1 rounded hover:bg-surface-200 text-surface-500"
                                        disabled={index === 0}
                                    >
                                        <FiChevronUp size={12} />
                                    </button>
                                    <button
                                        onClick={() => index < formFields.length - 1 && reorderFields(index, index + 1)}
                                        className="p-1 rounded hover:bg-surface-200 text-surface-500"
                                        disabled={index === formFields.length - 1}
                                    >
                                        <FiChevronDown size={12} />
                                    </button>
                                    <button
                                        onClick={() => removeField(field.id)}
                                        className="p-1 rounded hover:bg-surface-200 text-danger"
                                    >
                                        <FiTrash2 size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Row 2: Label + Placeholder */}
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                    className="input-base text-xs"
                                    placeholder="Display label"
                                />
                                <input
                                    type="text"
                                    value={field.placeholder}
                                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                    className="input-base text-xs"
                                    placeholder="Placeholder text"
                                />
                            </div>

                            {/* Row 3: Required toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                    className="rounded border-surface-300"
                                />
                                <span className="text-xs text-surface-600">Required</span>
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Field Button */}
            <button onClick={addField} className="btn btn-secondary w-full text-xs">
                <FiPlus size={14} />
                Add Form Field
            </button>
        </div>
    )
}

export default FormFieldPanel
