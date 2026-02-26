import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiTrash2, FiEdit3, FiClock, FiLayers, FiCopy, FiArchive, FiRefreshCw } from 'react-icons/fi'
import templateStorage from '../lib/templateStorage'
import { generateId, deepClone } from '../lib/utils'

/**
 * StudioHome — Template list page. Shows saved templates and a "Create New" button.
 */
function StudioHome() {
    const navigate = useNavigate()
    const [templates, setTemplates] = useState([])
    const [showArchived, setShowArchived] = useState(false)

    useEffect(() => {
        setTemplates(templateStorage.getAll())
    }, [])

    const handleDelete = (id) => {
        if (window.confirm('Delete this template? This cannot be undone.')) {
            templateStorage.delete(id)
            setTemplates(templateStorage.getAll())
        }
    }

    const handleDuplicate = (e, template) => {
        e.stopPropagation()
        const clone = deepClone(template)
        clone.id = generateId()
        clone.name = `${clone.name} (copy)`
        clone.status = 'draft'
        clone.metadata = {
            ...clone.metadata,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        templateStorage.save(clone)
        setTemplates(templateStorage.getAll())
    }

    const handleToggleArchive = (e, template) => {
        e.stopPropagation()
        const newStatus = template.status === 'archived' ? 'draft' : 'archived'
        templateStorage.updateField(template.id, 'status', newStatus)
        setTemplates(templateStorage.getAll())
    }

    const filteredTemplates = showArchived
        ? templates.filter((t) => t.status === 'archived')
        : templates.filter((t) => t.status !== 'archived')

    const archivedCount = templates.filter((t) => t.status === 'archived').length

    return (
        <div className="studio-home">
            {/* Header */}
            <header className="studio-home-header">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="logo-text">DesignMyInvites</h1>
                        <p className="text-xs text-surface-500 mt-0.5">Template Studio</p>
                    </div>
                    <button
                        onClick={() => navigate('/studio/new')}
                        className="btn btn-primary text-sm"
                    >
                        <FiPlus size={16} />
                        Create Template
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-semibold text-surface-700 uppercase tracking-wide">
                            {showArchived ? 'Archived' : 'Your Templates'}
                        </h2>
                        <span className="text-xs text-surface-400">
                            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    {archivedCount > 0 && (
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${showArchived
                                ? 'bg-brand-100 text-brand-700'
                                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                                }`}
                        >
                            <FiArchive size={12} />
                            {showArchived ? 'Show Active' : `Archive (${archivedCount})`}
                        </button>
                    )}
                </div>

                {filteredTemplates.length === 0 ? (
                    <div className="studio-empty-state animate-fade-in">
                        <div className="empty-icon">
                            {showArchived ? (
                                <FiArchive size={28} className="text-brand-400" />
                            ) : (
                                <FiLayers size={28} className="text-brand-400" />
                            )}
                        </div>
                        <h3>{showArchived ? 'No archived templates' : 'No templates yet'}</h3>
                        <p>
                            {showArchived
                                ? 'Archive templates from the main view to see them here.'
                                : 'Create your first invitation template to get started. Design beautiful invitations with text, images, and shapes.'}
                        </p>
                        {!showArchived && (
                            <button
                                onClick={() => navigate('/studio/new')}
                                className="btn btn-primary text-sm"
                            >
                                <FiPlus size={16} />
                                Create Your First Template
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredTemplates.map((template, i) => (
                            <div
                                key={template.id}
                                className="template-card animate-slide-up group"
                                style={{ animationDelay: `${i * 50}ms` }}
                                onClick={() => navigate(`/studio/${template.id}`)}
                            >
                                {/* Preview */}
                                <div
                                    className="template-card-preview"
                                    style={{
                                        backgroundColor: template.canvas?.background?.color || '#f5f5f5',
                                    }}
                                >
                                    {/* Thumbnail or fallback */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {template.thumbnailUrl ? (
                                            <img
                                                src={template.thumbnailUrl}
                                                alt={template.name || 'Template'}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-xs text-surface-400 font-medium">
                                                {template.layers?.length || 0} layer{(template.layers?.length || 0) !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>

                                    {/* Status badge */}
                                    {template.status && template.status !== 'draft' && (
                                        <div className="absolute top-2 left-2">
                                            <span className={`badge ${template.status === 'published' ? 'badge-published' : 'badge-archived'}`}>
                                                {template.status}
                                            </span>
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <FiEdit3 size={20} className="text-white drop-shadow-md" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="template-card-info">
                                    <h3 className="truncate">{template.name || 'Untitled'}</h3>
                                    {/* Occasions & tags */}
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {template.occasion && template.occasion !== 'other' && (
                                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-600 capitalize">
                                                {template.occasion.replace('-', ' ')}
                                            </span>
                                        )}
                                        {template.tags?.slice(0, 2).map((tag) => (
                                            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-100 text-surface-500">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] text-surface-400">
                                            <FiClock size={10} />
                                            {template.metadata?.updatedAt
                                                ? new Date(template.metadata.updatedAt).toLocaleDateString()
                                                : '—'}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleDuplicate(e, template)}
                                                className="p-1 rounded hover:bg-brand-50 text-surface-400 hover:text-brand-600 transition-colors"
                                                title="Duplicate"
                                            >
                                                <FiCopy size={13} />
                                            </button>
                                            <button
                                                onClick={(e) => handleToggleArchive(e, template)}
                                                className="p-1 rounded hover:bg-yellow-50 text-surface-400 hover:text-yellow-600 transition-colors"
                                                title={template.status === 'archived' ? 'Unarchive' : 'Archive'}
                                            >
                                                {template.status === 'archived' ? <FiRefreshCw size={13} /> : <FiArchive size={13} />}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(template.id)
                                                }}
                                                className="p-1 rounded hover:bg-red-50 text-surface-400 hover:text-danger transition-colors"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default StudioHome
