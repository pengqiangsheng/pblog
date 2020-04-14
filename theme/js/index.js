const bgHelpers = {
  generateBg(direction, colors) {
    const colorStr = colors.join(', ')
    switch (direction) {
      case 0:
        return `linear-gradient(to left, ${colorStr})`
      case 1:
        return `linear-gradient(to right, ${colorStr})`
      case 2:
        return `linear-gradient(to top, ${colorStr})`
      case 3:
        return `linear-gradient(to bottom, ${colorStr})`
      default:
        return ``
    }
  }
}
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min) 
}

window.onload = fetch('./theme/json/gradients.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(gradientsList) {
    const { name, colors } = gradientsList[random(0, gradientsList.length - 1)]
    const bgStyle = bgHelpers.generateBg(0, colors)
    const bg = document.getElementById('bg')
    bg.style.background = bgStyle
    console.log('背景主题：', name, 'background:', bgStyle)
  })

