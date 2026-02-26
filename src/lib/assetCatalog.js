/**
 * assetCatalog.js — Built-in decorative SVG assets for the invitation studio.
 * Organized by category: borders, dividers, symbols, decoratives.
 * Each asset is an inline SVG string for easy rendering.
 */

const assetCatalog = [
    // ===== DIVIDERS =====
    {
        id: 'divider-classic',
        name: 'Classic Divider',
        category: 'dividers',
        svg: `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="80" y2="10" stroke="currentColor" stroke-width="1"/><circle cx="100" cy="10" r="3" fill="currentColor"/><line x1="120" y1="10" x2="200" y2="10" stroke="currentColor" stroke-width="1"/></svg>`,
    },
    {
        id: 'divider-ornate',
        name: 'Ornate Divider',
        category: 'dividers',
        svg: `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="70" y2="10" stroke="currentColor" stroke-width="1"/><path d="M80 10 L90 5 L100 10 L90 15Z" fill="currentColor"/><path d="M100 10 L110 5 L120 10 L110 15Z" fill="currentColor"/><line x1="130" y1="10" x2="200" y2="10" stroke="currentColor" stroke-width="1"/></svg>`,
    },
    {
        id: 'divider-dots',
        name: 'Dot Divider',
        category: 'dividers',
        svg: `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="10" r="2" fill="currentColor"/><circle cx="80" cy="10" r="2" fill="currentColor"/><circle cx="100" cy="10" r="3" fill="currentColor"/><circle cx="120" cy="10" r="2" fill="currentColor"/><circle cx="140" cy="10" r="2" fill="currentColor"/></svg>`,
    },
    {
        id: 'divider-wave',
        name: 'Wave Divider',
        category: 'dividers',
        svg: `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 10 Q25 0 50 10 Q75 20 100 10 Q125 0 150 10 Q175 20 200 10" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
    },

    // ===== SYMBOLS =====
    {
        id: 'symbol-heart',
        name: 'Heart',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 88 C25 65 5 50 5 30 C5 15 18 5 30 5 C38 5 45 9 50 16 C55 9 62 5 70 5 C82 5 95 15 95 30 C95 50 75 65 50 88Z" fill="currentColor"/></svg>`,
    },
    {
        id: 'symbol-star',
        name: 'Star',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 63,38 98,38 70,60 80,95 50,73 20,95 30,60 2,38 37,38" fill="currentColor"/></svg>`,
    },
    {
        id: 'symbol-flower',
        name: 'Flower',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="30" r="15" fill="currentColor" opacity="0.8"/><circle cx="30" cy="50" r="15" fill="currentColor" opacity="0.8"/><circle cx="70" cy="50" r="15" fill="currentColor" opacity="0.8"/><circle cx="40" cy="70" r="15" fill="currentColor" opacity="0.8"/><circle cx="60" cy="70" r="15" fill="currentColor" opacity="0.8"/><circle cx="50" cy="50" r="10" fill="currentColor"/></svg>`,
    },
    {
        id: 'symbol-om',
        name: 'Om',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50" y="75" font-size="72" text-anchor="middle" fill="currentColor" font-family="serif">ॐ</text></svg>`,
    },
    {
        id: 'symbol-ganesh',
        name: 'Shree',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50" y="75" font-size="64" text-anchor="middle" fill="currentColor" font-family="serif">श्री</text></svg>`,
    },

    // ===== DECORATIVES =====
    {
        id: 'deco-corner-tl',
        name: 'Corner Flourish',
        category: 'decoratives',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M5 95 L5 50 Q5 5 50 5 L95 5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 95 L5 60 Q5 20 40 15" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/><circle cx="5" cy="95" r="3" fill="currentColor"/></svg>`,
    },
    {
        id: 'deco-wreath',
        name: 'Simple Wreath',
        category: 'decoratives',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 5 Q15 25 15 50 Q15 75 50 95" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M50 5 Q85 25 85 50 Q85 75 50 95" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M25 25 Q35 20 40 30" fill="none" stroke="currentColor" stroke-width="1"/><path d="M75 25 Q65 20 60 30" fill="none" stroke="currentColor" stroke-width="1"/><path d="M20 50 Q30 45 35 55" fill="none" stroke="currentColor" stroke-width="1"/><path d="M80 50 Q70 45 65 55" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
    },
    {
        id: 'deco-mandala',
        name: 'Mini Mandala',
        category: 'decoratives',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.3"/><circle cx="50" cy="50" r="5" fill="currentColor"/><line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" stroke-width="0.5"/><line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="0.5"/><line x1="22" y1="22" x2="78" y2="78" stroke="currentColor" stroke-width="0.5"/><line x1="78" y1="22" x2="22" y2="78" stroke="currentColor" stroke-width="0.5"/></svg>`,
    },

    // ===== BORDERS =====
    {
        id: 'border-simple',
        name: 'Simple Border',
        category: 'borders',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" stroke-width="2" rx="2"/></svg>`,
    },
    {
        id: 'border-double',
        name: 'Double Border',
        category: 'borders',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="94" height="94" fill="none" stroke="currentColor" stroke-width="1.5" rx="2"/><rect x="8" y="8" width="84" height="84" fill="none" stroke="currentColor" stroke-width="1" rx="1"/></svg>`,
    },
    {
        id: 'border-dashed',
        name: 'Dashed Border',
        category: 'borders',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 3" rx="3"/></svg>`,
    },
]

export default assetCatalog

export const ASSET_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'dividers', label: 'Dividers' },
    { id: 'symbols', label: 'Symbols' },
    { id: 'decoratives', label: 'Decoratives' },
    { id: 'borders', label: 'Borders' },
]
