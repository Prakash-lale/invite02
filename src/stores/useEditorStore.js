import { create } from 'zustand'
import { deepClone, generateId, createDefaultTextLayer, createDefaultImageLayer, createDefaultShapeLayer } from '../lib/utils'

const MAX_HISTORY = 50

/**
 * Creates a snapshot of the editor state for undo/redo history.
 */
function createSnapshot(state) {
    return deepClone({
        canvas: state.canvas,
        layers: state.layers,
        templateName: state.templateName,
    })
}

/**
 * useEditorStore — Central Zustand store for the Template Studio editor.
 *
 * Manages: canvas config, layers, selection, undo/redo, preview mode, zoom.
 */
const useEditorStore = create((set, get) => ({
    // ===== Template Metadata =====
    templateId: null,
    templateName: 'Untitled Template',
    occasion: '',
    tags: [],
    language: 'english',
    status: 'draft',

    // ===== Canvas State =====
    canvas: {
        width: 1080,
        height: 1920,
        preset: 'instagram-story',
        background: {
            type: 'solid',
            color: '#FFFFFF',
            gradient: { type: 'linear', angle: 135, stops: ['#FFFFFF', '#F8F9FA'] },
            imageUrl: '',
            imageData: '',
        },
    },

    // ===== Layers =====
    layers: [],
    selectedLayerId: null,

    // ===== Preview =====
    isPreviewMode: false,
    previewData: {},

    // ===== Zoom =====
    zoom: 0.5,

    // ===== Undo/Redo =====
    history: [],
    historyIndex: -1,

    // ----- Private: Push to undo history -----
    _pushHistory: () => {
        const { history, historyIndex } = get()
        const snapshot = createSnapshot(get())
        // Trim future states if we've undone and are now making a new change
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(snapshot)
        // Cap history size
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift()
        }
        set({ history: newHistory, historyIndex: newHistory.length - 1 })
    },

    // ===== Template Metadata Actions =====
    setTemplateName: (name) => set({ templateName: name }),
    setOccasion: (occasion) => set({ occasion }),
    setTags: (tags) => set({ tags }),
    setLanguage: (language) => set({ language }),
    setStatus: (status) => set({ status }),

    // ===== Canvas Actions =====
    setCanvas: (updates) => {
        get()._pushHistory()
        set((state) => ({
            canvas: { ...state.canvas, ...updates },
        }))
    },

    setCanvasBackground: (bgUpdates) => {
        get()._pushHistory()
        set((state) => ({
            canvas: {
                ...state.canvas,
                background: { ...state.canvas.background, ...bgUpdates },
            },
        }))
    },

    // ===== Layer Actions =====
    addLayer: (type) => {
        get()._pushHistory()
        let newLayer
        const layerCount = get().layers.filter((l) => l.type === type).length + 1

        switch (type) {
            case 'text':
                newLayer = createDefaultTextLayer({ name: `Text ${layerCount}` })
                break
            case 'image':
                newLayer = createDefaultImageLayer({ name: `Image ${layerCount}` })
                break
            case 'shape':
                newLayer = createDefaultShapeLayer({ name: `Shape ${layerCount}` })
                break
            default:
                return
        }

        set((state) => ({
            layers: [...state.layers, newLayer],
            selectedLayerId: newLayer.id,
        }))
    },

    removeLayer: (id) => {
        get()._pushHistory()
        set((state) => ({
            layers: state.layers.filter((l) => l.id !== id),
            selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
        }))
    },

    updateLayer: (id, updates) => {
        get()._pushHistory()
        set((state) => ({
            layers: state.layers.map((l) =>
                l.id === id ? { ...l, ...updates } : l
            ),
        }))
    },

    updateLayerText: (id, textUpdates) => {
        get()._pushHistory()
        set((state) => ({
            layers: state.layers.map((l) =>
                l.id === id ? { ...l, text: { ...l.text, ...textUpdates } } : l
            ),
        }))
    },

    updateLayerImage: (id, imageUpdates) => {
        get()._pushHistory()
        set((state) => ({
            layers: state.layers.map((l) =>
                l.id === id ? { ...l, image: { ...l.image, ...imageUpdates } } : l
            ),
        }))
    },

    updateLayerShape: (id, shapeUpdates) => {
        get()._pushHistory()
        set((state) => ({
            layers: state.layers.map((l) =>
                l.id === id ? { ...l, shape: { ...l.shape, ...shapeUpdates } } : l
            ),
        }))
    },

    selectLayer: (id) => set({ selectedLayerId: id }),
    deselectLayer: () => set({ selectedLayerId: null }),

    toggleLayerVisibility: (id) => {
        get()._pushHistory()
        set((state) => ({
            layers: state.layers.map((l) =>
                l.id === id ? { ...l, visible: !l.visible } : l
            ),
        }))
    },

    toggleLayerLock: (id) => {
        get()._pushHistory()
        set((state) => ({
            layers: state.layers.map((l) =>
                l.id === id ? { ...l, locked: !l.locked } : l
            ),
        }))
    },

    renameLayer: (id, name) => {
        set((state) => ({
            layers: state.layers.map((l) =>
                l.id === id ? { ...l, name } : l
            ),
        }))
    },

    duplicateLayer: (id) => {
        get()._pushHistory()
        const layer = get().layers.find((l) => l.id === id)
        if (!layer) return
        const clone = deepClone(layer)
        clone.id = generateId()
        clone.name = `${clone.name} (copy)`
        clone.position = {
            x: clone.position.x + 20,
            y: clone.position.y + 20,
        }
        set((state) => ({
            layers: [...state.layers, clone],
            selectedLayerId: clone.id,
        }))
    },

    reorderLayers: (fromIndex, toIndex) => {
        get()._pushHistory()
        set((state) => {
            const layers = [...state.layers]
            const [moved] = layers.splice(fromIndex, 1)
            layers.splice(toIndex, 0, moved)
            return { layers }
        })
    },

    // Move layer up/down in z-order
    moveLayerUp: (id) => {
        const { layers } = get()
        const idx = layers.findIndex((l) => l.id === id)
        if (idx < layers.length - 1) {
            get().reorderLayers(idx, idx + 1)
        }
    },

    moveLayerDown: (id) => {
        const { layers } = get()
        const idx = layers.findIndex((l) => l.id === id)
        if (idx > 0) {
            get().reorderLayers(idx, idx - 1)
        }
    },

    // ===== Preview Mode =====
    togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
    setPreviewData: (data) => set({ previewData: data }),

    // ===== Zoom =====
    setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),
    zoomIn: () => set((state) => ({ zoom: Math.min(3, state.zoom + 0.1) })),
    zoomOut: () => set((state) => ({ zoom: Math.max(0.1, state.zoom - 0.1) })),
    zoomFit: () => set({ zoom: 0.5 }),

    // ===== Undo/Redo =====
    undo: () => {
        const { history, historyIndex } = get()
        if (historyIndex < 0) return

        const snapshot = history[historyIndex]
        set({
            canvas: deepClone(snapshot.canvas),
            layers: deepClone(snapshot.layers),
            templateName: snapshot.templateName,
            historyIndex: historyIndex - 1,
        })
    },

    redo: () => {
        const { history, historyIndex } = get()
        if (historyIndex >= history.length - 1) return

        const nextSnapshot = history[historyIndex + 1]
        // We need to save current state first, then apply the next
        // Actually for redo, we go forward in history
        if (historyIndex + 2 < history.length) {
            const snapshot = history[historyIndex + 2]
            set({
                canvas: deepClone(snapshot.canvas),
                layers: deepClone(snapshot.layers),
                templateName: snapshot.templateName,
                historyIndex: historyIndex + 1,
            })
        } else {
            // We're at the end, just move the pointer
            set({ historyIndex: historyIndex + 1 })
        }
    },

    canUndo: () => get().historyIndex >= 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    // ===== Serialization =====
    getTemplateJSON: () => {
        const state = get()
        return {
            id: state.templateId || generateId(),
            name: state.templateName,
            occasion: state.occasion,
            tags: state.tags,
            language: state.language,
            status: state.status,
            thumbnailUrl: '',
            canvas: deepClone(state.canvas),
            layers: deepClone(state.layers),
            formFields: [], // Will be populated from useFormFieldStore
            previewData: deepClone(state.previewData),
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'admin',
                version: 1,
            },
        }
    },

    loadTemplateJSON: (json) => {
        set({
            templateId: json.id,
            templateName: json.name || 'Untitled Template',
            occasion: json.occasion || '',
            tags: json.tags || [],
            language: json.language || 'english',
            status: json.status || 'draft',
            canvas: json.canvas || get().canvas,
            layers: json.layers || [],
            previewData: json.previewData || {},
            selectedLayerId: null,
            history: [],
            historyIndex: -1,
        })
    },

    // ===== Reset =====
    resetEditor: () => {
        set({
            templateId: null,
            templateName: 'Untitled Template',
            occasion: '',
            tags: [],
            language: 'english',
            status: 'draft',
            canvas: {
                width: 1080,
                height: 1920,
                preset: 'instagram-story',
                background: {
                    type: 'solid',
                    color: '#FFFFFF',
                    gradient: { type: 'linear', angle: 135, stops: ['#FFFFFF', '#F8F9FA'] },
                    imageUrl: '',
                    imageData: '',
                },
            },
            layers: [],
            selectedLayerId: null,
            isPreviewMode: false,
            previewData: {},
            zoom: 0.5,
            history: [],
            historyIndex: -1,
        })
    },
}))

export default useEditorStore
