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
      parentNode.style.height = "450px";
      parentNode.style.width = "100%";
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
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Video className="h-6 w-6 text-blue-500 animate-pulse" />
          </div>
          <div className="text-gray-500">Initializing meeting room...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm">
      <div className="bg-[#0a1e42] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="font-medium mr-2">Meeting Room: {roomName}</div>
          <div className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center">
            <Users className="h-3 w-3 mr-1" /> {participantCount}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className={`p-1.5 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'}`}
            onClick={toggleAudio}
          >
            {isMuted ? (
              <MicOff className="h-4 w-4 text-white" />
            ) : (
              <Mic className="h-4 w-4 text-white" />
            )}
          </button>
          <button 
            className={`p-1.5 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-green-500'}`}
            onClick={toggleVideo}
          >
            {isVideoOff ? (
              <VideoOff className="h-4 w-4 text-white" />
            ) : (
              <Video className="h-4 w-4 text-white" />
            )}
          </button>
          <div className="text-xs bg-green-500/70 px-2 py-1 rounded-full">Live</div>
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
