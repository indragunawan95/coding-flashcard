'use client'

import { useEffect, useRef } from 'react'
import p5 from 'p5'

const Page = () => {
  const sketchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sketchRef.current) return

    const sketch = (p: p5) => {
      // All your global variables go here
      let array: number[] = []
      let steps: any[] = []
      let currentStep = 0
      let animationSpeed = 60
      let isPaused = false
      let frameCounter = 0

      let CHALK_BG: p5.Color, CHALK_WHITE: p5.Color, CHALK_YELLOW: p5.Color
      let CHALK_RED: p5.Color, CHALK_BLUE: p5.Color, CHALK_GREEN: p5.Color, CHALK_ORANGE: p5.Color

      const codeLines = [
        "function quicksort(arr, low, high) {",
        "  if (low < high) {",
        "    pivotIndex = partition(arr, low, high);",
        "    quicksort(arr, low, pivotIndex - 1);",
        "    quicksort(arr, pivotIndex + 1, high);",
        "  }",
        "}",
        "",
        "function partition(arr, low, high) {",
        "  pivot = arr[high];",
        "  i = low - 1;",
        "  for (j = low; j < high; j++) {",
        "    if (arr[j] <= pivot) {",
        "      i++;",
        "      swap(arr[i], arr[j]);",
        "    }",
        "  }",
        "  swap(arr[i + 1], arr[high]);",
        "  return i + 1;",
        "}"
      ]

      // All your functions go here, prefixed with p. where needed
      p.setup = () => {
        CHALK_BG = p.color(26, 58, 26)
        CHALK_WHITE = p.color(240, 240, 232)
        CHALK_YELLOW = p.color(255, 235, 153)
        CHALK_RED = p.color(255, 107, 107)
        CHALK_BLUE = p.color(107, 163, 255)
        CHALK_GREEN = p.color(127, 255, 127)
        CHALK_ORANGE = p.color(255, 179, 102)

        p.createCanvas(1400, 700)
        p.textFont('Courier New')
        resetVisualization()
      }

      p.draw = () => {
        p.background(CHALK_BG)
        drawChalkboardFrame()
        drawTitle()

        if (currentStep < steps.length) {
          drawStepInfo(steps[currentStep])
          drawArray(steps[currentStep])
          drawCodeDisplay(steps[currentStep])

          if (!isPaused) {
            frameCounter++
            if (frameCounter >= animationSpeed) {
              frameCounter = 0
              if (currentStep < steps.length - 1) {
                currentStep++
              }
            }
          }
        } else {
          drawCompletionMessage()
          drawCodeDisplay(null)
        }

        drawControls()
        drawProgressBar()
        drawLegend()
        updateCursor()
      }

      function updateCursor() {
        const y = p.height - 80
        const buttonHeight = 30

        if (p.mouseY > y - buttonHeight / 2 && p.mouseY < y + buttonHeight / 2) {
          if ((p.mouseX > p.width / 2 - 290 && p.mouseX < p.width / 2 - 210 && currentStep > 0) ||
              (p.mouseX > p.width / 2 - 140 && p.mouseX < p.width / 2 - 60) ||
              (p.mouseX > p.width / 2 + 40 && p.mouseX < p.width / 2 + 120 && currentStep < steps.length - 1) ||
              (p.mouseX > p.width / 2 + 180 && p.mouseX < p.width / 2 + 260)) {
            p.cursor('pointer')
          } else {
            p.cursor('default')
          }
        } else {
          p.cursor('default')
        }
      }

      function drawChalkboardFrame() {
        p.stroke(100, 80, 50)
        p.strokeWeight(15)
        p.noFill()
        p.rect(10, 10, p.width - 20, p.height - 20, 5)

        p.stroke(CHALK_WHITE)
        p.strokeWeight(2)
        p.noFill()
        p.rect(20, 20, p.width - 40, p.height - 40)
      }

      function drawTitle() {
        p.fill(CHALK_YELLOW)
        p.noStroke()
        p.textSize(32)
        p.textAlign(p.CENTER)
        p.text('Quicksort Algorithm', p.width / 2, 60)

        p.stroke(CHALK_YELLOW)
        p.strokeWeight(3)
        p.line(p.width / 2 - 180, 70, p.width / 2 + 180, 70)
      }

      function drawStepInfo(step: any) {
        p.fill(CHALK_WHITE)
        p.noStroke()
        p.textSize(16)
        p.textAlign(p.LEFT)

        const boxX = 40
        const boxY = 100
        const boxWidth = 620

        p.fill(CHALK_YELLOW)
        p.textSize(14)
        p.text('Step ' + (currentStep + 1) + ' of ' + steps.length, boxX, boxY)

        p.fill(CHALK_WHITE)
        p.textSize(13)
        const lines = splitTextIntoLines(step.description, boxWidth - 20)
        for (let i = 0; i < lines.length; i++) {
          p.text(lines[i], boxX, boxY + 25 + i * 18)
        }
      }

      function splitTextIntoLines(txt: string, maxWidth: number) {
        const words = txt.split(' ')
        const lines: string[] = []
        let currentLine = ''

        p.textSize(13)
        for (let i = 0; i < words.length; i++) {
          const word = words[i]
          const testLine = currentLine + word + ' '
          if (p.textWidth(testLine) > maxWidth && currentLine.length > 0) {
            lines.push(currentLine.trim())
            currentLine = word + ' '
          } else {
            currentLine = testLine
          }
        }
        lines.push(currentLine.trim())
        return lines
      }

      function drawCodeDisplay(step: any) {
        const codeX = 700
        const codeY = 100
        const codeWidth = 650
        const lineHeight = 22

        p.fill(CHALK_BG)
        p.stroke(CHALK_YELLOW)
        p.strokeWeight(2)
        p.rect(codeX, codeY, codeWidth, 450, 5)

        p.fill(CHALK_YELLOW)
        p.noStroke()
        p.textSize(16)
        p.textAlign(p.LEFT)
        p.text('Algorithm Code:', codeX + 15, codeY + 25)

        const startY = codeY + 50
        p.textSize(13)
        p.textAlign(p.LEFT)

        const highlightLine = step ? step.codeLine : -1

        for (let i = 0; i < codeLines.length; i++) {
          const y = startY + i * lineHeight

          if (highlightLine === i) {
            p.fill(255, 235, 153, 80)
            p.noStroke()
            p.rect(codeX + 5, y - 15, codeWidth - 10, lineHeight - 2, 3)
          }

          p.fill(CHALK_BLUE)
          p.textAlign(p.RIGHT)
          p.text((i + 1).toString(), codeX + 40, y)

          if (highlightLine === i) {
            p.fill(CHALK_YELLOW)
          } else {
            p.fill(CHALK_WHITE)
          }
          p.textAlign(p.LEFT)
          p.text(codeLines[i], codeX + 50, y)
        }
      }

      function drawArray(step: any) {
        const startY = 230
        const barWidth = 40
        const barSpacing = 8
        const maxHeight = 140
        const startX = 40

        for (let i = 0; i < array.length; i++) {
          const x = startX + i * (barWidth + barSpacing)
          const barHeight = p.map(step.array[i], 0, p.max(array), 20, maxHeight)
          const y = startY + maxHeight - barHeight

          let fillColor = CHALK_WHITE
          if (step.pivot === i) {
            fillColor = CHALK_RED
          } else if (step.comparing && step.comparing.indexOf(i) !== -1) {
            fillColor = CHALK_YELLOW
          } else if (step.swapping && step.swapping.indexOf(i) !== -1) {
            fillColor = CHALK_ORANGE
          } else if (step.sorted && step.sorted.indexOf(i) !== -1) {
            fillColor = CHALK_GREEN
          } else if (step.partition && i >= step.partition.low && i <= step.partition.high) {
            fillColor = CHALK_BLUE
          }

          p.fill(fillColor)
          p.noStroke()
          p.rect(x, y, barWidth, barHeight, 3)

          p.fill(CHALK_BG)
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(16)
          p.text(step.array[i], x + barWidth / 2, y + barHeight / 2)

          p.fill(CHALK_WHITE)
          p.textSize(11)
          p.text(i, x + barWidth / 2, startY + maxHeight + 18)

          if (step.pivot === i) {
            p.fill(CHALK_RED)
            p.textSize(10)
            p.text('PIVOT', x + barWidth / 2, y - 10)
          }
          if (step.pointers) {
            if (step.pointers.i === i) {
              p.fill(CHALK_YELLOW)
              p.text('i', x + barWidth / 2, startY + maxHeight + 32)
            }
            if (step.pointers.j === i) {
              p.fill(CHALK_BLUE)
              p.text('j', x + barWidth / 2, startY + maxHeight + 32)
            }
          }
        }

        if (step.partition) {
          p.stroke(CHALK_BLUE)
          p.strokeWeight(2)
          p.noFill()
          const partX = startX + step.partition.low * (barWidth + barSpacing) - 5
          const partWidth = (step.partition.high - step.partition.low + 1) * (barWidth + barSpacing)
          p.rect(partX, startY - 20, partWidth, maxHeight + 40, 5)

          p.fill(CHALK_BLUE)
          p.noStroke()
          p.textSize(11)
          p.textAlign(p.LEFT)
          p.text('Partition [' + step.partition.low + '...' + step.partition.high + ']', partX, startY - 28)
        }
      }

      function drawButton(x: number, y: number, btnWidth: number, btnHeight: number, label: string, enabled: boolean, isHovered: boolean) {
        if (enabled) {
          if (isHovered) {
            p.fill(255, 235, 153, 100)
          } else {
            p.fill(CHALK_BG)
          }
          p.stroke(CHALK_YELLOW)
        } else {
          p.fill(CHALK_BG)
          p.stroke(100, 100, 100)
        }
        p.strokeWeight(2)
        p.rect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 5)

        if (enabled) {
          p.fill(CHALK_YELLOW)
        } else {
          p.fill(100, 100, 100)
        }
        p.noStroke()
        p.textAlign(p.CENTER, p.CENTER)
        p.textSize(14)
        p.text(label, x, y)
      }

      function drawControls() {
        const y = p.height - 80
        const buttonHeight = 30

        const prevHovered = p.mouseY > y - buttonHeight / 2 && p.mouseY < y + buttonHeight / 2 &&
                          p.mouseX > p.width / 2 - 290 && p.mouseX < p.width / 2 - 210
        const pauseHovered = p.mouseY > y - buttonHeight / 2 && p.mouseY < y + buttonHeight / 2 &&
                           p.mouseX > p.width / 2 - 140 && p.mouseX < p.width / 2 - 60
        const nextHovered = p.mouseY > y - buttonHeight / 2 && p.mouseY < y + buttonHeight / 2 &&
                          p.mouseX > p.width / 2 + 40 && p.mouseX < p.width / 2 + 120
        const resetHovered = p.mouseY > y - buttonHeight / 2 && p.mouseY < y + buttonHeight / 2 &&
                           p.mouseX > p.width / 2 + 180 && p.mouseX < p.width / 2 + 260

        drawButton(p.width / 2 - 250, y, 80, buttonHeight, '< Prev', currentStep > 0, prevHovered)
        drawButton(p.width / 2 - 100, y, 80, buttonHeight, isPaused ? 'Resume' : 'Pause', true, pauseHovered)
        drawButton(p.width / 2 + 80, y, 80, buttonHeight, 'Next >', currentStep < steps.length - 1, nextHovered)
        drawButton(p.width / 2 + 220, y, 80, buttonHeight, 'Reset', true, resetHovered)

        p.fill(CHALK_WHITE)
        p.noStroke()
        p.textAlign(p.CENTER, p.CENTER)
        p.textSize(12)
        p.text('Speed: ' + p.map(animationSpeed, 10, 120, 100, 10).toFixed(0) + '%', p.width / 2, y + 25)
      }

      function drawProgressBar() {
        const barY = p.height - 40
        const barWidth = p.width - 100
        const barX = 50
        const progress = currentStep / (steps.length - 1)

        p.noFill()
        p.stroke(CHALK_WHITE)
        p.strokeWeight(2)
        p.rect(barX, barY, barWidth, 15, 5)

        p.fill(CHALK_GREEN)
        p.noStroke()
        p.rect(barX + 2, barY + 2, (barWidth - 4) * progress, 11, 3)
      }

      function drawLegend() {
        const legendX = 40
        let legendY = 410
        const boxSize = 18
        const spacing = 23

        p.textAlign(p.LEFT, p.CENTER)
        p.textSize(12)

        p.fill(CHALK_YELLOW)
        p.text('Legend:', legendX, legendY)
        legendY += spacing

        p.fill(CHALK_RED)
        p.noStroke()
        p.rect(legendX, legendY, boxSize, boxSize, 3)
        p.fill(CHALK_WHITE)
        p.text('Pivot', legendX + boxSize + 10, legendY + boxSize / 2)
        legendY += spacing

        p.fill(CHALK_YELLOW)
        p.rect(legendX, legendY, boxSize, boxSize, 3)
        p.fill(CHALK_WHITE)
        p.text('Comparing', legendX + boxSize + 10, legendY + boxSize / 2)
        legendY += spacing

        p.fill(CHALK_ORANGE)
        p.rect(legendX, legendY, boxSize, boxSize, 3)
        p.fill(CHALK_WHITE)
        p.text('Swapping', legendX + boxSize + 10, legendY + boxSize / 2)
        legendY += spacing

        p.fill(CHALK_BLUE)
        p.rect(legendX, legendY, boxSize, boxSize, 3)
        p.fill(CHALK_WHITE)
        p.text('Partition', legendX + boxSize + 10, legendY + boxSize / 2)
        legendY += spacing

        p.fill(CHALK_GREEN)
        p.rect(legendX, legendY, boxSize, boxSize, 3)
        p.fill(CHALK_WHITE)
        p.text('Sorted', legendX + boxSize + 10, legendY + boxSize / 2)
      }

      function drawCompletionMessage() {
        p.fill(CHALK_GREEN)
        p.textAlign(p.CENTER)
        p.textSize(28)
        p.text('Sorting Complete!', 350, 250)

        p.fill(CHALK_WHITE)
        p.textSize(16)
        p.text('Press Reset to watch again', 350, 290)

        const startY = 330
        const barWidth = 40
        const barSpacing = 8
        const maxHeight = 120
        const startX = 40

        for (let i = 0; i < array.length; i++) {
          const x = startX + i * (barWidth + barSpacing)
          const barHeight = p.map(steps[steps.length - 1].array[i], 0, p.max(array), 20, maxHeight)
          const y = startY + maxHeight - barHeight

          p.fill(CHALK_GREEN)
          p.noStroke()
          p.rect(x, y, barWidth, barHeight, 3)

          p.fill(CHALK_BG)
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(16)
          p.text(steps[steps.length - 1].array[i], x + barWidth / 2, y + barHeight / 2)
        }
      }

      p.keyPressed = () => {
        if (p.key === ' ') {
          isPaused = !isPaused
        } else if (p.key === 'r' || p.key === 'R') {
          resetVisualization()
        } else if (p.keyCode === 38) { // UP_ARROW
          animationSpeed = p.max(10, animationSpeed - 10)
        } else if (p.keyCode === 40) { // DOWN_ARROW
          animationSpeed = p.min(120, animationSpeed + 10)
        } else if (p.keyCode === 37) { // LEFT_ARROW
          if (currentStep > 0) {
            currentStep--
            frameCounter = 0
            isPaused = true
          }
        } else if (p.keyCode === 39) { // RIGHT_ARROW
          if (currentStep < steps.length - 1) {
            currentStep++
            frameCounter = 0
            isPaused = true
          }
        }
      }

      p.mouseClicked = () => {
        const y = p.height - 80
        const buttonHeight = 30

        if (p.mouseY > y - buttonHeight / 2 && p.mouseY < y + buttonHeight / 2) {
          if (p.mouseX > p.width / 2 - 290 && p.mouseX < p.width / 2 - 210 && currentStep > 0) {
            currentStep--
            frameCounter = 0
            isPaused = true
          }
          else if (p.mouseX > p.width / 2 - 140 && p.mouseX < p.width / 2 - 60) {
            isPaused = !isPaused
          }
          else if (p.mouseX > p.width / 2 + 40 && p.mouseX < p.width / 2 + 120 && currentStep < steps.length - 1) {
            currentStep++
            frameCounter = 0
            isPaused = true
          }
          else if (p.mouseX > p.width / 2 + 180 && p.mouseX < p.width / 2 + 260) {
            resetVisualization()
          }
        }
      }

      function resetVisualization() {
        array = []
        for (let i = 0; i < 10; i++) {
          array.push(p.floor(p.random(10, 99)))
        }

        steps = []
        currentStep = 0
        isPaused = false
        frameCounter = 0

        steps.push({
          array: array.slice(),
          description: 'Initial unsorted array. Quicksort works by selecting a pivot and partitioning the array.',
          sorted: [],
          codeLine: -1
        })

        quicksortWithSteps(array.slice(), 0, array.length - 1)
      }

      function quicksortWithSteps(arr: number[], low: number, high: number) {
        if (low < high) {
          steps.push({
            array: arr.slice(),
            description: 'Check if low < high. Starting quicksort on partition [' + low + '...' + high + '].',
            partition: { low: low, high: high },
            sorted: getSortedIndices(arr, low, high),
            codeLine: 1
          })

          const pivotIndex = partition(arr, low, high)

          steps.push({
            array: arr.slice(),
            description: 'Recursively sort left partition [' + low + '...' + (pivotIndex - 1) + '].',
            partition: { low: low, high: pivotIndex - 1 },
            sorted: getSortedIndices(arr, low, high).concat([pivotIndex]),
            codeLine: 3
          })

          quicksortWithSteps(arr, low, pivotIndex - 1)

          steps.push({
            array: arr.slice(),
            description: 'Recursively sort right partition [' + (pivotIndex + 1) + '...' + high + '].',
            partition: { low: pivotIndex + 1, high: high },
            sorted: getSortedIndices(arr, low, high).concat([pivotIndex]),
            codeLine: 4
          })

          quicksortWithSteps(arr, pivotIndex + 1, high)
        } else if (low === high) {
          steps.push({
            array: arr.slice(),
            description: 'Base case: partition has only one element [' + low + '], already sorted.',
            partition: { low: low, high: high },
            sorted: getSortedIndices(arr, low, high).concat([low]),
            codeLine: 1
          })
        }
      }

      function partition(arr: number[], low: number, high: number) {
        const pivot = arr[high]
        let pivotIndex = high

        steps.push({
          array: arr.slice(),
          description: 'Select pivot = arr[' + high + '] = ' + pivot + ' (last element).',
          pivot: pivotIndex,
          partition: { low: low, high: high },
          sorted: getSortedIndices(arr, low, high),
          codeLine: 9
        })

        let i = low - 1

        steps.push({
          array: arr.slice(),
          description: 'Initialize i = ' + i + ' (position of smaller element).',
          pivot: pivotIndex,
          pointers: { i: i, j: low },
          partition: { low: low, high: high },
          sorted: getSortedIndices(arr, low, high),
          codeLine: 10
        })

        for (let j = low; j < high; j++) {
          steps.push({
            array: arr.slice(),
            description: 'Compare arr[' + j + '] = ' + arr[j] + ' with pivot ' + pivot + '.',
            pivot: pivotIndex,
            comparing: [j],
            pointers: { i: i, j: j },
            partition: { low: low, high: high },
            sorted: getSortedIndices(arr, low, high),
            codeLine: 12
          })

          if (arr[j] <= pivot) {
            i++

            steps.push({
              array: arr.slice(),
              description: 'arr[' + j + '] <= pivot, so increment i to ' + i + '.',
              pivot: pivotIndex,
              comparing: [j],
              pointers: { i: i, j: j },
              partition: { low: low, high: high },
              sorted: getSortedIndices(arr, low, high),
              codeLine: 13
            })

            if (i !== j) {
              steps.push({
                array: arr.slice(),
                description: 'Swap arr[' + i + '] = ' + arr[i] + ' with arr[' + j + '] = ' + arr[j] + '.',
                pivot: pivotIndex,
                swapping: [i, j],
                pointers: { i: i, j: j },
                partition: { low: low, high: high },
                sorted: getSortedIndices(arr, low, high),
                codeLine: 14
              })

              const temp = arr[i]
              arr[i] = arr[j]
              arr[j] = temp
              if (i === pivotIndex) pivotIndex = j
              else if (j === pivotIndex) pivotIndex = i
            }
          }
        }

        i++
        steps.push({
          array: arr.slice(),
          description: 'Place pivot in correct position: swap arr[' + i + '] with arr[' + high + '].',
          pivot: pivotIndex,
          swapping: [i, high],
          partition: { low: low, high: high },
          sorted: getSortedIndices(arr, low, high),
          codeLine: 17
        })

        const temp = arr[i]
        arr[i] = arr[high]
        arr[high] = temp

        steps.push({
          array: arr.slice(),
          description: 'Pivot ' + pivot + ' is now at index ' + i + '. Return ' + i + ' as pivot position.',
          pivot: i,
          partition: { low: low, high: high },
          sorted: getSortedIndices(arr, low, high).concat([i]),
          codeLine: 18
        })

        return i
      }

      function getSortedIndices(arr: number[], low: number, high: number) {
        const sorted: number[] = []
        for (let i = 0; i < low; i++) sorted.push(i)
        for (let i = high + 1; i < arr.length; i++) sorted.push(i)
        return sorted
      }
    }

    // Create p5 instance
    const p5Instance = new p5(sketch, sketchRef.current)

    // Cleanup function to remove p5 instance on unmount
    return () => {
      p5Instance.remove()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div ref={sketchRef}></div>
    </div>
  )
}

export default Page
