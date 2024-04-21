import cloudinary

cloudinary.config(
    cloud_name="",
    api_key="",
    api_secret=""
)

import cloudinary.uploader


def upload_image(image_path, public_id):
    a = cloudinary.uploader.upload(image_path, public_id=public_id)
    return a["url"]


# print(upload_image("../../imaged_pdfs/17.jpg", "18"))