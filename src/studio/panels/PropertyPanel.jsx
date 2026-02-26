import { useState } from 'react'
import { FiSliders, FiList } from 'react-icons/fi'
import useEditorStore from '../../stores/useEditorStore'
import CanvasProperties from './CanvasProperties'
import TextProperties from './TextProperties'
import ImageProperties from './ImageProperties'
import FormFieldPanel from './FormFieldPanel'
import ShapeProperties from './ShapeProperties'
import TemplateMetadata from './TemplateMetadata'
import AlignmentTools from './AlignmentTools'

/**
 * PropertyPanel — Right sidebar with tabs for Properties and Form Fields.
 */
function PropertyPanel() {
    const selectedLayerId = useEditorStore((s) => s.selectedLayerId)
    const layers = useEditorStore((s) => s.layers)
    const [activeTab, setActiveTab] = useState('properties')

    const selectedLayer = layers.find((l) => l.id === selectedLayerId)

    const getPanelTitle = () => {
        if (activeTab === 'fields') return 'Form Fields'
        if (!selectedLayer) return 'Canvas'
        switch (selectedLayer.type) {
            case 'text': return `Text — ${selectedLayer.name}`
            case 'image': return `Image — ${selectedLayer.name}`
            case 'shape': return `Shape — ${selectedLayer.name}`
            default: return 'Properties'
        }
    }

    const renderProperties = () => {
        if (!selectedLayer) return (
            <>
                <CanvasProperties />
                <div className="h-px bg-surface-200 my-3" />
                <TemplateMetadata />
            </>
        )
        let layerProps = null
        switch (selectedLayer.type) {
            case 'text': layerProps = <TextProperties />; break
            case 'image': layerProps = <ImageProperties />; break
            case 'shape': layerProps = <ShapeProperties />; break
            default: layerProps = null
        }
        return (
            <>
                {layerProps}
                <div className="h-px bg-surface-200 my-3" />
                <AlignmentTools />
            </>
        )
    }

    return (
        <div className="studio-right-panel bg-white border-l border-surface-200 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-surface-200">
                <button
                    onClick={() => setActiveTab('properties')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium flex-1 justify-center transition-colors ${activeTab === 'properties'
                        ? 'text-brand-700 border-b-2 border-brand-600 bg-brand-50/50'
                        : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                        }`}
                >
                    <FiSliders size={13} />
                    Properties
                </button>
                <button
                    onClick={() => setActiveTab('fields')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium flex-1 justify-center transition-colors ${activeTab === 'fields'
                        ? 'text-brand-700 border-b-2 border-brand-600 bg-brand-50/50'
                        : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                        }`}
                >
                    <FiList size={13} />
                    Form Fields
                </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                {activeTab === 'properties' ? renderProperties() : <FormFieldPanel />}
            </div>
        </div>
    )
}

export default PropertyPanel
