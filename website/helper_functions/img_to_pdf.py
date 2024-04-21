from PIL import Image  # install by > python3 -m pip install --upgrade Pillow  # ref. https://pillow.readthedocs.io/en/latest/installation.html#basic-installation


def convert_image_to_pdf(image_path, pdf_path):
    image = Image.open(image_path)
    image.save(pdf_path, "PDF", resolution=100.0, save_all=True)

# images = [Image.open("images/" + f)
#     for f in ["vloga 2022-2023 po ZŠti_0.jpg", "vloga 2022-2023 po ZŠti_1.jpg"]
# ]
#
# pdf_path = "bbd1.pdf"
#
# images[0].save(
#     pdf_path, "PDF" ,resolution=100.0, save_all=True, append_images=images[1:]
# )