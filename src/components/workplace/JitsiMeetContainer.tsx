"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Video, Users, Mic, MicOff, VideoOff } from "lucide-react"

// Dynamically import JitsiMeeting to avoid SSR issues
const JitsiMeeting = dynamic(() => import("@jitsi/react-sdk").then(mod => mod.JitsiMeeting), { ssr: false })

interface JitsiMeetContainerProps {
  roomName: string
  userName: string
  userEmail?: string
}

export function JitsiMeetContainer({ roomName, userName, userEmail }: JitsiMeetContainerProps) {
  const [mounted, setMounted] = useState(false)
  const [participantCount, setParticipantCount] = useState(1)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [jitsiApi, setJitsiApi] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleJitsiIFrameRef = (parentNode: HTMLDivElement) => {
    // Store the container reference instead
    // The API object will be provided through the onApiReady callback
    if (parentNode) {
      // Responsive height based on screen size
      const setResponsiveHeight = () => {
        const height = window.innerWidth < 768 ? "300px" : "450px";
        parentNode.style.height = height;
        parentNode.style.width = "100%";
      };

      // Set initial height
      setResponsiveHeight();

      // Add resize listener
      window.addEventListener("resize", setResponsiveHeight);

      // Return cleanup function
      return () => {
        window.removeEventListener("resize", setResponsiveHeight);
      };
    }
  }

  const handleApiReady = (apiObj: any) => {
    // Store JitsiMeeting API reference
    setJitsiApi(apiObj);
    
    // Add event listeners
    apiObj.addEventListener('participantJoined', () => {
      const count = apiObj.getNumberOfParticipants();
      setParticipantCount(count);
    });

    apiObj.addEventListener('participantLeft', () => {
      const count = apiObj.getNumberOfParticipants();
      setParticipantCount(count);
    });

    apiObj.addEventListener('audioMuteStatusChanged', (data: any) => {
      setIsMuted(data.muted);
    });

    apiObj.addEventListener('videoMuteStatusChanged', (data: any) => {
      setIsVideoOff(data.muted);
    });
  };

  const toggleAudio = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleAudio');
      // Do not setIsMuted here; rely on Jitsi event to update state
    }
  };

  const toggleVideo = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleVideo');
      // Do not setIsVideoOff here; rely on Jitsi event to update state
    }
  };

  if (!mounted) {
    return (
      <div className="aspect-video w-full rounded-lg border bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Video className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 animate-pulse" />
          </div>
          <div className="text-gray-500 text-xs sm:text-sm">Initializing meeting room...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm">
      <div className="bg-[#0a1e42] text-white px-2 sm:px-4 py-1 sm:py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1 sm:gap-0">
        <div className="flex items-center flex-wrap gap-1">
          <div className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
            Meeting: {roomName}
          </div>
          <div className="text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center">
            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" /> {participantCount}
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            className={`p-1 sm:p-1.5 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'}`}
            onClick={toggleAudio}
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isMuted ? (
              <MicOff className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            ) : (
              <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            )}
          </button>
          <button 
            className={`p-1 sm:p-1.5 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-green-500'}`}
            onClick={toggleVideo}
            aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
          >
            {isVideoOff ? (
              <VideoOff className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            ) : (
              <Video className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            )}
          </button>
          <div className="text-[10px] sm:text-xs bg-green-500/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Live</div>
        </div>
      </div>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={`odrindia-${roomName}`}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          prejoinPageEnabled: true,
          disableModeratorIndicator: true,
          enableNoisyMicDetection: true,
          enableClosePage: false,
          disableDeepLinking: true,
          toolbarButtons: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'chat', 'raisehand', 'tileview', 'settings',
            'videoquality', 'filmstrip', 'invite',
          ],
        }}
        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          DEFAULT_REMOTE_DISPLAY_NAME: "Participant",
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen', 'fodeviceselection',
            'hangup', 'chat', 'raisehand', 'tileview', 'settings', 'videoquality',
            'filmstrip', 'invite', 'shortcuts',
          ],
          TOOLBAR_ALWAYS_VISIBLE: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: userName,
          email: userEmail || '',
        }}
        onApiReady={handleApiReady}
        getIFrameRef={handleJitsiIFrameRef}
      />
    </div>
  )
}
