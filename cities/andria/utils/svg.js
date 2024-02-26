const getSvg = async () => {
  const { createSVGWindow } = await import('svgdom');
  const { SVG, registerWindow } = await import('@svgdotjs/svg.js');
  const window = createSVGWindow();
  registerWindow(window, window.document);

  return SVG;
};

module.exports = getSvg;
