/**
 * Canvas size presets for the Template Studio.
 * Dimensions are in pixels at the design/export resolution.
 */
const CANVAS_PRESETS = [
    { id: 'a4-portrait', name: 'A4 Portrait', width: 2480, height: 3508, category: 'Print' },
    { id: 'a4-landscape', name: 'A4 Landscape', width: 3508, height: 2480, category: 'Print' },
    { id: 'a5-portrait', name: 'A5 Portrait', width: 1748, height: 2480, category: 'Print' },
    { id: 'a5-landscape', name: 'A5 Landscape', width: 2480, height: 1748, category: 'Print' },
    { id: 'square', name: 'Square (1:1)', width: 1080, height: 1080, category: 'Social' },
    { id: 'instagram-post', name: 'Instagram Post', width: 1080, height: 1080, category: 'Social' },
    { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, category: 'Social' },
    { id: 'whatsapp-status', name: 'WhatsApp Status', width: 1080, height: 1920, category: 'Social' },
    { id: 'whatsapp-share', name: 'WhatsApp Share', width: 800, height: 1200, category: 'Social' },
    { id: 'hd-landscape', name: 'HD Landscape', width: 1920, height: 1080, category: 'Digital' },
    { id: 'custom', name: 'Custom', width: 1080, height: 1080, category: 'Custom' },
]

export default CANVAS_PRESETS
