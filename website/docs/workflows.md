---
id: workflows
title: Workflows for development, release, and deployment
sidebar_label: Workflows
---

## Reviewing PRs

- Using [GitHub CLI](https://cli.github.com/): Run `gh pr checkout <PR number>` to checkout the PR locally.
- Using [GitHub Codespaces](https://github.com/features/codespaces): In the PR, click on the **Code** button and select **Create codespace**.

## Authoring change logs

For changes in the Bemuse game, create a changelog entry in the `changelog` folder.

```yaml
---
author:
category:
pr:
---

(Describe the change here)
```

- `author`: GitHub username of the author. (Can be an array if there are multiple authors.)
- `category`: One of `feature`, `internals`, `bugfix`, `improvement`.
- `pr`: Pull request number. (Can be an array if there are multiple PRs.)
- `type`: One of `major`, `minor`, `patch`. If not specified, it will be a `patch` release.

## Merging PRs

When all checks have passed, click the green "Merge pull request" button.

## Release a new version of the game

When a PR is merged, GitHub Actions will automatically create a release candidate. This involves:

- Consuming the changelog entries and updating the `CHANGELOG.md` file.
- Bumping the version number.

The release candidate will be published to the `release-candidate/proposed` branch and a pull request will be created. You can keep merging more PRs into `master` and the release candidate will be updated (although it’s generally better release as often as possible). When you are ready to release, merge that pull request.

## Deploying to production

Upon releasing a new version, it will automatically be deployed to production.

## Publishing npm packages

Right now this is currently being done manually using this command:

```
rush publish --apply --target-branch master --publish --npm-auth-token $NPM_TOKEN
```