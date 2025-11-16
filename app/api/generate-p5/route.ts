import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json()

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            )
        }

        const apiKey = process.env.ANTHROPIC_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            )
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 4000,
                messages: [{
                    role: 'user',
                    content: `Generate p5.js sketch code for: ${prompt}

            IMPORTANT: Return ONLY the code that goes inside the sketch function.
            Include setup, draw, and any other p5 functions.
            Use the pattern:

            p.setup = () => { ... }
            p.draw = () => { ... }

            Do NOT include:
            - imports
            - React code
            - the outer sketch function wrapper
            - any markdown formatting

            Return ONLY valid JavaScript code.`
                }]
            })
        })

        if (!response.ok) {
            const error = await response.json()
            return NextResponse.json(
                { error: 'Failed to generate animation', details: error },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.error('Error generating p5 code:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
