import json

import marvin
from pydantic import BaseModel
import easyocr
import matplotlib.pyplot as plt
import os
from skimage import io

os.environ["API_TOKEN"] = ""
TOKEN = os.environ["API_TOKEN"]
BASE_URL = "https://openai-proxy.sellestial.com/api"

marvin.settings.openai.api_key = TOKEN
marvin.settings.openai.base_url = BASE_URL
marvin.settings.openai.chat.completions.model = "gpt-4-turbo"

def get_fields_info(image_url, image_path):

    class Field(BaseModel):
        field_name: str
        relative_location_of_expected_answer: str
        expected_answer_type: None | list[str]

        form_instructions: None | str
        required: bool

        def to_dict(self):
            return {"field_name": self.field_name,
                    "relative_location_of_expected_answer": self.relative_location_of_expected_answer,
                    "expected_answer_type": self.expected_answer_type,
                    "form_instructions": self.form_instructions,
                    "required": self.required}

        def __str__(self):
            return str(self.to_dict())

        def __repr__(self):
            return str(self)



    myform = marvin.beta.Image(
        image_url
    )

    fields = marvin.beta.cast(
        myform,
        target=list[Field],
        # instructions=f"Get me a list of field names together with info about expected answer. Location of expected answer is right or down from the field name. Expected answer type is either a list of possible values to choose from listed in the form or it is None which means that text answer is required.",
        instructions="Get me a list of field names in original language together with info about expected answer. Location of expected answer is right or down from the field name.\
            Expected answer type is either a list of possible values to choose from listed in the form or it is None which means that text answer is required.\
                Instructions should any additional instructions about that field if provided in the document. Required should be True only if field is required"
    )

    print(fields)

    reader = easyocr.Reader(['en', 'en'])
    result = reader.readtext(image_path)


    def get_match(name, legit_names, tresh=2):
        for lni, ln in enumerate(legit_names):
            if len(os.path.commonprefix([name.strip("*:").lower(), ln.lower()])) > tresh:
                return ln, lni
        return None, -1

    legit = [x.to_dict() for x in fields]

    legit_names = [x["field_name"] for x in legit]
    for res in result:
        tresh_ocr = 0.5
        if res[2] > tresh_ocr:
            bbox = res[0]
            name = res[1]
            print(name.strip(":"))
            match, matchi = get_match(name, legit_names)
            if match is not None:

                for pi, p in enumerate(bbox):
                    bbox[pi] = [int(p[0]),int(p[1])]
                legit[matchi]["bbox"] = bbox
    for li, l in enumerate(legit):
        if "bbox" not in l:
            legit.remove(l)
            # poizvedi še enkrat
            # return get_fields_info(image_url, image_path)

    # print(legit)
    legit = json.dumps(legit)
    legit = legit.replace("\n", "")
    return legit


# get_fields_info(image_url = "https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2021/07/Form-Several-forms-on-a-page-1.92-1.png",
#                 image_path = "Form-Several-forms-on-a-page-1.92-1.png")


# get_fields_info(image_url="https://eobrazci.si/wp-content/uploads/2020/03/vzorcni_obrazec.png",
#                 image_path="vzorcni_obrazec.png")


