## phtography backend
Install django-phonenumber-field[phonenumbers] with
pip install "django-phonenumber-field[phonenumbers]"

## Testing
Using pytest to run tests for each app folder
Using: uv run pytest

## Migrations
Using: uv run python manage.py makemigrations
Using: uv run python manage.py migrate

## Activate venv
source .venv/bin/activate

## Run backend server
```bash
    pip3 install fastapi uvicorn
    uvicorn main:app --reload
    uv run uvicorn core.asgi:application --host 127.0.0.1 --port 8000 --reload
```
If fails install missing dependencies with uv add [libraries]

## Run frontend server
```bash
    npm install
    npm run rdev
```

## Dependencies error running backend
```bash
    rm -r .venv
    uv sync
```