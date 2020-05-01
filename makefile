requirements:
	pip freeze > requirements.txt

install:
	pip install -r requirements.txt

run: install
	python3 run.py
