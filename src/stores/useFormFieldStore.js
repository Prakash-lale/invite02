import { create } from 'zustand'
import { generateId } from '../lib/utils'

/**
 * useFormFieldStore — Manages the form fields array for the current template.
 * Form fields define what end users will fill out on the Storefront.
 */
const useFormFieldStore = create((set, get) => ({
    formFields: [],

    addField: () => {
        const count = get().formFields.length + 1
        const newField = {
            id: `field_${count}`,
            label: `Field ${count}`,
            type: 'text',
            placeholder: '',
            required: false,
            defaultValue: '',
            order: count,
        }
        set((state) => ({
            formFields: [...state.formFields, newField],
        }))
    },

    removeField: (id) => {
        set((state) => ({
            formFields: state.formFields.filter((f) => f.id !== id),
        }))
    },

    updateField: (id, updates) => {
        set((state) => ({
            formFields: state.formFields.map((f) =>
                f.id === id ? { ...f, ...updates } : f
            ),
        }))
    },

    reorderFields: (fromIndex, toIndex) => {
        set((state) => {
            const fields = [...state.formFields]
            const [moved] = fields.splice(fromIndex, 1)
            fields.splice(toIndex, 0, moved)
            return { formFields: fields.map((f, i) => ({ ...f, order: i + 1 })) }
        })
    },

    setFormFields: (fields) => set({ formFields: fields }),

    resetFields: () => set({ formFields: [] }),
}))

export default useFormFieldStore
