// import {Hands} from '@mediapipe/hands'
// import {Camera} from '@mediapipe/camera_utils'

const state = {
    handSphers: [],
    sceneElement: null,
    canvasElement: null,
    cameraElement: null,
    canvasCtx: null,
    isMobile: false,
}

const createSphere = (attributes) => {
    const sphere = document.createElement('a-sphere')
    for (const attribute in attributes) {
        sphere.setAttribute(attribute, attributes[attribute])
    }
    state.sceneElement.appendChild(sphere)
    return sphere
}

const getHandsSpheres = (landmarks) => {
    landmarks.forEach((landmark) => {
        const sphere = createSphere({
            position: { x: landmark.x, y: landmark.y, z: landmark.z },
            radius: 0.04,
            color: '#000',
            ['ammo-body']: 'type: kinematic',
            ['ammo-shape']: 'type: sphere'
        })
        state.handSphers.push(sphere)
    })
}

const onResults = (results) => {
    state.canvasCtx.save()
    state.canvasCtx.clearRect(0, 0, state.canvasElement.width, state.canvasElement.height)
    state.canvasCtx.drawImage(results.image, 0, 0, state.canvasElement.width, state.canvasElement.height)

    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {

            if (state.handSphers.length <= 0) {
                getHandsSpheres(landmarks)
            }
            
            state.handSphers.forEach((sphere, i) => {
                sphere.setAttribute('position', {
                    x: landmarks[i].x * -3 + 1,
                    y: landmarks[i].y * -2.5 + 2,
                    z: landmarks[i].z * 8 - 2,
                })
            })
        }
    }
    state.canvasCtx.restore()
}

const init = () => {
    state.sceneElement = document.querySelector('a-scene')
    state.canvasElement = document.querySelector('#output-canvas')
    state.cameraElement = document.querySelector('#camera')
    state.canvasCtx = state.canvasElement.getContext('2d')
    
    state.isMobile = AFRAME.utils.device.isMobile ()

    const videoElement = document.querySelector('#input-video')

    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        }
    })
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    })
    hands.onResults(onResults)

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement })
        },
        width: 1280,
        height: 720
    })
    camera.start()
}

window.onload = init