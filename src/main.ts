import Stats from 'stats.js'
import './style.css'

const MOUSE_SENSITIVITY = 0.002
const MOUSE_SENSITIVITY_PREVIEW = MOUSE_SENSITIVITY / 4
const WALK_SPEED = 2
const RUN_SPEED = 5

const canvas = createCanvas()
const stats = createStats()
const ctx = canvas.getContext('2d')!
// ctx.translate(0.5, 0.5)W
// ctx.setTransform(1, 0, 0, 1, 120, 0)
// ctx.filter = 'url(#remove-alpha)'
// ctx.imageSmoothingEnabled = true
const keys = new Set<string>()

let posX = 22
let posY = 12
let dirX = -1
let dirY = 0
let planeX = 0
let planeY = 0.66
let oldTime = performance.now()
let hasClicked = false
let isBatch = false
const worldMap = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 4, 0, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 4, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 2, 1],
	[1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
] as const

const tileColors = [
	'#000000',
	'#716a4e',
	'#4e3b35',
	'#6c4b36',
	'#b45e33',
	'#1c3b33'
] as const

document.addEventListener('keydown', e => {
	e.preventDefault()
	keys.add(e.key.toLowerCase())
})

document.addEventListener('keyup', e => {
	e.preventDefault()
	keys.delete(e.key.toLowerCase())
})

function createCanvas() {
	const c = document.createElement('canvas')
	document.body.appendChild(c)
	c.width = window.innerWidth
	c.height = window.innerHeight
	window.addEventListener('resize', () => {
		c.width = window.innerWidth
		c.height = window.innerHeight
	})
	enablePointerLock(c)
	return c
}

function createStats() {
	const s = new Stats()
	s.showPanel(0)
	document.body.appendChild(s.dom)
	return s
}

function enablePointerLock(c: HTMLCanvasElement) {
	document.addEventListener('mousemove', handleMouseMove)
	c.addEventListener('click', () => {
		hasClicked = true
		c.requestPointerLock()
	})
	document.addEventListener('pointerlockchange', () => {
		if (document.pointerLockElement !== c) hasClicked = false
	})
}

function handleMouseMove(e: MouseEvent) {
	const sensitivity = hasClicked ? MOUSE_SENSITIVITY : MOUSE_SENSITIVITY_PREVIEW
	const rot = e.movementX * sensitivity
	const oldDirX = dirX
	dirX = dirX * Math.cos(-rot) - dirY * Math.sin(-rot)
	dirY = oldDirX * Math.sin(-rot) + dirY * Math.cos(-rot)
	const oldPlaneX = planeX
	planeX = planeX * Math.cos(-rot) - planeY * Math.sin(-rot)
	planeY = oldPlaneX * Math.sin(-rot) + planeY * Math.cos(-rot)
}

function darkenColor(hex: string) {
	const r = parseInt(hex.slice(1, 3), 16)
	const g = parseInt(hex.slice(3, 5), 16)
	const b = parseInt(hex.slice(5, 7), 16)
	const nr = Math.floor(r * 0.5)
		.toString(16)
		.padStart(2, '0')
	const ng = Math.floor(g * 0.5)
		.toString(16)
		.padStart(2, '0')
	const nb = Math.floor(b * 0.5)
		.toString(16)
		.padStart(2, '0')
	return '#' + nr + ng + nb
}

function castRay(
	x: number,
	w: number,
	h: number,
	posX: number,
	posY: number,
	dirX: number,
	dirY: number,
	planeX: number,
	planeY: number
) {
	const cameraX = (2 * x) / w - 1
	const rayDirX = dirX + planeX * cameraX
	const rayDirY = dirY + planeY * cameraX
	let mapX = Math.floor(posX)
	let mapY = Math.floor(posY)
	const deltaDistX = rayDirX === 0 ? 1e30 : Math.abs(1 / rayDirX)
	const deltaDistY = rayDirY === 0 ? 1e30 : Math.abs(1 / rayDirY)
	let sideDistX = 0
	let sideDistY = 0
	let stepX = 0
	let stepY = 0
	if (rayDirX < 0) {
		stepX = -1
		sideDistX = (posX - mapX) * deltaDistX
	} else {
		stepX = 1
		sideDistX = (mapX + 1 - posX) * deltaDistX
	}
	if (rayDirY < 0) {
		stepY = -1
		sideDistY = (posY - mapY) * deltaDistY
	} else {
		stepY = 1
		sideDistY = (mapY + 1 - posY) * deltaDistY
	}
	let hit = 0
	let side = 0
	while (hit === 0) {
		if (sideDistX < sideDistY) {
			sideDistX += deltaDistX
			mapX += stepX
			side = 0
		} else {
			sideDistY += deltaDistY
			mapY += stepY
			side = 1
		}
		if (worldMap[mapX][mapY] > 0) hit = 1
	}
	const perpDist = side === 0 ? sideDistX - deltaDistX : sideDistY - deltaDistY
	const lineHeight = Math.floor(h / perpDist)
	let drawStart = Math.floor(-lineHeight / 2 + h / 2)
	if (drawStart < 0) drawStart = 0
	let drawEnd = Math.floor(lineHeight / 2 + h / 2)
	if (drawEnd >= h) drawEnd = h - 1
	let color: string = tileColors[worldMap[mapX][mapY]]
	if (side === 1) color = darkenColor(color)
	return { drawStart, drawEnd, side, color }
}

