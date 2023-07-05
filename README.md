## process of starting a djangoe project

1. use `django-admin startproject **projectname**` to create an empty project
2. use github to store the project
3. use `python3 manage.py runserver 0.0.0.0:8000` to run the server
4. add `**ip_address**` to ALLOWED_HOSTS in `setting.py`
* we can use `ag ALLOWED_HOSTS` to find the path and line of that name
5. we don't want `__pycache__` to be uploaded to github so we create a file '.gitignore' to myapp/ and add '**/__pycache__' to the file.

## Adding a new app with Django
* use `python3 manage.py startapp **game**`

## Migrate the update to the server:
* run `python3 manage.py migrate` to update

## Create a superuser to the admin site
* run `python3 manage.py createsuperuser`.

## Making python folder able to be imported:
* add a '__init__.py' to the folder

## Setting timezone:
* change the string after TIMEZONE in setting.py to **Asia/Shanghai**

## The structure of the project as a whole:

.
|-- README.md
|-- db.sqlite3
|-- game
|   |-- __init__.py
|   |-- __pycache__
|   |   |-- __init__.cpython-38.pyc
|   |   |-- admin.cpython-38.pyc
|   |   |-- apps.cpython-38.pyc
|   |   |-- urls.cpython-38.pyc
|   |   `-- views.cpython-38.pyc
|   |-- admin.py
|   |-- apps.py
|   |-- migrations
|   |   |-- __init__.py
|   |   `-- __pycache__
|   |       `-- __init__.cpython-38.pyc
|   |-- models
|   |   |-- __init__.py
|   |   `-- __pycache__
|   |       `-- __init__.cpython-38.pyc
|   |-- static
|   |   |-- css
|   |   |   `-- game.css
|   |   |-- image
|   |   |   |-- menu
|   |   |   |   `-- background.gif
|   |   |   |-- playground
|   |   |   `-- settings
|   |   `-- js
|   |       |-- dist
|   |       |   `-- game.js
|   |       `-- src
|   |           `-- zbase.js
|   |-- templates
|   |   |-- menu
|   |   |-- multiends
|   |   |   `-- web.html
|   |   |-- playground
|   |   `-- settings
|   |-- tests.py
|   |-- urls
|   |   |-- __init__.py
|   |   |-- __pycache__
|   |   |   |-- __init__.cpython-38.pyc
|   |   |   `-- index.cpython-38.pyc
|   |   |-- index.py
|   |   |-- menu
|   |   |   |-- __init__.py
|   |   |   |-- __pycache__
|   |   |   |   |-- __init__.cpython-38.pyc
|   |   |   |   `-- index.cpython-38.pyc
|   |   |   `-- index.py
|   |   |-- playground
|   |   |   |-- __init__.py
|   |   |   |-- __pycache__
|   |   |   |   |-- __init__.cpython-38.pyc
|   |   |   |   `-- index.cpython-38.pyc
|   |   |   `-- index.py
|   |   `-- settings
|   |       |-- __init__.py
|   |       |-- __pycache__
|   |       |   |-- __init__.cpython-38.pyc
|   |       |   `-- index.cpython-38.pyc
|   |       `-- index.py
|   `-- views
|       |-- __init__.py
|       |-- __pycache__
|       |   |-- __init__.cpython-38.pyc
|       |   `-- index.cpython-38.pyc
|       |-- index.py
|       |-- menu
|       |   `-- __init__.py
|       |-- playground
|       |   `-- __init__.py
|       `-- settings
|           `-- __init__.py
|-- manage.py
|-- myapp
|   |-- __init__.py
|   |-- __pycache__
|   |   |-- __init__.cpython-38.pyc
|   |   |-- settings.cpython-38.pyc
|   |   |-- urls.cpython-38.pyc
|   |   `-- wsgi.cpython-38.pyc
|   |-- asgi.py
|   |-- settings.py
|   |-- urls.py
|   `-- wsgi.py
`-- scripts
    `-- compress_game_js.sh

36 directories, 54 files
