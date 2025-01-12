/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useRef, useState, MouseEvent } from 'react'
import { 
    Crop, 
    Rotate3D, 
    SlidersHorizontal, 
    Save, 
    Palette, 
    Layers,
    Undo2,
    Redo2,
    FlipHorizontal,
    FlipVertical,
    RotateCcw,
    X
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ThumbnailEditorProps {
    imageUrl: string
    onSave: (editedImageUrl: string) => void
    onClose: () => void
}

interface EditState {
    brightness: number
    contrast: number
    saturation: number
    hue: number
    rotation: number
    crop: { x: number; y: number; width: number; height: number }
    backgroundColor: string
    overlay: string
    overlayOpacity: number
    flipX: boolean
    flipY: boolean
    blur: number
    sharpen: number
}

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    currentHandle: string | null;
    originalCrop: CropArea | null;
}

const INITIAL_STATE: EditState = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    rotation: 0,
    crop: { x: 0, y: 0, width: 100, height: 100 },
    backgroundColor: 'transparent',
    overlay: 'none',
    overlayOpacity: 0,
    flipX: false,
    flipY: false,
    blur: 0,
    sharpen: 0
}

const FILTERS = {
    none: 'None',
    grayscale: 'Grayscale',
    sepia: 'Sepia',
    vintage: 'Vintage',
    cool: 'Cool',
    warm: 'Warm',
    dramatic: 'Dramatic',
    cinematic: 'Cinematic'
}

const OVERLAYS = {
    none: 'None',
    'rgba(0,0,0,1)': 'Dark',
    'rgba(255,255,255,1)': 'Light',
    'linear-gradient(45deg, #ff6b6b, #4ecdc4)': 'Gradient 1',
    'linear-gradient(45deg, #a8e6cf, #dcedc1)': 'Gradient 2',
    'linear-gradient(45deg, #3494e6, #ec6ead)': 'Gradient 3'
}

