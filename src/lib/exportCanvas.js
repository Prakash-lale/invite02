import html2canvas from 'html2canvas'

/**
 * Export the canvas to a downloadable PNG or JPEG file.
 *
 * @param {HTMLElement} canvasElement — The .studio-canvas-surface DOM element
 * @param {object} options
 * @param {string} options.filename — Download filename
 * @param {'png'|'jpeg'} options.format — Image format
 * @param {number} options.quality — JPEG quality (0-1), ignored for PNG
 * @param {number} options.scale — Export scale multiplier (1 = native canvas size)
 * @returns {Promise<Blob>} The exported image blob
 */
export async function exportCanvas(canvasElement, options = {}) {
    const {
        filename = 'invitation',
        format = 'png',
        quality = 0.92,
        scale = 2,
    } = options

    if (!canvasElement) {
        throw new Error('Canvas element not found')
    }

    // html2canvas renders the element at its natural size
    const renderedCanvas = await html2canvas(canvasElement, {
        scale: scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        // Remove any transform for clean capture
        onclone: (clonedDoc, clonedElement) => {
            clonedElement.style.transform = 'none'
            clonedElement.style.transformOrigin = 'top left'
            // Hide any Moveable controls that might be in the DOM
            const moveableElements = clonedDoc.querySelectorAll('.moveable-control-box')
            moveableElements.forEach((el) => el.remove())
        },
    })

    // Convert to blob
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
    const blob = await new Promise((resolve) => {
        renderedCanvas.toBlob(resolve, mimeType, quality)
    })

    // Trigger download
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return blob
}

/**
 * Generate a small thumbnail data URL from the canvas surface element.
 * Used for template preview thumbnails in the sidebar and home page.
 *
 * @param {HTMLElement} canvasElement — The .studio-canvas-surface DOM element
 * @param {number} maxWidth — Max thumbnail width in px (default 300)
 * @returns {Promise<string>} Base64 JPEG data URL
 */
export async function generateThumbnail(canvasElement, maxWidth = 300) {
    if (!canvasElement) return ''

    try {
        const rect = canvasElement.getBoundingClientRect()
        const scale = Math.min(maxWidth / rect.width, 1)

        const rendered = await html2canvas(canvasElement, {
            scale,
            useCORS: true,
            allowTaint: false,
            backgroundColor: null,
            logging: false,
            onclone: (clonedDoc, clonedElement) => {
                clonedElement.style.transform = 'none'
                clonedElement.style.transformOrigin = 'top left'
                const moveableElements = clonedDoc.querySelectorAll('.moveable-control-box')
                moveableElements.forEach((el) => el.remove())
            },
        })

        // Return as small JPEG for storage efficiency
        return rendered.toDataURL('image/jpeg', 0.6)
    } catch (e) {
        console.warn('Thumbnail generation failed:', e)
        return ''
    }
}
