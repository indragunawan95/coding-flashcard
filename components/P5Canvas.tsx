'use client'

import { useRef, useEffect, useState } from 'react'
import type p5 from 'p5'

const P5Canvas = ({ sketchCode }: { sketchCode: string }) => {
    const sketchRef = useRef<HTMLDivElement>(null)
    const [P5, setP5] = useState<typeof p5 | null>(null)

    // Dynamically import p5 only on client side
    useEffect(() => {
        import('p5').then((mod) => setP5(() => mod.default))
    }, [])

    useEffect(() => {
        if (!sketchCode || !sketchRef.current || !P5) return

        // Execute the code string to create sketch function
        const sketch = new Function('p', sketchCode) as (p: p5) => void
        const p5Instance = new P5(sketch, sketchRef.current)

        return () => p5Instance.remove()
    }, [sketchCode, P5])

    return <div ref={sketchRef} />
}

export default P5Canvas