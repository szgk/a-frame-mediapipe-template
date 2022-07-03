// import {Hands} from '@mediapipe/hands'
// import {Camera} from '@mediapipe/camera_utils'

const state = {
    handSpheres: [],
    sceneElement: null,
    cameraElement: null,
    isMobile: false,
}

const createSphere = (attributes) => {
    const sphere = document.createElement('a-sphere')
    for (const key in attributes) {
        sphere.setAttribute(key, attributes[key])
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
        state.handSpheres.push(sphere)
    })
}

const onResults = (results) => {
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {

            if (state.handSpheres.length <= 0) {
                getHandsSpheres(landmarks)
            }
            
            state.handSpheres.forEach((sphere, i) => {
                sphere.setAttribute('position', {
                    x: landmarks[i].x * -3 + 1,
                    y: landmarks[i].y * -2.5 + 2,
                    z: landmarks[i].z * 8 - 2,
                })
            })
        }
    }
}

const init = () => {
    state.sceneElement = document.querySelector('a-scene')
    state.cameraElement = document.querySelector('#camera')
    
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