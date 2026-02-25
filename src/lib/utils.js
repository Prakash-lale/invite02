/**
 * Utility functions for DesignMyInvites v2
 */

/**
 * Generate a unique ID for layers, form fields, etc.
 * Uses crypto.randomUUID with a fallback.
 */
export function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }
    // Fallback
    return 'id-' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}

/**
 * Deep clone an object (for undo history, layer duplication, etc.)
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

/**
 * Replace {{binding}} placeholders in text with values from a data object.
 * @param {string} text - Text containing {{fieldName}} placeholders
 * @param {object} data - Key-value pairs to replace placeholders
 * @returns {string} Text with placeholders replaced
 */
export function resolveBindings(text, data) {
    if (!text || !data) return text
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match
    })
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

/**
 * Create a default text layer object.
 */
export function createDefaultTextLayer(overrides = {}) {
    return {
        id: generateId(),
        type: 'text',
        name: 'Text',
        visible: true,
        locked: false,
        position: { x: 100, y: 100 },
        dimensions: { width: 300, height: 50 },
        rotation: 0,
        opacity: 1,
        text: {
            content: 'New Text',
            binding: '',
            fontFamily: 'Inter',
            fontSize: 24,
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#212529',
            textAlign: 'center',
            letterSpacing: 0,
            lineHeight: 1.4,
            effects: [],
        },
        ...overrides,
    }
}

/**
 * Create a default image layer object.
 */
export function createDefaultImageLayer(overrides = {}) {
    return {
        id: generateId(),
        type: 'image',
        name: 'Image',
        visible: true,
        locked: false,
        position: { x: 100, y: 100 },
        dimensions: { width: 200, height: 200 },
        rotation: 0,
        opacity: 1,
        image: {
            src: '',
            objectFit: 'cover',
            borderRadius: 0,
        },
        ...overrides,
    }
}

/**
 * Create a default shape layer object.
 */
export function createDefaultShapeLayer(overrides = {}) {
    return {
        id: generateId(),
        type: 'shape',
        name: 'Shape',
        visible: true,
        locked: false,
        position: { x: 100, y: 100 },
        dimensions: { width: 200, height: 200 },
        rotation: 0,
        opacity: 1,
        shape: {
            shapeType: 'rectangle',
            fill: '#dee2e6',
            stroke: 'transparent',
            strokeWidth: 0,
            borderRadius: 0,
        },
        ...overrides,
    }
}
