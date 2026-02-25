import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiTrash2, FiEdit3, FiClock, FiLayers } from 'react-icons/fi'
import templateStorage from '../lib/templateStorage'

/**
 * StudioHome — Template list page. Shows saved templates and a "Create New" button.
 */
function StudioHome() {
    const navigate = useNavigate()
    const [templates, setTemplates] = useState([])

    useEffect(() => {
        setTemplates(templateStorage.getAll())
    }, [])

    const handleDelete = (id) => {
        if (window.confirm('Delete this template? This cannot be undone.')) {
            templateStorage.delete(id)
            setTemplates(templateStorage.getAll())
        }
    }

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Header */}
            <header className="bg-white border-b border-surface-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-surface-900">DesignMyInvites</h1>
                        <p className="text-xs text-surface-500">Template Studio</p>
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
                    <h2 className="text-sm font-semibold text-surface-700 uppercase tracking-wide">
                        Your Templates
                    </h2>
                    <span className="text-xs text-surface-400">{templates.length} template{templates.length !== 1 ? 's' : ''}</span>
                </div>

                {templates.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                            <FiLayers size={28} className="text-surface-400" />
                        </div>
                        <h3 className="text-sm font-medium text-surface-700 mb-1">
                            No templates yet
                        </h3>
                        <p className="text-xs text-surface-500 mb-6 max-w-sm mx-auto">
                            Create your first invitation template to get started. You can design beautiful invitations with text, images, and shapes.
                        </p>
                        <button
                            onClick={() => navigate('/studio/new')}
                            className="btn btn-primary text-sm"
                        >
                            <FiPlus size={16} />
                            Create Your First Template
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white rounded-xl border border-surface-200 overflow-hidden hover:shadow-md hover:border-brand-200 transition-all duration-200 group cursor-pointer"
                                onClick={() => navigate(`/studio/${template.id}`)}
                            >
                                {/* Preview */}
                                <div
                                    className="aspect-[9/16] relative overflow-hidden"
                                    style={{
                                        backgroundColor: template.canvas?.background?.color || '#f0f0f0',
                                        maxHeight: '200px',
                                    }}
                                >
                                    {/* Mini layer preview */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs text-surface-400">
                                            {template.layers?.length || 0} layer{(template.layers?.length || 0) !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <FiEdit3 size={20} className="text-white drop-shadow-md" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="px-3 py-3">
                                    <h3 className="text-sm font-medium text-surface-800 truncate">
                                        {template.name || 'Untitled'}
                                    </h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1 text-[10px] text-surface-400">
                                            <FiClock size={10} />
                                            {template.metadata?.updatedAt
                                                ? new Date(template.metadata.updatedAt).toLocaleDateString()
                                                : '—'}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(template.id)
                                            }}
                                            className="p-1 rounded hover:bg-red-50 text-surface-400 hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={13} />
                                        </button>
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
