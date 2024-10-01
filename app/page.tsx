"use client"

import React, { useState, ChangeEvent, useRef } from 'react'
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCode } from 'react-qrcode-logo'
import { HexColorPicker } from "react-colorful"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy } from 'lucide-react'
import { toast } from "sonner"

type ECLevel = 'L' | 'M' | 'H' | 'Q'
type LogoPaddingStyle = 'square' | 'circle'
type QrStyle = 'squares' | 'dots' | 'fluid'
type EyeRadiusArray = [number, number, number?, number?]

type EyeRadiusObject = {
  outer: EyeRadiusArray
  inner: EyeRadiusArray
}

type EyeRadius = number | number[] | EyeRadiusArray | EyeRadiusObject[]

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('')
  const [dataUri, setDataUri] = useState<string>('')
  const [size, setSize] = useState(150)
  const [ecLevel, setEcLevel] = useState<ECLevel>('L')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [fgColor, setFgColor] = useState('#000000')
  const [logoWidth, setLogoWidth] = useState(size * 0.2)
  const [logoHeight, setLogoHeight] = useState(logoWidth)
  const [enableLogoHeight, setEnableLogoHeight] = useState(false)
  const [logoOpacity, setLogoOpacity] = useState(1)
  const [quietZone, setQuietZone] = useState(10)
  const [removeQrCodeBehindLogo, setRemoveQrCodeBehindLogo] = useState<boolean | undefined>(false)
  const [logoPadding, setLogoPadding] = useState(0)
  const [logoPaddingStyle, setLogoPaddingStyle] = useState<LogoPaddingStyle>('square')
  const [qrStyle, setQrStyle] = useState<QrStyle>('squares')
  const [eyeRadius, setEyeRadius] = useState<number>(0)

  const qrRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setDataUri(reader.result as string)
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Quick Custom QR Codes</h1>
        <p className="text-xl">
          Completely custom QR codes that <span className="font-semibold">last forever</span> and <span className="font-semibold">never expire</span>
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <form>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="url">URL/Website address</Label>
                    <Input 
                      type="text" 
                      id="url" 
                      placeholder="https://example.com" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="picture">Picture/Logo</Label>
                    <Input 
                      id="picture" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                  <div>
                    <Label>Size: {size}px</Label>
                    <Slider 
                      defaultValue={[150]} 
                      max={500} 
                      min={50} 
                      step={1} 
                      onValueChange={(e) => setSize(e[0])} 
                    />
                  </div>
                  <Tabs defaultValue="background">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="background">Background Color</TabsTrigger>
                      <TabsTrigger value="foreground">Foreground Color</TabsTrigger>
                    </TabsList>
                    <TabsContent value="background">
                      <HexColorPicker color={bgColor} onChange={setBgColor} />
                    </TabsContent>
                    <TabsContent value="foreground">
                      <HexColorPicker color={fgColor} onChange={setFgColor} />
                    </TabsContent>
                  </Tabs>
                  <div>
                    <Label>Quiet Zone: {quietZone}px</Label>
                    <Slider 
                      defaultValue={[10]} 
                      max={100} 
                      min={1} 
                      step={1} 
                      onValueChange={(e) => setQuietZone(e[0])} 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="logo-bg-toggle" 
                      onCheckedChange={setRemoveQrCodeBehindLogo}
                    />
                    <Label htmlFor="logo-bg-toggle">Remove QR Code Behind Logo</Label>
                  </div>
                </div>

                <Accordion type="single" collapsible className="mt-6">
                  <AccordionItem value="advanced-options">
                    <AccordionTrigger>Advanced Options</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Logo Padding: {logoPadding}px</Label>
                          <Slider 
                            defaultValue={[0]} 
                            max={100} 
                            min={0} 
                            step={1} 
                            onValueChange={(e) => setLogoPadding(e[0])} 
                          />
                        </div>
                        <div>
                          <Label>Logo Width: {logoWidth}px</Label>
                          <Slider 
                            defaultValue={[logoWidth]} 
                            max={size} 
                            min={1} 
                            step={1} 
                            onValueChange={(e) => setLogoWidth(e[0])} 
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="logoheighttoggle" 
                              onCheckedChange={() => setEnableLogoHeight(!enableLogoHeight)} 
                            />
                            <Label htmlFor="logoheighttoggle">Modify logo height</Label>
                          </div>
                          {enableLogoHeight && (
                            <div className="mt-2">
                              <Label>Logo Height: {logoHeight}px</Label>
                              <Slider 
                                defaultValue={[logoWidth]} 
                                max={size} 
                                min={1} 
                                step={1} 
                                onValueChange={(e) => setLogoHeight(e[0])} 
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <Label>Logo Opacity: {logoOpacity}</Label>
                          <Slider 
                            defaultValue={[logoOpacity]} 
                            max={1} 
                            min={0} 
                            step={0.1} 
                            onValueChange={(e) => setLogoOpacity(e[0])} 
                          />
                        </div>
                        <div>
                          <Label>Error Correction: <span className="font-semibold">{ecLevel}</span></Label>
                          <div className="flex space-x-2 mt-2">
                            {(['L', 'M', 'Q', 'H'] as ECLevel[]).map((level) => (
                              <Button 
                                key={level}
                                variant={ecLevel === level ? "default" : "outline"}
                                onClick={(e) => {
                                  e.preventDefault()
                                  setEcLevel(level)
                                }}
                              >
                                {level}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Eye Radius: {eyeRadius}%</Label>
                          <Slider 
                            defaultValue={[0]} 
                            max={100} 
                            min={0} 
                            step={1} 
                            onValueChange={(e) => setEyeRadius(e[0])} 
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </form>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
              <div ref={qrRef}>
                {url !== '' ? (
                  <QRCode 
                    value={url}
                    logoImage={dataUri}
                    size={size}
                    ecLevel={ecLevel}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    logoWidth={logoWidth}
                    logoHeight={enableLogoHeight ? logoHeight : logoWidth}
                    logoOpacity={logoOpacity}
                    quietZone={quietZone}
                    removeQrCodeBehindLogo={removeQrCodeBehindLogo}
                    logoPadding={logoPadding}
                    logoPaddingStyle={logoPaddingStyle}
                    qrStyle={qrStyle}
                    eyeRadius={eyeRadius}
                  />
                ) : (
                  <p className="text-center text-gray-500">Enter a URL to generate a QR code</p>
                )}
              </div>
              {'' !== '' && (
                <div className="flex space-x-2 mt-4">
                  {/* <Button onClick={copyAsImage} variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy as PNG
                  </Button>
                  <Button onClick={downloadQRCode} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download as PNG
                  </Button> */}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500 text-center w-full">
            This tool doesn't store any data. All QR code generation is done client-side in your browser.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
