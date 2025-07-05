
from flask import Flask, request, jsonify
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
from PIL import Image
import torch
import requests
from io import BytesIO

app = Flask(__name__)

# Load model once on startup
model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@app.route("/caption", methods=["POST"])
def caption():
    data = request.get_json()
    image_url = data.get("image_url")

    if not image_url:
        return jsonify({"error": "Missing 'image_url' field"}), 400

    try:
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content)).convert("RGB")

        pixel_values = feature_extractor(images=image, return_tensors="pt").pixel_values.to(device)
        # ❗ FIX: Không dùng beam search
        output_ids = model.generate(pixel_values, max_length=16)  # <-- chỉ dùng greedy decoding
        caption = tokenizer.decode(output_ids[0], skip_special_tokens=True)

        return jsonify({"caption": caption})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
