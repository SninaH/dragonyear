from PIL import Image, ImageDraw, ImageFont


def fill_image(image_path, answered_fields):

    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)

    font_size = 40
    font = ImageFont.load_default(size=font_size)
    for e in answered_fields:
        if e["relative_location_of_expected_answer"].lower() == "right" and e["expected_answer_type"] is None:
            print("INFO: Decided to fill to the right.")
            (x, y1), (_, y2) = e["bbox"][1], e["bbox"][2]
            y = min(y1,y2)
            draw.text((x + 120, y), e["answer"], fill=(0, 0, 0), font=font)
        else:  # down
            print("INFO: Decided to fill down - right.")
            (x, y1), (_, y2) = e["bbox"][1], e["bbox"][2]
            y = min(y1,y2)
            draw.text((x+ 100, y + 40), e["answer"], fill=(0, 0, 0), font=font)

    img.save(image_path.strip(".jpg")+ "_filled.jpg")