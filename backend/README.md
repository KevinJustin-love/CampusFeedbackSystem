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

## Production deployment (dovelink.com)

1. Copy the sample environment file and fill in your secrets:

```bash
cp .env.example .env
# edit .env to set DJANGO_SECRET_KEY and database/OpenAI keys
```

2. Build static files and run migrations:

```bash
python manage.py collectstatic --noinput
python manage.py migrate
```

3. Start Gunicorn in production mode (DEBUG is controlled by `.env`):

```bash
DJANGO_DEBUG=False gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

4. Put Nginx (or another reverse proxy) in front:

- Serve `https://dovelink.com` and proxy `/api/` (or the whole site) to Gunicorn at `http://127.0.0.1:8000`.
- Point `/static/` to `backend/staticfiles/` and `/media/` to `backend/media/`.
- Enable HTTPS certificates (e.g., via Certbot) for `dovelink.com`/`www.dovelink.com` and add them to your Nginx server block.

5. Frontend configuration:

- Set `VITE_API_URL` to your API origin (for example `https://api.dovelink.com` or `https://dovelink.com/api`) before building.
- After `npm run build` in `frontend/`, deploy the generated `dist/` folder to your static hosting or let Nginx serve it under `https://dovelink.com`.

> Defaults in `.env.example` already include `dovelink.com`/`www.dovelink.com`/`api.dovelink.com` for allowed hosts, CORS and CSRF.
