from django.contrib import admin
from .models import uinfo, uwork, Tag

# Register your models here.
class Taginline(admin.TabularInline):
    model = Tag

class uinfoAdmin(admin.ModelAdmin):
    inlines  = [Taginline]

    #fields = ('u_name','u_addr')
    list_display = ('u_name', 'u_addr', 'u_sex', 'u_age', )
    search_fields = ('u_name', )
    fieldsets = (
        ['MainBody', {'fields': ('u_name', 'u_addr', ), }],
        ['Footer', {'classes': ('collapse', ), 'fields': ('u_sex', 'u_age', ), }]
    )


admin.site.register(uinfo, uinfoAdmin)
admin.site.register(uwork)