.DEFAULT_GOAL := build
.PHONY: test lint

test:
	npm run test-ci

lint:
	npm run lint

cov:
	npm run test-cov

test-ci: lint test cov
