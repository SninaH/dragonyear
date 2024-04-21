import json
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont


# imagejson = "image.json"
# image_path = "Form-Several-forms-on-a-page-1.92-1.png"
def fill_image(image_path, answered_fields):

    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)

    # txt = "HELLO"



    # im = plt.imread(image_path)
    print(answered_fields)
    font_size = 40
    font = ImageFont.load_default(size=font_size)
    for e in answered_fields:
        print(e["field_name"])
        if e["relative_location_of_expected_answer"].lower() == "right" and e["expected_answer_type"] is None:
            print("Decided to fill to the right.")
            (x, y1), (_, y2) = e["bbox"][1], e["bbox"][2]
            # y = (y1 + y2) / 2
            y = min(y1,y2)
            # plt.text(x + 100, y, e["answer"], horizontalalignment='left')
            draw.text((x + 120, y), e["answer"], fill=(0, 0, 0), font=font)
        else:  # down
            print("Decided to fill down - right.")
            (x, y1), (_, y2) = e["bbox"][1], e["bbox"][2]
            # y = (y1 + y2) / 2
            y = min(y1,y2)
            # plt.text(x, y + 50, e["answer"], horizontalalignment='left')
            draw.text((x+ 100, y + 40), e["answer"], fill=(0, 0, 0), font=font)
        # plt.gca().text("HELLO")

    # plt.savefig(image_path)
    img.save(image_path.strip(".jpg")+ "_filled.jpg")






    # GPT VERZIJA

    # print("image_path: ", image_path, "image_json: ", image_json)
    # image_info = json.loads(image_json)
    # print(image_info)
    # img = plt.imread(image_path)
    #
    # print(image_info)
    # for e in image_info:
    #     print(e["field_name"])
    #     if e["relative_location_of_expected_answer"].lower() == "right":
    #         (x, y1), (_, y2) = e["bbox"][1], e["bbox"][2]
    #         y = (y1 + y2) / 2
    #         plt.text(x + 100, y, e["answer"], horizontalalignment='left')
    #     else:  # down
    #         (x, y1), (_, y2) = e["bbox"][1], e["bbox"][2]
    #         y = (y1 + y2) / 2
    #         plt.text(x, y + 50, e["answer"], horizontalalignment='left')
    #
    # # plt.imshow(img)  # Display the image
    # plt.savefig(image_path)  # Save the image