// import {Hands} from '@mediapipe/hands'
// import {Camera} from '@mediapipe/camera_utils'

const state = {
    handSphers: []
}

const createSphere = (attributes) => {
    const sceneEl = document.querySelector('a-scene')
    const sphere = document.createElement('a-sphere')
    for (const attribute in attributes) {
        sphere.setAttribute(attribute, attributes[attribute])
    }
    sceneEl.appendChild(sphere)
    return sphere
}

const getHandsSpheres = (landmarks) => {
    landmarks.forEach((landmark) => {
        const sphere = createSphere({
            position: { x: landmark.x, y: landmark.y, z: landmark.z },
            radius: 0.04,
            color: '#000',
            ['static-body']: '',
        })
        state.handSphers.push(sphere)
    })
}

function onResults(results) {
    const canvasElement = document.getElementsByClassName('output_canvas')[0]
    const canvasCtx = canvasElement.getContext('2d')
    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height)
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
    canvasCtx.restore()
}

const init = () => {
    const videoElement = document.getElementsByClassName('input_video')[0]

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