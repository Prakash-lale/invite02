import { useState } from 'react'
import { FiTag, FiX, FiPlus } from 'react-icons/fi'
import useEditorStore from '../../stores/useEditorStore'

const OCCASIONS = [
    '', 'Wedding', 'Birthday', 'Engagement', 'Baby Shower', 'Anniversary',
    'Housewarming', 'Graduation', 'Religious', 'Corporate', 'Festive', 'Other',
]

const LANGUAGES = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'bilingual', label: 'Bilingual' },
]

const STATUSES = [
    { value: 'draft', label: 'Draft', color: 'bg-surface-100 text-surface-600' },
    { value: 'published', label: 'Published', color: 'bg-green-50 text-green-700' },
    { value: 'archived', label: 'Archived', color: 'bg-yellow-50 text-yellow-700' },
]

/**
 * TemplateMetadata — Panel section for managing template metadata:
 * occasion, tags, language, and status.
 */
function TemplateMetadata() {
    const occasion = useEditorStore((s) => s.occasion)
    const tags = useEditorStore((s) => s.tags)
    const language = useEditorStore((s) => s.language)
    const status = useEditorStore((s) => s.status)
    const setOccasion = useEditorStore((s) => s.setOccasion)
    const setTags = useEditorStore((s) => s.setTags)
    const setLanguage = useEditorStore((s) => s.setLanguage)
    const setStatus = useEditorStore((s) => s.setStatus)

    const [tagInput, setTagInput] = useState('')

    const addTag = () => {
        const trimmed = tagInput.trim().toLowerCase()
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed])
        }
        setTagInput('')
    }

    const removeTag = (tag) => {
        setTags(tags.filter((t) => t !== tag))
    }

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag()
        }
    }

    return (
        <div className="space-y-4">
            {/* Status */}
            <div>
                <label className="label-text">Status</label>
                <div className="flex gap-1">
                    {STATUSES.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => setStatus(s.value)}
                            className={`flex-1 text-[11px] font-semibold py-1.5 rounded-md transition-all ${status === s.value
                                ? `${s.color} ring-1 ring-current/20`
                                : 'bg-surface-50 text-surface-400 hover:bg-surface-100'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Occasion */}
            <div>
                <label className="label-text">Occasion</label>
                <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="input-base"
                >
                    <option value="">— Select occasion —</option>
                    {OCCASIONS.filter(Boolean).map((o) => (
                        <option key={o} value={o.toLowerCase()}>{o}</option>
                    ))}
                </select>
            </div>

            {/* Language */}
            <div>
                <label className="label-text">Language</label>
                <div className="flex gap-1">
                    {LANGUAGES.map((l) => (
                        <button
                            key={l.value}
                            onClick={() => setLanguage(l.value)}
                            className={`flex-1 text-[11px] font-medium py-1.5 rounded-md transition-all ${language === l.value
                                ? 'bg-brand-100 text-brand-700'
                                : 'bg-surface-50 text-surface-500 hover:bg-surface-100'
                                }`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="label-text">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-brand-50 text-brand-700 rounded-full"
                        >
                            <FiTag size={10} />
                            {tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="hover:text-danger transition-colors ml-0.5"
                            >
                                <FiX size={10} />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-1">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="input-base flex-1"
                        placeholder="Add tag…"
                    />
                    <button
                        onClick={addTag}
                        disabled={!tagInput.trim()}
                        className="btn btn-ghost btn-icon"
                        title="Add tag"
                    >
                        <FiPlus size={14} />
                    </button>
                </div>
                <p className="text-[10px] text-surface-400 mt-1">
                    Press Enter or comma to add
                </p>
            </div>
        </div>
    )
}

export default TemplateMetadata
