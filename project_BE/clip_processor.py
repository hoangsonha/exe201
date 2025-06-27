# import sys
# import requests
# from PIL import Image
# from transformers import CLIPProcessor, CLIPModel
# import cv2
#
# # Nhận tham số: text, image_urls..., video_url
# text = sys.argv[1]
# image_urls = sys.argv[2:-1]  # Tất cả tham số giữa text và video_url
# video_url = sys.argv[-1] if sys.argv[-1] else None
#
# # Khởi tạo CLIP
# model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
# processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
#
# # Xử lý ảnh
# images = []
# for url in image_urls:
#     try:
#         image = Image.open(requests.get(url, stream=True).raw)
#         images.append(image)
#     except Exception as e:
#         print(f"Error loading image {url}: {e}", file=sys.stderr)
#         continue
#
# # Xử lý video
# frame_image = None
# if video_url:
#     try:
#         cap = cv2.VideoCapture(video_url)
#         ret, frame = cap.read()
#         if ret:
#             frame_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
#         cap.release()
#     except Exception as e:
#         print(f"Error loading video {video_url}: {e}", file=sys.stderr)
#         frame_image = None
#
# # So sánh văn bản với ảnh/video
# similarities = []
# for image in images:
#     inputs = processor(text=[text], images=image, return_tensors="pt", padding=True)
#     outputs = model(**inputs)
#     similarities.append(outputs.logits_per_image.softmax(dim=1).detach().numpy()[0][0])
#
# if frame_image:
#     inputs = processor(text=[text], images=frame_image, return_tensors="pt", padding=True)
#     outputs = model(**inputs)
#     similarities.append(outputs.logits_per_image.softmax(dim=1).detach().numpy()[0][0])
#
# # Tính relevant_star
# avg_similarity = sum(similarities) / len(similarities) if similarities else 0.5
# relevant_star = round(avg_similarity * 5)
# print(relevant_star)



import sys
import requests
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import cv2
import numpy as np
import json
import traceback
import warnings
import os

# Cấu hình môi trường để tắt cảnh báo
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
warnings.filterwarnings("ignore")

def load_image(url):
    """Tải ảnh từ URL với xử lý lỗi chi tiết"""
    try:
        if url.lower() == "null":
            return None
        response = requests.get(url, stream=True, timeout=15)
        response.raise_for_status()
        return Image.open(response.raw)
    except Exception as e:
        print(f"Error loading image {url}: {str(e)}", file=sys.stderr)
        return None

def process_video(video_url):
    """Xử lý video và trích xuất frame"""
    try:
        if video_url.lower() == "null":
            return None

        cap = cv2.VideoCapture(video_url)
        if not cap.isOpened():
            return None

        # Lấy frame giữa video
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        target_frame = total_frames // 2 if total_frames > 0 else 0
        cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)

        ret, frame = cap.read()
        if not ret or frame is None:
            return None

        # Chuyển đổi màu và tạo PIL Image
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return Image.fromarray(rgb_frame)
    except Exception as e:
        print(f"Video processing error: {str(e)}", file=sys.stderr)
        return None
    finally:
        if 'cap' in locals():
            cap.release()

def calculate_similarity(model, processor, text, images):
    """Tính toán similarity scores giữa text và images"""
    similarities = []
    for img in images:
        try:
            inputs = processor(
                text=[text],
                images=img,
                return_tensors="pt",
                padding=True,
                truncation=True
            )
            outputs = model(**inputs)
            similarity = outputs.logits_per_image.softmax(dim=1).item()
            similarities.append(similarity)
        except Exception as e:
            print(f"Similarity calculation error: {str(e)}", file=sys.stderr)
            continue
    return similarities

def main():
    result = {
        "status": "success",
        "relevant_star": 3,
        "media_similarities": [],
        "average_similarity": 0.3,
        "error": None
    }

    try:
        # Validate input
        if len(sys.argv) < 2:
            raise ValueError("Usage: python clip_processor.py <text> [image_urls...] [video_url]")

        text = sys.argv[1]
        image_urls = sys.argv[2:-1] if len(sys.argv) > 2 else []
        video_url = sys.argv[-1] if len(sys.argv) > 2 else None

        # Load model với silent mode
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
            processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

        # Process media
        all_media = []

        # Process images
        for url in image_urls:
            img = load_image(url)
            if img is not None:
                all_media.append(img)

        # Process video
        if video_url:
            video_frame = process_video(video_url)
            if video_frame is not None:
                all_media.append(video_frame)

        if not all_media:
            raise ValueError("No valid media found")

        # Calculate similarities
        similarities = calculate_similarity(model, processor, text, all_media)

        if not similarities:
            raise ValueError("No valid similarity scores calculated")

        # Calculate final scores
        avg_similarity = np.mean(similarities)
        relevant_star = int(np.clip(round(avg_similarity * 5), 1, 5))

        result.update({
            "relevant_star": relevant_star,
            "media_similarities": similarities,
            "average_similarity": avg_similarity
        })

    except Exception as e:
        result.update({
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        })
        sys.stderr.write(json.dumps(result, ensure_ascii=False))

    # Output kết quả
    print(json.dumps(result, ensure_ascii=False))
    sys.exit(0 if result["status"] == "success" else 1)

if __name__ == "__main__":
    main()