export default function ThumbnailEditor({ imageUrl, onSave, onClose }: ThumbnailEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [activeTab, setActiveTab] = useState('adjust')
    const [editHistory, setEditHistory] = useState<EditState[]>([INITIAL_STATE])
    const [currentEditIndex, setCurrentEditIndex] = useState(0)
    const [selectedFilter, setSelectedFilter] = useState('none')
    const [editState, setEditState] = useState<EditState>(INITIAL_STATE)
    const [showCropOverlay, setShowCropOverlay] = useState(false)
    const [cropArea, setCropArea] = useState<CropArea>({
        x: 0,
        y: 0,
        width: 100,
        height: 100
    })
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentHandle: null,
        originalCrop: null
    });

    const applyEdits = (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
      // Apply background color first
      if (editState.backgroundColor !== 'transparent') {
          ctx.fillStyle = editState.backgroundColor
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      }
  
      // Save the context state before transformations
      ctx.save()
  
      // Move to center, apply transforms, then move back
      ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
      
      // Apply rotation
      ctx.rotate((editState.rotation * Math.PI) / 180)
      
      // Apply flips
      const scaleX = editState.flipX ? -1 : 1
      const scaleY = editState.flipY ? -1 : 1
      ctx.scale(scaleX, scaleY)
  
      // Move back to origin
      ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
  
      // Apply filters
      ctx.filter = `
          brightness(${editState.brightness}%) 
          contrast(${editState.contrast}%)
          saturate(${editState.saturation}%)
          hue-rotate(${editState.hue}deg)
          blur(${editState.blur}px)
          ${selectedFilter !== 'none' ? getFilterStyle(selectedFilter) : ''}
      `
  
      // Draw the image
      ctx.drawImage(
          image,
          editState.crop.x,
          editState.crop.y,
          (image.width * editState.crop.width) / 100,
          (image.height * editState.crop.height) / 100,
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height
      )

      // Apply sharpening if needed
      if (editState.sharpen > 0) {
          const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
          const sharpenedData = applySharpen(imageData, editState.sharpen)
          ctx.putImageData(sharpenedData, 0, 0)
      }
  
      // Apply overlay if present
      if (editState.overlay !== 'none') {
          ctx.globalAlpha = editState.overlayOpacity
          ctx.fillStyle = editState.overlay
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
          ctx.globalAlpha = 1
      }
  
      // Restore the context state
      ctx.restore()
  }

  const applySharpen = (imageData: ImageData, amount: number): ImageData => {
      const data = imageData.data
      const width = imageData.width
      const height = imageData.height
      const factor = amount / 10
      
      // Sharpen kernel
      const kernel = [
          [0, -1 * factor, 0],
          [-1 * factor, 1 + 4 * factor, -1 * factor],
          [0, -1 * factor, 0]
      ]

      const result = new ImageData(new Uint8ClampedArray(data), width, height)
      const resultData = result.data

      // Apply convolution
      for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
              const idx = (y * width + x) * 4
              
              // Apply to RGB channels
              for (let c = 0; c < 3; c++) {
                  let val = 0
                  for (let ky = -1; ky <= 1; ky++) {
                      for (let kx = -1; kx <= 1; kx++) {
                          const pidx = ((y + ky) * width + (x + kx)) * 4
                          val += data[pidx + c] * kernel[ky + 1][kx + 1]
                      }
                  }
                  resultData[idx + c] = Math.min(255, Math.max(0, val))
              }
              resultData[idx + 3] = data[idx + 3] // Keep original alpha
          }
      }

      return result
  }

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        
        if (!canvas || !ctx) return

        const image = new Image()
        image.src = imageUrl
        image.onload = () => {
            canvas.width = image.width
            canvas.height = image.height
            applyEdits(ctx, image)
        }
    }, [imageUrl, editState, selectedFilter])
    
    const initializeCrop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const initialCrop = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
    
        setCropArea(initialCrop);
        setShowCropOverlay(true);
    };

    const handleCropMouseDown = (e: MouseEvent<HTMLDivElement>, handle: string | null = null) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
  
      setDragState({
          isDragging: true,
          startX: (e.clientX - rect.left) * scaleX,
          startY: (e.clientY - rect.top) * scaleY,
          currentHandle: handle,
          originalCrop: { ...cropArea }
      });
    };
  
    const handleCropMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!dragState.isDragging || !canvas || !dragState.originalCrop) return;
  
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
  
      const currentX = (e.clientX - rect.left) * scaleX;
      const currentY = (e.clientY - rect.top) * scaleY;
      const deltaX = currentX - dragState.startX;
      const deltaY = currentY - dragState.startY;
  
      const newCrop = { ...dragState.originalCrop };
  
      if (dragState.currentHandle === null) {
          // Moving the entire crop area
          newCrop.x = Math.max(0, Math.min(canvas.width - newCrop.width, newCrop.x + deltaX));
          newCrop.y = Math.max(0, Math.min(canvas.height - newCrop.height, newCrop.y + deltaY));
      } else {
          // Resizing from handles
          switch (dragState.currentHandle) {
              case 'nw':
                  newCrop.width = Math.max(20, dragState.originalCrop.width - deltaX);
                  newCrop.height = Math.max(20, dragState.originalCrop.height - deltaY);
                  newCrop.x = Math.min(dragState.originalCrop.x + dragState.originalCrop.width - 20, 
                                     dragState.originalCrop.x + deltaX);
                  newCrop.y = Math.min(dragState.originalCrop.y + dragState.originalCrop.height - 20, 
                                     dragState.originalCrop.y + deltaY);
                  break;
              case 'ne':
                  newCrop.width = Math.max(20, dragState.originalCrop.width + deltaX);
                  newCrop.height = Math.max(20, dragState.originalCrop.height - deltaY);
                  newCrop.y = Math.min(dragState.originalCrop.y + dragState.originalCrop.height - 20, 
                                     dragState.originalCrop.y + deltaY);
                  break;
              case 'sw':
                  newCrop.width = Math.max(20, dragState.originalCrop.width - deltaX);
                  newCrop.height = Math.max(20, dragState.originalCrop.height + deltaY);
                  newCrop.x = Math.min(dragState.originalCrop.x + dragState.originalCrop.width - 20, 
                                     dragState.originalCrop.x + deltaX);
                  break;
              case 'se':
                  newCrop.width = Math.max(20, dragState.originalCrop.width + deltaX);
                  newCrop.height = Math.max(20, dragState.originalCrop.height + deltaY);
                  break;
          }
  
          // Ensure crop area stays within canvas bounds
          newCrop.x = Math.max(0, Math.min(canvas.width - newCrop.width, newCrop.x));
          newCrop.y = Math.max(0, Math.min(canvas.height - newCrop.height, newCrop.y));
          newCrop.width = Math.min(canvas.width - newCrop.x, newCrop.width);
          newCrop.height = Math.min(canvas.height - newCrop.y, newCrop.height);
      }
  
      setCropArea(newCrop);
    };
    
    const handleCropMouseUp = () => {
        setDragState({
            isDragging: false,
            startX: 0,
            startY: 0,
            currentHandle: null,
            originalCrop: null
        });
    };

    const applyCrop = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        updateEditState({
            crop: {
                x: (cropArea.x / canvas.width) * 100,
                y: (cropArea.y / canvas.height) * 100,
                width: (cropArea.width / canvas.width) * 100,
                height: (cropArea.height / canvas.height) * 100
            }
        })
        setShowCropOverlay(false)
    }
    
    const getFilterStyle = (filter: string) => {
        switch (filter) {
            case 'grayscale': return 'grayscale(100%)'
            case 'sepia': return 'sepia(100%)'
            case 'vintage': return 'sepia(50%) hue-rotate(-30deg) saturate(140%)'
            case 'cool': return 'hue-rotate(180deg) saturate(120%)'
            case 'warm': return 'sepia(30%) saturate(140%)'
            case 'dramatic': return 'contrast(150%) saturate(120%)'
            case 'cinematic': return 'contrast(130%) saturate(110%) brightness(90%)'
            default: return ''
        }
    }

    const updateEditState = (updates: Partial<EditState>) => {
        const newState = { ...editState, ...updates }
        setEditState(newState)
        
        // Add to history
        const newHistory = editHistory.slice(0, currentEditIndex + 1)
        newHistory.push(newState)
        setEditHistory(newHistory)
        setCurrentEditIndex(newHistory.length - 1)
    }

    const undo = () => {
        if (currentEditIndex > 0) {
        setCurrentEditIndex(currentEditIndex - 1)
        setEditState(editHistory[currentEditIndex - 1])
        }
    }

    const redo = () => {
        if (currentEditIndex < editHistory.length - 1) {
        setCurrentEditIndex(currentEditIndex + 1)
        setEditState(editHistory[currentEditIndex + 1])
        }
    }

    const resetEdits = () => {
        setEditState(INITIAL_STATE)
        setSelectedFilter('none')
        setEditHistory([INITIAL_STATE])
        setCurrentEditIndex(0)
    }

    const handleSave = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const editedImageUrl = canvas.toDataURL('image/jpeg', 0.9)
        onSave(editedImageUrl)
    }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-5xl w-full max-h-[100vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium dark:text-slate-100">Edit Image</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={undo}
              disabled={currentEditIndex <= 0}
              className="dark:hover:bg-slate-700"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={redo}
              disabled={currentEditIndex >= editHistory.length - 1}
              className="dark:hover:bg-slate-700"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={resetEdits}
              className="text-red-500 dark:hover:bg-red-400"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="dark:hover:bg-slate-700" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        <div className="flex gap-2 sm:flex-row flex-col">
            <div className="flex-1 relative"> {/* This wrapper is important for absolute positioning */}
                <canvas
                    ref={canvasRef}
                    className="max-w-lg w-full h-auto border rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                />
                {showCropOverlay && (
                    <div 
                        className="absolute inset-0 bg-black/50"
                        onMouseMove={handleCropMouseMove}
                        onMouseUp={handleCropMouseUp}
                        onMouseLeave={handleCropMouseUp}
                    >
                        <div
                            className="absolute cursor-move select-none"
                            style={{
                                left: `${(cropArea.x / canvasRef.current!.width) * 100}%`,
                                top: `${(cropArea.y / canvasRef.current!.height) * 100}%`,
                                width: `${(cropArea.width / canvasRef.current!.width) * 100}%`,
                                height: `${(cropArea.height / canvasRef.current!.height) * 100}%`,
                                border: '2px solid white',
                                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                            }}
                            onMouseDown={e => handleCropMouseDown(e)}
                        >
                            {['nw', 'ne', 'sw', 'se'].map(handle => (
                                <div
                                    key={handle}
                                    className="absolute w-4 h-4 bg-white border-2 border-slate-800 rounded-full cursor-pointer"
                                    style={{
                                        top: handle.includes('n') ? '-8px' : 'auto',
                                        bottom: handle.includes('s') ? '-8px' : 'auto',
                                        left: handle.includes('w') ? '-8px' : 'auto',
                                        right: handle.includes('e') ? '-8px' : 'auto',
                                        cursor: handle === 'nw' || handle === 'se' ? 'nwse-resize' : 'nesw-resize',
                                        zIndex: 10
                                    }}
                                    onMouseDown={e => {
                                        e.stopPropagation();
                                        handleCropMouseDown(e, handle);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex dark:bg-slate-950/20">
                <TabsTrigger value="adjust">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Adjust
                </TabsTrigger>
                <TabsTrigger value="transform">
                  <Rotate3D className="h-4 w-4 mr-2" />
                  Transform
                </TabsTrigger>
                <TabsTrigger value="style">
                  <Palette className="h-4 w-4 mr-2" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="effects">
                  <Layers className="h-4 w-4 mr-2" />
                  Effects
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-4 space-y-4">
              {activeTab === 'adjust' && (
                <>
                  <div className="space-y-2">
                    <Label>Brightness</Label>
                    <Slider
                      value={[editState.brightness]}
                      onValueChange={([value]) => updateEditState({ brightness: value })}
                      min={0}
                      max={200}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contrast</Label>
                    <Slider
                      value={[editState.contrast]}
                      onValueChange={([value]) => updateEditState({ contrast: value })}
                      min={0}
                      max={200}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Saturation</Label>
                    <Slider
                      value={[editState.saturation]}
                      onValueChange={([value]) => updateEditState({ saturation: value })}
                      min={0}
                      max={200}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hue</Label>
                    <Slider
                      value={[editState.hue]}
                      onValueChange={([value]) => updateEditState({ hue: value })}
                      min={-180}
                      max={180}
                    />
                  </div>
                </>
              )}

                {activeTab === 'transform' && (
                    <>
                        <div className="space-y-2">
                            <Label>Rotation</Label>
                            <Slider
                                value={[editState.rotation]}
                                onValueChange={([value]) => updateEditState({ rotation: value })}
                                min={0}
                                max={360}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                onClick={() => updateEditState({ flipX: !editState.flipX })}
                                className={`dark:hover:bg-slate-600 ${editState.flipX ? 'bg-slate-100 dark:bg-slate-700 border-slate-400 dark:border-slate-500' : ''}`}
                            >
                                <FlipHorizontal className="h-4 w-4 mr-2" />
                                Flip X
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => updateEditState({ flipY: !editState.flipY })}
                                className={`dark:hover:bg-slate-600 ${editState.flipY ? 'bg-slate-100 dark:bg-slate-700 border-slate-400 dark:border-slate-500' : ''}`}
                            >
                                <FlipVertical className="h-4 w-4 mr-2" />
                                Flip Y
                            </Button>
                            <Button
                                variant="outline"
                                onClick={initializeCrop}
                                className={`dark:hover:bg-slate-600 ${showCropOverlay ? 'bg-slate-100 dark:bg-slate-700 border-slate-400 dark:border-slate-500' : ''}`}
                            >
                                <Crop className="h-4 w-4 mr-2" />
                                Crop
                            </Button>
                            {showCropOverlay && (
                                <Button
                                    variant="default"
                                    onClick={applyCrop}
                                >
                                    Apply Crop
                                </Button>
                            )}
                        </div>
                    </>
                )}

              {activeTab === 'style' && (
                <>
                  <div className="space-y-2">
                    <Label>Filter</Label>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a filter" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(FILTERS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={editState.backgroundColor === 'transparent' ? '#ffffff' : editState.backgroundColor}
                        onChange={(e) => updateEditState({ backgroundColor: e.target.value })}
                        className="w-12 h-8 p-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => updateEditState({ backgroundColor: 'transparent' })}
                        size="sm"
                        className="dark:hover:bg-slate-700"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'effects' && (
                <>
                  <div className="space-y-2">
                    <Label>Overlay</Label>
                    <Select
                      value={editState.overlay}
                      onValueChange={(value) => updateEditState({ overlay: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select overlay" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(OVERLAYS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {editState.overlay !== 'none' && (
                      <div className="space-y-2">
                        <Label>Overlay Opacity</Label>
                        <Slider
                          value={[editState.overlayOpacity]}
                          onValueChange={([value]) => updateEditState({ overlayOpacity: value })}
                          min={0}
                          max={1}
                          step={0.1}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Blur</Label>
                    <Slider
                      value={[editState.blur]}
                      onValueChange={([value]) => updateEditState({ blur: value })}
                      min={0}
                      max={10}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sharpen</Label>
                    <Slider
                      value={[editState.sharpen]}
                      onValueChange={([value]) => updateEditState({ sharpen: value })}
                      min={0}
                      max={10}
                      step={0.1}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <Button
                className="w-full"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Tip: Use keyboard shortcuts - Ctrl+Z to undo, Ctrl+Y to redo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
