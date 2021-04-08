const socket = io('/');
let myVideoStream;
const videoWrap = document.querySelector('.video-wrapp');
const btnScreen = document.querySelector('#screen');
const myVideo = document.createElement('video');
myVideo.classList.add('video-el');
myVideo.muted = true;

let peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000'
});

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  console.log('stream', stream);
  myVideoStream = stream;
  addVideoStream(myVideo, stream);
  peer.on('call', call => {
    console.log('call', call);
    call.answer(stream);
    const video = document.createElement('video');
    video.classList.add('video-el');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });
  socket.on('user-connected', userId => {
    connectNewUser(userId, stream);
  });
});

const connectNewUser = (userId, stream) => {
  console.log('connuid',userId);
  console.log('connstream',stream);
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  video.classList.add('video-el');
  call.on('stream', stream => {
    console.log('stream new user');
    addVideoStream(video, stream);
  });
};



peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
  console.log('rid', ROOM_ID);
  console.log('id', id);
})

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
    videoWrap.append(video);
  })
}
