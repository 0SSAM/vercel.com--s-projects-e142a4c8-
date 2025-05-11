import CameraHandler from "@/components/camera-handler"

export default function CameraTroubleshooterPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Camera Troubleshooter</h1>
      <p className="text-muted-foreground mb-8">
        This tool helps identify and resolve common camera-related issues in web applications.
      </p>

      <CameraHandler />

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Common Camera Issues</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Permission Issues</h3>
            <p>
              Users must explicitly grant camera access to your web application. When permission is denied, your
              application needs to handle this gracefully.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Camera Not Found</h3>
            <p>This can occur when no camera is connected to the device or when the selected camera is unavailable.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Constraint Errors</h3>
            <p>
              These happen when the requested camera constraints (resolution, frame rate) cannot be satisfied by the
              available hardware.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Security Restrictions</h3>
            <p>
              Camera access requires a secure context (HTTPS) in most modern browsers. Insecure origins will be blocked.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Browser Compatibility</h3>
            <p>
              Different browsers implement the MediaDevices API differently, requiring specific handling for
              cross-browser compatibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
