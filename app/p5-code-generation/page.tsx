'use client'

import { useState } from 'react'
import P5Canvas from '@/components/P5Canvas'

export default function GenerativeP5() {
    const [prompt, setPrompt] = useState('')
    const [generatedCode, setGeneratedCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const generateAnimation = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/generate-p5', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            })

            if (!response.ok) {
                throw new Error('Failed to generate animation')
            }

            const data = await response.json()
            const code = data.content[0].text

            // Clean up any markdown code blocks
            const cleanCode = code
                .replace(/```javascript\n?/g, '')
                .replace(/```\n?/g, '')
                .trim()

            setGeneratedCode(cleanCode)
        } catch (err) {
            setError('Failed to generate animation')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-white">
                    AI P5.js Generator
                </h1>

                <div className="space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your animation (e.g., 'colorful bouncing balls that leave trails')"
                        className="w-full h-32 p-4 bg-gray-800 text-white rounded-lg"
                    />

                    <button
                        onClick={generateAnimation}
                        disabled={loading || !prompt}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 disabled:bg-gray-600"
                    >
                        {loading ? 'Generating...' : 'Generate Animation'}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-900/50 text-red-200 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>

                {generatedCode && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">
                            Generated Animation
                        </h2>
                        <P5Canvas sketchCode={generatedCode} />

                        {/* Optional: Show the code */}
                        <details className="bg-gray-800 p-4 rounded-lg">
                            <summary className="text-white cursor-pointer">
                                View Code
                            </summary>
                            <pre className="mt-4 text-sm text-gray-300 overflow-x-auto">
                                {generatedCode}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    )
}