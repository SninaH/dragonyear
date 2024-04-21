# Generated by Django 5.0.4 on 2024-04-20 15:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('website', '0002_delete_document'),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('file', models.FileField(upload_to='uploads/')),
            ],
        ),
    ]
