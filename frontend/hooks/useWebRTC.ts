import { useEffect, useRef, useState, useCallback } from 'react';
// @ts-ignore - socket.io-client types
import { Socket } from 'socket.io-client';

interface UseWebRTCOptions {
  socket: Socket | null;
  roomId: string;
  userId: string;
  localStream: MediaStream | null;
  remoteUsers: string[];
}

interface PeerConnection {
  peerId: string;
  peerConnection: RTCPeerConnection;
  stream?: MediaStream;
}

export function useWebRTC({ socket, roomId, userId, localStream, remoteUsers }: UseWebRTCOptions) {
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());

  // WebRTC Configuration
  const rtcConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // Create peer connection using native WebRTC API
  const createPeerConnection = useCallback(
    (targetUserId: string, isInitiator: boolean): RTCPeerConnection => {
      const peerConnection = new RTCPeerConnection(rtcConfiguration);

      // Add local stream tracks if available
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      }

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0];
        if (remoteStream) {
          setRemoteStreams((prev) => {
            const newMap = new Map(prev);
            newMap.set(targetUserId, remoteStream);
            return newMap;
          });
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('webrtc:ice-candidate', {
            roomId,
            targetUserId,
            candidate: event.candidate,
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state with ${targetUserId}:`, peerConnection.connectionState);
        if (peerConnection.connectionState === 'failed' || peerConnection.connectionState === 'disconnected') {
          // Clean up on failure
          const peerConnection = peersRef.current.get(targetUserId);
          if (peerConnection) {
            peerConnection.peerConnection.close();
            peersRef.current.delete(targetUserId);
            setPeers(new Map(peersRef.current));
          }
        }
      };

      // Handle ICE connection state
      peerConnection.oniceconnectionstatechange = () => {
        console.log(`ICE connection state with ${targetUserId}:`, peerConnection.iceConnectionState);
      };

      // Create and send offer if initiator
      if (isInitiator) {
        peerConnection
          .createOffer()
          .then((offer) => {
            return peerConnection.setLocalDescription(offer);
          })
          .then(() => {
            if (socket && peerConnection.localDescription) {
              socket.emit('webrtc:offer', {
                roomId,
                targetUserId,
                offer: peerConnection.localDescription,
              });
            }
          })
          .catch((error) => {
            console.error('Error creating offer:', error);
          });
      }

      return peerConnection;
    },
    [socket, roomId, localStream]
  );

  // Set up WebRTC signaling
  useEffect(() => {
    if (!socket || !localStream) return;

    // Handle incoming offer
    const handleOffer = async (data: { fromUserId: string; offer: RTCSessionDescriptionInit }) => {
      const { fromUserId, offer } = data;

      if (peersRef.current.has(fromUserId)) {
        return; // Peer already exists
      }

      const peerConnection = createPeerConnection(fromUserId, false);

      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        if (socket && peerConnection.localDescription) {
          socket.emit('webrtc:answer', {
            roomId,
            targetUserId: fromUserId,
            answer: peerConnection.localDescription,
          });
        }

        peersRef.current.set(fromUserId, {
          peerId: fromUserId,
          peerConnection,
        });

        setPeers(new Map(peersRef.current));
      } catch (error) {
        console.error('Error handling offer:', error);
        peerConnection.close();
      }
    };

    // Handle incoming answer
    const handleAnswer = async (data: { fromUserId: string; answer: RTCSessionDescriptionInit }) => {
      const { fromUserId, answer } = data;

      const peerConnection = peersRef.current.get(fromUserId);
      if (peerConnection && peerConnection.peerConnection.signalingState !== 'stable') {
        try {
          await peerConnection.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
          console.error('Error handling answer:', error);
        }
      }
    };

    // Handle ICE candidate
    const handleICECandidate = async (data: { fromUserId: string; candidate: RTCIceCandidateInit }) => {
      const { fromUserId, candidate } = data;

      const peerConnection = peersRef.current.get(fromUserId);
      if (peerConnection && candidate) {
        try {
          await peerConnection.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    };

    socket.on('webrtc:offer', handleOffer);
    socket.on('webrtc:answer', handleAnswer);
    socket.on('webrtc:ice-candidate', handleICECandidate);

    return () => {
      socket.off('webrtc:offer', handleOffer);
      socket.off('webrtc:answer', handleAnswer);
      socket.off('webrtc:ice-candidate', handleICECandidate);
    };
  }, [socket, localStream, createPeerConnection, roomId]);

  // Create peer connections for new remote users
  useEffect(() => {
    if (!localStream || remoteUsers.length === 0) return;

    remoteUsers.forEach((targetUserId) => {
      if (targetUserId === userId) return; // Skip self
      if (peersRef.current.has(targetUserId)) return; // Peer already exists

      const peerConnection = createPeerConnection(targetUserId, true);
      peersRef.current.set(targetUserId, {
        peerId: targetUserId,
        peerConnection,
      });

      setPeers(new Map(peersRef.current));
    });
  }, [localStream, remoteUsers, userId, createPeerConnection]);

  // Update local stream tracks when stream changes
  useEffect(() => {
    if (!localStream) return;

    peersRef.current.forEach((peerConnection) => {
      // Remove old tracks
      peerConnection.peerConnection.getSenders().forEach((sender) => {
        if (sender.track) {
          peerConnection.peerConnection.removeTrack(sender);
        }
      });

      // Add new tracks
      localStream.getTracks().forEach((track) => {
        peerConnection.peerConnection.addTrack(track, localStream);
      });
    });
  }, [localStream]);

  // Clean up peers when users leave
  useEffect(() => {
    const currentPeerIds = new Set(peersRef.current.keys());
    const activeUserIds = new Set(remoteUsers.filter((id) => id !== userId));

    let hasChanges = false;

    // Remove peers for users who left
    currentPeerIds.forEach((peerId) => {
      if (!activeUserIds.has(peerId)) {
        const peerConnection = peersRef.current.get(peerId);
        if (peerConnection) {
          peerConnection.peerConnection.close();
          peersRef.current.delete(peerId);
          hasChanges = true;
        }
      }
    });

    // Only update state if there were actual changes
    if (hasChanges) {
      setPeers(new Map(peersRef.current));
    }
  }, [remoteUsers, userId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      peersRef.current.forEach((peerConnection) => {
        peerConnection.peerConnection.close();
      });
      peersRef.current.clear();
    };
  }, []);

  return {
    peers,
    remoteStreams,
  };
}
