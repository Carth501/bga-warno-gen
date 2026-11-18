export function exportJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

function createNameCardCanvas(name: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("The name preview could not be rendered.");
  }

  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#23c549";
  context.fillRect(0, 0, canvas.width, 16);

  context.fillStyle = "#cbd0fe";
  context.font = "600 24px Orbitron, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("YOUR NAME", canvas.width / 2, 220);

  const maxTextWidth = canvas.width - 96;
  context.font = "600 96px Orbitron, sans-serif";
  const textWidth = context.measureText(name).width;
  const fontSize =
    textWidth > 0 ? Math.min(96, (maxTextWidth / textWidth) * 96) : 96;
  context.font = `600 ${fontSize}px Orbitron, sans-serif`;
  context.fillStyle = "#cbd0fe";
  context.fillText(name, canvas.width / 2, 330, maxTextWidth);

  return canvas;
}

export function createNameCardPreview(name: string): string {
  return createNameCardCanvas(name).toDataURL("image/png");
}

export async function exportNameCardAsPng(name: string): Promise<void> {
  const canvas = createNameCardCanvas(name);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
      } else {
        reject(new Error("The PNG could not be created. Please try again."));
      }
    }, "image/png");
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "name.png";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
