# DoveLink - Backend

## Backend Development

Firstly, change to the /backend directory:

```
cd backend
```

And install all the dependencies in a virtual environment by using `uv、anaconda .etc`, here we use `conda` for demonstration:

```
conda create -n myenv python=3.12
conda activate myenv
pip install -r requirements.txt
```

Then migrate the models by running:

```python
python manage.py makemigrations
python manage.py migrate
```

If you want to create admin users, you can run by:

```python
python create_admin_data.py
```

This command will create two users called `super_admin`, `life_admin`. For `super_admin`, the username will be set to `admin`, while the password will be `admin123`. For `life_admin`, the username and password being `life_admin` and `life123` respectively. Then you can login in with this two users and get in to the adminDashboard.

Lastly, we can start the backend by:

```python
python manage.py runserver
```

And open your browser at http://127.0.0.1:8000/.
