import { generateId } from './utils'

const STORAGE_KEY = 'dmi_templates'

/**
 * Template storage using localStorage (will migrate to Supabase later).
 */
const templateStorage = {
    /** @returns {Array} All templates */
    getAll() {
        try {
            const data = localStorage.getItem(STORAGE_KEY)
            return data ? JSON.parse(data) : []
        } catch {
            return []
        }
    },

    /** @returns {Object|null} Get a single template by ID */
    getById(id) {
        const templates = this.getAll()
        return templates.find((t) => t.id === id) || null
    },

    /** Save a template (create or update) */
    save(template) {
        const templates = this.getAll()
        const now = new Date().toISOString()
        const idx = templates.findIndex((t) => t.id === template.id)

        if (idx >= 0) {
            // Update existing
            templates[idx] = {
                ...template,
                metadata: {
                    ...template.metadata,
                    updatedAt: now,
                    version: (template.metadata?.version || 0) + 1,
                },
            }
        } else {
            // Create new
            templates.push({
                ...template,
                id: template.id || generateId(),
                metadata: {
                    ...template.metadata,
                    createdAt: now,
                    updatedAt: now,
                    createdBy: 'admin',
                    version: 1,
                },
            })
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
        return templates[idx >= 0 ? idx : templates.length - 1]
    },

    /** Delete a template by ID */
    delete(id) {
        const templates = this.getAll().filter((t) => t.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
    },

    /** Delete all templates */
    clear() {
        localStorage.removeItem(STORAGE_KEY)
    },
}

export default templateStorage
