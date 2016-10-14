.DEFAULT_GOAL := build
.PHONY: test lint

build: 
	npm install

test-ci: test cov

test: 
	npm run test-ci

lint: 
	npm run lint

cov: 
	npm run test-cov
