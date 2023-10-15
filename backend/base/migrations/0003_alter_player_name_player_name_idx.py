# Generated by Django 4.2.6 on 2023-10-15 08:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("base", "0002_gamesession"),
    ]

    operations = [
        migrations.AlterField(
            model_name="player",
            name="name",
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AddIndex(
            model_name="player",
            index=models.Index(fields=["name"], name="name_idx"),
        ),
    ]
