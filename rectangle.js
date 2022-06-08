
    window.addEventListener("mousedown", (e) => {
        const [startX, startY] = [e.clientX, e.clientY]
        const divDom = document.createElement("div")
        divDom.id = 'screenshot'
        divDom.width = '1px'
        divDom.height = '1px'
        divDom.style.position = "absolute"
        divDom.style.top = startY + "px"
        divDom.style.left = startX + "px"
        document.body.appendChild(divDom)
        const moveEvent = (e) => {
            const moveX = e.clientX - startX
            const moveY = e.clientY - startY
            if (moveX > 0) {
                divDom.style.width = moveX + 'px'
            } else {
                divDom.style.width = -moveX + 'px'
                divDom.style.left = e.clientX + 'px'
            }
            if (moveY > 0) {
                divDom.style.height = moveY + 'px'
            } else {
                divDom.style.height = -moveY + 'px'
                divDom.style.top = e.clientY + 'px'
            }
        }
        window.addEventListener("mousemove", moveEvent)
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", moveEvent)
        })
    })
