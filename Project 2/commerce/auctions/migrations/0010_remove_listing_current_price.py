# Generated by Django 4.0.1 on 2022-01-26 00:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0009_category_alter_listing_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listing',
            name='current_price',
        ),
    ]
