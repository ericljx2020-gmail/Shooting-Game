## process of starting a djangoe project

1. use `django-admin startproject **projectname**` to create an empty project
2. use github to store the project
3. use `python3 manage.py runserver 0.0.0.0:8000` to run the server
4. add `**ip_address**` to ALLOWED_HOSTS in `setting.py`
* we can use `ag ALLOWED_HOSTS` to find the path and line of that name
5. we don't want `__pycache__` to be uploaded to github so we create a file '.gitignore' to myapp/ and add '*/__pycache__' to the file.

## Adding a new app with Django
* use `python3 manage.py startapp **game**`
