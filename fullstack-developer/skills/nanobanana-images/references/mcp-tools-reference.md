# MCP Tools Reference

Nanobanana MCP server tools for AI image generation.

---

## Available Tools

| Tool | Purpose | Cost |
|------|---------|------|
| `mcp__nanobanana__generate_image` | Create new image from prompt | $0.04-0.15 |
| `mcp__nanobanana__edit_image` | Modify existing image | $0.04-0.15 |
| `mcp__nanobanana__upload_file` | Upload file for editing | Free |

---

## generate_image

**Purpose**: Generate a new image from a text prompt.

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Text description of desired image |
| `aspect_ratio` | string | No | "1:1" | Image dimensions ratio |
| `quality` | string | No | "standard" | Output quality level |

**Aspect Ratio Options**:

| Value | Dimensions | Use Case |
|-------|------------|----------|
| `"1:1"` | 1024x1024 | Product photos, icons, avatars |
| `"16:9"` | 1792x1024 | Hero banners, backgrounds |
| `"9:16"` | 1024x1792 | Mobile, vertical displays |
| `"4:3"` | 1408x1024 | Feature images, about sections |
| `"3:4"` | 1024x1408 | Portraits, tall images |
| `"21:9"` | 2016x864 | Ultra-wide banners |

**Quality Options**:

| Value | Resolution | Cost | Use Case |
|-------|------------|------|----------|
| `"standard"` | ~1024px | ~$0.04-0.05 | Most uses |
| `"high"` | ~2048px | ~$0.08-0.10 | Hero images |
| `"premium"` | ~4096px | ~$0.15 | Print, large displays |

**Example Usage**:

```python
# Standard product photo
mcp__nanobanana__generate_image(
    prompt="Professional product photo of organic matcha powder in glass jar, soft studio lighting, white background, minimal shadows, centered, e-commerce style",
    aspect_ratio="1:1",
    quality="standard"
)

# High-quality hero banner
mcp__nanobanana__generate_image(
    prompt="Wide cinematic shot of fresh vegetables on wooden table, soft natural light, warm atmosphere, space on left for text, food photography",
    aspect_ratio="16:9",
    quality="high"
)
```

**Returns**: Image file path or URL

---

## edit_image

**Purpose**: Modify an existing image with a prompt.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image_path` | string | Yes | Path to source image |
| `prompt` | string | Yes | Description of desired changes |

**Use Cases**:

| Edit Type | Example Prompt |
|-----------|----------------|
| Background change | "Change background to gradient blue" |
| Color adjustment | "Make the product packaging green" |
| Add elements | "Add soft shadows beneath product" |
| Remove elements | "Remove background, make transparent" |
| Style transfer | "Make this look like watercolor painting" |

**Example Usage**:

```python
# First upload the image
mcp__nanobanana__upload_file(file_path="/images/original.png")

# Then edit it
mcp__nanobanana__edit_image(
    image_path="/images/original.png",
    prompt="Change the background to a soft gradient from white to light blue, keep the product unchanged"
)
```

**Note**: Original image must be uploaded first using `upload_file`.

---

## upload_file

**Purpose**: Upload an image file for editing operations.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file_path` | string | Yes | Local path to image file |

**Supported Formats**: PNG, JPG, JPEG, WebP

**Example Usage**:

```python
mcp__nanobanana__upload_file(file_path="public/images/product.png")
```

**Returns**: Upload confirmation and file reference

---

## Workflow Examples

### Generate Hero Image

```python
# 1. Generate the image
result = mcp__nanobanana__generate_image(
    prompt="Wide cinematic shot of modern coffee shop interior with warm lighting, cozy atmosphere, space on right for text overlay, lifestyle photography",
    aspect_ratio="16:9",
    quality="high"
)

# 2. Save to project
# Image saved to: public/images/hero-coffee.png

# 3. Use in component
# <Image src="/images/hero-coffee.png" width={1920} height={1080} />
```

### Generate Product Photo

```python
# 1. Generate
mcp__nanobanana__generate_image(
    prompt="Professional product photo of premium wireless headphones, matte black finish, soft studio lighting, white background, minimal shadows, centered composition, tech product photography",
    aspect_ratio="1:1",
    quality="standard"
)

# 2. Use in product card
# <Image src="/images/product-headphones.png" width={800} height={800} />
```

### Edit Existing Image

```python
# 1. Upload original
mcp__nanobanana__upload_file(file_path="public/images/original-product.png")

# 2. Edit
mcp__nanobanana__edit_image(
    image_path="public/images/original-product.png",
    prompt="Remove the background completely, make it transparent, keep only the product"
)
```

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid prompt | Empty or too short | Provide detailed prompt |
| Invalid aspect ratio | Unsupported value | Use supported ratios |
| File not found | Wrong path | Check file path exists |
| Upload failed | File too large/wrong format | Use supported formats, <10MB |
| Generation failed | Service unavailable | Retry after a moment |

---

## Best Practices

1. **Always confirm cost** before generating
2. **Use standard quality** unless high resolution needed
3. **Choose appropriate aspect ratio** for intended use
4. **Write detailed prompts** for better results
5. **Save with descriptive names** for easy management
6. **Organize in folders** by image type

---

## File Naming Convention

```
public/images/
├── hero-[description].png
├── product-[name].png
├── bg-[style].png
├── icon-[name].png
├── feature-[name].png
└── about-[description].png
```

---

## Integration Notes

After generation:

1. Image is saved to specified location
2. Provide Next.js Image component code
3. Include proper alt text
4. Set appropriate width/height
5. Add `priority` for above-fold images
