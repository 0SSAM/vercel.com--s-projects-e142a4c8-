"use client"

import { useState, useEffect, useRef } from "react"
import { AlertCircle, Camera, CheckCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CameraError = {
  type: "permission" | "not-found" | "constraints" | "aborted" | "security" | "display" | "unknown"
  message: string
  originalError?: Error
}

export default function CameraHandler() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<CameraError | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")

  // Function to enumerate available camera devices
  const enumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")

      // Ensure each device has a valid deviceId
      const validDevices = videoDevices.map((device, index) => {
        if (!device.deviceId) {
          // Create a copy with a valid deviceId
          return {
            ...device,
            deviceId: `camera-${index}`,
          }
        }
        return device
      })

      setDevices(validDevices)

      // Select the first device by default if available
      if (validDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(validDevices[0].deviceId)
      }
    } catch (err) {
      console.error("Error enumerating devices:", err)
      setError({
        type: "unknown",
        message: "Failed to enumerate camera devices",
        originalError: err as Error,
      })
    }
  }

  // Initialize camera stream
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError({
        type: "unknown",
        message:
          "Your browser does not support camera access. Try using a modern browser like Chrome, Firefox, or Edge.",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      // Request camera access with constraints
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      // Store the stream reference
      streamRef.current = stream

      // Connect stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsActive(true)
          setIsLoading(false)
        }
      }
    } catch (err: any) {
      setIsLoading(false)
      handleCameraError(err)
    }
  }

  // Handle specific camera errors
  const handleCameraError = (err: any) => {
    console.error("Camera error:", err)

    let errorInfo: CameraError = {
      type: "unknown",
      message: "An unknown error occurred while accessing the camera",
      originalError: err,
    }

    // Handle specific error types
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      errorInfo = {
        type: "permission",
        message: "Camera access was denied. Please allow camera access in your browser settings.",
        originalError: err,
      }
    } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      errorInfo = {
        type: "not-found",
        message: "No camera was found on your device, or the selected camera is not available.",
        originalError: err,
      }
    } else if (err.name === "ConstraintNotSatisfiedError" || err.name === "OverconstrainedError") {
      errorInfo = {
        type: "constraints",
        message: "The selected camera cannot satisfy the requested constraints. Try a different camera or settings.",
        originalError: err,
      }
    } else if (err.name === "AbortError") {
      errorInfo = {
        type: "aborted",
        message:
          "Camera access was aborted. This might be due to a hardware error or the camera being used by another application.",
        originalError: err,
      }
    } else if (err.name === "SecurityError") {
      errorInfo = {
        type: "security",
        message:
          "Camera access was blocked due to security restrictions. This site might not have permission to use the camera.",
        originalError: err,
      }
    } else if (err.name === "TypeError") {
      errorInfo = {
        type: "display",
        message: "There was a problem displaying the camera stream. Try refreshing the page.",
        originalError: err,
      }
    }

    setError(errorInfo)
    setIsActive(false)
  }

  // Stop the camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsActive(false)
  }

  // Check if the browser is using HTTPS
  const isSecureContext = () => {
    return window.isSecureContext
  }

  // Initial setup
  useEffect(() => {
    // Check for secure context
    if (!isSecureContext()) {
      setError({
        type: "security",
        message: "Camera access requires a secure connection (HTTPS). Your connection is not secure.",
      })
      return
    }

    // Enumerate available devices
    enumerateDevices()

    // Cleanup on unmount
    return () => {
      stopCamera()
    }
  }, [])

  // When device selection changes
  useEffect(() => {
    if (selectedDeviceId && isActive) {
      startCamera()
    }
  }, [selectedDeviceId])

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Camera Access</h2>

      {/* Camera selection */}
      {devices.length > 0 && (
        <div className="space-y-2">
          <label htmlFor="camera-select" className="text-sm font-medium">
            Select Camera
          </label>
          <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId} disabled={isLoading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a camera" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device, index) => {
                // Skip devices with empty deviceId or use a fallback value
                const deviceId = device.deviceId || `camera-${index}`
                return (
                  <SelectItem key={deviceId} value={deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error.type === "permission"
              ? "Permission Denied"
              : error.type === "not-found"
                ? "Camera Not Found"
                : error.type === "constraints"
                  ? "Camera Constraints Error"
                  : error.type === "security"
                    ? "Security Error"
                    : error.type === "aborted"
                      ? "Camera Access Aborted"
                      : error.type === "display"
                        ? "Display Error"
                        : "Camera Error"}
          </AlertTitle>
          <AlertDescription>
            {error.message}

            {error.type === "permission" && (
              <div className="mt-2">
                <p className="text-sm">To fix this issue:</p>
                <ol className="list-decimal list-inside text-sm mt-1">
                  <li>Click the camera icon in your browser's address bar</li>
                  <li>Select "Allow" for camera access</li>
                  <li>Refresh the page</li>
                </ol>
              </div>
            )}

            {error.type === "not-found" && (
              <div className="mt-2">
                <p className="text-sm">To fix this issue:</p>
                <ol className="list-decimal list-inside text-sm mt-1">
                  <li>Check if your camera is properly connected</li>
                  <li>Make sure no other application is using the camera</li>
                  <li>Try restarting your browser</li>
                </ol>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Video display */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {!isActive && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <Camera className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Camera controls */}
      <div className="flex gap-4">
        {!isActive ? (
          <Button onClick={startCamera} disabled={isLoading || !!error?.type === "security"} className="flex-1">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Initializing Camera...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </>
            )}
          </Button>
        ) : (
          <Button onClick={stopCamera} variant="outline" className="flex-1">
            Stop Camera
          </Button>
        )}

        <Button onClick={enumerateDevices} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Devices
        </Button>
      </div>

      {/* Status indicator */}
      {isActive && (
        <div className="flex items-center text-sm text-green-600 dark:text-green-500">
          <CheckCircle className="mr-2 h-4 w-4" />
          Camera is active and working properly
        </div>
      )}

      {/* Debugging information */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Debugging Information</h3>
        <div className="text-sm space-y-1">
          <p>
            <strong>Browser:</strong> {navigator.userAgent}
          </p>
          <p>
            <strong>Secure Context:</strong> {isSecureContext() ? "Yes" : "No"}
          </p>
          <p>
            <strong>Available Cameras:</strong> {devices.length}
          </p>
          <p>
            <strong>Camera Status:</strong> {isActive ? "Active" : isLoading ? "Initializing" : "Inactive"}
          </p>
          {error && (
            <p>
              <strong>Last Error:</strong> {error.type} - {error.originalError?.name || "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
