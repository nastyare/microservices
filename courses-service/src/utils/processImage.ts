import { Request, Response, NextFunction } from "express";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const inputPath = req.file?.path;

    if (!inputPath) return next();

    const ext = path.extname(inputPath);
    const newFilename = uuidv4() + ext;
    const outputPath = path.join("images", newFilename);

    const watermarkPath = path.join(__dirname, "..", "assets", "watermark.png");
    const watermarkSize = {
      width: 40,
      height: 20,
    };
    const watermarkBuffer = await sharp(watermarkPath)
      .resize(watermarkSize.width, watermarkSize.height, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    await sharp(inputPath)
      .resize(800, 600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .composite([
        {
          input: watermarkBuffer,
          gravity: "southeast",
        },
      ])
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    req.file!.filename = newFilename;
    req.file!.path = outputPath;

    next();
  } catch (error) {
    return next(error);
  }
};

export default processImage;
