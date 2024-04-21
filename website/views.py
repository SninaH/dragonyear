import html
import json

from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from website.models import UploadedFile
from website.forms import UploadFileForm

from pdf2image import convert_from_path

from website.helper_functions.fields_info import get_fields_info
from website.helper_functions.fill_image import fill_image

from website.helper_functions.cloudinar_api import upload_image
from website.helper_functions.img_to_pdf import convert_image_to_pdf


# Create your views here.
def index(request):
    if request.method == "GET":
        return render(request, 'index.html', {'form': 'form'})
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            # handle_uploaded_file(request.FILES['file']) delaj z datoteko
            file = form.cleaned_data['file']
            if file.content_type != 'application/pdf':
                print("File is not a pdf")
                return render(request, 'index.html', {'form': form, 'error': 'Uploaded file is not a PDF'})

            title = form.cleaned_data['file'].name
            ufile = UploadedFile.objects.create(title=title, file=file)
            print("File uploaded")

            # make images from pdf
            image = convert_from_path(ufile.file.path)[0]
            image.save(f"imaged_pdfs/{ufile.id}.jpg")
            print("Image saved")
            # upload image so we can send it to gpt -- hack
            image_url = upload_image(f"imaged_pdfs/{ufile.id}.jpg", f"{ufile.id}")

            # here
            print("Getting fields info...")
            fields = get_fields_info(image_url, f"imaged_pdfs/{ufile.id}.jpg")
            print(type(fields))
            print("Got fields info:")
            print(fields)
            #fields_str = json.dumps(fields).replace("\"", "'")
            # fields_str = json.dumps(fields)
            # print(fields_str)


            # return HttpResponseRedirect(f'/fill?id={ufile.id}')
            return render(request, 'fill.html', {'fields': fields, 'id': ufile.id})
        else:
            print("Form is not valid")
            return render(request, 'index.html', {'form': form})


def fill(request):
    id = request.GET.get("id", "")
    files = UploadedFile.objects.get(id=id)
    return render(request, 'fill.html', {'files': files, 'id': id})

def preview(request):
    if request.method == "GET":
        image_id = request.GET.get("image_id", "")
        print("Image id:", image_id)
        base_url = request.build_absolute_uri('/')
        print("Base url:", base_url)
        return render(request, 'preview.html', {'imageUrl': f'{base_url}/static/{image_id}_filled.jpg', 'pdf_id': image_id})

    if request.method == "POST":
        # pride not
        answered_fields = json.loads(request.body.decode('utf-8'))
        # print("Answered fields:", answered_fields)
        image_id = request.GET.get("image_id", "")
        print("Image id:", image_id)
        file_path = f"imaged_pdfs/{image_id}.jpg"
        print("File path:", file_path)
        fill_image(file_path, answered_fields)

        image_path = f"imaged_pdfs/{image_id}_filled.jpg"
        pdf_path = f"imaged_pdfs/{image_id}.pdf"
        convert_image_to_pdf(image_path, pdf_path)


        return HttpResponse(status=200)

        # base_url = request.build_absolute_uri('/')
        # print("Base url:", base_url)
        # return render(request, 'preview.html', {'imageUrl': f'{base_url}/static/{image_id}.jpg'})

# def download_pdf(request):
#     id = request.GET.get("image_id", "")
#     image_path = f"imaged_pdfs/{id}_filled.jpg"
#     pdf_path = f"imaged_pdfs/{id}.pdf"
#     convert_image_to_pdf(image_path, pdf_path)
#
#     response = HttpResponse(f"/imaged_pdfs/{id}.pdf", content_type='application/pdf')
#     response['Content-Disposition'] = f'attachment; filename="{id}.pdf"'
#     return response