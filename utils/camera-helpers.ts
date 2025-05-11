/**
 * Checks if the MediaDevices API is supported in the current browser
 */
export function isCameraSupported(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false
  }
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

/**
 * Checks if the current context is secure (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === "undefined") {
    return false
  }
  return window.isSecureContext
}

/**
 * Gets the browser name and version
 */
export function getBrowserInfo(): { name: string; version: string } {
  if (typeof navigator === "undefined") {
    return { name: "Unknown", version: "Unknown" }
  }

  const userAgent = navigator.userAgent
  let browserName = "Unknown"
  let browserVersion = "Unknown"

  if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Firefox"
    browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown"
  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
    browserName = "Samsung Browser"
    browserVersion = userAgent.match(/SamsungBrowser\/([0-9.]+)/)?.[1] || "Unknown"
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserName = "Opera"
    browserVersion = userAgent.match(/OPR\/([0-9.]+)/)?.[1] || "Unknown"
  } else if (userAgent.indexOf("Edg") > -1) {
    browserName = "Edge"
    browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || "Unknown"
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Chrome"
    browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown"
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "Safari"
    browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || "Unknown"
  }

  return { name: browserName, version: browserVersion }
}

/**
 * Formats camera constraints for better readability
 */
export function formatConstraints(constraints: MediaTrackConstraints): string {
  const result: string[] = []

  if (constraints.width) {
    const width =
      typeof constraints.width === "object"
        ? `${constraints.width.min || "?"}-${constraints.width.max || "?"}`
        : constraints.width
    result.push(`Width: ${width}`)
  }

  if (constraints.height) {
    const height =
      typeof constraints.height === "object"
        ? `${constraints.height.min || "?"}-${constraints.height.max || "?"}`
        : constraints.height
    result.push(`Height: ${height}`)
  }

  if (constraints.frameRate) {
    const frameRate =
      typeof constraints.frameRate === "object"
        ? `${constraints.frameRate.min || "?"}-${constraints.frameRate.max || "?"}`
        : constraints.frameRate
    result.push(`Frame Rate: ${frameRate}`)
  }

  if (constraints.facingMode) {
    result.push(`Facing Mode: ${constraints.facingMode}`)
  }

  return result.join(", ")
}

/**
 * Gets camera capabilities if supported
 */
export async function getCameraCapabilities(stream: MediaStream): Promise<Record<string, any> | null> {
  if (typeof window === "undefined") {
    return null
  }

  const videoTrack = stream.getVideoTracks()[0]

  if (!videoTrack || !videoTrack.getCapabilities) {
    return null
  }

  try {
    return videoTrack.getCapabilities()
  } catch (error) {
    console.error("Error getting camera capabilities:", error)
    return null
  }
}
