"use client"

import { useRef } from "react";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";

type Props = {
  url: string
  shortCode: string
}

export default function QRCodeDialog({ url, shortCode }: Props) {

  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    const svg = qrRef.current?.querySelector("svg")

    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const size = 512

    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const img = new Image()
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const objectUrl = URL.createObjectURL(svgBlob)

    img.onload = () => {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(objectUrl)

      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")

      downloadLink.href = pngFile
      downloadLink.download = `${shortCode}-qr.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
    img.src = objectUrl
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <QrCode className=" h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6">
          <div ref={qrRef} className="rounded-xl bg-white p-4 shadow-sm"><QRCode value={url} size={220} /></div>
          <p className="max-w-full break-all text-center text-sm text-muted-foreground">{url}</p>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />Download PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}