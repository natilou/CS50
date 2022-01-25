# Generated by Django 4.0.1 on 2022-01-25 00:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0002_listing_comment_bid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='category',
            field=models.CharField(max_length=64, null=True),
        ),
        migrations.AlterField(
            model_name='listing',
            name='image_url',
            field=models.URLField(null=True),
        ),
    ]
