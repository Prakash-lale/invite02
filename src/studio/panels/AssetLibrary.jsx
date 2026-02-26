import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import assetCatalog, { ASSET_CATEGORIES } from '../../lib/assetCatalog'
import useEditorStore from '../../stores/useEditorStore'
import { generateId } from '../../lib/utils'

/**
 * AssetLibrary — Left panel section for browsing and inserting decorative SVG assets
 * (borders, dividers, symbols, decoratives) onto the canvas as image layers.
 */
function AssetLibrary() {
    const [category, setCategory] = useState('all')
    const [search, setSearch] = useState('')
    const addLayerRaw = useEditorStore((s) => s.addLayer)
    const layers = useEditorStore((s) => s.layers)

    const filtered = assetCatalog.filter((asset) => {
        const matchCat = category === 'all' || asset.category === category
        const matchSearch = !search || asset.name.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const handleInsert = (asset) => {
        // Create an image layer with the SVG as a data URI
        const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(asset.svg)}`

        const newLayer = {
            id: generateId(),
            type: 'image',
            name: asset.name,
            visible: true,
            locked: false,
            position: { x: 100, y: 100 },
            dimensions: {
                width: asset.category === 'dividers' ? 400 : 200,
                height: asset.category === 'dividers' ? 40 : 200,
            },
            rotation: 0,
            opacity: 1,
            image: {
                src: svgDataUri,
                objectFit: 'contain',
                borderRadius: 0,
            },
        }

        // Insert via raw state set since we need a fully custom layer
        useEditorStore.getState()._pushHistory()
        useEditorStore.setState((state) => ({
            layers: [...state.layers, newLayer],
            selectedLayerId: newLayer.id,
        }))
    }

    return (
        <div className="space-y-3">
            {/* Search */}
            <div className="relative">
                <FiSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search assets…"
                    className="input-base pl-8"
                />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1">
                {ASSET_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${category === cat.id
                            ? 'bg-brand-100 text-brand-700'
                            : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-3 gap-2">
                {filtered.map((asset) => (
                    <button
                        key={asset.id}
                        onClick={() => handleInsert(asset)}
                        className="aspect-square rounded-lg bg-surface-50 border border-surface-200 hover:border-brand-300 hover:bg-brand-50 transition-all p-3 flex items-center justify-center group"
                        title={asset.name}
                    >
                        <div
                            className="w-full h-full text-surface-600 group-hover:text-brand-600 transition-colors"
                            dangerouslySetInnerHTML={{ __html: asset.svg }}
                        />
                    </button>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="text-xs text-surface-400 text-center py-4">
                    No assets found
                </p>
            )}
        </div>
    )
}

export default AssetLibrary
