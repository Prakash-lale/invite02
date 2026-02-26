/**
 * Google Fonts loader — dynamically loads font CSS from Google Fonts API.
 */

const loadedFonts = new Set()

/**
 * Load a Google Font by name. Idempotent — won't reload if already loaded.
 * @param {string} fontFamily — e.g. "Playfair Display"
 * @param {string[]} weights — e.g. ["400", "700"]
 */
export function loadGoogleFont(fontFamily, weights = ['400', '700']) {
    if (loadedFonts.has(fontFamily)) return

    const weightStr = weights.join(';')
    const familyParam = fontFamily.replace(/\s+/g, '+')
    const url = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weightStr}&display=swap`

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)

    loadedFonts.add(fontFamily)
}

/**
 * Load all project fonts at once.
 */
export function loadAllProjectFonts(fonts) {
    for (const font of fonts) {
        loadGoogleFont(font.name, font.weights || ['400', '700'])
    }
}

/**
 * Check if a font is loaded.
 */
export function isFontLoaded(fontFamily) {
    return loadedFonts.has(fontFamily)
}
