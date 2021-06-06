const servers = {
    iceServers: [{
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }, ],
    iceCandidatePoolSize: 10
}

let pc = new RTCPeerConnection(servers)
let localStream = null
let remoteStream = null
let localVideo = $('#localVideo')
let remoteVideo = $('#remoteVideo')
let camStart = $('#startCam')
let createCall = $('#createCall')

camStart.on('click', async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })

    remoteStream = new MediaStream()
    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream)
        console.log("localStream")
    })

    pc.ontrack = event => {
        console.log("peer track")
        event.stream[0].getTracks().forEach(track => {
            remoteStream.addTrack(track)
            console.log("remoteStream")
        });
    };

    localVideo.srcObject = localStream
    remoteVideo.srcObject = remoteStream

});