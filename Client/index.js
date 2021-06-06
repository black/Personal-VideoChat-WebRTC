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
let webcamButton = $('#startCam')
let callButton = $('#createCall')
let answerButton = $('#answerCall')

webcamButton.on('click', async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    remoteStream = new MediaStream()

    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream)
    })

    pc.ontrack = event => {
        console.log("peer track")
        event.stream[0].getTracks().forEach(track => {
            remoteStream.addTrack(track)
        });
    };

    localVideo.srcObject = localStream
    remoteVideo.srcObject = remoteStream

    callButton.disabled = false;
    answerButton.disabled = false;
    webcamButton.disabled = true;
});

callButton.on('click', async () => {

    // Get candidates for caller, save to db
    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };

    await callDoc.set({
        offer
    });

    // Listen for remote answer
    // callDoc.onSnapshot((snapshot) => {
    //     const data = snapshot.data();
    //     if (!pc.currentRemoteDescription && data ? .answer) {
    //         const answerDescription = new RTCSessionDescription(data.answer);
    //         pc.setRemoteDescription(answerDescription);
    //     }
    // });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
            }
        });
    });

    hangupButton.disabled = false;

});

answerButton.on('click', async () => {

});