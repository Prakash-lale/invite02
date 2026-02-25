import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StudioHome from './studio/StudioHome'
import TemplateEditor from './studio/TemplateEditor'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root to Studio for Phase 1 */}
                <Route path="/" element={<Navigate to="/studio" replace />} />

                {/* Studio Routes */}
                <Route path="/studio" element={<StudioHome />} />
                <Route path="/studio/new" element={<TemplateEditor />} />
                <Route path="/studio/edit/:id" element={<TemplateEditor />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
