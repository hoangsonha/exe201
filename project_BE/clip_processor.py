import sys
import requests
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import cv2

# Nhận tham số: text, image_urls..., video_url
text = sys.argv[1]
image_urls = sys.argv[2:-1]  # Tất cả tham số giữa text và video_url
video_url = sys.argv[-1] if sys.argv[-1] else None

# Khởi tạo CLIP
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Xử lý ảnh
images = []
for url in image_urls:
    try:
        image = Image.open(requests.get(url, stream=True).raw)
        images.append(image)
    except Exception as e:
        print(f"Error loading image {url}: {e}", file=sys.stderr)
        continue

# Xử lý video
frame_image = None
if video_url:
    try:
        cap = cv2.VideoCapture(video_url)
        ret, frame = cap.read()
        if ret:
            frame_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        cap.release()
    except Exception as e:
        print(f"Error loading video {video_url}: {e}", file=sys.stderr)
        frame_image = None

# So sánh văn bản với ảnh/video
similarities = []
for image in images:
    inputs = processor(text=[text], images=image, return_tensors="pt", padding=True)
    outputs = model(**inputs)
    similarities.append(outputs.logits_per_image.softmax(dim=1).detach().numpy()[0][0])

if frame_image:
    inputs = processor(text=[text], images=frame_image, return_tensors="pt", padding=True)
    outputs = model(**inputs)
    similarities.append(outputs.logits_per_image.softmax(dim=1).detach().numpy()[0][0])

# Tính relevant_star
avg_similarity = sum(similarities) / len(similarities) if similarities else 0.5
relevant_star = round(avg_similarity * 5)
print(relevant_star)