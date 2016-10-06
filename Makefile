.DEFAULT_GOAL := build
.PHONY: test lint

tests: lint test cov

test:
	npm run test-ci

lint:
	npm run lint

cov:
	npm run test-cov