const skyColor = {
	r: 0,
	g: 0,
	b: 0
}

function castRays() {
	const w = canvas.width
	const h = canvas.height
	ctx.clearRect(0, 0, w, h)
	for (let x = 0; x < w; x++) {
		const { drawStart, drawEnd, color } = castRay(
			x,
			w,
			h,
			posX,
			posY,
			dirX,
			dirY,
			planeX,
			planeY
		)
		ctx.fillStyle = `RGB(${skyColor.r}, ${skyColor.g}, ${skyColor.b})`
		ctx.fillRect(x, 0, 1, drawStart)
		ctx.fillStyle = color
		ctx.fillRect(x, drawStart, 1, drawEnd - drawStart + 1)
	}
}

const imageData = ctx.createImageData(canvas.width, canvas.height)
const data = new Uint8ClampedArray(imageData.data.buffer)

function castRaysBatch() {
	const w = canvas.width
	const h = canvas.height
	for (let i = 0; i < data.length; i += 4) {
		data[i] = skyColor.r
		data[i + 1] = skyColor.g
		data[i + 2] = skyColor.b
		data[i + 3] = 255
	}
	for (let x = 0; x < w; x++) {
		const { drawStart, drawEnd, color } = castRay(
			x,
			w,
			h,
			posX,
			posY,
			dirX,
			dirY,
			planeX,
			planeY
		)
		const rWall = parseInt(color.slice(1, 3), 16)
		const gWall = parseInt(color.slice(3, 5), 16)
		const bWall = parseInt(color.slice(5, 7), 16)
		for (let y = drawStart; y <= drawEnd; y++) {
			const idx = 4 * (x + y * w)
			data[idx] = rWall
			data[idx + 1] = gWall
			data[idx + 2] = bWall
			data[idx + 3] = 255
		}
		for (let y = drawEnd + 1; y < h; y++) {
			const idx = 4 * (x + y * w)
			data[idx] = 0
			data[idx + 1] = 0
			data[idx + 2] = 0
			data[idx + 3] = 255
		}
	}
	ctx.putImageData(imageData, 0, 0)
}

function canMove(x: number, y: number) {
	return worldMap[Math.floor(x)][Math.floor(y)] === 0
}

function update(frameTime: number) {
	const moveSpeed = frameTime * (keys.has('shift') ? RUN_SPEED : WALK_SPEED)
	const moveForward = keys.has('w') || keys.has('arrowup')
	const moveBackward = keys.has('s') || keys.has('arrowdown')
	const moveRight = keys.has('d') || keys.has('arrowright')
	const moveLeft = keys.has('a') || keys.has('arrowleft')
	if (moveForward) {
		if (canMove(posX + dirX * moveSpeed, posY)) posX += dirX * moveSpeed
		if (canMove(posX, posY + dirY * moveSpeed)) posY += dirY * moveSpeed
	}
	if (moveBackward) {
		if (canMove(posX - dirX * moveSpeed, posY)) posX -= dirX * moveSpeed
		if (canMove(posX, posY - dirY * moveSpeed)) posY -= dirY * moveSpeed
	}
	if (moveRight) {
		const sx = dirY
		const sy = -dirX
		if (canMove(posX + sx * moveSpeed, posY)) posX += sx * moveSpeed
		if (canMove(posX, posY + sy * moveSpeed)) posY += sy * moveSpeed
	}
	if (moveLeft) {
		const sx = -dirY
		const sy = dirX
		if (canMove(posX + sx * moveSpeed, posY)) posX += sx * moveSpeed
		if (canMove(posX, posY + sy * moveSpeed)) posY += sy * moveSpeed
	}
}
function drawCrosshair() {
	const w = ctx.canvas.width
	const h = ctx.canvas.height
	const x = w / 2
	const y = h / 2
	ctx.beginPath()
	ctx.moveTo(x - 5, y)
	ctx.lineTo(x + 5, y)
	ctx.moveTo(x, y - 5)
	ctx.lineTo(x, y + 5)
	ctx.stroke()
}
async function mainLoop() {
	stats.begin()
	const newTime = performance.now()
	const frameTime = (newTime - oldTime) / 1000
	oldTime = newTime

	update(frameTime)
	isBatch ? castRaysBatch() : castRays()
	drawCrosshair()
	stats.end()
	requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop)
