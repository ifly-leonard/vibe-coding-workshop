export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let line = words[0] ?? "";

  for (let i = 1; i < words.length; i += 1) {
    const next = `${line} ${words[i]}`;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
    } else {
      lines.push(line);
      line = words[i] ?? "";
    }
  }

  lines.push(line);
  return lines;
}

export function fitWrappedName(
  ctx: CanvasRenderingContext2D,
  name: string,
  maxWidth: number,
  maxSize: number,
  minSize: number,
) {
  const lineHeightFactor = 1.12;

  for (let size = maxSize; size >= minSize; size -= 2) {
    ctx.font = `800 ${size}px "Bricolage Grotesque", system-ui, sans-serif`;
    const lineHeight = Math.round(size * lineHeightFactor);

    if (ctx.measureText(name).width <= maxWidth) {
      return { size, lines: [name], lineHeight };
    }

    const lines = wrapText(ctx, name, maxWidth);
    const allFit = lines.every((l) => ctx.measureText(l).width <= maxWidth);
    if (allFit && lines.length > 0) {
      return { size, lines, lineHeight };
    }
  }

  ctx.font = `800 ${minSize}px "Bricolage Grotesque", system-ui, sans-serif`;
  return {
    size: minSize,
    lines: wrapText(ctx, name, maxWidth),
    lineHeight: Math.round(minSize * lineHeightFactor),
  };
}
